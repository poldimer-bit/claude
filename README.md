# Agentes de WhatsApp — LOCO4EVER

Dos agentes sobre el mismo webhook de WhatsApp:

- **Cobranza**: le escribe a clientes con facturas vencidas (recordatorio suave → firme → aviso final según días de atraso) y responde cuando el cliente contesta.
- **Community manager**: responde consultas generales de clientes/prospectos con la voz de marca de LOCO4EVER.

## Cómo decide a quién le habla cada mensaje

`src/router.js`: si el número que escribe tiene una factura `overdue` en `data/clients.json`, responde el agente de cobranza; si no, responde el community manager.

## Setup

### 1. WhatsApp Cloud API (Meta)

1. Crea una app en [developers.facebook.com/apps](https://developers.facebook.com/apps) tipo "Business".
2. Agrega el producto "WhatsApp".
3. Del panel de WhatsApp > API Setup, copia `Phone number ID` y el token temporal (o genera uno permanente en Business Settings > System Users).
4. En "Configuration" del producto WhatsApp, configura el webhook:
   - URL: `https://tu-dominio/webhook`
   - Verify token: cualquier string que tú inventes (ponlo también en `.env` como `WHATSAPP_VERIFY_TOKEN`)
   - Suscríbete al campo `messages`.
5. Para que el agente de cobranza pueda **iniciar** conversaciones (recordatorios proactivos), crea y aprueba una plantilla en WhatsApp Manager > Message Templates (categoría "Utility"), y pon su nombre en `WHATSAPP_COLLECTIONS_TEMPLATE_NAME`. Sin plantilla aprobada, WhatsApp no te deja escribirle primero a un cliente fuera de la ventana de 24h.

### 2. Variables de entorno

```
cp .env.example .env
```

Rellena `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `ANTHROPIC_API_KEY`.

### 3. Instalar y correr

```
npm install
npm run dev
```

El servidor expone:
- `GET /webhook` — verificación de Meta
- `POST /webhook` — mensajes entrantes
- `GET /health` — healthcheck

Para desarrollo local, expón el puerto con algo como `ngrok http 3000` y usa esa URL en el paso 4 de arriba.

### 4. Datos de clientes/facturas

`data/clients.json` es el store por defecto (simple, para arrancar). Estructura:

```json
{
  "id": "client-001",
  "name": "Nombre",
  "phone": "521XXXXXXXXXX",
  "invoices": [
    { "id": "inv-001", "amount": 15000, "currency": "MXN", "dueDate": "2026-07-28", "status": "overdue", "description": "..." }
  ]
}
```

Cuando tengas definido dónde quieres llevar esto de verdad (Sheets, Notion, tu propio CRM), se reemplaza `src/store/clientsStore.js` sin tocar los agentes ni el router — es la única capa que sabe de dónde vienen los datos.

### 5. Recordatorios automáticos

`src/scheduler/reminders.js` corre con el cron definido en `COLLECTIONS_CRON` (por defecto todos los días 9am) y le manda la plantilla aprobada a cada cliente con factura `overdue`.

## Pendientes / a definir contigo

- Ajustar el tono y las reglas de escalamiento reales en `src/agents/collectionsAgent.js`.
- Rellenar la voz de marca, servicios y FAQs reales en `src/agents/communityManagerAgent.js`.
- Decidir el store definitivo de clientes/facturas.
- Decidir si el community manager también cubre Instagram/Facebook (hoy solo WhatsApp).
- Deploy: cualquier VPS/Render/Railway/Fly.io sirve, solo necesita URL pública para el webhook.
