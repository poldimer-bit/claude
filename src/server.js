import express from "express";
import { config } from "./config.js";
import { handleIncomingMessage } from "./router.js";
import { startCollectionsScheduler } from "./scheduler/reminders.js";

const app = express();
app.use(express.json());

// Verificación del webhook (Meta hace un GET al configurar la URL en el panel de la app).
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.whatsapp.verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Mensajes entrantes de WhatsApp.
app.post("/webhook", async (req, res) => {
  res.sendStatus(200); // responder rápido, Meta reintenta si tardas

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    if (!message || message.type !== "text") return;

    const from = message.from;
    const text = message.text.body;
    const senderName = change?.value?.contacts?.[0]?.profile?.name;

    const reply = await handleIncomingMessage({ from, text, senderName });
    console.log(`[whatsapp] ${from} -> "${text}" | respuesta: "${reply}"`);
  } catch (err) {
    console.error("[webhook] error procesando mensaje:", err);
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(config.port, () => {
  console.log(`Servidor escuchando en puerto ${config.port}`);
  startCollectionsScheduler();
});
