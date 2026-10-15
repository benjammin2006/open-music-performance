import { serve } from "@hono/node-server";
import { openDb } from "./db.ts";
import { loadLexicons } from "./lexicons.ts";
import { createApp } from "./app.ts";

const port = Number(process.env["OMP_PORT"] ?? 3000);
const env = (k: string) => process.env[k] || undefined;
const cfg = {
  baseUrl: env("OMP_BASE_URL") ?? `http://localhost:${port}`, adminToken: env("OMP_ADMIN_TOKEN"),
  payments: { secretKey: env("OMP_STRIPE_SECRET_KEY"), webhookSecret: env("OMP_STRIPE_WEBHOOK_SECRET"), clientId: env("OMP_STRIPE_CLIENT_ID") },
};
const db = openDb(process.env["OMP_DB_PATH"] ?? "data/omp.sqlite");
const { app } = createApp(db, loadLexicons(), cfg);
serve({ fetch: app.fetch, port }, () => console.log(`OMP server listening on ${cfg.baseUrl}${cfg.payments.secretKey ? ` · Stripe ${cfg.payments.secretKey.startsWith("sk_live_") ? "LIVE" : "test"} mode${cfg.payments.webhookSecret ? "" : " (no webhook secret: relying on the success-page fallback)"}` : " · Stripe not configured"}`));
