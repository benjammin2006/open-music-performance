// Issuer key service: one Ed25519 key per organization, private half in SQLite (see db.ts TODO on encryption),
// public half published on the organization record so scanners can verify offline.
import type { DatabaseSync } from "node:sqlite";
import { exportPrivateKeyJwk, generateIssuerKey, importPrivateKeyJwk } from "@omp/tickets";
import type { RecordStore } from "./records.ts";
import { C } from "./lexicons.ts";

export class IssuerKeys {
  private db: DatabaseSync;
  private store: RecordStore;
  constructor(db: DatabaseSync, store: RecordStore) {
    this.db = db;
    this.store = store;
  }

  /** Create a key for the org and publish its public half on the organization record. */
  async provision(did: string, orgRkey: string, kid: string): Promise<string> {
    const key = await generateIssuerKey(kid);
    const jwk = JSON.stringify(await exportPrivateKeyJwk(key.privateKey));
    this.db.prepare("INSERT OR REPLACE INTO issuer_keys (did, kid, jwk, created_at) VALUES (?, ?, ?, ?)").run(did, kid, jwk, new Date().toISOString());
    const org = this.store.get(did, C.organization, orgRkey);
    if (!org) throw new Error(`organization ${did}/${orgRkey} not found`);
    const existing = (org.record["issuerKeys"] as unknown[] | undefined) ?? [];
    await this.store.put(did, C.organization, {
      ...org.record,
      issuerKeys: [...existing.filter((k) => (k as { kid: string }).kid !== kid), { kid, alg: "Ed25519", publicKeyMultibase: key.publicKeyMultibase, validFrom: new Date().toISOString() }],
    }, orgRkey);
    return key.publicKeyMultibase;
  }

  async privateKey(did: string, kid: string): Promise<CryptoKey | null> {
    const row = this.db.prepare("SELECT jwk FROM issuer_keys WHERE did = ? AND kid = ?").get(did, kid) as { jwk: string } | undefined;
    return row ? importPrivateKeyJwk(JSON.parse(row.jwk)) : null;
  }

  /** The current signing kid for an org: the last one provisioned. */
  currentKid(did: string): string | null {
    const row = this.db.prepare("SELECT kid FROM issuer_keys WHERE did = ? ORDER BY created_at DESC LIMIT 1").get(did) as { kid: string } | undefined;
    return row?.kid ?? null;
  }

  /** Published public key for (did, kid), from the organization record. Used by verification. */
  publicKeyMultibase(did: string, kid: string): string | null {
    const org = this.store.list<{ issuerKeys?: { kid: string; publicKeyMultibase: string }[] }>(did, C.organization, 1)[0];
    return org?.record.issuerKeys?.find((k) => k.kid === kid)?.publicKeyMultibase ?? null;
  }
}
