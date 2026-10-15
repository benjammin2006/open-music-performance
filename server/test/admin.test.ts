import { test } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/db.ts";
import { loadLexicons, C } from "../src/lexicons.ts";
import { createApp } from "../src/app.ts";
import { seedDemo, DEMO_DID, DEMO_ORGANIZER_KEY } from "../src/seed.ts";
import { localToUtc, utcToLocal } from "../src/time.ts";
import { parseProgram } from "../src/admin.ts";

const BASE = "http://omp.test";

async function signedIn() {
  const db = openDb(":memory:");
  const built = createApp(db, loadLexicons(), { baseUrl: BASE, adminToken: "x" });
  await seedDemo(built.store, built.keys, built.auth);
  const res = await built.app.request("/admin/signin", { method: "POST", body: new URLSearchParams({ key: DEMO_ORGANIZER_KEY }) });
  assert.equal(res.status, 303);
  const cookie = res.headers.get("set-cookie")!.split(";")[0]!;
  const req = (path: string, init: RequestInit = {}) => built.app.request(path, { ...init, headers: { ...(init.headers as Record<string, string> | undefined), cookie } });
  const post = (path: string, form: Record<string, string>) => req(path, { method: "POST", body: new URLSearchParams(form) });
  return { ...built, cookie, req, post };
}

test("timezone conversion round-trips and handles daylight saving", () => {
  assert.equal(localToUtc("2026-12-15T19:00", "America/Chicago"), "2026-12-16T01:00:00.000Z"); // CST, UTC-6
  assert.equal(localToUtc("2026-07-04T19:00", "America/Chicago"), "2026-07-05T00:00:00.000Z"); // CDT, UTC-5
  assert.equal(utcToLocal("2026-12-16T01:00:00Z", "America/Chicago"), "2026-12-15T19:00");
  assert.equal(utcToLocal("2026-07-05T00:00:00Z", "America/Chicago"), "2026-07-04T19:00");
  assert.equal(localToUtc("2026-03-08T02:30", "America/Chicago"), "2026-03-08T07:30:00.000Z"); // nonexistent wall time (DST gap) shifts forward to 3:30 CDT
  assert.equal(localToUtc("not a date", "America/Chicago"), null);
});

test("program paste parses pieces, intermissions and blank lines", () => {
  const p = parseProgram("Sleigh Ride | Leroy Anderson | | Concert Band\n\nINTERMISSION\nGreensleeves | Traditional | Alfred Reed | Concert Band\n | \nLet It Snow");
  assert.equal(p.length, 4);
  assert.deepEqual(p[0], { order: 0, title: "Sleigh Ride", composer: "Leroy Anderson", performedBy: "Concert Band" });
  assert.equal(p[1]!.isIntermission, true);
  assert.equal(p[2]!.arranger, "Alfred Reed");
  assert.deepEqual(p[3], { order: 3, title: "Let It Snow" });
});

test("admin requires a session; wrong key is refused; sign-out ends the session", async () => {
  const s = await signedIn();
  assert.equal((await s.app.request("/admin")).status, 401);
  assert.equal((await s.app.request("/admin/signin", { method: "POST", body: new URLSearchParams({ key: "WRONG" }) })).status, 401);
  assert.equal((await s.req("/admin")).status, 200);
  assert.match(await (await s.req("/admin")).text(), /Winter Concert/);
  await s.post("/admin/signout", {});
  assert.equal((await s.req("/admin")).status, 401);
});

test("scene 1: create a draft, add classes, paste a program, publish, and the public page appears", async () => {
  const s = await signedIn();
  // Draft creation with times in the org's timezone.
  const created = await s.post("/admin/events", { title: "Spring Concert", description: "All ensembles.", startsAt: "2027-05-12T19:00", doorsAt: "2027-05-12T18:30", endsAt: "2027-05-12T21:00", locationName: "Lincoln Auditorium", locality: "Springfield", region: "IL", capacity: "400", ageRestriction: "All ages", refundText: "Full refund if cancelled.", processorNote: "Price shown is the price you pay." });
  assert.equal(created.status, 303);
  const rkey = created.headers.get("location")!.split("/").pop()!;
  const draft = s.store.get<{ status: string; startsAt: string; doorsAt: string; createdAt: string }>(DEMO_DID, C.event, rkey)!;
  assert.equal(draft.record.status, "draft");
  assert.equal(draft.record.startsAt, "2027-05-13T00:00:00.000Z"); // 7 pm CDT
  assert.equal((await s.app.request(`/e/${DEMO_DID}/${rkey}`)).status, 404); // drafts are not public

  // Publishing without ticket classes is refused.
  assert.equal((await s.post(`/admin/events/${rkey}/status`, { status: "published" })).status, 400);

  // Two classes: free reservation and $5 GA. Free with a price is refused.
  assert.equal((await s.post(`/admin/events/${rkey}/classes`, { name: "Free reservation", kind: "freeRsvp", price: "0", capacity: "300", perOrderLimit: "6" })).status, 303);
  assert.equal((await s.post(`/admin/events/${rkey}/classes`, { name: "General admission", kind: "paid", price: "5", capacity: "", perOrderLimit: "8", classDescription: "$5, all in." })).status, 303);
  assert.equal((await s.post(`/admin/events/${rkey}/classes`, { name: "Bad", kind: "freeRsvp", price: "3" })).status, 400);
  const classes = s.svc.ticketClassesFor(s.store.get(DEMO_DID, C.event, rkey)! as never);
  assert.deepEqual(classes.map((c) => [c.record.name, c.record.price.amountCents, c.record.capacity]), [["Free reservation", 0, 300], ["General admission", 500, undefined]]);

  // Program paste.
  const prog = await s.post(`/admin/events/${rkey}/program`, { program: "Sleigh Ride | Leroy Anderson | | Concert Band\nINTERMISSION\nLincolnshire Posy | Percy Grainger | | Wind Ensemble", programNotes: "Thanks to the boosters." });
  assert.equal(prog.status, 303);
  assert.match(await (await s.req(prog.headers.get("location")!)).text(), /Program saved \(3 lines\)/);

  // Publish, then the public page shows everything and a door code exists.
  const pub = await s.post(`/admin/events/${rkey}/status`, { status: "published" });
  assert.equal(pub.status, 303);
  assert.match(await (await s.req(pub.headers.get("location")!)).text(), /Published\. The public page is live/);
  assert.ok(s.keys.currentDoorCode(`at://${DEMO_DID}/${C.event}/${rkey}`));
  const page = await (await s.app.request(`/e/${DEMO_DID}/${rkey}`)).text();
  assert.match(page, /<h1>Spring Concert<\/h1>/);
  assert.match(page, /Lincolnshire Posy/);
  assert.match(page, /\$5\.00/);
  assert.match(page, /name="quantity"/);
  assert.match(page, /Tuesday, May 11, 2027|Wednesday, May 12, 2027/);

  // A class with issued tickets cannot be removed; an empty one can.
  const free = classes[0]!;
  await s.app.request(`/e/${DEMO_DID}/${rkey}/rsvp`, { method: "POST", body: new URLSearchParams({ ticketClass: free.rkey, name: "A", quantity: "1" }) });
  assert.equal((await s.post(`/admin/events/${rkey}/classes/${free.rkey}/delete`, {})).status, 400);
  assert.equal((await s.post(`/admin/events/${rkey}/classes/${classes[1]!.rkey}/delete`, {})).status, 303);
  assert.equal(s.svc.ticketClassesFor(s.store.get(DEMO_DID, C.event, rkey)! as never).length, 1);

  // Organizer session opens the reconciliation sheet without a door code.
  assert.equal((await s.req(`/e/${DEMO_DID}/${rkey}/reconciliation`)).status, 200);
  // Editing details keeps status and createdAt.
  const edit = await s.post(`/admin/events/${rkey}`, { title: "Spring Concert 2027", startsAt: "2027-05-12T19:30", locationName: "Lincoln Auditorium" });
  assert.equal(edit.status, 303);
  const after = s.store.get<{ status: string; title: string; createdAt: string }>(DEMO_DID, C.event, rkey)!;
  assert.equal(after.record.status, "published");
  assert.equal(after.record.title, "Spring Concert 2027");
  assert.equal(after.record.createdAt, draft.record.createdAt);
});

test("organization settings validate the timezone and save the default venue", async () => {
  const s = await signedIn();
  assert.equal((await s.post("/admin/org", { name: "Lincoln High School Bands", kind: "school", timezone: "Mars/Olympus" })).status, 400);
  const ok = await s.post("/admin/org", { name: "Lincoln HS Bands", kind: "school", timezone: "America/New_York", locationName: "LHS Auditorium", locality: "Springfield", region: "IL", capacity: "450" });
  assert.equal(ok.status, 303);
  const org = s.store.list<{ name: string; timezone: string; location: { capacity: number }; issuerKeys: unknown[] }>(DEMO_DID, C.organization, 1)[0]!;
  assert.equal(org.record.timezone, "America/New_York");
  assert.equal(org.record.location.capacity, 450);
  assert.equal(org.record.issuerKeys.length, 1); // keys survive a settings save
});
