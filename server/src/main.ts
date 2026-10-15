import { serve } from "@hono/node-server";
import { openDb } from "./db.ts";
import { loadLexicons } from "./lexicons.ts";
import { createApp } from "./app.ts";

const port = Number(process.env["OMP_PORT"] ?? 3000);
const cfg = { baseUrl: process.env["OMP_BASE_URL"] ?? `http://localhost:${port}`, adminToken: process.env["OMP_ADMIN_TOKEN"] };
const db = openDb(process.env["OMP_DB_PATH"] ?? "data/omp.sqlite");
const { app } = createApp(db, loadLexicons(), cfg);
serve({ fetch: app.fetch, port }, () => console.log(`OMP server listening on ${cfg.baseUrl}`));
