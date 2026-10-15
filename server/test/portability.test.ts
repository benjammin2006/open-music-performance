import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyTicket } from "@omp/tickets";
import { openDb } from "../src/db.ts";
import { loadLexicons, C } from "../src/lexicons.ts";
import { createApp } from "../src/app.ts";
import { seedDemo, DEMO_DID, DEMO_EVENT_RKEY, DEMO_ORGANIZER_KEY } from "../src/seed.ts";
import { exportBundle, importBundle, verifyBundle, type ExportBundle } from "../src/portability.ts";

const A = "http://hosted.test";
const B = "http://selfhost.test";

async function instance(base: string, seed: boolean) {
  const db = openDb(":memory:");
  const built = createApp(db, loadLexicons(), { baseUrl: base, adminToken: "x" });
  if (seed) await seedDemo(built.store, built.keys, built.auth);
  return built;
}
async function session(built: Awaited<ReturnType<typeof instance>>, key: string) {
  const res = await built.app.request("/admin/signin", { method: "POST", body: new URLSearchParams({ key }) });
  return res.headers.get("set-cookie")!.split(";")[0]!;
}

test("well-known publishes the instance key and the export is signed with it", async () => {
  const a = await instance(A, true);
  const wk = await (await a.app.request("/.well-known/omp.json")).json() as { publicKeyMultibase: string; instance: string };
  assert.equal(wk.instance, A);
  assert.match(wk.publicKeyMultibase, /^z6Mk/);
  assert.equal((await a.app.request("/admin/export.json")).status, 401);
  const cookie = await session(a, DEMO_ORGANIZER_KEY);
  const res = await a.app.request("/admin/export.json", { headers: { cookie } });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-disposition") ?? "", /omp-export-did-web-lincolnbands-example-/);
  const bundle = await res.json() as ExportBundle;
  assert.equal(bundle.did, DEMO_DID);
  assert.equal(bundle.signature!.publicKeyMultibase, wk.publicKeyMultibase);
  assert.ok(bundle.records.some((r) => r.value["$type"] === C.ticket), "private records are included for the owner");
  assert.ok(!JSON.stringify(bundle).includes(DEMO_ORGANIZER_KEY), "no secrets");
  assert.ok(!JSON.stringify(bundle).includes("\"d\":"), "no private JWK material");
  const v = await verifyBundle(bundle);
  assert.equal(v.ok, true);
});

test("tampering with a bundle breaks its signature; unsigned bundles are refused", async () => {
  const a = await instance(A, true);
  const bundle = await exportBundle(a.store, a.instanceKey, DEMO_DID, A);
  const tampered = JSON.parse(JSON.stringify(bundle)) as ExportBundle;
  (tampered.records.find((r) => r.value["$type"] === C.event)!.value as { title: string }).title = "Altered";
  const v = await verifyBundle(tampered);
  assert.equal(v.ok, false);
  if (!v.ok) assert.match(v.reason, /altered/);
  const unsigned = { ...bundle, signature: undefined };
  assert.equal((await verifyBundle(unsigned)).ok, false);
  await assert.rejects(() => importBundle(unsigned as ExportBundle, a.store, a.keys, a.auth), /refusing to import/);
});

test("round trip: export from the hosted instance, import into an empty self-hosted one, everything still works", async () => {
  const a = await instance(A, true);
  // Add a real RSVP on A so there are signed tickets with serials to carry over.
  const rsvp = await a.app.request(`/e/${DEMO_DID}/${DEMO_EVENT_RKEY}/rsvp`, { method: "POST", body: new URLSearchParams({ ticketClass: "3lhtcfree00001", name: "Sam Lee", email: "sam@example.com", quantity: "2" }) });
  assert.equal(rsvp.status, 303);
  const bundle = await exportBundle(a.store, a.instanceKey, DEMO_DID, A);

  const b = await instance(B, false);
  assert.equal((await b.app.request("/")).status, 302); // empty instance sends you to /setup
  const result = await importBundle(bundle, b.store, b.keys, b.auth);
  assert.equal(result.skipped.length, 0, JSON.stringify(result.skipped));
  assert.equal(result.imported, bundle.records.length);

  // Public page renders on B with the program and classes.
  const page = await (await b.app.request(`/e/${DEMO_DID}/${DEMO_EVENT_RKEY}`)).text();
  assert.match(page, /<h1>Winter Concert<\/h1>/);
  assert.match(page, /Lincolnshire Posy/);

  // Old tickets verify on B through the retained public key; new tickets sign with the new key.
  const org = b.store.list<{ issuerKeys: { kid: string; publicKeyMultibase: string }[] }>(DEMO_DID, C.organization, 1)[0]!;
  assert.deepEqual(org.record.issuerKeys.map((k) => k.kid), ["lincoln-2026-1", result.issuerKid]);
  const oldTicket = b.store.list<{ token: string; serial: number }>(DEMO_DID, C.ticket, 100).find((t) => t.record.token)!;
  const v = await verifyTicket(oldTicket.record.token, { resolveKey: async (did, kid) => b.keys.publicKeyMultibase(did, kid), now: 1_797_379_200 });
  assert.equal(v.ok, true, JSON.stringify(v));
  const before = b.store.list<{ serial: number }>(DEMO_DID, C.ticket, 100).map((t) => t.record.serial);
  const newRsvp = await b.app.request(`/e/${DEMO_DID}/${DEMO_EVENT_RKEY}/rsvp`, { method: "POST", body: new URLSearchParams({ ticketClass: "3lhtcfree00001", name: "Pat", quantity: "1" }) });
  assert.equal(newRsvp.status, 303);
  const after = b.store.list<{ serial: number; issuerKid: string }>(DEMO_DID, C.ticket, 100);
  const newest = after.find((t) => t.record.issuerKid === result.issuerKid)!;
  assert.ok(newest.record.serial > Math.max(...before), "serials continue past the imported ones");

  // The printed organizer key signs in on B, and the sheet works there.
  const cookie = await session(b, result.organizerKey);
  assert.equal((await b.app.request("/admin", { headers: { cookie } })).status, 200);
  assert.equal((await b.app.request(`/e/${DEMO_DID}/${DEMO_EVENT_RKEY}/reconciliation`, { headers: { cookie } })).status, 200);
  // A's organizer key does not work on B.
  assert.equal((await b.app.request("/admin/signin", { method: "POST", body: new URLSearchParams({ key: DEMO_ORGANIZER_KEY }) })).status, 401);
  // Importing again is idempotent for records.
  const again = await importBundle(bundle, b.store, b.keys, b.auth);
  assert.equal(again.imported, bundle.records.length);
  assert.equal(b.store.list(DEMO_DID, C.event, 100).length, 1);
});

test("first-run setup creates an organization with a did:web id, a signing key and an organizer key, then closes", async () => {
  const b = await instance("http://localhost:3000", false);
  assert.equal((await b.app.request("/setup")).status, 200);
  assert.equal((await b.app.request("/setup", { method: "POST", body: new URLSearchParams({ name: "X", slug: "Bad Slug!", timezone: "America/Chicago" }) })).status, 400);
  const res = await b.app.request("/setup", { method: "POST", body: new URLSearchParams({ name: "Springfield Community Band", slug: "scb", kind: "ensemble", timezone: "America/Chicago", locationName: "Park Bandshell", locality: "Springfield", region: "IL" }) });
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /did:web:localhost%3A3000:org:scb/);
  const key = /<code>([0-9a-f]{48})<\/code>/.exec(html)![1]!;
  assert.match(res.headers.get("set-cookie") ?? "", /omp_session=/);
  const org = b.store.list<{ name: string; issuerKeys: unknown[] }>("did:web:localhost%3A3000:org:scb", C.organization, 1)[0]!;
  assert.equal(org.record.name, "Springfield Community Band");
  assert.equal(org.record.issuerKeys.length, 1);
  assert.equal((await b.app.request("/setup")).status, 302); // closed once an org exists
  assert.equal((await b.app.request("/setup", { method: "POST", body: new URLSearchParams({ name: "Y", slug: "y", timezone: "UTC" }) })).status, 303);
  const cookie = await session(b, key);
  assert.equal((await b.app.request("/admin", { headers: { cookie } })).status, 200);
});
