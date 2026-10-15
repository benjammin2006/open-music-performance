// The record store: AT-shaped (did, collection, rkey) addressing, lexicon-validated writes, strong refs by CID.
import type { DatabaseSync } from "node:sqlite";
import { jsonToLex, type Lexicons } from "@atproto/lexicon";
import { cidForRecord } from "./cid.ts";
import { nextTid, isTid } from "./tid.ts";

export interface Stored<T = Record<string, unknown>> {
  uri: string;
  did: string;
  collection: string;
  rkey: string;
  cid: string;
  record: T;
  createdAt: string;
  updatedAt: string;
}

export class ValidationError extends Error {}

export class RecordStore {
  private db: DatabaseSync;
  private lex: Lexicons;
  constructor(db: DatabaseSync, lex: Lexicons) {
    this.db = db;
    this.lex = lex;
  }

  validate(collection: string, record: Record<string, unknown>): void {
    const withType = { ...record, $type: collection };
    try {
      this.lex.assertValidRecord(collection, jsonToLex(withType));
    } catch (e) {
      throw new ValidationError((e as Error).message);
    }
  }

  async put<T = Record<string, unknown>>(did: string, collection: string, record: Record<string, unknown>, rkey = nextTid()): Promise<Stored<T>> {
    if (!isTid(rkey) && !/^[A-Za-z0-9._:~-]{1,512}$/.test(rkey)) throw new ValidationError(`bad rkey ${rkey}`);
    const rec = { ...record, $type: collection };
    this.validate(collection, rec);
    const cid = await cidForRecord(rec);
    const now = new Date().toISOString();
    const json = JSON.stringify(rec);
    this.db
      .prepare(
        `INSERT INTO records (did, collection, rkey, cid, json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(did, collection, rkey) DO UPDATE SET cid = excluded.cid, json = excluded.json, updated_at = excluded.updated_at`,
      )
      .run(did, collection, rkey, cid, json, now, now);
    return this.get<T>(did, collection, rkey)!;
  }

  get<T = Record<string, unknown>>(did: string, collection: string, rkey: string): Stored<T> | null {
    const row = this.db
      .prepare("SELECT * FROM records WHERE did = ? AND collection = ? AND rkey = ?")
      .get(did, collection, rkey) as Row | undefined;
    return row ? toStored<T>(row) : null;
  }

  getByUri<T = Record<string, unknown>>(uri: string): Stored<T> | null {
    const parsed = parseUri(uri);
    return parsed ? this.get<T>(parsed.did, parsed.collection, parsed.rkey) : null;
  }

  list<T = Record<string, unknown>>(did: string | null, collection: string, limit = 100): Stored<T>[] {
    const rows = (did
      ? this.db.prepare("SELECT * FROM records WHERE did = ? AND collection = ? ORDER BY created_at DESC LIMIT ?").all(did, collection, limit)
      : this.db.prepare("SELECT * FROM records WHERE collection = ? ORDER BY created_at DESC LIMIT ?").all(collection, limit)) as unknown as Row[];
    return rows.map((r) => toStored<T>(r));
  }

  /** All records in a collection whose JSON contains the given strong-ref uri (cheap filter for "children of event"). */
  listReferencing<T = Record<string, unknown>>(collection: string, uri: string, limit = 1000): Stored<T>[] {
    const rows = this.db
      .prepare("SELECT * FROM records WHERE collection = ? AND instr(json, ?) > 0 ORDER BY created_at ASC LIMIT ?")
      .all(collection, `"${uri}"`, limit) as unknown as Row[];
    return rows.map((r) => toStored<T>(r)).filter((s) => JSON.stringify(s.record).includes(`"${uri}"`));
  }

  nextSerial(eventUri: string): number {
    this.db.prepare("INSERT INTO serials (event_uri, next) VALUES (?, 1) ON CONFLICT(event_uri) DO UPDATE SET next = next + 1").run(eventUri);
    const row = this.db.prepare("SELECT next FROM serials WHERE event_uri = ?").get(eventUri) as { next: number };
    return row.next - 1;
  }

  countReferencing(collection: string, uri: string): number {
    return this.listReferencing(collection, uri, 100_000).length;
  }
}

interface Row { did: string; collection: string; rkey: string; cid: string; json: string; created_at: string; updated_at: string }

function toStored<T>(r: Row): Stored<T> {
  return { uri: makeUri(r.did, r.collection, r.rkey), did: r.did, collection: r.collection, rkey: r.rkey, cid: r.cid, record: JSON.parse(r.json) as T, createdAt: r.created_at, updatedAt: r.updated_at };
}

export function makeUri(did: string, collection: string, rkey: string): string {
  return `at://${did}/${collection}/${rkey}`;
}

export function parseUri(uri: string): { did: string; collection: string; rkey: string } | null {
  const m = /^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(uri);
  return m ? { did: m[1]!, collection: m[2]!, rkey: m[3]! } : null;
}

export function strongRef<T>(s: Stored<T>): { uri: string; cid: string } {
  return { uri: s.uri, cid: s.cid };
}
