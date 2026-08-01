import "dotenv/config";

function required(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  whatsapp: {
    token: required("WHATSAPP_TOKEN"),
    phoneNumberId: required("WHATSAPP_PHONE_NUMBER_ID"),
    verifyToken: required("WHATSAPP_VERIFY_TOKEN"),
    collectionsTemplateName: required("WHATSAPP_COLLECTIONS_TEMPLATE_NAME"),
    graphApiVersion: "v20.0",
  },
  anthropic: {
    apiKey: required("ANTHROPIC_API_KEY"),
    model: "claude-sonnet-5",
  },
  collectionsCron: required("COLLECTIONS_CRON", "0 9 * * *"),
};
