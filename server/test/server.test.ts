import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyTicket } from "@omp/tickets";
import { openDb } from "../src/db.ts";
import { loadLexicons, C } from "../src/lexicons.ts";
import { createApp } from "../src/app.ts";
import { seedDemo, DEMO_DID, DEMO_EVENT_RKEY } from "../src/seed.ts";
import { ValidationError } from "../src/records.ts";
import { nextTid, isTid } from "../src/tid.ts";

const BASE = "http://omp.test";
const ADMIN = "test-admin-token";

async function fresh() {
  const db = openDb(":memory:");
  const built = createApp(db, loadLexicons(), { baseUrl: BASE, adminToken: ADMIN });
  await seedDemo(built.store, built.keys, built.auth);
  return built;
}
const EVENT_PATH = `/e/${DEMO_DID}/${DEMO_EVENT_RKEY}`;

test("tids are 13-char base32-sortable and strictly increasing", () => {
  const a = nextTid(), b = nextTid(), c = nextTid();
  for (const t of [a, b, c]) assert.ok(isTid(t), t);
  assert.ok(a < b && b < c);
});

test("seed loads every fixture and the org publishes a real issuer key", async () => {
  const { store } = await fresh();
  for (const col of [C.organization, C.act, C.event, C.ticketClass, C.performance, C.program, C.order, C.ticket, C.doorScan, C.donation]) {
    assert.ok(store.list(DEMO_DID, col).length >= 1, col);
  }
  const org = store.list<{ issuerKeys: { kid: string; publicKeyMultibase: string }[] }>(DEMO_DID, C.organization)[0]!;
  assert.equal(org.record.issuerKeys[0]!.kid, "lincoln-2026-1");
  assert.match(org.record.issuerKeys[0]!.publicKeyMultibase, /^z6Mk/);
});

test("record store rejects records that fail the lexicon", async () => {
  const { store } = await fresh();
  await assert.rejects(() => store.put(DEMO_DID, C.event, { title: "No required fields" }), ValidationError);
  await assert.rejects(() => store.put(DEMO_DID, C.ticketClass, { event: { uri: "at://x/y/z", cid: "notacid" }, name: "x", kind: "paid", price: { amountCents: 500, currency: "USD" }, createdAt: "2026-01-01T00:00:00Z" }), ValidationError);
});

test("event page renders title, offers, program, JSON-LD and the RSVP form", async () => {
  const { app } = await fresh();
  const res = await app.request(EVENT_PATH);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<h1>Winter Concert<\/h1>/);
  assert.match(html, /Lincoln High School Bands/);
  assert.match(html, /Lincolnshire Posy/);
  assert.match(html, /\$5\.00/);
  assert.match(html, /name="quantity"/);
  const ld = /<script type="application\/ld\+json">(.*?)<\/script>/s.exec(html)!;
  const data = JSON.parse(ld[1]!);
  assert.equal(data["@type"], "MusicEvent");
  assert.equal(data.offers.length, 2);
  assert.equal(data.location.name, "Lincoln High School Auditorium");
  assert.match(html, /Platform fee: Free/);
});

test("iCal feeds are valid-looking and carry the event", async () => {
  const { app } = await fresh();
  const one = await app.request(`${EVENT_PATH}.ics`);
  assert.equal(one.status, 200);
  assert.match(one.headers.get("content-type") ?? "", /text\/calendar/);
  const ics = await one.text();
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /SUMMARY:Winter Concert/);
  assert.match(ics, /DTSTART:20261216T010000Z/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
  const all = await app.request(`/o/${DEMO_DID}/calendar.ics`);
  assert.equal(all.status, 200);
  assert.match(await all.text(), /X-WR-CALNAME:Lincoln High School Bands/);
});

test("free RSVP creates an order and signed tickets that verify against the published key", async () => {
  const { app, store, keys } = await fresh();
  const body = new URLSearchParams({ ticketClass: "3lhtcfree00001", name: "Sam Lee", email: "Sam.Lee@example.com", quantity: "2", marketingConsent: "1" });
  const res = await app.request(`${EVENT_PATH}/rsvp`, { method: "POST", body, headers: { "content-type": "application/x-www-form-urlencoded" } });
  assert.equal(res.status, 303);
  const location = res.headers.get("location")!;
  assert.match(location, new RegExp(`^/order/${DEMO_DID}/`));
  const page = await app.request(location);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /2 tickets/);
  assert.match(html, /<svg/);
  assert.equal(page.headers.get("referrer-policy"), "no-referrer");

  const orderRkey = location.split("/").pop()!;
  const order = store.get<{ status: string; buyer: { marketingConsent: boolean } }>(DEMO_DID, C.order, orderRkey)!;
  assert.equal(order.record.status, "free");
  assert.equal(order.record.buyer.marketingConsent, true);
  const tickets = store.listReferencing<{ token: string; serial: number; issuerKid: string; holderBinding: string }>(C.ticket, order.uri);
  assert.equal(tickets.length, 2);
  assert.notEqual(tickets[0]!.record.serial, tickets[1]!.record.serial);
  assert.match(tickets[0]!.record.holderBinding, /^sha256:/);
  for (const t of tickets) {
    const r = await verifyTicket(t.record.token, { resolveKey: async (org, kid) => keys.publicKeyMultibase(org, kid), now: 1_797_379_200 });
    assert.equal(r.ok, true, JSON.stringify(r));
  }
});

test("RSVP enforces per-order limit, capacity and the free-only rule", async () => {
  const { app, store } = await fresh();
  const post = (params: Record<string, string>) => app.request(`${EVENT_PATH}/rsvp`, { method: "POST", body: new URLSearchParams(params), headers: { "content-type": "application/x-www-form-urlencoded" } });
  assert.equal((await post({ ticketClass: "3lhtcfree00001", name: "A", quantity: "7" })).status, 400);
  assert.equal((await post({ ticketClass: "3lhtcpaid00001", name: "A", quantity: "1" })).status, 400);
  assert.equal((await post({ ticketClass: "3lhtcfree00001", name: "   ", quantity: "1" })).status, 400);
  // Capacity 100: 16 orders of 6 then one more of 6 must fail with 4 left.
  for (let i = 0; i < 16; i++) assert.equal((await post({ ticketClass: "3lhtcfree00001", name: `P${i}`, quantity: "6" })).status, 303);
  assert.equal((await post({ ticketClass: "3lhtcfree00001", name: "Late", quantity: "6" })).status, 400);
  assert.equal((await post({ ticketClass: "3lhtcfree00001", name: "Late", quantity: "4" })).status, 303);
  assert.equal(store.listReferencing(C.ticket, `at://${DEMO_DID}/${C.ticketClass}/3lhtcfree00001`).length, 100);
  const sold = await (await app.request(EVENT_PATH)).text();
  assert.match(sold, /Sold out/);
});

test("status list and issuer keys endpoints serve what a scanner pre-syncs", async () => {
  const { app } = await fresh();
  const sl = await (await app.request(`${EVENT_PATH}/status-list.json`)).json() as { size: number; encodedList: string };
  assert.ok(sl.size >= 1024);
  assert.ok(sl.encodedList.length > 0);
  const ik = await (await app.request(`/o/${DEMO_DID}/issuer-keys.json`)).json() as { issuerKeys: unknown[] };
  assert.equal(ik.issuerKeys.length, 1);
});

test("public export contains only public collections and validates as lexicon records", async () => {
  const { app, store } = await fresh();
  const data = await (await app.request(`/export/${DEMO_DID}/public.json`)).json() as { records: { uri: string; value: { $type: string } }[] };
  const types = new Set(data.records.map((r) => r.value.$type));
  assert.ok(types.has(C.event) && types.has(C.program) && types.has(C.ticketClass));
  assert.ok(!types.has(C.order) && !types.has(C.ticket) && !types.has(C.donation));
  for (const r of data.records) store.validate(r.value.$type, r.value as unknown as Record<string, unknown>);
});

test("write API requires the admin token and validates against the lexicon", async () => {
  const { app } = await fresh();
  const record = { name: "Jazz Band", kind: "band", createdAt: "2026-10-15T00:00:00Z" };
  const noAuth = await app.request(`/api/${DEMO_DID}/${C.act}`, { method: "POST", body: JSON.stringify(record), headers: { "content-type": "application/json" } });
  assert.equal(noAuth.status, 401);
  const ok = await app.request(`/api/${DEMO_DID}/${C.act}`, { method: "POST", body: JSON.stringify(record), headers: { "content-type": "application/json", authorization: `Bearer ${ADMIN}` } });
  assert.equal(ok.status, 201);
  const bad = await app.request(`/api/${DEMO_DID}/${C.act}`, { method: "POST", body: JSON.stringify({ name: "x" }), headers: { "content-type": "application/json", authorization: `Bearer ${ADMIN}` } });
  assert.equal(bad.status, 400);
  const priv = await app.request(`/api/${DEMO_DID}/${C.order}`);
  assert.equal(priv.status, 403);
});

test("paid checkout on an instance without Stripe explains itself instead of charging", async () => {
  const { app } = await fresh();
  const page = await (await app.request(EVENT_PATH)).text();
  assert.match(page, /Online purchase is not open yet/);
  assert.doesNotMatch(page, /action="[^"]*\/checkout"/);
  const res = await app.request(`${EVENT_PATH}/checkout`, { method: "POST", body: new URLSearchParams({ ticketClass: "3lhtcpaid00001", name: "A", email: "a@b.co" }) });
  assert.equal(res.status, 409);
  assert.match(await res.text(), /not set up for this organizer/);
});

test("door pack requires the door code and carries keys, status list and the door list", async () => {
  const { app } = await fresh();
  const { DEMO_DOOR_CODE } = await import("../src/seed.ts");
  assert.equal((await app.request(`${EVENT_PATH}/door.json`)).status, 401);
  assert.equal((await app.request(`${EVENT_PATH}/door.json`, { headers: { authorization: "Bearer WRONG" } })).status, 401);
  const res = await app.request(`${EVENT_PATH}/door.json`, { headers: { authorization: `Bearer ${DEMO_DOOR_CODE}` } });
  assert.equal(res.status, 200);
  const pack = await res.json() as { issuerKeys: unknown[]; statusList: { size: number }; tickets: { holder: string; serial: number }[]; classes: unknown[]; event: { title: string } };
  assert.equal(pack.event.title, "Winter Concert");
  assert.equal(pack.issuerKeys.length, 1);
  assert.ok(pack.statusList.size >= 1024);
  assert.equal(pack.classes.length, 2);
  assert.equal(pack.tickets[0]!.holder, "Jordan Rivera");
});

test("scan upload is idempotent by nonce and links scans to tickets", async () => {
  const { app, store } = await fresh();
  const { DEMO_DOOR_CODE } = await import("../src/seed.ts");
  const nonce = "0123456789abcdef0123456789abcdef";
  const scans = [
    { nonce, ticketTid: "3lhticket00001", scannerId: "door-north", result: "admitted", offline: true, scannedAt: "2026-12-16T00:41:12Z" },
    { nonce: "ffffffffffffffffffffffffffffffff", scannerId: "door-north", result: "cashAdmit", cashCollected: { amountCents: 500, currency: "USD" }, scannedAt: "2026-12-16T00:42:00Z" },
    { nonce: "not-a-nonce", scannerId: "x", result: "admitted", scannedAt: "2026-12-16T00:42:00Z" },
  ];
  const post = () => app.request(`${EVENT_PATH}/scans`, { method: "POST", body: JSON.stringify({ scans }), headers: { "content-type": "application/json", authorization: `Bearer ${DEMO_DOOR_CODE}` } });
  const first = await (await post()).json() as { accepted: string[] };
  assert.deepEqual(first.accepted, [nonce, "ffffffffffffffffffffffffffffffff"]);
  const second = await (await post()).json() as { accepted: string[] };
  assert.deepEqual(second.accepted, first.accepted);
  const stored = store.list<{ ticket?: { uri: string }; cashCollected?: { amountCents: number } }>(DEMO_DID, C.doorScan, 100);
  const mine = stored.filter((s) => s.rkey === nonce);
  assert.equal(mine.length, 1);
  assert.match(mine[0]!.record.ticket!.uri, /3lhticket00001$/);
  assert.equal(stored.find((s) => s.rkey === "ffffffffffffffffffffffffffffffff")!.record.cashCollected!.amountCents, 500);
  assert.equal((await app.request(`${EVENT_PATH}/scans`, { method: "POST", body: "{}", headers: { "content-type": "application/json" } })).status, 401);
});

test("scanner PWA is served under /scan/ when built", async () => {
  const { app } = await fresh();
  const res = await app.request("/scan/");
  assert.ok(res.status === 200 || res.status === 404);
  if (res.status === 200) {
    assert.match(res.headers.get("content-type") ?? "", /text\/html/);
    assert.match(await res.text(), /OMP Door/);
    assert.equal((await app.request("/scan/../../package.json")).status, 404);
  }
});

test("reconciliation sheet needs the door code via cookie, then renders totals and CSVs", async () => {
  const { app } = await fresh();
  const { DEMO_DOOR_CODE } = await import("../src/seed.ts");
  const locked = await app.request(`${EVENT_PATH}/reconciliation`);
  assert.equal(locked.status, 401);
  assert.match(await locked.text(), /Organizer access/);
  const bad = await app.request(`${EVENT_PATH}/reconciliation`, { method: "POST", body: new URLSearchParams({ code: "nope" }) });
  assert.equal(bad.status, 401);
  const ok = await app.request(`${EVENT_PATH}/reconciliation`, { method: "POST", body: new URLSearchParams({ code: DEMO_DOOR_CODE }) });
  assert.equal(ok.status, 303);
  const cookie = ok.headers.get("set-cookie")!;
  assert.match(cookie, /HttpOnly/);
  const page = await app.request(`${EVENT_PATH}/reconciliation`, { headers: { cookie: cookie.split(";")[0]! } });
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /Cash to deposit/);
  assert.match(html, /Jordan Rivera/);
  assert.match(html, /General admission/);
  const csv = await app.request(`${EVENT_PATH}/reconciliation.csv`, { headers: { cookie: cookie.split(";")[0]! } });
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get("content-type") ?? "", /text\/csv/);
  assert.match(await csv.text(), /CASH TO DEPOSIT/);
  assert.equal((await app.request(`${EVENT_PATH}/attendance.csv`)).status, 401);
});
