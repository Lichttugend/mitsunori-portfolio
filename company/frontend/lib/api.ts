const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getAgentsStatus() {
  const res = await fetch(`${BASE}/api/agents/status`);
  if (!res.ok) throw new Error("agents/status fetch failed");
  return res.json();
}

export async function triggerAgent(agentName: string) {
  const res = await fetch(`${BASE}/api/agents/${agentName}/trigger`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`trigger ${agentName} failed`);
  return res.json();
}

export async function getRecords() {
  const res = await fetch(`${BASE}/api/accounting/records`);
  if (!res.ok) throw new Error("records fetch failed");
  return res.json();
}

export async function fetchInvoices(opts?: { dry_run?: boolean; max?: number }) {
  const res = await fetch(`${BASE}/api/accounting/fetch-invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts ?? {}),
  });
  if (!res.ok) throw new Error("fetch-invoices failed");
  return res.json();
}

export const WS_URL = BASE.replace(/^http/, "ws") + "/api/agents/ws";
