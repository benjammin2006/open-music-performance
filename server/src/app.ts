// HTTP routes. Public pages, open feeds and exports, the free RSVP flow, paid checkout on the organizer's own
// Stripe account (payments.ts), the Stripe webhook, and a token-guarded write API.
import { Hono, type Context } from "hono";
import QRCode from "qrcode";
import type { DatabaseSync } from "node:sqlite";
import type { Lexicons } from "@atproto/lexicon";
import { C, NS } from "./lexicons.ts";
import { IssuerKeys } from "./keys.ts";
import { RecordStore, ValidationError, type Stored } from "./records.ts";
import { Services } from "./services.ts";
import { icalCalendar } from "./ical.ts";
import { eventPage, posterPage } from "./pages/event.ts";
import { orgPage } from "./pages/org.ts";
import { orderPage, pendingOrderPage } from "./pages/order.ts";
import { PaymentError, Payments, type PaymentsConfig } from "./payments.ts";
import { StripeError } from "./stripe.ts";
import { reconciliationPage, doorCodePrompt } from "./pages/reconciliation.ts";
import { attendanceCsv, reconcile, summaryCsv, type DoorScanRecord, type DonationRecord } from "./reconcile.ts";
import { getCookie, setCookie } from "hono/cookie";
import { Auth } from "./auth.ts";
import { mountAdmin } from "./admin.ts";
import { InstanceKey, exportBundle } from "./portability.ts";
import { setupDonePage, setupPage } from "./pages/setup.ts";
import { isValidTimeZone } from "./time.ts";
import { randomToken } from "./auth.ts";
import { esc, layout } from "./render.ts";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, normalize } from "node:path";
import type { Event, Organization, Order, Performance, Program, Ticket, TicketClass } from "./types.ts";

export interface AppConfig {
  baseUrl: string;
  adminToken?: string;
  payments?: PaymentsConfig;
}

const PUBLIC_COLLECTIONS = new Set<string>([C.organization, C.act, C.event, C.performance, C.ticketClass, C.program]);

export function createApp(db: DatabaseSync, lex: Lexicons, cfg: AppConfig) {
  const store = new RecordStore(db, lex);
  const keys = new IssuerKeys(db, store);
  const svc = new Services(store, keys);
  const auth = new Auth(db);
  const app = new Hono();
  const instanceKey = new InstanceKey(db);
  const payments = new Payments({ db, store, svc, baseUrl: cfg.baseUrl, config: cfg.payments ?? {} });
  const admin = mountAdmin(app, { store, keys, svc, auth, payments, baseUrl: cfg.baseUrl, exportBundle: (did) => exportBundle(store, instanceKey, did, cfg.baseUrl) });

  app.get("/healthz", (c) => c.json({ ok: true, ns: NS }));

  app.get("/", (c) => {
    const orgs = store.list<Organization>(null, C.organization, 50);
    if (orgs.length === 0) return c.redirect("/setup");
    return c.html(layout({ title: "Open Music Performance", body: `<h1>Events</h1>${orgs.map((o) => `<div class="card"><a href="/o/${esc(o.did)}"><strong>${esc(o.record.name)}</strong></a></div>`).join("")}` }));
  });

  // The instance's export-signing key, so anyone holding a bundle can check which instance signed it.
  app.get("/.well-known/omp.json", async (c) => {
    const k = await instanceKey.get();
    return c.json({ instance: cfg.baseUrl, kid: k.kid, alg: "Ed25519", publicKeyMultibase: k.publicKeyMultibase, exportFormat: "org.openmusicperformance.export/1" });
  });

  // First-run setup: only while the instance has no organizations.
  const isEmpty = () => store.list(null, C.organization, 1).length === 0;
  app.get("/setup", (c) => (isEmpty() ? c.html(setupPage(cfg.baseUrl)) : c.redirect("/admin")));
  app.post("/setup", async (c) => {
    if (!isEmpty()) return c.redirect("/admin", 303);
    const b = await c.req.parseBody();
    const s = (k: string, max = 200) => String(b[k] ?? "").trim().slice(0, max);
    const slug = s("slug", 40).toLowerCase();
    const tz = s("timezone", 64);
    if (!/^[a-z0-9-]{2,40}$/.test(slug)) return c.html(setupPage(cfg.baseUrl, "Short id must be 2 to 40 lowercase letters, digits or dashes."), 400);
    if (!isValidTimeZone(tz)) return c.html(setupPage(cfg.baseUrl, `Unknown timezone "${tz}".`), 400);
    const host = new URL(cfg.baseUrl).host.replace(":", "%3A");
    const did = `did:web:${host}:org:${slug}`;
    const locationName = s("locationName");
    try {
      const org = await store.put<Organization>(did, C.organization, {
        name: s("name"), kind: s("kind", 40) || "other", timezone: tz, ...(s("website", 500) ? { website: s("website", 500) } : {}),
        ...(locationName ? { location: { name: locationName, ...(s("locality", 100) ? { locality: s("locality", 100) } : {}), ...(s("region", 100) ? { region: s("region", 100) } : {}), country: "US" } } : {}),
        createdAt: new Date().toISOString(),
      });
      await keys.provision(did, org.rkey, `${slug}-${new Date().getUTCFullYear()}-1`);
      const organizerKey = await auth.issueKey(did, "setup", randomToken());
      setCookie(c, "omp_session", await auth.createSession(did), { httpOnly: true, sameSite: "Lax", path: "/", secure: cfg.baseUrl.startsWith("https"), maxAge: 30 * 86400 });
      return c.html(setupDonePage(org.record.name, did, organizerKey));
    } catch (e) {
      if (e instanceof ValidationError) return c.html(setupPage(cfg.baseUrl, e.message), 400);
      throw e;
    }
  });

  // Organization page and calendar feed.
  app.get("/o/:did", (c) => {
    const org = firstOrg(store, c.req.param("did"));
    if (!org) return c.notFound();
    const events = store.list<Event>(org.did, C.event).filter(isPublic).sort((a, b) => a.record.startsAt.localeCompare(b.record.startsAt));
    return c.html(orgPage(org, events, cfg.baseUrl));
  });
  app.get("/o/:did/calendar.ics", (c) => {
    const org = firstOrg(store, c.req.param("did"));
    if (!org) return c.notFound();
    const events = store.list<Event>(org.did, C.event).filter(isPublic);
    return ics(c, icalCalendar(org.record.name, events.map((e) => toIcal(e, cfg.baseUrl))), `${org.rkey}.ics`);
  });

  // Event page, feed, poster, status list.
  app.get("/e/:did/:rkey", (c) => {
    const raw = c.req.param("rkey");
    const wantsIcs = raw.endsWith(".ics");
    const event = store.get<Event>(c.req.param("did"), C.event, wantsIcs ? raw.slice(0, -4) : raw);
    if (!event || event.record.status === "draft") return c.notFound();
    if (wantsIcs) return ics(c, icalCalendar(event.record.title, [toIcal(event, cfg.baseUrl)]), `${event.rkey}.ics`);
    return c.html(renderEvent(event, c.req.query("notice")));
  });
  app.get("/e/:did/:rkey/poster", async (c) => {
    const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
    if (!event) return c.notFound();
    const url = `${cfg.baseUrl}/e/${event.did}/${event.rkey}`;
    return c.html(posterPage(event, firstOrg(store, event.did), url, await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 1 })));
  });
  app.get("/e/:did/:rkey/status-list.json", async (c) => {
    const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
    if (!event) return c.notFound();
    return c.json({ event: event.uri, ...(await svc.statusList(event)) });
  });
  app.get("/o/:did/issuer-keys.json", (c) => {
    const org = firstOrg(store, c.req.param("did"));
    if (!org) return c.notFound();
    return c.json({ did: org.did, issuerKeys: org.record.issuerKeys ?? [] });
  });

  // Door endpoints, guarded by the per-event door code. One sync gives the scanner everything it needs offline.
  const doorAuth = (c: { req: { header: (n: string) => string | undefined } }, eventUri: string) =>
    keys.checkDoorCode(eventUri, (c.req.header("authorization") ?? "").replace(/^Bearer\s+/i, ""));
  app.get("/e/:did/:rkey/door.json", async (c) => {
    const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
    if (!event) return c.notFound();
    if (!doorAuth(c, event.uri)) return c.text("door code required", 401);
    c.header("Cache-Control", "private, no-store");
    return c.json(await svc.doorPack(event, firstOrg(store, event.did)));
  });
  app.post("/e/:did/:rkey/scans", async (c) => {
    const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
    if (!event) return c.notFound();
    if (!doorAuth(c, event.uri)) return c.text("door code required", 401);
    const body = (await c.req.json().catch(() => null)) as { scans?: unknown[] } | null;
    if (!body || !Array.isArray(body.scans)) return c.text("expected { scans: [] }", 400);
    return c.json({ accepted: await svc.recordScans(event, body.scans.slice(0, 5000)) });
  });

  // Reconciliation sheet and CSVs. Organizer access via the door code held in a session cookie (never in the URL).
  const cookieName = (rkey: string) => `omp_door_${rkey}`;
  const sheetAuth = async (c: Context, event: Stored<Event>) => keys.checkDoorCode(event.uri, getCookie(c, cookieName(event.rkey)) ?? "") || (await admin.sessionDid(c)) === event.did;
  const buildSheet = (event: Stored<Event>) => reconcile({
    event, classes: svc.ticketClassesFor(event),
    orders: store.listReferencing<Order>(C.order, event.uri, 100_000), tickets: store.listReferencing<Ticket>(C.ticket, event.uri, 100_000),
    scans: store.listReferencing<DoorScanRecord>(C.doorScan, event.uri, 100_000), donations: store.listReferencing<DonationRecord>(C.donation, event.uri, 100_000),
  });
  app.get("/e/:did/:rkey/reconciliation", async (c) => {
    const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
    if (!event) return c.notFound();
    c.header("Cache-Control", "private, no-store");
    if (!(await sheetAuth(c, event))) return c.html(doorCodePrompt(event.record.title, `/e/${event.did}/${event.rkey}/reconciliation`), 401);
    return c.html(reconciliationPage(buildSheet(event), `/e/${event.did}/${event.rkey}`));
  });
  app.post("/e/:did/:rkey/reconciliation", async (c) => {
    const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
    if (!event) return c.notFound();
    const code = String((await c.req.parseBody())["code"] ?? "").trim();
    if (!keys.checkDoorCode(event.uri, code)) return c.html(doorCodePrompt(event.record.title, `/e/${event.did}/${event.rkey}/reconciliation`, true), 401);
    setCookie(c, cookieName(event.rkey), code, { httpOnly: true, sameSite: "Lax", path: `/e/${event.did}/${event.rkey}`, secure: cfg.baseUrl.startsWith("https") });
    return c.redirect(`/e/${event.did}/${event.rkey}/reconciliation`, 303);
  });
  for (const [path, fn, name] of [["reconciliation.csv", summaryCsv, "reconciliation"], ["attendance.csv", attendanceCsv, "attendance"]] as const) {
    app.get(`/e/:did/:rkey/${path}`, async (c) => {
      const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
      if (!event) return c.notFound();
      if (!(await sheetAuth(c, event))) return c.text("organizer access required", 401);
      return c.body(fn(buildSheet(event)), 200, { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}-${event.rkey}.csv"`, "Cache-Control": "private, no-store" });
    });
  }

  // Scanner PWA, served from apps/scanner/dist (run `npm run build` first).
  const scannerDir = fileURLToPath(new URL("../../apps/scanner/dist/", import.meta.url));
  const types: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".map": "application/json", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".css": "text/css" };
  app.get("/scan", (c) => c.redirect("/scan/"));
  app.get("/scan/*", async (c) => {
    const rel = normalize(c.req.path.replace(/^\/scan\//, "") || "index.html");
    if (rel.startsWith("..")) return c.notFound();
    const file = join(scannerDir, rel === "" || rel === "." ? "index.html" : rel);
    try {
      const body = await readFile(file);
      const ext = file.slice(file.lastIndexOf("."));
      return c.body(body, 200, { "Content-Type": types[ext] ?? "application/octet-stream", "Cache-Control": rel.endsWith("sw.js") ? "no-cache" : "public, max-age=300" });
    } catch {
      return c.text("scanner not built; run npm run build", 404);
    }
  });

  // Free RSVP: issues signed tickets. Paid checkout is a stub until the payments lane.
  app.post("/e/:did/:rkey/rsvp", async (c) => {
    const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
    if (!event) return c.notFound();
    const form = await c.req.parseBody();
    const cls = store.get<TicketClass>(event.did, C.ticketClass, String(form["ticketClass"] ?? ""));
    if (!cls) return c.text("unknown ticket class", 400);
    try {
      const { order, tickets } = await svc.rsvp(event, cls, {
        name: String(form["name"] ?? ""),
        email: form["email"] ? String(form["email"]) : undefined,
        marketingConsent: form["marketingConsent"] === "1",
      }, Number(form["quantity"] ?? 1));
      return c.redirect(`/order/${order.did}/${order.rkey}`, 303);
    } catch (e) {
      if (e instanceof ValidationError) return c.html(renderEvent(event, `Could not reserve: ${e.message}`, true), 400);
      throw e;
    }
  });

  // Paid checkout: hold the seats with a pending order, then send the buyer to Stripe's hosted page, charged
  // directly on the organizer's connected account. Nothing card-related touches this server.
  app.post("/e/:did/:rkey/checkout", async (c) => {
    const event = store.get<Event>(c.req.param("did"), C.event, c.req.param("rkey"));
    if (!event) return c.notFound();
    const form = await c.req.parseBody();
    const cls = store.get<TicketClass>(event.did, C.ticketClass, String(form["ticketClass"] ?? ""));
    if (!cls) return c.text("unknown ticket class", 400);
    if (!payments.canSell(event.did)) return c.html(renderEvent(event, "Online payment is not set up for this organizer yet. Free reservations still work.", true), 409);
    try {
      const offered = form["amount"] !== undefined && String(form["amount"]).trim() !== "" ? Math.round(Number(form["amount"]) * 100) : undefined;
      const { url } = await payments.startCheckout(event, cls, {
        name: String(form["name"] ?? ""), email: String(form["email"] ?? ""), marketingConsent: form["marketingConsent"] === "1",
      }, Number(form["quantity"] ?? 1), offered);
      return c.redirect(url, 303);
    } catch (e) {
      if (e instanceof ValidationError) return c.html(renderEvent(event, `Could not start checkout: ${e.message}`, true), 400);
      if (e instanceof PaymentError) return c.html(renderEvent(event, e.message, true), 502);
      throw e;
    }
  });

  // Stripe webhook (Connect: events from connected accounts). Raw body is required for the signature check.
  app.post("/webhooks/stripe", async (c) => {
    try {
      const result = await payments.handleWebhook(await c.req.text(), c.req.header("stripe-signature"));
      return c.json({ received: true, ...result });
    } catch (e) {
      if (e instanceof StripeError) return c.json({ error: e.message }, e.status === 503 ? 503 : 400);
      throw e;
    }
  });

  // Order page with QR tickets. The order rkey is the capability; keep it out of logs and referers.
  // A pending paid order is settled here if Stripe says it is paid (covers a webhook that has not arrived).
  app.get("/order/:did/:rkey", async (c) => {
    let order = store.get<Order>(c.req.param("did"), C.order, c.req.param("rkey"));
    if (!order) return c.notFound();
    const event = store.getByUri<Event>(order.record.event.uri);
    if (!event) return c.notFound();
    c.header("Referrer-Policy", "no-referrer");
    c.header("Cache-Control", "private, no-store");
    if (order.record.status === "pending") {
      const sessionId = c.req.query("session_id");
      order = await payments.syncPending(order, ...(sessionId ? [sessionId] as const : []));
      if (order.record.status === "pending") return c.html(pendingOrderPage(event, order));
    }
    if (order.record.status !== "paid" && order.record.status !== "free") return c.html(pendingOrderPage(event, order));
    const tickets = store.listReferencing<Ticket>(C.ticket, order.uri);
    const withQr = await Promise.all(tickets.map(async (ticket) => ({ ticket, qrSvg: ticket.record.token ? await QRCode.toString(ticket.record.token, { type: "svg", errorCorrectionLevel: "M", margin: 1 }) : "" })));
    return c.html(orderPage(event, order, withQr));
  });
  // Stripe's cancel_url (a GET) and the pending page's cancel button both release the hold.
  const cancelOrder = async (c: Context) => {
    const order = store.get<Order>(c.req.param("did") ?? "", C.order, c.req.param("rkey") ?? "");
    if (!order) return c.notFound();
    await payments.cancelPending(order);
    return c.redirect(`/e/${order.did}/${store.getByUri<Event>(order.record.event.uri)?.rkey ?? ""}?notice=${encodeURIComponent("Checkout cancelled. Nothing was charged and the seats were released.")}`, 303);
  };
  app.get("/order/:did/:rkey/cancelled", cancelOrder);
  app.post("/order/:did/:rkey/cancel", cancelOrder);

  // Open data: every public record for a DID, in lexicon form. Anyone can index this.
  app.get("/export/:did/public.json", (c) => {
    const did = c.req.param("did");
    const records = [...PUBLIC_COLLECTIONS].flatMap((col) => store.list(did, col, 10_000)).filter((r) => r.collection !== C.event || isPublic(r as unknown as Stored<Event>));
    return c.json({ did, generatedAt: new Date().toISOString(), records: records.map((r) => ({ uri: r.uri, cid: r.cid, value: r.record })) });
  });

  // Write API, token-guarded until organizer accounts exist. Validates against the lexicons.
  app.use("/api/*", async (c, next) => {
    if (c.req.method === "GET") return next();
    const auth = c.req.header("authorization") ?? "";
    if (!cfg.adminToken || auth !== `Bearer ${cfg.adminToken}`) return c.text("unauthorized", 401);
    return next();
  });
  app.get("/api/:did/:collection", (c) => {
    const collection = c.req.param("collection");
    if (!PUBLIC_COLLECTIONS.has(collection)) return c.text("not a public collection", 403);
    return c.json(store.list(c.req.param("did"), collection).map((r) => ({ uri: r.uri, cid: r.cid, value: r.record })));
  });
  app.get("/api/:did/:collection/:rkey", (c) => {
    const collection = c.req.param("collection");
    if (!PUBLIC_COLLECTIONS.has(collection)) return c.text("not a public collection", 403);
    const r = store.get(c.req.param("did"), collection, c.req.param("rkey"));
    return r ? c.json({ uri: r.uri, cid: r.cid, value: r.record }) : c.notFound();
  });
  app.post("/api/:did/:collection", async (c) => {
    const collection = c.req.param("collection");
    if (!collection.startsWith(`${NS}.`)) return c.text("unknown collection", 400);
    try {
      const r = await store.put(c.req.param("did"), collection, (await c.req.json()) as Record<string, unknown>);
      return c.json({ uri: r.uri, cid: r.cid }, 201);
    } catch (e) {
      if (e instanceof ValidationError) return c.json({ error: e.message }, 400);
      throw e;
    }
  });

  function renderEvent(event: Stored<Event>, notice?: string, error = false): string {
    const org = firstOrg(store, event.did);
    const classes = svc.ticketClassesFor(event).map((cls) => ({ cls, remaining: svc.remaining(cls) }));
    const performances = store.listReferencing<Performance>(C.performance, event.uri).map((p) => ({ ...p, record: { ...p.record, actName: p.record.actName ?? (p.record.act ? store.getByUri<{ name: string }>(p.record.act.uri)?.record.name : undefined) } }));
    const program = store.listReferencing<Program>(C.program, event.uri)[0] ?? null;
    return eventPage({ org, event, classes, performances, program, baseUrl: cfg.baseUrl, paymentsReady: payments.canSell(event.did), ...(notice ? { notice, error } : {}) });
  }

  return { app, store, keys, svc, auth, instanceKey, payments };
}

function firstOrg(store: RecordStore, did: string): Stored<Organization> | null {
  return store.list<Organization>(did, C.organization, 1)[0] ?? null;
}
function isPublic(e: Stored<Event>): boolean {
  return e.record.status !== "draft" && e.record.visibility !== "unlisted";
}
function toIcal(e: Stored<Event>, baseUrl: string) {
  const l = e.record.location;
  return { uid: e.uri, summary: e.record.title, description: e.record.description, location: [l.name, l.streetAddress, l.locality, l.region].filter(Boolean).join(", "), url: `${baseUrl}/e/${e.did}/${e.rkey}`, startsAt: e.record.startsAt, endsAt: e.record.endsAt, stamp: e.updatedAt };
}
function ics(c: { body: (b: string, status?: number, headers?: Record<string, string>) => Response }, body: string, filename: string): Response {
  return c.body(body, 200, { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}"` });
}
