import { test } from "node:test";
import assert from "node:assert/strict";
import { StatusList, generateIssuerKey, signTicket } from "@omp/tickets";
import { Door, type DoorPack } from "../src/core.ts";

const DID = "did:web:lincolnbands.example";
const NOW = new Date("2026-12-16T00:40:00Z");

async function fixture(revokedSerials: number[] = []) {
  const key = await generateIssuerKey("lincoln-2026-1");
  const list = new StatusList(1024);
  for (const s of revokedSerials) list.set(s);
  const pack: DoorPack = {
    event: { did: DID, rkey: "3lhevent000001", uri: `at://${DID}/org.openmusicperformance.event/3lhevent000001`, title: "Winter Concert", startsAt: "2026-12-16T01:00:00Z", timezone: "America/Chicago", location: "Auditorium" },
    issuerKeys: [{ kid: key.kid, publicKeyMultibase: key.publicKeyMultibase }],
    statusList: await list.encode(),
    classes: [{ rkey: "3lhtcfree00001", name: "Free reservation", kind: "freeRsvp" }, { rkey: "3lhtcpaid00001", name: "General admission", kind: "paid" }],
    tickets: [
      { tid: "3lht00000000a", serial: 0, holder: "Sam Lee", classRkey: "3lhtcfree00001", status: "valid" },
      { tid: "3lht00000000b", serial: 1, holder: "Sam Lee", classRkey: "3lhtcfree00001", status: "valid" },
      { tid: "3lht00000000c", serial: 2, holder: "Pat Okafor", classRkey: "3lhtcpaid00001", status: "valid" },
    ],
    syncedAt: NOW.toISOString(),
  };
  const token = (tid: string, ser: number, over: Partial<{ evt: string; exp: number }> = {}) =>
    signTicket({ v: 1, org: DID, iss: key.kid, evt: over.evt ?? "3lhevent000001", cls: tid === "3lht00000000c" ? "3lhtcpaid00001" : "3lhtcfree00001", tid, ser, exp: over.exp ?? Math.floor(NOW.getTime() / 1000) + 7200, nbf: Math.floor(NOW.getTime() / 1000) - 86400 }, { privateKey: key.privateKey });
  const door = await Door.open({ pack, ledger: [], outbox: [], scannerId: "door-north" });
  return { key, pack, token, door };
}

test("valid ticket admits once, then is a duplicate with the first admission time", async () => {
  const { door, token } = await fixture();
  const t = await token("3lht00000000a", 0);
  const first = await door.scan(t, NOW);
  assert.equal(first?.result, "admitted");
  assert.equal(first?.holder, "Sam Lee");
  assert.equal(first?.className, "Free reservation");
  // Same code again within 3 s is camera jitter: ignored, not logged.
  assert.equal(await door.scan(t, new Date(NOW.getTime() + 1000)), null);
  const again = await door.scan(t, new Date(NOW.getTime() + 60_000));
  assert.equal(again?.result, "duplicate");
  assert.match(again!.detail, /1 min ago at door-north/);
  assert.equal(door.counts().admitted, 1);
  assert.equal(door.counts().duplicates, 1);
});

test("revoked, expired, tampered, wrong-event and garbage codes all deny with a reason", async () => {
  const { door, token } = await fixture([2]);
  assert.equal((await door.scan(await token("3lht00000000c", 2), NOW))?.result, "revoked");
  assert.equal((await door.scan(await token("3lht00000000a", 0, { exp: Math.floor(NOW.getTime() / 1000) - 7200 }), NOW))?.result, "expired");
  const good = await token("3lht00000000b", 1);
  assert.equal((await door.scan(good.slice(0, -4) + "AAAA", NOW))?.result, "invalid");
  assert.equal((await door.scan(await token("3lht00000000b", 1, { evt: "3lhotherevent1" }), NOW))?.result, "denied");
  assert.equal((await door.scan("https://example.com/not-a-ticket", NOW))?.result, "invalid");
  assert.equal(door.counts().admitted, 0);
  assert.equal(door.outbox.length, 5);
});

test("manual list admit, cash and comp all log entries; list shows admitted state", async () => {
  const { door } = await fixture();
  assert.equal(door.admitFromList("3lht00000000c", NOW).result, "manualAdmit");
  assert.equal(door.admitFromList("3lht00000000c", NOW).result, "duplicate");
  assert.equal(door.admitFromList("3lhtnope00000", NOW).result, "invalid");
  assert.equal(door.admitCash(1000, "USD", NOW).result, "cashAdmit");
  assert.equal(door.admitComp("Band director's guest", NOW).result, "compAdmit");
  const c = door.counts();
  assert.deepEqual([c.admitted, c.duplicates, c.cash, c.cashCents, c.comp, c.pending], [1, 1, 1, 1000, 1, 5]);
  const row = door.list().find((r) => r.tid === "3lht00000000c")!;
  assert.equal(row.admitted, true);
  assert.equal(door.list()[0]!.holder, "Pat Okafor");
});

test("state round-trips through toState/open and a re-sync keeps the ledger", async () => {
  const { door, token, pack, key } = await fixture();
  await door.scan(await token("3lht00000000a", 0), NOW);
  const reopened = await Door.open(JSON.parse(JSON.stringify(door.toState())));
  assert.equal((await reopened.scan(await token("3lht00000000a", 0), new Date(NOW.getTime() + 10_000)))?.result, "duplicate");
  const list = new StatusList(1024); list.set(1);
  const resynced = await reopened.resync({ ...pack, statusList: await list.encode(), syncedAt: new Date().toISOString() });
  assert.equal((await resynced.scan(await token("3lht00000000b", 1), NOW))?.result, "revoked");
  assert.equal(resynced.ledger.has("3lht00000000a"), true);
  assert.equal(resynced.outbox.length, 3);
  void key;
});

test("outbox upload bookkeeping is idempotent", async () => {
  const { door, token } = await fixture();
  await door.scan(await token("3lht00000000a", 0), NOW);
  door.admitCash(500, "USD", NOW);
  const pending = door.pendingUploads();
  assert.equal(pending.length, 2);
  door.markUploaded(pending.map((e) => e.nonce));
  assert.equal(door.pendingUploads().length, 0);
  door.markUploaded(pending.map((e) => e.nonce));
  assert.equal(door.counts().pending, 0);
});

test("a duplicate scan logs its own entry with a distinct nonce (regression: it used to overwrite the admission)", async () => {
  const { door, token } = await fixture();
  const t = await token("3lht00000000a", 0);
  await door.scan(t, NOW);
  await door.scan(t, new Date(NOW.getTime() + 30_000));
  const [first, second] = door.outbox;
  assert.equal(first!.result, "admitted");
  assert.equal(second!.result, "duplicate");
  assert.notEqual(first!.nonce, second!.nonce);
  assert.equal(new Set(door.outbox.map((e) => e.nonce)).size, door.outbox.length);
});
