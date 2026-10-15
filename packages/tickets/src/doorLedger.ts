// The admitted set a scanner keeps locally. Cryptography proves a ticket is genuine; this proves it has
// not already been used. It is a grow-only set keyed by ticket id, so two scanners can merge their ledgers
// in any order (hub mode or mesh mode in docs/ARCHITECTURE.md 5.4) and reach the same state.
export interface LedgerEntry {
  tid: string;
  scannerId: string;
  nonce: string;
  scannedAt: string;
}

export type AdmitResult = { result: "admitted"; entry: LedgerEntry } | { result: "duplicate"; first: LedgerEntry };

export class DoorLedger {
  private entries = new Map<string, LedgerEntry>();
  readonly scannerId: string;

  constructor(scannerId: string, entries: Iterable<LedgerEntry> = []) {
    this.scannerId = scannerId;
    for (const e of entries) this.absorb(e);
  }

  /** Record an admission. Returns "duplicate" (with the first admission) if the ticket id was already admitted. */
  admit(tid: string, now: Date = new Date()): AdmitResult {
    const first = this.entries.get(tid);
    if (first) return { result: "duplicate", first };
    const entry: LedgerEntry = { tid, scannerId: this.scannerId, nonce: randomNonce(), scannedAt: now.toISOString() };
    this.entries.set(tid, entry);
    return { result: "admitted", entry };
  }

  has(tid: string): boolean {
    return this.entries.has(tid);
  }

  get size(): number {
    return this.entries.size;
  }

  /** Union with another ledger's entries. The earliest scannedAt wins for a given ticket id; idempotent. */
  merge(other: Iterable<LedgerEntry>): number {
    let added = 0;
    for (const e of other) if (this.absorb(e)) added++;
    return added;
  }

  export(): LedgerEntry[] {
    return [...this.entries.values()].sort((a, b) => a.scannedAt.localeCompare(b.scannedAt));
  }

  private absorb(e: LedgerEntry): boolean {
    const existing = this.entries.get(e.tid);
    if (!existing) {
      this.entries.set(e.tid, e);
      return true;
    }
    if (e.scannedAt < existing.scannedAt) this.entries.set(e.tid, e);
    return false;
  }
}

function randomNonce(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
