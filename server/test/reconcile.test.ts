import { test } from "node:test";
import assert from "node:assert/strict";
import { attendanceCsv, reconcile, summaryCsv } from "../src/reconcile.ts";
import type { Stored } from "../src/records.ts";

const DID = "did:web:x.example";
const uri = (col: string, rk: string) => `at://${DID}/org.openmusicperformance.${col}/${rk}`;
const stored = <T,>(col: string, rkey: string, record: T): Stored<T> => ({ uri: uri(col, rkey), did: DID, collection: `org.openmusicperformance.${col}`, rkey, cid: "bafy", record, createdAt: "2026-12-01T00:00:00Z", updatedAt: "2026-12-01T00:00:00Z" });
const ref = (col: string, rk: string) => ({ uri: uri(col, rk), cid: "bafy" });
const usd = (amountCents: number) => ({ amountCents, currency: "USD" });

function scenario() {
  const event = stored("event", "ev", { title: "Winter Concert", startsAt: "2026-12-16T01:00:00Z", timezone: "America/Chicago", location: { name: "Aud" }, status: "published", refundPolicy: { onCancellation: "full", onPostponement: "honor" }, feeDisclosure: { platformFeeCents: 0 }, createdAt: "" } as never);
  const paid = stored("ticketClass", "paid", { event: ref("event", "ev"), name: "GA", kind: "paid" as const, price: usd(500), createdAt: "" });
  const free = stored("ticketClass", "free", { event: ref("event", "ev"), name: "Free", kind: "freeRsvp" as const, price: usd(0), createdAt: "" });
  const o1 = stored("order", "o1", { event: ref("event", "ev"), items: [{ ticketClass: ref("ticketClass", "paid"), quantity: 2, unitPrice: usd(500) }], buyer: { name: "Pat", email: "pat@example.com" }, status: "paid", paymentProvider: "stripe", total: usd(1000), createdAt: "" });
  const o2 = stored("order", "o2", { event: ref("event", "ev"), items: [{ ticketClass: ref("ticketClass", "free"), quantity: 1, unitPrice: usd(0) }], buyer: { name: "Sam" }, status: "free", paymentProvider: "none", total: usd(0), createdAt: "" });
  const o3 = stored("order", "o3", { event: ref("event", "ev"), items: [{ ticketClass: ref("ticketClass", "paid"), quantity: 1, unitPrice: usd(500) }], buyer: { name: "Lee" }, status: "refunded", paymentProvider: "stripe", total: usd(500), createdAt: "" });
  const o4 = stored("order", "o4", { event: ref("event", "ev"), items: [{ ticketClass: ref("ticketClass", "paid"), quantity: 1, unitPrice: usd(500) }], buyer: { name: "Box Office" }, status: "paid", paymentProvider: "cash", total: usd(500), createdAt: "" });
  const tk = (rk: string, cls: string, order: string, serial: number, status = "valid") => stored("ticket", rk, { event: ref("event", "ev"), ticketClass: ref("ticketClass", cls), order: ref("order", order), serial, status: status as "valid", issuerKid: "k", issuedAt: "" });
  const tickets = [tk("t1", "paid", "o1", 0), tk("t2", "paid", "o1", 1), tk("t3", "free", "o2", 2), tk("t4", "paid", "o3", 3, "refunded"), tk("t5", "paid", "o4", 4)];
  const sc = (nonce: string, result: string, extra: Record<string, unknown> = {}, at = "2026-12-16T00:40:00Z", scannerId = "north") => stored("doorScan", nonce, { event: ref("event", "ev"), scannerId, nonce, result, scannedAt: at, ...extra });
  const scans = [
    sc("a1", "admitted", { ticket: ref("ticket", "t1"), offline: true }),
    sc("a2", "duplicate", { ticket: ref("ticket", "t1") }, "2026-12-16T00:41:00Z"),
    sc("a3", "admitted", { ticket: ref("ticket", "t1") }, "2026-12-16T00:42:00Z", "south"), // double admit from an unsynced second scanner
    sc("a4", "manualAdmit", { ticket: ref("ticket", "t3") }),
    sc("a5", "cashAdmit", { cashCollected: usd(1000) }),
    sc("a6", "compAdmit"),
    sc("a7", "invalid"),
    sc("a8", "revoked", { ticket: ref("ticket", "t4") }),
  ];
  const donations = [
    stored("donation", "d1", { amount: usd(2500), paymentProvider: "stripe", status: "completed", createdAt: "" }),
    stored("donation", "d2", { amount: usd(700), paymentProvider: "cash", status: "completed", createdAt: "" }),
    stored("donation", "d3", { amount: usd(9900), paymentProvider: "stripe", status: "pending", createdAt: "" }),
  ];
  return { event, classes: [free, paid], orders: [o1, o2, o3, o4], tickets, scans, donations, now: new Date("2026-12-16T03:00:00Z") };
}

test("reconciliation totals: card, cash, refunds, deposit, headcount", () => {
  const r = reconcile(scenario());
  assert.equal(r.money.cardGross, 1000 + 2500);           // o1 card + card donation; refunded o3 excluded
  assert.equal(r.money.cashGross, 500 + 1000 + 700);       // cash order + door cash + cash donation
  assert.equal(r.money.refunds, 500);
  assert.equal(r.money.platformFee, 0);
  assert.equal(r.money.net, 3500 + 2200 - 500);
  assert.equal(r.money.cashToDeposit, 2200);
  assert.equal(r.headcount, 2 + 1 + 1);                    // t1 + t3 admitted, one cash walk-up, one comp
});

test("reconciliation attendance: issued, admitted, no-shows, voided, double admits", () => {
  const r = reconcile(scenario());
  assert.deepEqual(r.tickets, { issued: 4, admitted: 2, noShows: 2, voided: 1 });
  const ga = r.classes.find((c) => c.name === "GA")!;
  assert.deepEqual([ga.issued, ga.admitted, ga.noShows, ga.card, ga.cash, ga.refunded], [3, 1, 2, 1000, 500, 500]);
  assert.equal(r.door.doubleAdmits, 1);
  assert.equal(r.door.duplicateAttempts, 1);
  assert.equal(r.door.invalidAttempts, 2);                 // invalid + revoked attempt
  assert.equal(r.door.offlineScans, 1);
  assert.equal(r.donations.count, 2);                      // pending donation excluded
  assert.deepEqual(r.scanners.map((s) => [s.scannerId, s.scans, s.admitted]), [["north", 7, 4], ["south", 1, 0]]);
  const t1 = r.lines.find((l) => l.ticketRkey === "t1")!;
  assert.equal(t1.scannerId, "north");                     // first admission wins
  assert.equal(r.lines.find((l) => l.ticketRkey === "t2")!.admittedAt, "");
});

test("CSV exports are well-formed and carry the deposit line and every ticket", () => {
  const r = reconcile(scenario());
  const s = summaryCsv(r);
  assert.match(s, /\r\nCASH TO DEPOSIT,,22\.00\r\n/);
  assert.match(s, /Double admits \(same ticket admitted twice\),1,/);
  const a = attendanceCsv(r);
  assert.equal(a.trim().split("\r\n").length, 1 + 5);
  assert.match(a, /Pat,pat@example\.com,GA,5\.00,card,paid,t1,0,valid,2026-12-16T00:40:00Z,north/);
  assert.match(summaryCsv({ ...r, event: { ...r.event, title: 'Show, "Live"' } }), /^Open Music Performance reconciliation,"Show, ""Live"""\r\n/);
});
