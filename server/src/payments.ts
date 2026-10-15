// Paid checkout on the organizer's own Stripe account (docs/ARCHITECTURE.md D5, section 5.5).
//
// Flow: buyer submits name, email and quantity → a `pending` order holds the seats for HOLD_SECONDS → a
// Stripe Checkout Session is created as a direct charge on the organizer's connected account → buyer pays
// on Stripe's hosted page → `checkout.session.completed` webhook (or the success-page fallback, which fetches
// the session when the webhook has not arrived) marks the order paid and issues signed tickets. Expired or
// cancelled sessions release the hold. OMP never holds funds and never sees card data; the order keeps only
// the session id as paymentRef.
import type { DatabaseSync } from "node:sqlite";
import { C } from "./lexicons.ts";
import { ValidationError, parseUri, strongRef, type RecordStore, type Stored } from "./records.ts";
import { HOLD_SECONDS, type Services } from "./services.ts";
import { Stripe, StripeError, constructWebhookEvent, type CheckoutSession, type Transport, type WebhookEvent } from "./stripe.ts";
import type { Event, Order, TicketClass } from "./types.ts";

export interface PaymentsConfig { secretKey?: string; webhookSecret?: string; clientId?: string; transport?: Transport }
export interface ConnectedAccount { accountId: string; livemode: boolean; connectedAt: string }

/** Thrown when a checkout cannot start for a reason the buyer should see. */
export class PaymentError extends Error {}

/** Which Stripe account each organization charges on. Private: never exported with the organization record. */
export class PaymentAccounts {
  private db: DatabaseSync;
  constructor(db: DatabaseSync) { this.db = db; }
  get(did: string): ConnectedAccount | null {
    const r = this.db.prepare("SELECT account_id, livemode, connected_at FROM payment_accounts WHERE did = ? AND provider = 'stripe'").get(did) as { account_id: string; livemode: number; connected_at: string } | undefined;
    return r ? { accountId: r.account_id, livemode: Boolean(r.livemode), connectedAt: r.connected_at } : null;
  }
  set(did: string, accountId: string, livemode: boolean): void {
    this.db.prepare("INSERT OR REPLACE INTO payment_accounts (did, provider, account_id, livemode, connected_at) VALUES (?, 'stripe', ?, ?, ?)").run(did, accountId, livemode ? 1 : 0, new Date().toISOString());
  }
  remove(did: string): void { this.db.prepare("DELETE FROM payment_accounts WHERE did = ? AND provider = 'stripe'").run(did); }
}

export class Payments {
  readonly accounts: PaymentAccounts;
  readonly stripe: Stripe | null;
  private webhookSecret: string | undefined;
  private store: RecordStore;
  private svc: Services;
  private baseUrl: string;
  private inFlight = new Set<string>();
  constructor(deps: { db: DatabaseSync; store: RecordStore; svc: Services; baseUrl: string; config: PaymentsConfig }) {
    this.accounts = new PaymentAccounts(deps.db);
    this.store = deps.store;
    this.svc = deps.svc;
    this.baseUrl = deps.baseUrl;
    const cfg = deps.config;
    this.webhookSecret = cfg.webhookSecret;
    this.stripe = cfg.secretKey ? new Stripe({ secretKey: cfg.secretKey, ...(cfg.clientId ? { clientId: cfg.clientId } : {}), ...(cfg.transport ? { transport: cfg.transport } : {}) }) : null;
  }

  /** The instance has a Stripe secret key, so organizers can connect accounts. */
  get configured(): boolean { return this.stripe !== null; }
  get webhooksConfigured(): boolean { return Boolean(this.webhookSecret); }
  /** This organization can take card payments right now. */
  canSell(did: string): boolean { return this.stripe !== null && this.accounts.get(did) !== null; }

  /** Create the pending order (the inventory hold) and the Checkout Session. Returns where to send the buyer. */
  async startCheckout(event: Stored<Event>, cls: Stored<TicketClass>, buyer: { name: string; email: string; marketingConsent?: boolean }, quantity: number, offered?: number): Promise<{ order: Stored<Order>; url: string }> {
    const kind = cls.record.kind;
    if (kind !== "paid" && kind !== "payWhatYouWant") throw new ValidationError("this ticket class is free; use the reservation form");
    const account = this.accounts.get(event.did);
    if (!this.stripe || !account) throw new PaymentError("Online payment is not set up for this organizer yet.");
    if (!buyer.name.trim()) throw new ValidationError("name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim())) throw new ValidationError("a valid email is required for a paid order");
    const unit = unitPriceFor(cls, offered);
    this.releaseExpiredHolds(event);
    this.svc.checkOrderable(event, cls, quantity);

    const total = unit * quantity;
    const now = new Date();
    const order = await this.store.put<Order>(event.did, C.order, {
      event: strongRef(event),
      items: [{ ticketClass: strongRef(cls), quantity, unitPrice: { amountCents: unit, currency: cls.record.price.currency } }],
      buyer: { name: buyer.name.trim(), email: buyer.email.trim(), ...(buyer.marketingConsent !== undefined ? { marketingConsent: buyer.marketingConsent } : {}) },
      status: "pending", paymentProvider: "stripe",
      total: { amountCents: total, currency: cls.record.price.currency },
      createdAt: now.toISOString(),
    });

    const orderUrl = `${this.baseUrl}/order/${order.did}/${order.rkey}`;
    let session: CheckoutSession;
    try {
      session = await this.stripe.createCheckoutSession(account.accountId, {
        mode: "payment",
        line_items: [{ quantity, price_data: { currency: cls.record.price.currency.toLowerCase(), unit_amount: unit, product_data: { name: `${event.record.title}: ${cls.record.name}`, description: `${event.record.location.name}, ${event.record.startsAt.slice(0, 10)}` } } }],
        success_url: `${orderUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${orderUrl}/cancelled`,
        customer_email: buyer.email.trim(),
        client_reference_id: order.rkey,
        metadata: { omp_order_uri: order.uri, omp_event_uri: event.uri },
        payment_intent_data: { description: `${event.record.title} × ${quantity}`, metadata: { omp_order_uri: order.uri } },
        expires_at: Math.floor(now.getTime() / 1000) + HOLD_SECONDS,
      }, `omp-order-${order.rkey}`);
    } catch (e) {
      await this.store.put<Order>(order.did, C.order, { ...order.record, status: "failed", notes: `Checkout could not start: ${(e as Error).message}`.slice(0, 1000) }, order.rkey);
      throw new PaymentError(e instanceof StripeError ? "The payment provider refused to start checkout. Please try again or contact the organizer." : "Checkout could not start. Please try again.");
    }
    if (!session.url) {
      await this.store.put<Order>(order.did, C.order, { ...order.record, status: "failed", notes: "Checkout session returned no URL" }, order.rkey);
      throw new PaymentError("Checkout could not start. Please try again.");
    }
    const withRef = await this.store.put<Order>(order.did, C.order, { ...order.record, paymentRef: session.id }, order.rkey);
    return { order: withRef, url: session.url };
  }

  /** Mark an order paid and issue its tickets. Idempotent: a replayed webhook or a second success-page load is a no-op. */
  async fulfil(order: Stored<Order>, session: CheckoutSession): Promise<Stored<Order>> {
    if (order.record.status === "paid") return order;
    if (this.inFlight.has(order.uri)) return order;
    this.inFlight.add(order.uri);
    try {
      const event = this.store.getByUri<Event>(order.record.event.uri);
      const cls = this.store.getByUri<TicketClass>(order.record.items[0]!.ticketClass.uri);
      if (!event || !cls) throw new Error(`order ${order.uri} references a missing event or class`);
      const amountOk = session.amount_total === order.record.total.amountCents && (session.currency ?? "").toUpperCase() === order.record.total.currency;
      if (!amountOk) {
        return this.store.put<Order>(order.did, C.order, { ...order.record, status: "failed", paymentRef: session.id, notes: `Paid amount ${session.amount_total ?? "?"} ${session.currency ?? "?"} does not match order total ${order.record.total.amountCents} ${order.record.total.currency}. Refund from the Stripe dashboard and contact the buyer.` }, order.rkey);
      }
      const buyer = { ...order.record.buyer, ...(session.customer_details?.name && !order.record.buyer.name ? { name: session.customer_details.name } : {}) };
      const paid = await this.store.put<Order>(order.did, C.order, { ...order.record, buyer, status: "paid", paymentRef: session.id, paidAt: new Date().toISOString() }, order.rkey);
      const already = this.store.listReferencing(C.ticket, paid.uri).length;
      const wanted = order.record.items[0]!.quantity;
      if (already < wanted) await this.svc.issueTickets(event, cls, paid, wanted - already);
      return paid;
    } finally {
      this.inFlight.delete(order.uri);
    }
  }

  /** Success-page fallback: ask Stripe about a pending order's session and settle it. Safe to call repeatedly. */
  async syncPending(order: Stored<Order>, sessionId?: string): Promise<Stored<Order>> {
    if (order.record.status !== "pending" || !this.stripe) return order;
    const account = this.accounts.get(order.did);
    const id = order.record.paymentRef ?? sessionId;
    if (!account || !id || (sessionId && sessionId !== id)) return order;
    let session: CheckoutSession;
    try { session = await this.stripe.getCheckoutSession(account.accountId, id); } catch { return order; }
    if (session.payment_status === "paid") return this.fulfil(order, session);
    if (session.status === "expired") return this.cancelPending(order, "Checkout session expired", false);
    return order;
  }

  /** Release the hold. Expires the Stripe session best-effort so the buyer cannot pay after cancelling. */
  async cancelPending(order: Stored<Order>, reason = "Cancelled by buyer", expireSession = true): Promise<Stored<Order>> {
    if (order.record.status !== "pending") return order;
    const account = this.accounts.get(order.did);
    if (expireSession && this.stripe && account && order.record.paymentRef) {
      try { await this.stripe.expireCheckoutSession(account.accountId, order.record.paymentRef); } catch { /* already expired or paid; the webhook settles it */ }
    }
    return this.store.put<Order>(order.did, C.order, { ...order.record, status: "cancelled", notes: reason }, order.rkey);
  }

  /** Pending orders past the hold window are cancelled so their seats sell again. */
  releaseExpiredHolds(event: Stored<Event>): void {
    const cutoff = Date.now() - (HOLD_SECONDS + 120) * 1000;
    for (const o of this.store.listReferencing<Order>(C.order, event.uri, 100_000)) {
      if (o.record.status === "pending" && Date.parse(o.record.createdAt) < cutoff) void this.store.put<Order>(o.did, C.order, { ...o.record, status: "cancelled", notes: "Hold expired" }, o.rkey);
    }
  }

  /** Verify and apply one Stripe webhook delivery. Returns what was done; unknown events are acknowledged and ignored. */
  async handleWebhook(rawBody: string, signature: string | undefined, now?: number): Promise<{ handled: string; orderUri?: string }> {
    if (!this.webhookSecret) throw new StripeError("webhooks are not configured on this instance", 503);
    const ev = constructWebhookEvent(rawBody, signature, this.webhookSecret, now === undefined ? {} : { now });
    const session = ev.data.object as unknown as CheckoutSession;
    const order = this.orderForSession(ev, session);
    switch (ev.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        if (!order) return { handled: "ignored: no matching order" };
        if (session.payment_status !== "paid") return { handled: "ignored: not paid yet", orderUri: order.uri };
        await this.fulfil(order, session);
        return { handled: "paid", orderUri: order.uri };
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        if (!order) return { handled: "ignored: no matching order" };
        await this.cancelPending(order, ev.type === "checkout.session.expired" ? "Checkout session expired" : "Payment failed", false);
        return { handled: "released", orderUri: order.uri };
      }
      default:
        return { handled: `ignored: ${ev.type}` };
    }
  }

  private orderForSession(ev: WebhookEvent, session: CheckoutSession): Stored<Order> | null {
    const uri = session.metadata?.["omp_order_uri"];
    const parsed = uri ? parseUri(uri) : null;
    if (!parsed || parsed.collection !== C.order) return null;
    const order = this.store.getByUri<Order>(uri!);
    if (!order) return null;
    // The event must come from the account this organization connected, and the session must be the one we created.
    const account = this.accounts.get(order.did);
    if (ev.account && account && ev.account !== account.accountId) return null;
    if (order.record.paymentRef && order.record.paymentRef !== session.id) return null;
    return order;
  }
}

/** Unit price in cents: the class price, or for pay-what-you-want the buyer's offer clamped to the floor. */
export function unitPriceFor(cls: Stored<TicketClass>, offered?: number): number {
  if (cls.record.kind !== "payWhatYouWant") return cls.record.price.amountCents;
  const floor = Math.max(cls.record.minimumPrice?.amountCents ?? 0, 50);
  const amount = offered === undefined || !Number.isFinite(offered) ? cls.record.price.amountCents : Math.round(offered);
  if (amount < floor) throw new ValidationError(`the minimum for this ticket is ${(floor / 100).toFixed(2)}`);
  if (amount > 1_000_000) throw new ValidationError("that amount is above the maximum");
  return amount;
}
