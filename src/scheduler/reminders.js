import cron from "node-cron";
import { config } from "../config.js";
import { listOverdueInvoices } from "../store/clientsStore.js";
import { generateCollectionsMessage } from "../agents/collectionsAgent.js";
import { sendTemplateMessage } from "../whatsapp/client.js";

// Envía recordatorios de cobranza a todos los clientes con facturas vencidas,
// desde el número exclusivo de cobranza. Usa plantilla aprobada porque es un
// mensaje que INICIA la conversación (fuera de la ventana de 24h de WhatsApp).
export async function runCollectionsPass() {
  const overdue = await listOverdueInvoices();

  for (const { client, invoice } of overdue) {
    try {
      const { text, tone, days } = await generateCollectionsMessage({ client, invoice });

      if (!config.collectionsWhatsapp.templateName) {
        console.warn(
          `[cobranza] falta COLLECTIONS_WHATSAPP_TEMPLATE_NAME; no se puede enviar a ${client.name}. Mensaje generado: "${text}"`
        );
        continue;
      }

      // El texto generado por Claude sirve de referencia/log; el envío real usa
      // la plantilla aprobada con sus propias variables ({{1}}, {{2}}, ...).
      await sendTemplateMessage(
        config.collectionsWhatsapp,
        client.phone,
        config.collectionsWhatsapp.templateName,
        "es_MX",
        [client.name, `${invoice.amount} ${invoice.currency}`, invoice.description]
      );

      console.log(
        `[cobranza] recordatorio (tono ${tone}, ${days}d atraso) enviado a ${client.name}`
      );
    } catch (err) {
      console.error(`[cobranza] error enviando recordatorio a ${client.name}:`, err);
    }
  }
}

export function startCollectionsScheduler() {
  cron.schedule(config.collectionsCron, () => {
    runCollectionsPass().catch((err) =>
      console.error("[cobranza] error en corrida programada:", err)
    );
  });
  console.log(`[cobranza] scheduler activo con cron "${config.collectionsCron}"`);
}
