// HTTP routes. Public pages, open feeds and exports, the free RSVP flow, and a token-guarded write API.
// Paid checkout is a stub until server/payments lands (docs/DEMO_PLAN.md build list).
import { Hono } from "hono";
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
import { orderPage } from "./pages/order.ts";
import { esc, layout } from "./render.ts";
import type { Event, Organization, Order, Performance, Program, Ticket, TicketClass } from "./types.ts";

export interface AppConfig {
  baseUrl: string;
  adminToken?: string;
}

const PUBLIC_COLLECTIONS = new Set<string>([C.organization, C.act, C.event, C.performance, C.ticketClass, C.program]);

export function createApp(db: DatabaseSync, lex: Lexicons, cfg: AppConfig) {
  const store = new RecordStore(db, lex);
  const keys = new IssuerKeys(db, store);
  const svc = new Services(store, keys);
  const app = new Hono();

  app.get("/healthz", (c) => c.json({ ok: true, ns: NS }));

  app.get("/", (c) => {
    const orgs = store.list<Organization>(null, C.organization, 50);
    return c.html(layout({ title: "Open Music Performance", body: `<h1>Events</h1>${orgs.map((o) => `<div class="card"><a href="/o/${esc(o.did)}"><strong>${esc(o.record.name)}</strong></a></div>`).join("") || "<p class='fine'>Nothing here yet. Run <code>npm run seed</code>.</p>"}` }));
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
      if (e instanceof ValidationError) return c.html(renderEvent(event, `Could not reserve: ${e.message}`), 400);
      throw e;
    }
  });
  app.post("/e/:did/:rkey/checkout", (c) => c.text("Paid checkout is not configured on this instance yet. Free reservations work.", 501));

  // Order page with QR tickets. The order rkey is the capability; keep it out of logs and referers.
  app.get("/order/:did/:rkey", async (c) => {
    const order = store.get<Order>(c.req.param("did"), C.order, c.req.param("rkey"));
    if (!order) return c.notFound();
    const event = store.getByUri<Event>(order.record.event.uri);
    if (!event) return c.notFound();
    const tickets = store.listReferencing<Ticket>(C.ticket, order.uri);
    const withQr = await Promise.all(tickets.map(async (ticket) => ({ ticket, qrSvg: ticket.record.token ? await QRCode.toString(ticket.record.token, { type: "svg", errorCorrectionLevel: "M", margin: 1 }) : "" })));
    c.header("Referrer-Policy", "no-referrer");
    c.header("Cache-Control", "private, no-store");
    return c.html(orderPage(event, order, withQr));
  });

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

  function renderEvent(event: Stored<Event>, notice?: string): string {
    const org = firstOrg(store, event.did);
    const classes = svc.ticketClassesFor(event).map((cls) => ({ cls, remaining: svc.remaining(cls) }));
    const performances = store.listReferencing<Performance>(C.performance, event.uri).map((p) => ({ ...p, record: { ...p.record, actName: p.record.actName ?? (p.record.act ? store.getByUri<{ name: string }>(p.record.act.uri)?.record.name : undefined) } }));
    const program = store.listReferencing<Program>(C.program, event.uri)[0] ?? null;
    return eventPage({ org, event, classes, performances, program, baseUrl: cfg.baseUrl, ...(notice ? { notice } : {}) });
  }

  return { app, store, keys, svc };
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
