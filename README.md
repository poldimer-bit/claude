# Agentes de WhatsApp — LOCO4EVER

Dos agentes independientes, cada uno con su propio número de WhatsApp:

- **Cobranza** (`/webhook/collections`): número exclusivo. Le escribe a clientes con facturas vencidas (recordatorio suave → firme → aviso final según días de atraso) y responde cuando el cliente contesta.
- **Community manager** (`/webhook/community`): número separado, distinto al de cobranza. Responde consultas generales de clientes/prospectos con la voz de marca de LOCO4EVER.

## Sobre los grupos de WhatsApp existentes

La API oficial de WhatsApp (Meta Cloud API) **no soporta grupos**: no puede unirse a un grupo, ni leer ni escribir en uno. Por eso el community manager de este MVP responde por **chat individual (1:1)** con cada cliente/prospecto, no dentro de los grupos que ya tienes. Los grupos existentes siguen siendo 100% manuales.

Si más adelante quieres que el agente opere directo dentro de esos grupos, existe la opción de usar una librería no oficial (Baileys/whatsapp-web.js) que se conecta como un WhatsApp normal vía QR y sí soporta grupos — pero viola los Términos de Servicio de WhatsApp y hay riesgo real de que Meta banee ese número. Es una decisión de negocio, no técnica: si la quieres, se agrega como fase 2, idealmente con un número secundario (no el principal de la agencia) para acotar el riesgo.

## Setup

### 1. Dos números en WhatsApp Business

Necesitas **dos** números de teléfono distintos dados de alta en WhatsApp Business (pueden estar bajo la misma cuenta de Meta Business y la misma app, o en apps separadas):

1. Crea (o usa) una app en [developers.facebook.com/apps](https://developers.facebook.com/apps) tipo "Business", con el producto "WhatsApp".
2. Agrega los dos números de teléfono en la sección de WhatsApp (uno para cobranza, otro para community manager). Cada uno tiene su propio `Phone number ID`.
3. Genera un token permanente por número en Business Settings > System Users (o usa el temporal para pruebas).
4. En "Configuration" del producto WhatsApp, configura **un webhook por número**:
   - Cobranza → `https://tu-dominio/webhook/collections`, verify token = el que pongas en `COLLECTIONS_WHATSAPP_VERIFY_TOKEN`
   - Community → `https://tu-dominio/webhook/community`, verify token = el que pongas en `COMMUNITY_WHATSAPP_VERIFY_TOKEN`
   - Ambos suscritos al campo `messages`.
5. Para que el agente de cobranza pueda **iniciar** conversaciones (recordatorios proactivos), crea y aprueba una plantilla en WhatsApp Manager > Message Templates (categoría "Utility") para el número de cobranza, y pon su nombre en `COLLECTIONS_WHATSAPP_TEMPLATE_NAME`. Sin plantilla aprobada, WhatsApp no te deja escribirle primero a un cliente fuera de la ventana de 24h.

### 2. Variables de entorno

```
cp .env.example .env
```

Rellena los tokens/IDs de ambos números y `ANTHROPIC_API_KEY`.

### 3. Instalar y correr

```
npm install
npm run dev
```

El servidor expone:
- `GET/POST /webhook/collections` — agente de cobranza
- `GET/POST /webhook/community` — agente de community manager
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

`src/scheduler/reminders.js` corre con el cron definido en `COLLECTIONS_CRON` (por defecto todos los días 9am) y le manda la plantilla aprobada, desde el número de cobranza, a cada cliente con factura `overdue`.

## Pendientes / a definir contigo

- Ajustar el tono y las reglas de escalamiento reales en `src/agents/collectionsAgent.js`.
- Rellenar la voz de marca, servicios y FAQs reales en `src/agents/communityManagerAgent.js`.
- Decidir el store definitivo de clientes/facturas.
- Decidir si en algún momento quieres la fase 2 con Baileys para operar dentro de los grupos existentes (con el riesgo de ban que implica).
- Deploy: cualquier VPS/Render/Railway/Fly.io sirve, solo necesita URL pública para los dos webhooks.
