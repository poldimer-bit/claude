import express from "express";
import { config } from "./config.js";
import { handleCollectionsMessage, handleCommunityMessage } from "./router.js";
import { startCollectionsScheduler } from "./scheduler/reminders.js";

const app = express();
app.use(express.json());

function verifyHandler(verifyToken) {
  return (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === verifyToken) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  };
}

function extractMessage(body) {
  const entry = body?.entry?.[0];
  const change = entry?.changes?.[0];
  const message = change?.value?.messages?.[0];
  if (!message || message.type !== "text") return null;

  return {
    from: message.from,
    text: message.text.body,
    senderName: change?.value?.contacts?.[0]?.profile?.name,
  };
}

// --- Agente de cobranza (número exclusivo) ---
app.get("/webhook/collections", verifyHandler(config.collectionsWhatsapp.verifyToken));
app.post("/webhook/collections", async (req, res) => {
  res.sendStatus(200);
  try {
    const message = extractMessage(req.body);
    if (!message) return;
    const reply = await handleCollectionsMessage(message);
    console.log(`[cobranza] ${message.from} -> "${message.text}" | respuesta: "${reply}"`);
  } catch (err) {
    console.error("[cobranza] error procesando mensaje:", err);
  }
});

// --- Agente de community manager (número dedicado, 1:1) ---
app.get("/webhook/community", verifyHandler(config.communityWhatsapp.verifyToken));
app.post("/webhook/community", async (req, res) => {
  res.sendStatus(200);
  try {
    const message = extractMessage(req.body);
    if (!message) return;
    const reply = await handleCommunityMessage(message);
    console.log(`[community] ${message.from} -> "${message.text}" | respuesta: "${reply}"`);
  } catch (err) {
    console.error("[community] error procesando mensaje:", err);
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(config.port, () => {
  console.log(`Servidor escuchando en puerto ${config.port}`);
  startCollectionsScheduler();
});
