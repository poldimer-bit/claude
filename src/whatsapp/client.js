import { config } from "../config.js";

const baseUrl = () =>
  `https://graph.facebook.com/${config.whatsapp.graphApiVersion}/${config.whatsapp.phoneNumberId}/messages`;

async function post(body) {
  const res = await fetch(baseUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.whatsapp.token}`,
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
export function sendTextMessage(to, text) {
  return post({
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  });
}

// Iniciar conversación fuera de la ventana de 24h: requiere una plantilla
// previamente aprobada en Meta Business Manager (WhatsApp Manager > Message Templates).
export function sendTemplateMessage(to, templateName, languageCode, params = []) {
  return post({
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
