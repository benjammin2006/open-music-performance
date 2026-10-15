// Domain operations on top of the record store: issuing tickets for an order, free RSVP, status lists.
import { StatusList, holderBindingFromEmail, signTicket } from "@omp/tickets";
import { C } from "./lexicons.ts";
import type { IssuerKeys } from "./keys.ts";
import { ValidationError, strongRef, type RecordStore, type Stored } from "./records.ts";
import { nextTid } from "./tid.ts";
import type { Event, Order, Ticket, TicketClass } from "./types.ts";

export class Services {
  private store: RecordStore;
  private keys: IssuerKeys;
  constructor(store: RecordStore, keys: IssuerKeys) {
    this.store = store;
    this.keys = keys;
  }

  ticketClassesFor(event: Stored<Event>): Stored<TicketClass>[] {
    return this.store.listReferencing<TicketClass>(C.ticketClass, event.uri).sort((a, b) => (a.record.sortOrder ?? 0) - (b.record.sortOrder ?? 0));
  }

  issuedCount(ticketClass: Stored<TicketClass>): number {
    return this.store.listReferencing<Ticket>(C.ticket, ticketClass.uri).filter((t) => t.record.status === "valid").length;
  }

  remaining(ticketClass: Stored<TicketClass>): number | null {
    const cap = ticketClass.record.capacity;
    return cap === undefined ? null : Math.max(0, cap - this.issuedCount(ticketClass));
  }

  /** Free RSVP: creates a free order and issues signed tickets. Paid classes are refused here. */
  async rsvp(event: Stored<Event>, ticketClass: Stored<TicketClass>, buyer: { name: string; email?: string; marketingConsent?: boolean }, quantity: number): Promise<{ order: Stored<Order>; tickets: Stored<Ticket>[] }> {
    if (ticketClass.record.kind !== "freeRsvp" && ticketClass.record.kind !== "comp") throw new ValidationError("this ticket class is not free");
    if (event.record.status !== "published") throw new ValidationError("event is not open");
    const limit = ticketClass.record.perOrderLimit ?? 10;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > limit) throw new ValidationError(`quantity must be between 1 and ${limit}`);
    const left = this.remaining(ticketClass);
    if (left !== null && quantity > left) throw new ValidationError(left === 0 ? "sold out" : `only ${left} left`);
    if (!buyer.name.trim()) throw new ValidationError("name is required");

    const now = new Date().toISOString();
    const order = await this.store.put<Order>(event.did, C.order, {
      event: strongRef(event),
      items: [{ ticketClass: strongRef(ticketClass), quantity, unitPrice: { amountCents: 0, currency: ticketClass.record.price.currency } }],
      buyer: { name: buyer.name.trim(), ...(buyer.email ? { email: buyer.email.trim() } : {}), ...(buyer.marketingConsent !== undefined ? { marketingConsent: buyer.marketingConsent } : {}) },
      status: "free",
      paymentProvider: "none",
      total: { amountCents: 0, currency: ticketClass.record.price.currency },
      createdAt: now,
    });
    const tickets = await this.issueTickets(event, ticketClass, order, quantity);
    return { order, tickets };
  }

  async issueTickets(event: Stored<Event>, ticketClass: Stored<TicketClass>, order: Stored<Order>, quantity: number): Promise<Stored<Ticket>[]> {
    const kid = this.keys.currentKid(event.did);
    const privateKey = kid ? await this.keys.privateKey(event.did, kid) : null;
    if (!kid || !privateKey) throw new Error(`no issuer key for ${event.did}`);
    const binding = order.record.buyer.email ? await holderBindingFromEmail(order.record.buyer.email) : null;
    const expiry = Math.floor(new Date(event.record.endsAt ?? event.record.startsAt).getTime() / 1000) + 6 * 3600;
    const notBefore = Math.floor(new Date(order.record.createdAt).getTime() / 1000) - 60;
    const out: Stored<Ticket>[] = [];
    for (let i = 0; i < quantity; i++) {
      const serial = this.store.nextSerial(event.uri);
      const rkey = nextRkey();
      const token = await signTicket(
        { v: 1, org: event.did, iss: kid, evt: event.rkey, cls: ticketClass.rkey, tid: rkey, ser: serial, exp: expiry, nbf: notBefore, ...(binding ? { hb: binding.short } : {}) },
        { privateKey },
      );
      out.push(await this.store.put<Ticket>(event.did, C.ticket, {
        event: strongRef(event), ticketClass: strongRef(ticketClass), order: strongRef(order),
        serial, status: "valid", ...(binding ? { holderBinding: binding.full } : {}), holderLabel: order.record.buyer.name,
        issuerKid: kid, token, issuedAt: new Date().toISOString(),
      }, rkey));
    }
    return out;
  }

  /** Status list for an event: bit set for every revoked or refunded serial. Scanners fetch this before doors. */
  async statusList(event: Stored<Event>): Promise<{ size: number; encodedList: string }> {
    const tickets = this.store.listReferencing<Ticket>(C.ticket, event.uri, 100_000);
    const size = Math.max(1024, 1 << Math.ceil(Math.log2(Math.max(1, tickets.length + 1))));
    const list = new StatusList(size);
    for (const t of tickets) if (t.record.status === "revoked" || t.record.status === "refunded") list.set(t.record.serial);
    return list.encode();
  }
}

function nextRkey(): string { return nextTid(); }
