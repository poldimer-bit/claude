import { findClientByPhone } from "./store/clientsStore.js";
import { replyToClientMessage } from "./agents/collectionsAgent.js";
import { generateCommunityManagerReply } from "./agents/communityManagerAgent.js";
import { sendTextMessage } from "./whatsapp/client.js";

// Decide qué agente contesta un mensaje entrante:
// - Si el remitente es un cliente con una factura "overdue" -> agente de cobranza.
// - Si no -> agente de community manager.
export async function handleIncomingMessage({ from, text, senderName }) {
  const client = await findClientByPhone(from);
  const overdueInvoice = client?.invoices.find((i) => i.status === "overdue");

  let reply;
  if (client && overdueInvoice) {
    reply = await replyToClientMessage({
      client,
      invoice: overdueInvoice,
      incomingText: text,
    });
  } else {
    reply = await generateCommunityManagerReply({ incomingText: text, senderName });
  }

  await sendTextMessage(from, reply);
  return reply;
}
