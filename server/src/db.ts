import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function openDb(path: string): DatabaseSync {
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

    -- Per-event ticket serial counter; serial is the bit index in the event's status list.
    CREATE TABLE IF NOT EXISTS serials (
      event_uri TEXT PRIMARY KEY,
      next      INTEGER NOT NULL
    );
  `);
}
