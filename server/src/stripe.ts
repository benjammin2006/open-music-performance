// A thin Stripe REST client: form-encoded requests, the Stripe-Account header for direct charges on a
// connected account, Connect OAuth token exchange, and webhook signature verification. No SDK, so the test
// suite can swap the transport for a fake and the dependency surface stays at zero.
//
// STUBBORN_FACT: no request here ever sets on_behalf_of or application_fee_amount. The connected account is
// the merchant of record (docs/ARCHITECTURE.md 5.5); adding either parameter changes who that is.
import { createHmac, timingSafeEqual } from "node:crypto";

export type Transport = (url: string, init: { method: string; headers: Record<string, string>; body?: string }) => Promise<{ status: number; text(): Promise<string> }>;

export interface CheckoutSession {
  id: string;
  url?: string | null;
  status?: "open" | "complete" | "expired";
  payment_status?: "paid" | "unpaid" | "no_payment_required";
  amount_total?: number | null;
  currency?: string | null;
  client_reference_id?: string | null;
  customer_details?: { email?: string | null; name?: string | null } | null;
  payment_intent?: string | null;
  metadata?: Record<string, string> | null;
  expires_at?: number;
}

export interface WebhookEvent { id: string; type: string; account?: string; livemode?: boolean; created?: number; data: { object: Record<string, unknown> } }

export class StripeError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    if (code) this.code = code;
  }
}

export interface StripeOptions { secretKey: string; clientId?: string; transport?: Transport; apiBase?: string; connectBase?: string }

export class Stripe {
  private secretKey: string;
  private clientId: string | undefined;
  private transport: Transport;
  private apiBase: string;
  private connectBase: string;
  constructor(o: StripeOptions) {
    this.secretKey = o.secretKey;
    this.clientId = o.clientId;
    this.transport = o.transport ?? ((url, init) => fetch(url, init));
    this.apiBase = o.apiBase ?? "https://api.stripe.com";
    this.connectBase = o.connectBase ?? "https://connect.stripe.com";
  }

  get livemode(): boolean { return this.secretKey.startsWith("sk_live_") || this.secretKey.startsWith("rk_live_"); }
  get hasOAuth(): boolean { return Boolean(this.clientId); }

  /** Create a Checkout Session as a direct charge on `account`. */
  createCheckoutSession(account: string, params: Record<string, unknown>, idempotencyKey: string): Promise<CheckoutSession> {
    return this.request<CheckoutSession>("POST", "/v1/checkout/sessions", params, { account, idempotencyKey });
  }
  getCheckoutSession(account: string, id: string): Promise<CheckoutSession> {
    return this.request<CheckoutSession>("GET", `/v1/checkout/sessions/${encodeURIComponent(id)}`, undefined, { account });
  }
  expireCheckoutSession(account: string, id: string): Promise<CheckoutSession> {
    return this.request<CheckoutSession>("POST", `/v1/checkout/sessions/${encodeURIComponent(id)}/expire`, {}, { account });
  }

  /** Connect Standard OAuth: where to send the organizer to authorize this instance. */
  authorizeUrl(redirectUri: string, state: string): string {
    if (!this.clientId) throw new Error("OMP_STRIPE_CLIENT_ID is not set");
    const q = new URLSearchParams({ response_type: "code", client_id: this.clientId, scope: "read_write", state, redirect_uri: redirectUri });
    return `${this.connectBase}/oauth/authorize?${q}`;
  }
  async exchangeOAuthCode(code: string): Promise<{ accountId: string; livemode: boolean }> {
    const r = await this.request<{ stripe_user_id: string; livemode: boolean }>("POST", "/oauth/token", { grant_type: "authorization_code", code }, { base: this.connectBase, secretInBody: true });
    return { accountId: r.stripe_user_id, livemode: Boolean(r.livemode) };
  }
  async deauthorize(accountId: string): Promise<void> {
    if (!this.clientId) return;
    await this.request("POST", "/oauth/deauthorize", { client_id: this.clientId, stripe_user_id: accountId }, { base: this.connectBase });
  }

  private async request<T>(method: string, path: string, params?: Record<string, unknown>, o: { account?: string; idempotencyKey?: string; base?: string; secretInBody?: boolean } = {}): Promise<T> {
    const headers: Record<string, string> = { Authorization: `Bearer ${this.secretKey}`, Accept: "application/json" };
    if (o.account) headers["Stripe-Account"] = o.account;
    if (o.idempotencyKey) headers["Idempotency-Key"] = o.idempotencyKey;
    let body: string | undefined;
    if (params) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      body = formEncode(o.secretInBody ? { ...params, client_secret: this.secretKey } : params);
    }
    const res = await this.transport(`${o.base ?? this.apiBase}${path}`, body === undefined ? { method, headers } : { method, headers, body });
    const text = await res.text();
    let json: unknown;
    try { json = JSON.parse(text); } catch { json = {}; }
    if (res.status >= 400) {
      const err = (json as { error?: { message?: string; code?: string }; error_description?: string }) ?? {};
      throw new StripeError(err.error?.message ?? err.error_description ?? `Stripe ${res.status}`, res.status, err.error?.code);
    }
    return json as T;
  }
}

/** Stripe's nested form encoding: { a: { b: [x] } } → a[b][0]=x. Booleans and numbers stringify. */
export function formEncode(params: Record<string, unknown>): string {
  const pairs: string[] = [];
  const walk = (key: string, v: unknown) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((item, i) => walk(`${key}[${i}]`, item));
    else if (typeof v === "object") for (const [k, item] of Object.entries(v as Record<string, unknown>)) walk(`${key}[${k}]`, item);
    else pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  };
  for (const [k, v] of Object.entries(params)) walk(k, v);
  return pairs.join("&");
}

/** Verify a Stripe-Signature header against the raw body and return the parsed event. Throws on any failure. */
export function constructWebhookEvent(rawBody: string, signatureHeader: string | undefined, secret: string, opts: { toleranceSeconds?: number; now?: number } = {}): WebhookEvent {
  if (!signatureHeader) throw new StripeError("missing Stripe-Signature header", 400);
  const parts = Object.create(null) as Record<string, string[]>;
  for (const kv of signatureHeader.split(",")) {
    const i = kv.indexOf("=");
    if (i < 0) continue;
    const k = kv.slice(0, i).trim(), v = kv.slice(i + 1).trim();
    (parts[k] ??= []).push(v);
  }
  const t = Number(parts["t"]?.[0]);
  const sigs = parts["v1"] ?? [];
  if (!Number.isFinite(t) || sigs.length === 0) throw new StripeError("malformed Stripe-Signature header", 400);
  const expected = signPayload(secret, t, rawBody);
  const ok = sigs.some((s) => s.length === expected.length && timingSafeEqual(Buffer.from(s, "hex"), Buffer.from(expected, "hex")));
  if (!ok) throw new StripeError("webhook signature mismatch", 400);
  const now = opts.now ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - t) > (opts.toleranceSeconds ?? 300)) throw new StripeError("webhook timestamp outside tolerance", 400);
  return JSON.parse(rawBody) as WebhookEvent;
}

export function signPayload(secret: string, timestamp: number, rawBody: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
}

/** Build a Stripe-Signature header for a payload (tests and the local replay tool). */
export function signatureHeader(secret: string, rawBody: string, timestamp = Math.floor(Date.now() / 1000)): string {
  return `t=${timestamp},v1=${signPayload(secret, timestamp, rawBody)}`;
}
