// Content ids for records. STUBBORN_FACT: v1 computes CIDs as raw-codec (0x55) sha256 over canonical JSON,
// not dag-cbor as a PDS would. Strong refs are therefore internally consistent but will be recomputed when
// records are mirrored to a PDS in stage 3 (docs/ARCHITECTURE.md section 8). Switching to dag-cbor is a
// one-file change here plus a re-seed.
import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.keys(v as object).sort().map((k) => [k, sortKeys((v as Record<string, unknown>)[k])]));
  }
  return v;
}

export async function cidForRecord(record: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalJson(record));
  return CID.createV1(0x55, await sha256.digest(bytes)).toString();
}
