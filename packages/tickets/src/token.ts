// The compact signed ticket token carried in the QR code.
//
//   OMP1.<base64url(JSON claims)>.<base64url(Ed25519 signature)>
//
// The signature covers the ASCII bytes of "OMP1.<payload>" exactly as transmitted, so there is no
// canonicalization step to get wrong. Claims use short keys to keep the QR small (target: under 400 chars).
import { base64urlDecode, base64urlEncode, bytesToHex, sha256, utf8 } from "./encoding.ts";
import { importPublicKey } from "./keys.ts";
import type { StatusList } from "./statusList.ts";

export const TOKEN_PREFIX = "OMP1";

export interface TicketClaims {
  /** Token format version. Always 1. */
  v: 1;
  /** Issuer organization DID. */
  org: string;
  /** Issuer key id, matching `issuerKeys[].kid` on the organization record. */
  iss: string;
  /** Event record key. */
  evt: string;
  /** Ticket class record key. */
  cls: string;
  /** Ticket record key. Unique per ticket; the door ledger keys on it. */
  tid: string;
  /** Serial within the event; its bit in the status list marks revocation. */
  ser: number;
  /** Expiry, unix seconds (event end plus grace). */
  exp: number;
  /** Not before, unix seconds. Optional. */
  nbf?: number;
  /** Short holder binding: first 24 hex chars of sha256(lowercased email) or of the holder public key. Optional. */
  hb?: string;
}

export type VerifyFailure =
  | "malformed"
  | "unsupported-version"
  | "unknown-key"
  | "bad-signature"
  | "not-yet-valid"
  | "expired"
  | "revoked";

export type VerifyResult = { ok: true; claims: TicketClaims } | { ok: false; reason: VerifyFailure; claims?: TicketClaims };

export interface SignOptions {
  privateKey: CryptoKey;
}

export interface VerifyOptions {
  /** Resolve an issuer's public key. Return null if the (org, kid) pair is unknown. Scanners pre-sync this. */
  resolveKey: (org: string, kid: string) => Promise<string | CryptoKey | null>;
  /** Current time in unix seconds. Defaults to Date.now()/1000. Injectable for tests and clock skew policy. */
  now?: number;
  /** Per-event status list; a set bit at `ser` means revoked. Optional. */
  statusList?: StatusList;
  /** Seconds of clock skew to tolerate on nbf/exp. Default 60. */
  skewSeconds?: number;
}

export async function signTicket(claims: TicketClaims, opts: SignOptions): Promise<string> {
  assertClaimsShape(claims);
  const payload = base64urlEncode(utf8.encode(JSON.stringify(claims)));
  const signingInput = `${TOKEN_PREFIX}.${payload}`;
  const sig = new Uint8Array(await crypto.subtle.sign("Ed25519", opts.privateKey, utf8.encode(signingInput) as BufferSource));
  return `${signingInput}.${base64urlEncode(sig)}`;
}

/** Parse without verifying. Use only for display or to find the issuer before key lookup. */
export function parseTicket(token: string): { claims: TicketClaims; signingInput: string; signature: Uint8Array } | null {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) return null;
  const [prefix, payload, sig] = parts as [string, string, string];
  let claims: unknown;
  try {
    claims = JSON.parse(utf8.decode(base64urlDecode(payload)));
  } catch {
    return null;
  }
  if (!isClaims(claims)) return null;
  let signature: Uint8Array;
  try {
    signature = base64urlDecode(sig);
  } catch {
    return null;
  }
  return { claims, signingInput: `${prefix}.${payload}`, signature };
}

export async function verifyTicket(token: string, opts: VerifyOptions): Promise<VerifyResult> {
  const parsed = parseTicket(token);
  if (!parsed) return { ok: false, reason: "malformed" };
  const { claims, signingInput, signature } = parsed;
  if (claims.v !== 1) return { ok: false, reason: "unsupported-version", claims };

  const resolved = await opts.resolveKey(claims.org, claims.iss);
  if (!resolved) return { ok: false, reason: "unknown-key", claims };
  const key = typeof resolved === "string" ? await importPublicKey(resolved) : resolved;

  const valid = await crypto.subtle.verify("Ed25519", key, signature as BufferSource, utf8.encode(signingInput) as BufferSource);
  if (!valid) return { ok: false, reason: "bad-signature", claims };

  const now = opts.now ?? Math.floor(Date.now() / 1000);
  const skew = opts.skewSeconds ?? 60;
  if (claims.nbf !== undefined && now + skew < claims.nbf) return { ok: false, reason: "not-yet-valid", claims };
  if (now - skew > claims.exp) return { ok: false, reason: "expired", claims };

  if (opts.statusList && opts.statusList.get(claims.ser)) return { ok: false, reason: "revoked", claims };
  return { ok: true, claims };
}

/** Full binding for the ticket record (`holderBinding`), and the short form carried in the token (`hb`). */
export async function holderBindingFromEmail(email: string): Promise<{ full: string; short: string }> {
  const hex = bytesToHex(await sha256(utf8.encode(email.trim().toLowerCase())));
  return { full: `sha256:${hex}`, short: hex.slice(0, 24) };
}

function isClaims(x: unknown): x is TicketClaims {
  if (typeof x !== "object" || x === null) return false;
  const c = x as Record<string, unknown>;
  const str = (k: string) => typeof c[k] === "string" && (c[k] as string).length > 0 && (c[k] as string).length <= 256;
  const int = (k: string) => Number.isInteger(c[k]) && (c[k] as number) >= 0;
  return (
    c["v"] === 1 && str("org") && str("iss") && str("evt") && str("cls") && str("tid") && int("ser") && int("exp") &&
    (c["nbf"] === undefined || int("nbf")) &&
    (c["hb"] === undefined || (typeof c["hb"] === "string" && /^[0-9a-f]{24}$/.test(c["hb"] as string)))
  );
}

function assertClaimsShape(claims: TicketClaims): void {
  if (!isClaims(claims)) throw new Error("invalid ticket claims");
}
