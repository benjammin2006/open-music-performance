// Organizer authentication. v1 interim: one organizer key per organization (random, shown once, stored hashed)
// exchanged for a session cookie. Passkeys are the planned replacement and will issue sessions through the
// same table (docs/ARCHITECTURE.md 5.1).
import type { DatabaseSync } from "node:sqlite";
import { bytesToHex, sha256, utf8 } from "@omp/tickets";

const SESSION_DAYS = 30;

export class Auth {
  private db: DatabaseSync;
  constructor(db: DatabaseSync) {
    this.db = db;
    db.exec(`
      CREATE TABLE IF NOT EXISTS organizer_keys (key_hash TEXT PRIMARY KEY, did TEXT NOT NULL, label TEXT, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, did TEXT NOT NULL, created_at TEXT NOT NULL, expires_at TEXT NOT NULL);
    `);
  }

  /** Create an organizer key for a DID. Returns the plaintext key once; only its hash is stored. */
  async issueKey(did: string, label = "default", plaintext?: string): Promise<string> {
    const key = plaintext ?? randomToken();
    this.db.prepare("INSERT OR REPLACE INTO organizer_keys (key_hash, did, label, created_at) VALUES (?, ?, ?, ?)").run(await hash(key), did, label, new Date().toISOString());
    return key;
  }

  async didForKey(key: string): Promise<string | null> {
    if (!key) return null;
    const row = this.db.prepare("SELECT did FROM organizer_keys WHERE key_hash = ?").get(await hash(key)) as { did: string } | undefined;
    return row?.did ?? null;
  }

  async createSession(did: string): Promise<string> {
    const token = randomToken();
    const now = Date.now();
    this.db.prepare("INSERT INTO sessions (token_hash, did, created_at, expires_at) VALUES (?, ?, ?, ?)").run(await hash(token), did, new Date(now).toISOString(), new Date(now + SESSION_DAYS * 86400000).toISOString());
    return token;
  }

  async didForSession(token: string | undefined): Promise<string | null> {
    if (!token) return null;
    const row = this.db.prepare("SELECT did, expires_at FROM sessions WHERE token_hash = ?").get(await hash(token)) as { did: string; expires_at: string } | undefined;
    if (!row) return null;
    if (row.expires_at < new Date().toISOString()) { this.db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(await hash(token)); return null; }
    return row.did;
  }

  async destroySession(token: string | undefined): Promise<void> {
    if (token) this.db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(await hash(token));
  }
}

export function randomToken(): string {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return bytesToHex(b);
}

async function hash(s: string): Promise<string> {
  return bytesToHex(await sha256(utf8.encode(s)));
}
