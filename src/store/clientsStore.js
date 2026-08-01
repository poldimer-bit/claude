import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "..", "data", "clients.json");

async function readAll() {
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeAll(clients) {
  await writeFile(DATA_PATH, JSON.stringify(clients, null, 2) + "\n", "utf-8");
}

export async function findClientByPhone(phone) {
  const clients = await readAll();
  return clients.find((c) => c.phone === phone) ?? null;
}

export async function listOverdueInvoices() {
  const clients = await readAll();
  const result = [];
  for (const client of clients) {
    for (const invoice of client.invoices) {
      if (invoice.status === "overdue") {
        result.push({ client, invoice });
      }
    }
  }
  return result;
}

export async function markInvoiceStatus(clientId, invoiceId, status) {
  const clients = await readAll();
  const client = clients.find((c) => c.id === clientId);
  if (!client) throw new Error(`Cliente no encontrado: ${clientId}`);
  const invoice = client.invoices.find((i) => i.id === invoiceId);
  if (!invoice) throw new Error(`Factura no encontrada: ${invoiceId}`);
  invoice.status = status;
  await writeAll(clients);
}

export function daysOverdue(dueDate, now = new Date()) {
  const due = new Date(dueDate);
  const diffMs = now.getTime() - due.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
