// The scanner's decision logic, free of DOM and camera code so it can be tested in Node.
// A Door is built from a DoorPack synced once while online; after that every decision is local.
import { DoorLedger, StatusList, verifyTicket, type LedgerEntry, type TicketClaims } from "@omp/tickets";

export interface DoorPack {
  event: { did: string; rkey: string; uri: string; title: string; startsAt: string; timezone: string; location: string };
  issuerKeys: { kid: string; publicKeyMultibase: string }[];
  statusList: { size: number; encodedList: string };
  classes: { rkey: string; name: string; kind: string }[];
  tickets: { tid: string; serial: number; holder: string; classRkey: string; status: string }[];
  syncedAt: string;
}

export type ScanResult = "admitted" | "duplicate" | "invalid" | "revoked" | "expired" | "manualAdmit" | "cashAdmit" | "compAdmit" | "denied";

/** One row of the scan log, mirroring org.openmusicperformance.doorScan minus the event ref the server adds. */
export interface ScanEntry {
  nonce: string;
  ticketTid?: string;
  scannerId: string;
  result: ScanResult;
  offline: boolean;
  cashCollected?: { amountCents: number; currency: string };
  note?: string;
  scannedAt: string;
  uploaded?: boolean;
}

export interface Decision {
  result: ScanResult;
  headline: string;
  detail: string;
  holder?: string;
  className?: string;
  serial?: number;
  entry: ScanEntry;
}

export interface DoorState {
  pack: DoorPack;
  ledger: LedgerEntry[];
  outbox: ScanEntry[];
  scannerId: string;
}

export class Door {
  readonly pack: DoorPack;
  readonly ledger: DoorLedger;
  readonly outbox: ScanEntry[];
  readonly scannerId: string;
  private statusList: StatusList;
  private keyByKid: Map<string, string>;
  private ticketByTid: Map<string, DoorPack["tickets"][number]>;
  private classByRkey: Map<string, DoorPack["classes"][number]>;
  private lastToken: { token: string; at: number } | null = null;
  online = false;

  private constructor(state: DoorState, statusList: StatusList) {
    this.pack = state.pack;
    this.ledger = new DoorLedger(state.scannerId, state.ledger);
    this.outbox = [...state.outbox];
    this.scannerId = state.scannerId;
    this.statusList = statusList;
    this.keyByKid = new Map(state.pack.issuerKeys.map((k) => [k.kid, k.publicKeyMultibase]));
    this.ticketByTid = new Map(state.pack.tickets.map((t) => [t.tid, t]));
    this.classByRkey = new Map(state.pack.classes.map((c) => [c.rkey, c]));
  }

  static async open(state: DoorState): Promise<Door> {
    return new Door(state, await StatusList.decode(state.pack.statusList));
  }

  /** Replace the pack after a re-sync, keeping the ledger and outbox. */
  async resync(pack: DoorPack): Promise<Door> {
    return Door.open({ pack, ledger: this.ledger.export(), outbox: this.outbox, scannerId: this.scannerId });
  }

  toState(): DoorState {
    return { pack: this.pack, ledger: this.ledger.export(), outbox: this.outbox, scannerId: this.scannerId };
  }

  /** Verify a scanned token and decide. Repeated reads of the same code within 3 s are ignored (camera jitter). */
  async scan(token: string, now: Date = new Date()): Promise<Decision | null> {
    const t = token.trim();
    if (this.lastToken && this.lastToken.token === t && now.getTime() - this.lastToken.at < 3000) return null;
    this.lastToken = { token: t, at: now.getTime() };

    const r = await verifyTicket(t, {
      resolveKey: async (org, kid) => (org === this.pack.event.did ? this.keyByKid.get(kid) ?? null : null),
      now: Math.floor(now.getTime() / 1000),
      statusList: this.statusList,
    });
    const claims = r.ok ? r.claims : r.claims;
    const known = claims ? this.ticketByTid.get(claims.tid) : undefined;
    const holder = known?.holder;
    const className = claims ? this.classByRkey.get(claims.cls)?.name : undefined;

    if (!r.ok) {
      const map: Record<string, { result: ScanResult; headline: string; detail: string }> = {
        malformed: { result: "invalid", headline: "Not a ticket", detail: "This code is not an OMP ticket." },
        "unsupported-version": { result: "invalid", headline: "Not a ticket", detail: "Unsupported ticket format." },
        "unknown-key": { result: "invalid", headline: "Not this event", detail: "Signed by an unknown key. Wrong event, or re-sync." },
        "bad-signature": { result: "invalid", headline: "Invalid ticket", detail: "Signature does not match. Possibly altered." },
        "not-yet-valid": { result: "denied", headline: "Not yet valid", detail: "This ticket is not valid yet." },
        expired: { result: "expired", headline: "Expired", detail: "This ticket's event window has passed." },
        revoked: { result: "revoked", headline: "Refunded or cancelled", detail: "This ticket was revoked before doors." },
      };
      const m = map[r.reason] ?? map["malformed"]!;
      return this.record({ ...m, holder, className, serial: claims?.ser, ticketTid: claims?.tid }, now);
    }

    if (claims && claims.evt !== this.pack.event.rkey) {
      return this.record({ result: "denied", headline: "Wrong event", detail: "Valid ticket, but for a different event.", holder, className, serial: claims.ser, ticketTid: claims.tid }, now);
    }

    const admit = this.ledger.admit(claims!.tid, now);
    if (admit.result === "duplicate") {
      const when = new Date(admit.first.scannedAt);
      return this.record({ result: "duplicate", headline: "Already used", detail: `Admitted ${timeAgo(when, now)} at ${admit.first.scannerId}.`, holder, className, serial: claims!.ser, ticketTid: claims!.tid }, now);
    }
    return this.record({ result: "admitted", headline: "Admitted", detail: className ? `${className}` : "Valid ticket.", holder, className, serial: claims!.ser, ticketTid: claims!.tid }, now);
  }

  /** Admit from the printed/door list by ticket id, for guests without their code. */
  admitFromList(tid: string, now: Date = new Date()): Decision {
    const t = this.ticketByTid.get(tid);
    if (!t) return this.record({ result: "invalid", headline: "Unknown ticket", detail: "Not on the door list. Re-sync if it was just issued.", ticketTid: tid }, now);
    if (t.status !== "valid" || this.statusList.get(t.serial)) return this.record({ result: "revoked", headline: "Refunded or cancelled", detail: `${t.holder}'s ticket is not valid.`, holder: t.holder, serial: t.serial, ticketTid: tid }, now);
    const admit = this.ledger.admit(tid, now);
    if (admit.result === "duplicate") return this.record({ result: "duplicate", headline: "Already used", detail: `Admitted ${timeAgo(new Date(admit.first.scannedAt), now)}.`, holder: t.holder, serial: t.serial, ticketTid: tid }, now);
    return this.record({ result: "manualAdmit", headline: "Admitted from list", detail: t.holder, holder: t.holder, className: this.classByRkey.get(t.classRkey)?.name, serial: t.serial, ticketTid: tid }, now);
  }

  admitCash(amountCents: number, currency = "USD", now: Date = new Date()): Decision {
    return this.record({ result: "cashAdmit", headline: "Cash admitted", detail: `${(amountCents / 100).toFixed(2)} ${currency} collected.`, cashCollected: { amountCents, currency } }, now);
  }

  admitComp(note = "", now: Date = new Date()): Decision {
    return this.record({ result: "compAdmit", headline: "Comp admitted", detail: note || "Complimentary admission.", note }, now);
  }

  /** Door-list rows with live admitted state, for the list view and the printout. */
  list(): { tid: string; serial: number; holder: string; className: string; status: string; admitted: boolean }[] {
    return this.pack.tickets
      .map((t) => ({ tid: t.tid, serial: t.serial, holder: t.holder, className: this.classByRkey.get(t.classRkey)?.name ?? "", status: this.statusList.get(t.serial) ? "revoked" : t.status, admitted: this.ledger.has(t.tid) }))
      .sort((a, b) => a.holder.localeCompare(b.holder) || a.serial - b.serial);
  }

  counts(): { admitted: number; duplicates: number; invalid: number; cash: number; cashCents: number; comp: number; pending: number; capacityIssued: number } {
    const c = { admitted: 0, duplicates: 0, invalid: 0, cash: 0, cashCents: 0, comp: 0, pending: 0, capacityIssued: this.pack.tickets.length };
    for (const e of this.outbox) {
      if (!e.uploaded) c.pending++;
      if (e.result === "admitted" || e.result === "manualAdmit") c.admitted++;
      else if (e.result === "duplicate") c.duplicates++;
      else if (e.result === "cashAdmit") { c.cash++; c.cashCents += e.cashCollected?.amountCents ?? 0; }
      else if (e.result === "compAdmit") c.comp++;
      else c.invalid++;
    }
    return c;
  }

  pendingUploads(): ScanEntry[] {
    return this.outbox.filter((e) => !e.uploaded);
  }

  markUploaded(nonces: Iterable<string>): void {
    const set = new Set(nonces);
    for (const e of this.outbox) if (set.has(e.nonce)) e.uploaded = true;
  }

  /** Every scan entry gets its own nonce, including duplicates: the server keys records by nonce, so reusing one would overwrite the first admission. */
  private record(d: Omit<Decision, "entry"> & { ticketTid?: string; cashCollected?: ScanEntry["cashCollected"]; note?: string }, now: Date): Decision {
    const entry: ScanEntry = {
      nonce: randomNonce(), scannerId: this.scannerId, result: d.result, offline: !this.online, scannedAt: now.toISOString(),
      ...(d.ticketTid ? { ticketTid: d.ticketTid } : {}), ...(d.cashCollected ? { cashCollected: d.cashCollected } : {}), ...(d.note ? { note: d.note } : {}),
    };
    this.outbox.push(entry);
    const { ticketTid: _t, cashCollected: _c, note: _n, ...rest } = d;
    return { ...rest, entry };
  }
}

export function timeAgo(then: Date, now: Date): string {
  const s = Math.max(0, Math.round((now.getTime() - then.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  return `${(s / 3600).toFixed(1)} h ago`;
}

function randomNonce(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

export type { TicketClaims };
