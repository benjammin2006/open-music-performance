// Organizer admin routes. Mounted by app.ts; everything under /admin requires an organizer session.
import type { Hono, Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { C } from "./lexicons.ts";
import type { Auth } from "./auth.ts";
import type { IssuerKeys } from "./keys.ts";
import { ValidationError, strongRef, type RecordStore, type Stored } from "./records.ts";
import type { Services } from "./services.ts";
import { localToUtc, isValidTimeZone } from "./time.ts";
import { dashboardPage, eventAdminPage, eventFormValues, newEventPage, orgPage, signInPage, type EventFormValues } from "./pages/admin.ts";
import type { Event, Order, Organization, Program, Ticket, TicketClass } from "./types.ts";

const COOKIE = "omp_session";

export function mountAdmin(app: Hono, deps: { store: RecordStore; keys: IssuerKeys; svc: Services; auth: Auth; baseUrl: string }) {
  const { store, keys, svc, auth, baseUrl } = deps;
  const secure = baseUrl.startsWith("https");
  const firstOrg = (did: string) => store.list<Organization>(did, C.organization, 1)[0] ?? null;
  const str = (b: Record<string, unknown>, k: string, max = 2000) => String(b[k] ?? "").trim().slice(0, max);

  app.post("/admin/signin", async (c) => {
    const key = str(await c.req.parseBody(), "key", 256);
    const did = await auth.didForKey(key);
    if (!did) return c.html(signInPage(true), 401);
    setCookie(c, COOKIE, await auth.createSession(did), { httpOnly: true, sameSite: "Lax", path: "/", secure, maxAge: 30 * 86400 });
    return c.redirect("/admin", 303);
  });
  app.post("/admin/signout", async (c) => {
    await auth.destroySession(getCookie(c, COOKIE));
    deleteCookie(c, COOKIE, { path: "/" });
    return c.redirect("/admin", 303);
  });

  // Session guard for everything else under /admin.
  app.use("/admin/*", async (c, next) => {
    const did = await auth.didForSession(getCookie(c, COOKIE));
    if (!did) return c.html(signInPage(), 401);
    c.set("did" as never, did as never);
    c.header("Cache-Control", "private, no-store");
    await next();
  });
  const didOf = (c: Context): string => c.get("did" as never) as string;
  const ownEvent = (c: Context): Stored<Event> | null => {
    const e = store.get<Event>(didOf(c), C.event, c.req.param("rkey") ?? "");
    return e ?? null;
  };

  app.get("/admin", (c) => {
    const did = didOf(c);
    const events = store.list<Event>(did, C.event).sort((a, b) => b.record.startsAt.localeCompare(a.record.startsAt));
    const counts = new Map(events.map((e) => [e.uri, store.listReferencing<Ticket>(C.ticket, e.uri, 100_000).length]));
    return c.html(dashboardPage(firstOrg(did), events, counts));
  });

  app.get("/admin/org", (c) => {
    const org = firstOrg(didOf(c));
    return org ? c.html(orgPage(org, undefined, c.req.query("notice"))) : c.text("no organization record", 404);
  });
  app.post("/admin/org", async (c) => {
    const org = firstOrg(didOf(c));
    if (!org) return c.text("no organization record", 404);
    const b = await c.req.parseBody();
    const tz = str(b, "timezone", 64);
    if (!isValidTimeZone(tz)) return c.html(orgPage(org, `Unknown timezone "${tz}". Use an IANA name such as America/Chicago.`), 400);
    const location = locationFrom(b, str);
    const record = { ...org.record, name: str(b, "name", 200), kind: str(b, "kind", 40), description: str(b, "description", 30000) || undefined, website: str(b, "website", 500) || undefined, timezone: tz, ...(location ? { location } : {}) };
    try {
      await store.put(org.did, C.organization, stripUndefined(record), org.rkey);
    } catch (e) {
      if (e instanceof ValidationError) return c.html(orgPage(org, e.message), 400);
      throw e;
    }
    return c.redirect("/admin/org?notice=Saved.", 303);
  });

  app.get("/admin/events/new", (c) => {
    const org = firstOrg(didOf(c));
    return c.html(newEventPage(org, eventFormValues(null, org), org?.record.timezone ?? "America/Chicago"));
  });
  app.post("/admin/events", async (c) => {
    const did = didOf(c);
    const org = firstOrg(did);
    const tz = org?.record.timezone ?? "America/Chicago";
    const b = await c.req.parseBody();
    const built = buildEvent(b, tz, null, str);
    if ("error" in built) return c.html(newEventPage(org, formValuesFrom(b, str), tz, built.error), 400);
    try {
      const e = await store.put<Event>(did, C.event, built.record);
      return c.redirect(`/admin/events/${e.rkey}`, 303);
    } catch (e) {
      if (e instanceof ValidationError) return c.html(newEventPage(org, formValuesFrom(b, str), tz, e.message), 400);
      throw e;
    }
  });

  const renderEventAdmin = (c: Context, event: Stored<Event>, extra: { notice?: string; error?: string } = {}, status = 200) => {
    const org = firstOrg(event.did);
    const classes = svc.ticketClassesFor(event).map((cls) => ({ cls, issued: svc.issuedCount(cls) }));
    const program = store.listReferencing<Program>(C.program, event.uri)[0] ?? null;
    const tickets = store.listReferencing<Ticket>(C.ticket, event.uri, 100_000).length;
    const orders = store.listReferencing<Order>(C.order, event.uri, 100_000).length;
    return c.html(eventAdminPage({ org, event, classes, program, doorCode: keys.currentDoorCode(event.uri), ticketCount: tickets, orderCount: orders, baseUrl, ...extra }), status as 200);
  };

  app.get("/admin/events/:rkey", (c) => {
    const event = ownEvent(c);
    const notice = c.req.query("notice");
    return event ? renderEventAdmin(c, event, notice ? { notice } : {}) : c.notFound();
  });
  // Redirect after a successful POST so a refresh never resubmits.
  const done = (c: Context, event: Stored<Event>, notice: string) => c.redirect(`/admin/events/${event.rkey}?notice=${encodeURIComponent(notice)}`, 303);
  app.post("/admin/events/:rkey", async (c) => {
    const event = ownEvent(c);
    if (!event) return c.notFound();
    const b = await c.req.parseBody();
    const built = buildEvent(b, event.record.timezone, event.record, str);
    if ("error" in built) return renderEventAdmin(c, event, { error: built.error }, 400);
    try {
      const updated = await store.put<Event>(event.did, C.event, built.record, event.rkey);
      return done(c, updated, "Details saved.");
    } catch (e) {
      if (e instanceof ValidationError) return renderEventAdmin(c, event, { error: e.message }, 400);
      throw e;
    }
  });
  app.post("/admin/events/:rkey/status", async (c) => {
    const event = ownEvent(c);
    if (!event) return c.notFound();
    const status = str(await c.req.parseBody(), "status", 20);
    if (!["draft", "published", "cancelled", "postponed", "completed"].includes(status)) return renderEventAdmin(c, event, { error: "Unknown status." }, 400);
    if (status === "published" && svc.ticketClassesFor(event).length === 0) return renderEventAdmin(c, event, { error: "Add at least one ticket class before publishing." }, 400);
    const updated = await store.put<Event>(event.did, C.event, { ...event.record, status }, event.rkey);
    if (status === "published" && !keys.currentDoorCode(event.uri)) keys.setDoorCode(event.uri, randomCode());
    return done(c, updated, status === "published" ? "Published. The public page is live." : `Status set to ${status}.`);
  });
  app.post("/admin/events/:rkey/door-code", (c) => {
    const event = ownEvent(c);
    if (!event) return c.notFound();
    keys.setDoorCode(event.uri, randomCode());
    return done(c, event, "Door code rotated. Scanners must re-sync with the new code.");
  });
  app.post("/admin/events/:rkey/classes", async (c) => {
    const event = ownEvent(c);
    if (!event) return c.notFound();
    const b = await c.req.parseBody();
    const kind = str(b, "kind", 20);
    const price = Math.round(Number(b["price"] ?? 0) * 100);
    const capacity = str(b, "capacity") === "" ? undefined : Math.max(0, Math.floor(Number(b["capacity"])));
    const perOrderLimit = Math.max(1, Math.floor(Number(b["perOrderLimit"] ?? 8)) || 8);
    if (!["freeRsvp", "paid", "payWhatYouWant", "comp"].includes(kind)) return renderEventAdmin(c, event, { error: "Unknown ticket kind." }, 400);
    if ((kind === "freeRsvp" || kind === "comp") && price !== 0) return renderEventAdmin(c, event, { error: "Free and comp classes must have a price of 0." }, 400);
    if (kind === "paid" && !(price > 0)) return renderEventAdmin(c, event, { error: "Paid classes need a price above 0." }, 400);
    try {
      await store.put(event.did, C.ticketClass, stripUndefined({
        event: strongRef(event), name: str(b, "name", 100), kind, price: { amountCents: Number.isFinite(price) ? Math.max(0, price) : 0, currency: "USD" },
        capacity, perOrderLimit, description: str(b, "classDescription", 1000) || undefined, sortOrder: svc.ticketClassesFor(event).length, createdAt: new Date().toISOString(),
      }));
    } catch (e) {
      if (e instanceof ValidationError) return renderEventAdmin(c, event, { error: e.message }, 400);
      throw e;
    }
    return done(c, event, "Ticket class added.");
  });
  app.post("/admin/events/:rkey/classes/:crkey/delete", (c) => {
    const event = ownEvent(c);
    if (!event) return c.notFound();
    const cls = store.get<TicketClass>(event.did, C.ticketClass, c.req.param("crkey"));
    if (!cls || cls.record.event.uri !== event.uri) return c.notFound();
    if (svc.issuedCount(cls) > 0) return renderEventAdmin(c, event, { error: "That class has tickets issued; it cannot be removed." }, 400);
    store.delete(event.did, C.ticketClass, cls.rkey);
    return done(c, event, "Ticket class removed.");
  });
  app.post("/admin/events/:rkey/program", async (c) => {
    const event = ownEvent(c);
    if (!event) return c.notFound();
    const b = await c.req.parseBody();
    const pieces = parseProgram(str(b, "program", 50000));
    const existing = store.listReferencing<Program>(C.program, event.uri)[0] ?? null;
    const notes = str(b, "programNotes", 50000) || undefined;
    try {
      if (pieces.length === 0 && !notes) {
        if (existing) store.delete(event.did, C.program, existing.rkey);
        return done(c, event, "Program cleared.");
      }
      await store.put(event.did, C.program, stripUndefined({ event: strongRef(event), pieces, notes, createdAt: existing?.record.createdAt ?? new Date().toISOString() }), existing?.rkey);
    } catch (e) {
      if (e instanceof ValidationError) return renderEventAdmin(c, event, { error: e.message }, 400);
      throw e;
    }
    return done(c, event, `Program saved (${pieces.length} lines).`);
  });

  return { sessionDid: (c: Context) => auth.didForSession(getCookie(c, COOKIE)) };
}

type Str = (b: Record<string, unknown>, k: string, max?: number) => string;

function locationFrom(b: Record<string, unknown>, str: Str) {
  const name = str(b, "locationName", 200);
  if (!name) return null;
  const cap = str(b, "capacity");
  return stripUndefined({ name, streetAddress: str(b, "streetAddress", 300) || undefined, locality: str(b, "locality", 100) || undefined, region: str(b, "region", 100) || undefined, postalCode: str(b, "postalCode", 20) || undefined, country: "US", capacity: cap === "" ? undefined : Math.max(0, Math.floor(Number(cap))), accessibilityNotes: str(b, "accessibilityNotes", 1000) || undefined });
}

export function formValuesFrom(b: Record<string, unknown>, str: Str): EventFormValues {
  const g = (k: string) => str(b, k, 50000);
  return { title: g("title"), description: g("description"), startsAt: g("startsAt"), endsAt: g("endsAt"), doorsAt: g("doorsAt"), locationName: g("locationName"), streetAddress: g("streetAddress"), locality: g("locality"), region: g("region"), postalCode: g("postalCode"), capacity: g("capacity"), accessibilityNotes: g("accessibilityNotes"), ageRestriction: g("ageRestriction"), refundText: g("refundText"), processorNote: g("processorNote"), tags: g("tags") };
}

export function buildEvent(b: Record<string, unknown>, tz: string, existing: Event | null, str: Str): { record: Record<string, unknown> } | { error: string } {
  const title = str(b, "title", 200);
  if (!title) return { error: "Title is required." };
  const startsAt = localToUtc(str(b, "startsAt", 30), tz);
  if (!startsAt) return { error: "Start date and time are required." };
  const endsAt = str(b, "endsAt") ? localToUtc(str(b, "endsAt", 30), tz) : null;
  const doorsAt = str(b, "doorsAt") ? localToUtc(str(b, "doorsAt", 30), tz) : null;
  if (endsAt && endsAt < startsAt) return { error: "End must be after start." };
  const location = locationFrom(b, str);
  if (!location) return { error: "Venue name is required." };
  const tags = str(b, "tags", 500).split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10);
  return {
    record: stripUndefined({
      ...(existing ?? {}),
      title, description: str(b, "description", 50000) || undefined, startsAt, endsAt: endsAt ?? undefined, doorsAt: doorsAt ?? undefined, timezone: tz, location,
      status: existing?.status ?? "draft", visibility: existing?.visibility ?? "public", ageRestriction: str(b, "ageRestriction", 40) || undefined,
      refundPolicy: { onCancellation: "full", onPostponement: "honorOrFull", buyerCancellation: "none", text: str(b, "refundText", 20000) || undefined },
      feeDisclosure: { platformFeeCents: 0, processorNote: str(b, "processorNote", 3000) || undefined },
      tags: tags.length ? tags : undefined, createdAt: existing?.createdAt ?? new Date().toISOString(),
    }),
  };
}

/** "Title | Composer | Arranger | Performed by" per line; INTERMISSION lines become intermissions. */
export function parseProgram(text: string) {
  const out: { order: number; title: string; composer?: string; arranger?: string; performedBy?: string; isIntermission?: boolean }[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (/^intermission$/i.test(line) || /^-+\s*intermission\s*-+$/i.test(line)) { out.push({ order: out.length, title: "Intermission", isIntermission: true }); continue; }
    const [title = "", composer = "", arranger = "", performedBy = ""] = line.split("|").map((s) => s.trim());
    if (!title) continue;
    out.push(stripUndefined({ order: out.length, title: title.slice(0, 300), composer: composer.slice(0, 200) || undefined, arranger: arranger.slice(0, 200) || undefined, performedBy: performedBy.slice(0, 500) || undefined }) as (typeof out)[number]);
  }
  return out.slice(0, 200);
}

function randomCode(): string {
  const words = ["BRASS", "REED", "OBOE", "TUBA", "VIOLA", "CELLO", "DRUM", "HORN", "FLUTE", "HARP", "CHOIR", "BASS"];
  const w = words[Math.floor(Math.random() * words.length)];
  return `${w}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function stripUndefined<T extends Record<string, unknown>>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}
