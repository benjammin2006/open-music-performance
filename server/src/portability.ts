// Export, verify and import of an organization's records as one signed JSON bundle.
// The instance signs the bundle with its own Ed25519 key (published at /.well-known/omp.json) so a recipient
// can check the file was not altered in transit. Secrets never leave: no organizer keys, sessions, door codes
// or issuer private keys. Importing provisions fresh ones and keeps the old public keys so old tickets verify.
import type { DatabaseSync } from "node:sqlite";
import { base64urlDecode, base64urlEncode, exportPrivateKeyJwk, generateIssuerKey, importPrivateKeyJwk, importPublicKey, utf8 } from "@omp/tickets";
import { canonicalJson } from "./cid.ts";
import { C, NS } from "./lexicons.ts";
import type { IssuerKeys } from "./keys.ts";
import type { Auth } from "./auth.ts";
import { ValidationError, type RecordStore } from "./records.ts";

export const EXPORT_FORMAT = "org.openmusicperformance.export/1";

export interface ExportBundle {
  format: typeof EXPORT_FORMAT;
  exportedAt: string;
  instance: string;
  did: string;
  records: { uri: string; cid: string; value: Record<string, unknown> }[];
  signature?: { kid: string; alg: "Ed25519"; publicKeyMultibase: string; sig: string };
}

const ALL_COLLECTIONS = [C.organization, C.act, C.event, C.performance, C.ticketClass, C.order, C.ticket, C.doorScan, C.program, C.donation];

/** The instance's signing key, created on first use. */
export class InstanceKey {
  private db: DatabaseSync;
  constructor(db: DatabaseSync) {
    this.db = db;
    db.exec("CREATE TABLE IF NOT EXISTS instance_keys (kid TEXT PRIMARY KEY, jwk TEXT NOT NULL, public_multibase TEXT NOT NULL, created_at TEXT NOT NULL)");
  }
  async get(): Promise<{ kid: string; privateKey: CryptoKey; publicKeyMultibase: string }> {
    const row = this.db.prepare("SELECT kid, jwk, public_multibase FROM instance_keys WHERE kid = 'instance'").get() as { kid: string; jwk: string; public_multibase: string } | undefined;
    if (row) return { kid: row.kid, privateKey: await importPrivateKeyJwk(JSON.parse(row.jwk)), publicKeyMultibase: row.public_multibase };
    const k = await generateIssuerKey("instance");
    this.db.prepare("INSERT INTO instance_keys (kid, jwk, public_multibase, created_at) VALUES ('instance', ?, ?, ?)").run(JSON.stringify(await exportPrivateKeyJwk(k.privateKey)), k.publicKeyMultibase, new Date().toISOString());
    return { kid: "instance", privateKey: k.privateKey, publicKeyMultibase: k.publicKeyMultibase };
  }
}

function signingBytes(b: ExportBundle): Uint8Array {
  const { signature: _s, ...rest } = b;
  return utf8.encode(canonicalJson(rest));
}

export async function exportBundle(store: RecordStore, instanceKey: InstanceKey, did: string, instance: string): Promise<ExportBundle> {
  const records = ALL_COLLECTIONS.flatMap((col) => store.list(did, col, 1_000_000)).map((r) => ({ uri: r.uri, cid: r.cid, value: r.record }));
  const bundle: ExportBundle = { format: EXPORT_FORMAT, exportedAt: new Date().toISOString(), instance, did, records };
  const key = await instanceKey.get();
  const sig = new Uint8Array(await crypto.subtle.sign("Ed25519", key.privateKey, signingBytes(bundle) as BufferSource));
  bundle.signature = { kid: key.kid, alg: "Ed25519", publicKeyMultibase: key.publicKeyMultibase, sig: base64urlEncode(sig) };
  return bundle;
}

export async function verifyBundle(bundle: unknown): Promise<{ ok: true; bundle: ExportBundle } | { ok: false; reason: string }> {
  const b = bundle as ExportBundle;
  if (!b || b.format !== EXPORT_FORMAT || typeof b.did !== "string" || !Array.isArray(b.records)) return { ok: false, reason: "not an OMP export bundle" };
  if (!b.signature) return { ok: false, reason: "bundle is unsigned" };
  try {
    const key = await importPublicKey(b.signature.publicKeyMultibase);
    const ok = await crypto.subtle.verify("Ed25519", key, base64urlDecode(b.signature.sig) as BufferSource, signingBytes(b) as BufferSource);
    return ok ? { ok: true, bundle: b } : { ok: false, reason: "signature does not match the contents (altered?)" };
  } catch (e) {
    return { ok: false, reason: `bad signature encoding: ${(e as Error).message}` };
  }
}

export interface ImportResult { did: string; imported: number; skipped: { uri: string; reason: string }[]; organizerKey: string; issuerKid: string }

/** Load a verified bundle into a store under its original DID, then provision fresh secrets for the organization. */
export async function importBundle(bundle: ExportBundle, store: RecordStore, keys: IssuerKeys, auth: Auth, opts: { allowUnsigned?: boolean } = {}): Promise<ImportResult> {
  if (!opts.allowUnsigned) {
    const v = await verifyBundle(bundle);
    if (!v.ok) throw new Error(`refusing to import: ${v.reason}`);
  }
  const did = bundle.did;
  const skipped: ImportResult["skipped"] = [];
  let imported = 0;
  let orgRkey: string | null = null;
  const maxSerial = new Map<string, number>();
  // Organizations first so the issuer-key publish below finds the record; everything else in file order.
  const ordered = [...bundle.records].sort((a, b) => Number(b.value["$type"] === C.organization) - Number(a.value["$type"] === C.organization));
  for (const r of ordered) {
    const m = /^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(r.uri);
    if (!m || m[1] !== did || !m[2]!.startsWith(`${NS}.`)) { skipped.push({ uri: r.uri, reason: "uri outside the bundle's DID or namespace" }); continue; }
    const { $type: _t, ...value } = r.value;
    try {
      await store.put(did, m[2]!, value, m[3]!);
      imported++;
      if (m[2] === C.organization) orgRkey = m[3]!;
      if (m[2] === C.ticket) {
        const ev = (value as { event?: { uri: string } }).event?.uri;
        const serial = (value as { serial?: number }).serial ?? 0;
        if (ev) maxSerial.set(ev, Math.max(maxSerial.get(ev) ?? -1, serial));
      }
    } catch (e) {
      if (e instanceof ValidationError) skipped.push({ uri: r.uri, reason: e.message }); else throw e;
    }
  }
  for (const [ev, max] of maxSerial) store.setSerialFloor(ev, max + 1);
  if (!orgRkey) throw new Error("bundle has no organization record");
  const issuerKid = `imported-${new Date().toISOString().slice(0, 10)}`;
  await keys.provision(did, orgRkey, issuerKid); // appends; earlier public keys stay so old tickets still verify
  const organizerKey = await auth.issueKey(did, "imported");
  return { did, imported, skipped, organizerKey, issuerKid };
}
