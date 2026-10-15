import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** The monorepo root (server/src/db.ts → ../../). Relative DB paths resolve here unless OMP_ROOT overrides. */
const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));

/** Relative paths resolve against OMP_ROOT if set, else the repo root, so every workspace and launcher hits the same file. */
export function resolveDbPath(path: string): string {
  if (path === ":memory:" || isAbsolute(path)) return path;
  return resolve(process.env["OMP_ROOT"] ?? REPO_ROOT, path);
}

export function openDb(rawPath: string): DatabaseSync {
  const path = resolveDbPath(rawPath);
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  migrate(db);
  return db;
}

function migrate(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      did        TEXT NOT NULL,
      collection TEXT NOT NULL,
      rkey       TEXT NOT NULL,
      cid        TEXT NOT NULL,
      json       TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (did, collection, rkey)
    );
    CREATE INDEX IF NOT EXISTS records_collection_created ON records (collection, created_at);
    CREATE INDEX IF NOT EXISTS records_did_collection ON records (did, collection);

    -- Issuer private keys. TODO before any non-demo deployment: encrypt jwk at rest with a KMS or passphrase key.
    CREATE TABLE IF NOT EXISTS issuer_keys (
      did        TEXT NOT NULL,
      kid        TEXT NOT NULL,
      jwk        TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (did, kid)
    );

    -- Per-event door codes: the shared secret door staff enter in the scanner. Rotate by inserting a new row.
    CREATE TABLE IF NOT EXISTS door_codes (
      event_uri  TEXT NOT NULL,
      code       TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (event_uri, code)
    );

    -- Per-event ticket serial counter; serial is the bit index in the event's status list.
    CREATE TABLE IF NOT EXISTS serials (
      event_uri TEXT PRIMARY KEY,
      next      INTEGER NOT NULL
    );
  `);
}
