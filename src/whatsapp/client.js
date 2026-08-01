import { config } from "../config.js";

function urlFor(channel) {
  return `https://graph.facebook.com/${config.graphApiVersion}/${channel.phoneNumberId}/messages`;
}

async function post(channel, body) {
  const res = await fetch(urlFor(channel), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${channel.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`WhatsApp API error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

// Responder dentro de la ventana de 24h desde el último mensaje del cliente.
// `channel` es config.collectionsWhatsapp o config.communityWhatsapp.
export function sendTextMessage(channel, to, text) {
  return post(channel, {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  });
}

// Iniciar conversación fuera de la ventana de 24h: requiere una plantilla
// previamente aprobada en Meta Business Manager (WhatsApp Manager > Message Templates).
export function sendTemplateMessage(channel, to, templateName, languageCode, params = []) {
  return post(channel, {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: params.length
        ? [
            {
              type: "body",
              parameters: params.map((text) => ({ type: "text", text })),
            },
          ]
        : undefined,
    },
  });
}
