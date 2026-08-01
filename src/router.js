import { config } from "./config.js";
import { findClientByPhone } from "./store/clientsStore.js";
import { replyToClientMessage } from "./agents/collectionsAgent.js";
import { generateCommunityManagerReply } from "./agents/communityManagerAgent.js";
import { sendTextMessage } from "./whatsapp/client.js";

// Mensaje entrante en el número EXCLUSIVO de cobranza.
export async function handleCollectionsMessage({ from, text }) {
  const client = await findClientByPhone(from);
  const overdueInvoice = client?.invoices.find((i) => i.status === "overdue");

  if (!client || !overdueInvoice) {
    // Alguien escribe al número de cobranza sin tener una factura vencida registrada.
    console.warn(`[cobranza] mensaje de ${from} sin factura vencida asociada, se ignora.`);
    return null;
  }

  const reply = await replyToClientMessage({ client, invoice: overdueInvoice, incomingText: text });
  await sendTextMessage(config.collectionsWhatsapp, from, reply);
  return reply;
}

// Mensaje entrante en el número del community manager (chat 1:1, no grupos).
export async function handleCommunityMessage({ from, text, senderName }) {
  const reply = await generateCommunityManagerReply({ incomingText: text, senderName });
  await sendTextMessage(config.communityWhatsapp, from, reply);
  return reply;
}
