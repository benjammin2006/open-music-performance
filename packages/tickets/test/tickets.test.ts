import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DoorLedger,
  StatusList,
  base58btcDecode,
  base58btcEncode,
  base64urlDecode,
  base64urlEncode,
  decodePublicKeyMultibase,
  exportPrivateKeyJwk,
  generateIssuerKey,
  holderBindingFromEmail,
  importPrivateKeyJwk,
  parseTicket,
  signTicket,
  verifyTicket,
  type TicketClaims,
} from "../src/index.ts";

const ORG = "did:web:lincolnbands.example";
const NOW = 1_765_843_200; // 2026-12-16T00:00:00Z, doors night for the fixture event

async function setup() {
  const key = await generateIssuerKey("lincoln-2026-1");
  const claims: TicketClaims = {
    v: 1, org: ORG, iss: key.kid, evt: "3lhevent000001", cls: "3lhtcpaid00001", tid: "3lhticket00001",
    ser: 42, exp: NOW + 4 * 3600, nbf: NOW - 24 * 3600, hb: (await holderBindingFromEmail("Jordan.Rivera@example.com")).short,
  };
  const token = await signTicket(claims, { privateKey: key.privateKey });
  const resolveKey = async (org: string, kid: string) => (org === ORG && kid === key.kid ? key.publicKeyMultibase : null);
  return { key, claims, token, resolveKey };
}

test("valid token verifies offline from the published multibase key", async () => {
  const { token, claims, resolveKey } = await setup();
  const r = await verifyTicket(token, { resolveKey, now: NOW });
  assert.equal(r.ok, true);
  if (r.ok) assert.deepEqual(r.claims, claims);
});

test("token fits a phone-scannable QR budget", async () => {
  const { token } = await setup();
  assert.ok(token.length < 400, `token is ${token.length} chars`);
  assert.match(token, /^OMP1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
});

test("tampered payload fails with bad-signature", async () => {
  const { token, resolveKey } = await setup();
  const [p, payload, sig] = token.split(".") as [string, string, string];
  const claims = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
  claims.ser = 7; // try to become a different ticket
  const forged = `${p}.${base64urlEncode(new TextEncoder().encode(JSON.stringify(claims)))}.${sig}`;
  const r = await verifyTicket(forged, { resolveKey, now: NOW });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "bad-signature");
});

test("token signed by a different key fails even with the same kid", async () => {
  const { claims, resolveKey } = await setup();
  const impostor = await generateIssuerKey("lincoln-2026-1");
  const token = await signTicket(claims, { privateKey: impostor.privateKey });
  const r = await verifyTicket(token, { resolveKey, now: NOW });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "bad-signature");
});

test("unknown issuer key fails closed", async () => {
  const { token } = await setup();
  const r = await verifyTicket(token, { resolveKey: async () => null, now: NOW });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "unknown-key");
});

test("expired and not-yet-valid tokens are rejected, within skew they pass", async () => {
  const { token, claims, resolveKey } = await setup();
  const late = await verifyTicket(token, { resolveKey, now: claims.exp + 61 });
  assert.equal(late.ok, false);
  if (!late.ok) assert.equal(late.reason, "expired");
  const early = await verifyTicket(token, { resolveKey, now: claims.nbf! - 61 });
  assert.equal(early.ok, false);
  if (!early.ok) assert.equal(early.reason, "not-yet-valid");
  const skewed = await verifyTicket(token, { resolveKey, now: claims.exp + 30 });
  assert.equal(skewed.ok, true);
});

test("revoked serial in the status list is rejected", async () => {
  const { token, claims, resolveKey } = await setup();
  const list = new StatusList(1000);
  list.set(claims.ser);
  const r = await verifyTicket(token, { resolveKey, now: NOW, statusList: list });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "revoked");
  list.set(claims.ser, false);
  assert.equal((await verifyTicket(token, { resolveKey, now: NOW, statusList: list })).ok, true);
});

test("status list survives encode/decode and stays small", async () => {
  const list = new StatusList(10_000);
  for (const i of [0, 7, 8, 42, 9_999]) list.set(i);
  const encoded = await list.encode();
  assert.ok(encoded.encodedList.length < 200, `encoded list is ${encoded.encodedList.length} chars`);
  const back = await StatusList.decode(encoded);
  assert.deepEqual(back.revoked(), [0, 7, 8, 42, 9_999]);
  assert.equal(back.get(43), false);
  assert.equal(back.get(10_000), false);
});

test("replayed ticket is a duplicate on the same scanner and after a ledger merge", async () => {
  const { claims } = await setup();
  const north = new DoorLedger("door-north");
  const south = new DoorLedger("door-south");
  assert.equal(north.admit(claims.tid, new Date("2026-12-16T00:41:12Z")).result, "admitted");
  assert.equal(north.admit(claims.tid).result, "duplicate");
  // South door was offline and admitted the same screenshot a minute later.
  assert.equal(south.admit(claims.tid, new Date("2026-12-16T00:42:00Z")).result, "admitted");
  // When they sync, both agree, and the earliest admission is the one kept.
  assert.equal(south.merge(north.export()), 0);
  assert.equal(north.merge(south.export()), 0);
  assert.equal(south.export()[0]!.scannerId, "door-north");
  assert.equal(south.admit(claims.tid).result, "duplicate");
  // Merge is idempotent and commutative in size.
  assert.equal(north.size, 1);
  assert.equal(south.size, 1);
});

test("malformed input never throws, it fails closed", async () => {
  const resolveKey = async () => null;
  for (const bad of ["", "OMP1", "OMP1.x", "OMP1.!!.!!", "JWT.eyJ.sig", "OMP1." + base64urlEncode(new TextEncoder().encode("[]")) + ".AA"]) {
    const r = await verifyTicket(bad, { resolveKey, now: NOW });
    assert.equal(r.ok, false, bad);
    if (!r.ok) assert.equal(r.reason, "malformed", bad);
  }
  assert.equal(parseTicket("nope"), null);
});

test("fixture organization key is a valid did:key-style Ed25519 multibase", async () => {
  const org = JSON.parse(readFileSync(new URL("../../../schemas/fixtures/organization.json", import.meta.url), "utf8"));
  const raw = decodePublicKeyMultibase(org.issuerKeys[0].publicKeyMultibase);
  assert.equal(raw.length, 32);
  const key = await generateIssuerKey("k");
  assert.deepEqual(decodePublicKeyMultibase(key.publicKeyMultibase), new Uint8Array(await crypto.subtle.exportKey("raw", key.publicKey)));
});

test("private key round-trips through JWK and still signs verifiable tokens", async () => {
  const { key, claims, resolveKey } = await setup();
  const restored = await importPrivateKeyJwk(await exportPrivateKeyJwk(key.privateKey));
  const token = await signTicket(claims, { privateKey: restored });
  assert.equal((await verifyTicket(token, { resolveKey, now: NOW })).ok, true);
});

test("holder binding is case- and whitespace-insensitive and never contains the email", async () => {
  const a = await holderBindingFromEmail("  Jordan.Rivera@Example.com ");
  const b = await holderBindingFromEmail("jordan.rivera@example.com");
  assert.deepEqual(a, b);
  assert.match(a.full, /^sha256:[0-9a-f]{64}$/);
  assert.equal(a.short.length, 24);
  assert.doesNotMatch(a.full, /jordan/i);
});

test("base58btc and base64url encoders round-trip, including leading zeros", () => {
  const bytes = new Uint8Array([0, 0, 1, 255, 42, 0, 17]);
  assert.deepEqual(base58btcDecode(base58btcEncode(bytes)), bytes);
  assert.deepEqual(base64urlDecode(base64urlEncode(bytes)), bytes);
  assert.equal(base58btcEncode(new Uint8Array([0, 0])), "11");
});
