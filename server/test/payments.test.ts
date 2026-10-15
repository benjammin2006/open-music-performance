// Paid checkout against a fake Stripe transport: direct charges on the connected account, holds, webhook
// settlement, replay safety, the success-page fallback, cancellation, and signature verification.
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Hono } from "hono";
import { verifyTicket } from "@omp/tickets";
import { openDb } from "../src/db.ts";
import { loadLexicons, C } from "../src/lexicons.ts";
import { createApp } from "../src/app.ts";
import { seedDemo, DEMO_DID, DEMO_EVENT_RKEY } from "../src/seed.ts";
import { constructWebhookEvent, formEncode, signatureHeader, type CheckoutSession, type Transport } from "../src/stripe.ts";
import { HOLD_SECONDS } from "../src/services.ts";
import type { Order, Ticket, TicketClass } from "../src/types.ts";

const BASE = "http://omp.test";
const SECRET = "sk_test_fake";
const WHSEC = "whsec_testsecret";
const ACCT = "acct_1TestLincoln";
const EVENT_PATH = `/e/${DEMO_DID}/${DEMO_EVENT_RKEY}`;
const PAID = "3lhtcpaid00001";

/** A fake Stripe: records every request and serves sessions from memory. */
function fakeStripe() {
  const calls: { url: string; method: string; headers: Record<string, string>; body: string }[] = [];
  const sessions = new Map<string, CheckoutSession>();
  let n = 0;
  const transport: Transport = async (url, init) => {
    calls.push({ url, method: init.method, headers: init.headers, body: init.body ?? "" });
    const params = new URLSearchParams(init.body ?? "");
    const reply = (status: number, body: unknown) => ({ status, text: async () => JSON.stringify(body) });
    if (init.method === "POST" && url.endsWith("/v1/checkout/sessions")) {
      const id = `cs_test_${++n}`;
      const qty = Number(params.get("line_items[0][quantity]"));
      const unit = Number(params.get("line_items[0][price_data][unit_amount]"));
      const s: CheckoutSession = { id, url: `https://checkout.stripe.com/c/pay/${id}`, status: "open", payment_status: "unpaid", amount_total: qty * unit, currency: params.get("line_items[0][price_data][currency]"), client_reference_id: params.get("client_reference_id"), metadata: { omp_order_uri: params.get("metadata[omp_order_uri]")!, omp_event_uri: params.get("metadata[omp_event_uri]")! }, customer_details: { email: params.get("customer_email") } };
      sessions.set(id, s);
      return reply(200, s);
    }
    const m = /\/v1\/checkout\/sessions\/([^/]+)(\/expire)?$/.exec(url);
    if (m) {
      const s = sessions.get(m[1]!);
      if (!s) return reply(404, { error: { message: "No such checkout.session", code: "resource_missing" } });
      if (m[2]) { s.status = "expired"; }
      return reply(200, s);
    }
    if (url.endsWith("/oauth/token")) return reply(200, { stripe_user_id: "acct_1FromOAuth", livemode: false });
    if (url.endsWith("/oauth/deauthorize")) return reply(200, { stripe_user_id: params.get("stripe_user_id") });
    return reply(500, { error: { message: `unexpected ${init.method} ${url}` } });
  };
  /** Simulate the buyer paying on Stripe's page. */
  const pay = (id: string) => { const s = sessions.get(id)!; s.status = "complete"; s.payment_status = "paid"; s.customer_details = { ...s.customer_details, name: "Card Holder" }; return s; };
  return { transport, calls, sessions, pay };
}

async function fresh(opts: { connect?: boolean; webhookSecret?: string | null; clientId?: string } = {}) {
  const stripe = fakeStripe();
  const db = openDb(":memory:");
  const built = createApp(db, loadLexicons(), { baseUrl: BASE, adminToken: "t", payments: { secretKey: SECRET, transport: stripe.transport, ...(opts.webhookSecret === null ? {} : { webhookSecret: opts.webhookSecret ?? WHSEC }), ...(opts.clientId ? { clientId: opts.clientId } : {}) } });
  await seedDemo(built.store, built.keys, built.auth);
  if (opts.connect !== false) built.payments.accounts.set(DEMO_DID, ACCT, false);
  return { ...built, stripe };
}

const checkout = (app: Hono, fields: Record<string, string>) =>
  app.request(`${EVENT_PATH}/checkout`, { method: "POST", body: new URLSearchParams({ ticketClass: PAID, name: "Pat Buyer", email: "pat@example.com", quantity: "2", ...fields }) });

function webhook(app: Hono, type: string, session: CheckoutSession, o: { secret?: string; account?: string; ts?: number } = {}) {
  const body = JSON.stringify({ id: `evt_${Math.random().toString(36).slice(2)}`, type, account: o.account ?? ACCT, livemode: false, data: { object: session } });
  return app.request("/webhooks/stripe", { method: "POST", body, headers: { "content-type": "application/json", "stripe-signature": signatureHeader(o.secret ?? WHSEC, body, o.ts) } });
}

test("checkout creates a pending hold and a direct-charge session on the connected account", async () => {
  const { app, store, svc, stripe } = await fresh();
  const cls = store.get<TicketClass>(DEMO_DID, C.ticketClass, PAID)!;
  const before = svc.remaining(cls)!;
  const res = await checkout(app, {});
  assert.equal(res.status, 303);
  assert.match(res.headers.get("location")!, /^https:\/\/checkout\.stripe\.com\/c\/pay\/cs_test_1$/);

  const call = stripe.calls.find((c) => c.url.endsWith("/v1/checkout/sessions"))!;
  assert.equal(call.headers["Stripe-Account"], ACCT, "direct charge on the connected account");
  assert.equal(call.headers["Authorization"], `Bearer ${SECRET}`);
  assert.match(call.headers["Idempotency-Key"]!, /^omp-order-/);
  const p = new URLSearchParams(call.body);
  assert.equal(p.get("mode"), "payment");
  assert.equal(p.get("line_items[0][price_data][unit_amount]"), "500");
  assert.equal(p.get("line_items[0][quantity]"), "2");
  assert.equal(p.get("customer_email"), "pat@example.com");
  assert.equal(p.has("on_behalf_of"), false, "never on_behalf_of (ARCHITECTURE 5.5)");
  assert.equal(p.has("application_fee_amount"), false);
  assert.ok(Number(p.get("expires_at")) >= Math.floor(Date.now() / 1000) + HOLD_SECONDS - 5);
  assert.match(p.get("success_url")!, new RegExp(`^${BASE}/order/${DEMO_DID}/[0-9a-z]+\\?session_id=\\{CHECKOUT_SESSION_ID\\}$`));

  const order = store.list<Order>(DEMO_DID, C.order).find((o) => o.record.status === "pending")!;
  assert.equal(order.record.paymentProvider, "stripe");
  assert.equal(order.record.paymentRef, "cs_test_1");
  assert.equal(order.record.total.amountCents, 1000);
  assert.equal(svc.remaining(cls), before - 2, "pending order holds seats");
  assert.equal(store.listReferencing(C.ticket, order.uri).length, 0, "no tickets before payment");
});

test("checkout.session.completed marks the order paid, issues verifiable tickets, and replays are no-ops", async () => {
  const { app, store, keys, stripe } = await fresh();
  const res = await checkout(app, {});
  const order = store.list<Order>(DEMO_DID, C.order).find((o) => o.record.status === "pending")!;
  const session = stripe.pay(order.record.paymentRef!);

  const wh = await webhook(app, "checkout.session.completed", session);
  assert.equal(wh.status, 200);
  assert.equal((await wh.json() as { handled: string }).handled, "paid");
  const paid = store.get<Order>(DEMO_DID, C.order, order.rkey)!;
  assert.equal(paid.record.status, "paid");
  assert.ok(paid.record.paidAt);
  const tickets = store.listReferencing<Ticket>(C.ticket, paid.uri);
  assert.equal(tickets.length, 2);
  const v = await verifyTicket(tickets[0]!.record.token!, { resolveKey: async (did, kid) => keys.publicKeyMultibase(did, kid), now: Math.floor(Date.now() / 1000) + 60 });
  assert.equal(v.ok, true, JSON.stringify(v));
  assert.ok(tickets[0]!.record.holderBinding, "email-bound ticket");

  // Replay the same event: nothing changes.
  const again = await webhook(app, "checkout.session.completed", session);
  assert.equal(again.status, 200);
  assert.equal(store.listReferencing(C.ticket, paid.uri).length, 2);

  // The order page now shows the QR tickets.
  const page = await app.request(res.headers.get("location")!.replace(/^https:\/\/checkout\.stripe\.com.*$/, `/order/${DEMO_DID}/${order.rkey}`));
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /Here are your 2 tickets/);
  assert.match(html, /<svg/);
});

test("success-page fallback settles a paid session when the webhook has not arrived", async () => {
  const { app, store, stripe } = await fresh({ webhookSecret: null });
  await checkout(app, { quantity: "1" });
  const order = store.list<Order>(DEMO_DID, C.order).find((o) => o.record.status === "pending")!;
  const path = `/order/${DEMO_DID}/${order.rkey}`;

  const pending = await app.request(`${path}?session_id=${order.record.paymentRef}`);
  assert.equal(pending.status, 200);
  assert.match(await pending.text(), /waiting for the payment confirmation/);
  assert.equal(store.get<Order>(DEMO_DID, C.order, order.rkey)!.record.status, "pending");

  stripe.pay(order.record.paymentRef!);
  const done = await app.request(`${path}?session_id=${order.record.paymentRef}`);
  assert.match(await done.text(), /Here is your ticket/);
  assert.equal(store.get<Order>(DEMO_DID, C.order, order.rkey)!.record.status, "paid");
  assert.equal(store.listReferencing(C.ticket, order.uri).length, 1);
  // Webhooks are off on this instance: the endpoint says so rather than pretending.
  assert.equal((await webhook(app, "checkout.session.completed", stripe.sessions.get(order.record.paymentRef!)!)).status, 503);
});

test("bad signatures, wrong accounts, stale timestamps and amount mismatches never issue tickets", async () => {
  const { app, store, stripe } = await fresh();
  await checkout(app, {});
  const order = store.list<Order>(DEMO_DID, C.order).find((o) => o.record.status === "pending")!;
  const session = stripe.pay(order.record.paymentRef!);
  const status = () => store.get<Order>(DEMO_DID, C.order, order.rkey)!.record.status;

  assert.equal((await webhook(app, "checkout.session.completed", session, { secret: "whsec_wrong" })).status, 400);
  assert.equal((await app.request("/webhooks/stripe", { method: "POST", body: "{}" })).status, 400);
  assert.equal((await webhook(app, "checkout.session.completed", session, { ts: Math.floor(Date.now() / 1000) - 3600 })).status, 400);
  assert.equal(status(), "pending");

  const other = await webhook(app, "checkout.session.completed", session, { account: "acct_SomeoneElse" });
  assert.equal(other.status, 200);
  assert.match((await other.json() as { handled: string }).handled, /ignored/);
  assert.equal(status(), "pending");

  const short = await webhook(app, "checkout.session.completed", { ...session, amount_total: 500 });
  assert.equal(short.status, 200);
  assert.equal(status(), "failed");
  assert.equal(store.listReferencing(C.ticket, order.uri).length, 0);
  assert.match(store.get<Order>(DEMO_DID, C.order, order.rkey)!.record.notes!, /does not match/);
});

test("expired sessions and buyer cancellation release the hold; a cancelled order page says so", async () => {
  const { app, store, svc, stripe } = await fresh();
  const cls = store.get<TicketClass>(DEMO_DID, C.ticketClass, PAID)!;
  const before = svc.remaining(cls)!;

  await checkout(app, {});
  const a = store.list<Order>(DEMO_DID, C.order).find((o) => o.record.status === "pending")!;
  assert.equal(svc.remaining(cls), before - 2);
  const exp = await webhook(app, "checkout.session.expired", { ...stripe.sessions.get(a.record.paymentRef!)!, status: "expired" });
  assert.equal((await exp.json() as { handled: string }).handled, "released");
  assert.equal(store.get<Order>(DEMO_DID, C.order, a.rkey)!.record.status, "cancelled");
  assert.equal(svc.remaining(cls), before);

  await checkout(app, { quantity: "1" });
  const b = store.list<Order>(DEMO_DID, C.order).find((o) => o.record.status === "pending")!;
  const cancel = await app.request(`/order/${DEMO_DID}/${b.rkey}/cancelled`);
  assert.equal(cancel.status, 303);
  assert.match(cancel.headers.get("location")!, /notice=Checkout%20cancelled/);
  assert.equal(store.get<Order>(DEMO_DID, C.order, b.rkey)!.record.status, "cancelled");
  assert.equal(stripe.sessions.get(b.record.paymentRef!)!.status, "expired", "Stripe session expired so it cannot be paid later");
  assert.equal(svc.remaining(cls), before);
  assert.match(await (await app.request(`/order/${DEMO_DID}/${b.rkey}`)).text(), /Order cancelled/);
});

test("checkout refuses free classes, bad quantities, missing email, and over-capacity after holds", async () => {
  const { app, store } = await fresh();
  const text = async (r: Response) => [r.status, await r.text()] as const;
  let [st, body] = await text(await checkout(app, { ticketClass: "3lhtcfree00001" }));
  assert.equal(st, 400); assert.match(body, /free; use the reservation form/);
  [st, body] = await text(await checkout(app, { quantity: "99" }));
  assert.equal(st, 400); assert.match(body, /quantity must be between/);
  [st, body] = await text(await checkout(app, { email: "nope" }));
  assert.equal(st, 400); assert.match(body, /valid email/);
  assert.equal(store.list<Order>(DEMO_DID, C.order).filter((o) => o.record.status === "pending").length, 0, "nothing held by refused checkouts");

  // Fill the class with holds, then one more is refused.
  const cls = store.get<TicketClass>(DEMO_DID, C.ticketClass, PAID)!;
  await store.put(DEMO_DID, C.ticketClass, { ...cls.record, capacity: 3 }, PAID);
  assert.equal((await checkout(app, { quantity: "2" })).status, 303); // seed already issued 1 paid ticket → 3 - 1 - 2 = 0
  [st, body] = await text(await checkout(app, { quantity: "1" }));
  assert.equal(st, 400); assert.match(body, /sold out/);
});

test("pay-what-you-want charges the offered amount, clamped to the floor", async () => {
  const { app, store, stripe } = await fresh();
  const paid = store.get<TicketClass>(DEMO_DID, C.ticketClass, PAID)!;
  await store.put(DEMO_DID, C.ticketClass, { ...paid.record, name: "Pay what you want", kind: "payWhatYouWant", price: { amountCents: 1000, currency: "USD" }, minimumPrice: { amountCents: 300, currency: "USD" } }, "3lhtcpwyw00001");
  const res = await checkout(app, { ticketClass: "3lhtcpwyw00001", quantity: "1", amount: "7.50" });
  assert.equal(res.status, 303);
  const p = new URLSearchParams(stripe.calls.at(-1)!.body);
  assert.equal(p.get("line_items[0][price_data][unit_amount]"), "750");
  const low = await checkout(app, { ticketClass: "3lhtcpwyw00001", quantity: "1", amount: "1" });
  assert.equal(low.status, 400);
  assert.match(await low.text(), /minimum for this ticket is 3\.00/);
});

test("admin connects and disconnects a Stripe account; the event page follows", async () => {
  const { app, store, payments } = await fresh({ connect: false, clientId: "ca_test" });
  const { DEMO_ORGANIZER_KEY } = await import("../src/seed.ts");
  const signin = await app.request("/admin/signin", { method: "POST", body: new URLSearchParams({ key: DEMO_ORGANIZER_KEY }) });
  const cookie = signin.headers.get("set-cookie")!.split(";")[0]!;
  const h = { cookie };

  assert.match(await (await app.request("/admin/org", { headers: h })).text(), /Connect with Stripe/);
  assert.match(await (await app.request(EVENT_PATH)).text(), /Online purchase is not open yet/);

  // OAuth: the state cookie must round-trip.
  const start = await app.request("/admin/stripe/connect", { headers: h });
  assert.equal(start.status, 303);
  const loc = new URL(start.headers.get("location")!);
  assert.equal(loc.origin + loc.pathname, "https://connect.stripe.com/oauth/authorize");
  assert.equal(loc.searchParams.get("client_id"), "ca_test");
  assert.equal(loc.searchParams.get("redirect_uri"), `${BASE}/admin/stripe/callback`);
  const state = loc.searchParams.get("state")!;
  const stateCookie = start.headers.get("set-cookie")!.split(";")[0]!;
  const badState = await app.request(`/admin/stripe/callback?code=ac_1&state=wrong`, { headers: { cookie: `${cookie}; ${stateCookie}` } });
  assert.match(badState.headers.get("location")!, /state%20mismatch/);
  assert.equal(payments.accounts.get(DEMO_DID), null);
  const cb = await app.request(`/admin/stripe/callback?code=ac_1&state=${state}`, { headers: { cookie: `${cookie}; ${stateCookie}` } });
  assert.match(cb.headers.get("location")!, /Connected%20Stripe%20account%20acct_1FromOAuth/);
  assert.equal(payments.accounts.get(DEMO_DID)!.accountId, "acct_1FromOAuth");
  assert.match(await (await app.request(EVENT_PATH)).text(), /Buy tickets/);

  const off = await app.request("/admin/stripe/disconnect", { method: "POST", headers: h });
  assert.equal(off.status, 303);
  assert.equal(payments.accounts.get(DEMO_DID), null);

  // Manual id entry (the test-mode path).
  const bad = await app.request("/admin/stripe/account", { method: "POST", headers: h, body: new URLSearchParams({ accountId: "nonsense" }) });
  assert.equal(bad.status, 400);
  const ok = await app.request("/admin/stripe/account", { method: "POST", headers: h, body: new URLSearchParams({ accountId: ACCT }) });
  assert.equal(ok.status, 303);
  assert.equal(payments.accounts.get(DEMO_DID)!.accountId, ACCT);
  // Not in the public export or the signed bundle.
  assert.doesNotMatch(await (await app.request(`/export/${DEMO_DID}/public.json`)).text(), new RegExp(ACCT));
  assert.doesNotMatch(await (await app.request("/admin/export.json", { headers: h })).text(), new RegExp(ACCT));
  assert.equal(store.list(DEMO_DID, C.organization)[0]!.record["stripeAccount"], undefined);
});

test("webhook signature helpers match Stripe's scheme and reject tampering", () => {
  const body = JSON.stringify({ id: "evt_1", type: "x", data: { object: {} } });
  const ts = 1_797_379_200;
  const header = signatureHeader(WHSEC, body, ts);
  assert.match(header, /^t=1797379200,v1=[0-9a-f]{64}$/);
  assert.equal(constructWebhookEvent(body, header, WHSEC, { now: ts + 10 }).id, "evt_1");
  assert.throws(() => constructWebhookEvent(body + " ", header, WHSEC, { now: ts }), /mismatch/);
  assert.throws(() => constructWebhookEvent(body, header, WHSEC, { now: ts + 301 }), /tolerance/);
  assert.throws(() => constructWebhookEvent(body, undefined, WHSEC), /missing/);
  assert.throws(() => constructWebhookEvent(body, "t=abc", WHSEC), /malformed/);
  assert.equal(formEncode({ a: { b: [1, "x y"] }, c: true, d: null }), "a%5Bb%5D%5B0%5D=1&a%5Bb%5D%5B1%5D=x%20y&c=true");
});
