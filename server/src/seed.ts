// Loads the @omp/schemas fixtures (the Lincoln High School Winter Concert) into a store, rewriting the
// fixtures' placeholder strong refs to the real URIs and CIDs the store assigns, and provisioning a real
// issuer key for the organization. Idempotent: re-running overwrites the same record keys.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { C, fixturesDir } from "./lexicons.ts";
import type { IssuerKeys } from "./keys.ts";
import { strongRef, type RecordStore } from "./records.ts";

export const DEMO_DID = "did:web:lincolnbands.example";
export const DEMO_EVENT_RKEY = "3lhevent000001";

export async function seedDemo(store: RecordStore, keys: IssuerKeys): Promise<{ did: string; eventRkey: string }> {
  const fx = (name: string) => JSON.parse(readFileSync(join(fixturesDir(), `${name}.json`), "utf8")) as Record<string, unknown>;
  const did = DEMO_DID;
  const put = (collection: string, record: Record<string, unknown>, rkey: string) => {
    const { $type: _t, ...rest } = record;
    return store.put(did, collection, rest, rkey);
  };

  const orgFx = fx("organization");
  const org = await put(C.organization, { ...orgFx, issuerKeys: [] }, "3lhorg000000001");
  await keys.provision(did, org.rkey, "lincoln-2026-1");

  const act = await put(C.act, fx("act"), "3lhact00000001");
  const event = await put(C.event, fx("event"), DEMO_EVENT_RKEY);
  const ev = strongRef(event);

  const paidFx = fx("ticketClass");
  const paid = await put(C.ticketClass, { ...paidFx, event: ev }, "3lhtcpaid00001");
  const free = await put(C.ticketClass, {
    event: ev, name: "Free reservation", kind: "freeRsvp", price: { amountCents: 0, currency: "USD" },
    capacity: 100, perOrderLimit: 6, description: "Reserve a seat at no cost. Donations welcome at the door.", sortOrder: 0, createdAt: paidFx["createdAt"],
  }, "3lhtcfree00001");

  await put(C.performance, { ...fx("performance"), event: ev, act: strongRef(act) }, "3lhperf0000001");
  await put(C.program, { ...fx("program"), event: ev }, "3lhprog0000001");

  const orderFx = fx("order") as { items: { ticketClass: { uri: string }; quantity: number; unitPrice: unknown }[] };
  const order = await put(C.order, {
    ...orderFx, event: ev,
    items: orderFx.items.map((it) => ({ ...it, ticketClass: it.ticketClass.uri.includes("free") ? strongRef(free) : strongRef(paid) })),
  }, "3lhorder000001");

  // The fixture ticket carries a placeholder token; re-sign it for real so the demo scanner can verify it.
  const ticketFx = fx("ticket") as Record<string, unknown>;
  const { token: _placeholder, ...ticketRest } = ticketFx;
  const ticket = await put(C.ticket, { ...ticketRest, event: ev, ticketClass: strongRef(paid), order: strongRef(order), serial: store.nextSerial(event.uri) }, "3lhticket00001");
  await put(C.doorScan, { ...fx("doorScan"), event: ev, ticket: strongRef(ticket) }, "3lhscan0000001");
  await put(C.donation, { ...fx("donation"), event: ev }, "3lhdon00000001");

  return { did, eventRkey: event.rkey };
}
