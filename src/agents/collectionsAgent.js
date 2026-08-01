import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config.js";
import { daysOverdue } from "../store/clientsStore.js";

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

function toneForDaysOverdue(days) {
  if (days <= 3) return "suave"; // recordatorio amable
  if (days <= 10) return "firme"; // recordatorio directo, sin agresividad
  return "final"; // aviso final, consecuencias claras (pausa de servicio, etc.)
}

const SYSTEM_PROMPT = `Eres el agente de cobranza de LOCO4EVER CREATIVISION, una agencia creativa.
Escribes mensajes de WhatsApp para cobrar facturas vencidas a clientes.

Reglas:
- Tono "suave": amable, da el beneficio de la duda, asume que pudo ser un olvido.
- Tono "firme": directo, menciona el monto y la fecha de vencimiento con claridad, pide una fecha de pago concreta.
- Tono "final": serio pero profesional, indica que de no regularizarse se pausan entregables/servicios, ofrece hablar por teléfono.
- Nunca seas agresivo, grosero, ni uses amenazas legales.
- Máximo 3-4 líneas. Es WhatsApp, no un correo formal.
- Incluye siempre el monto y el concepto de la factura.
- Firma como "Equipo LOCO4EVER".
- Responde solo con el texto del mensaje, sin explicaciones adicionales.`;

export async function generateCollectionsMessage({ client, invoice }) {
  const days = daysOverdue(invoice.dueDate);
  const tone = toneForDaysOverdue(days);

  const userPrompt = `Cliente: ${client.name}
Factura: ${invoice.description}
Monto: ${invoice.amount} ${invoice.currency}
Fecha de vencimiento: ${invoice.dueDate}
Días de atraso: ${days}
Tono a usar: ${tone}

Genera el mensaje de WhatsApp para este cliente.`;

  const response = await anthropic.messages.create({
    model: config.anthropic.model,
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return { text: text.trim(), tone, days };
}

// Para cuando el cliente responde algo (dentro de la ventana de 24h) y hay que
// contestarle en el contexto de su factura pendiente.
export async function replyToClientMessage({ client, invoice, incomingText }) {
  const days = daysOverdue(invoice.dueDate);
  const tone = toneForDaysOverdue(days);

  const userPrompt = `Cliente: ${client.name}
Factura pendiente: ${invoice.description}
Monto: ${invoice.amount} ${invoice.currency}
Días de atraso: ${days}
Tono base a usar: ${tone}

El cliente escribió: "${incomingText}"

Responde de forma natural, manteniendo el objetivo de cobrar la factura pero
adaptándote a lo que dijo (si pide una prórroga, propone fecha, o pregunta algo,
responde a eso primero).`;

  const response = await anthropic.messages.create({
    model: config.anthropic.model,
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return text.trim();
}
