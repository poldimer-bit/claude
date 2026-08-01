import "dotenv/config";

function required(name, fallback = undefined) {
  return process.env[name] ?? fallback;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  graphApiVersion: "v20.0",

  // Número dedicado exclusivamente a cobranza.
  collectionsWhatsapp: {
    token: required("COLLECTIONS_WHATSAPP_TOKEN"),
    phoneNumberId: required("COLLECTIONS_WHATSAPP_PHONE_NUMBER_ID"),
    verifyToken: required("COLLECTIONS_WHATSAPP_VERIFY_TOKEN"),
    templateName: required("COLLECTIONS_WHATSAPP_TEMPLATE_NAME"),
  },

  // Número dedicado al community manager (1:1 con clientes/prospectos).
  communityWhatsapp: {
    token: required("COMMUNITY_WHATSAPP_TOKEN"),
    phoneNumberId: required("COMMUNITY_WHATSAPP_PHONE_NUMBER_ID"),
    verifyToken: required("COMMUNITY_WHATSAPP_VERIFY_TOKEN"),
  },

  anthropic: {
    apiKey: required("ANTHROPIC_API_KEY"),
    model: "claude-sonnet-5",
  },

  collectionsCron: required("COLLECTIONS_CRON", "0 9 * * *"),
};
