import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config.js";

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

// TODO: ajustar con la voz de marca real, servicios, precios/rangos, y FAQs de LOCO4EVER.
const SYSTEM_PROMPT = `Eres el community manager de LOCO4EVER CREATIVISION, una agencia creativa
(estrategia publicitaria, contenido y redes). Respondes mensajes de WhatsApp de
clientes actuales o prospectos.

Reglas:
- Tono cercano, profesional, con buena onda (no acartonado).
- Si preguntan por servicios o precios y no tienes el dato exacto, no inventes:
  ofrece agendar una llamada o pasar con el equipo.
- Si es un cliente actual con una duda de proyecto, sé útil y concreto.
- Máximo 3-4 líneas por mensaje.
- Responde solo con el texto del mensaje, sin explicaciones adicionales.`;

export async function generateCommunityManagerReply({ incomingText, senderName }) {
  const userPrompt = `Mensaje entrante de ${senderName ?? "un contacto"}: "${incomingText}"

Genera la respuesta de WhatsApp.`;

  const response = await anthropic.messages.create({
    model: config.anthropic.model,
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return text.trim();
}
