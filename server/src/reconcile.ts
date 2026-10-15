// The reconciliation sheet: computed, never stored, from orders, tickets, door scans and donations.
// Pure function so it is testable with constructed records and cannot drift from the data.
import type { Stored } from "./records.ts";
import type { Event, Order, Ticket, TicketClass } from "./types.ts";

export interface DoorScanRecord { event: { uri: string }; ticket?: { uri: string }; scannerId: string; nonce: string; result: string; cashCollected?: { amountCents: number; currency: string }; offline?: boolean; note?: string; scannedAt: string }
export interface DonationRecord { event?: { uri: string }; amount: { amountCents: number; currency: string }; donor?: { name: string }; anonymous?: boolean; paymentProvider: string; status: string; createdAt: string }

export type Channel = "card" | "cash" | "free" | "other";

export interface ClassLine { name: string; kind: string; issued: number; admitted: number; noShows: number; card: number; cash: number; refunded: number }
export interface Reconciliation {
  event: { title: string; startsAt: string; timezone: string; uri: string };
  currency: string;
  generatedAt: string;
  classes: ClassLine[];
  tickets: { issued: number; admitted: number; noShows: number; voided: number };
  door: { cashAdmits: number; cashCents: number; compAdmits: number; duplicateAttempts: number; invalidAttempts: number; doubleAdmits: number; offlineScans: number };
  donations: { count: number; card: number; cash: number; other: number };
  money: { cardGross: number; cashGross: number; refunds: number; platformFee: number; net: number; cashToDeposit: number };
  headcount: number;
  scanners: { scannerId: string; scans: number; admitted: number; offline: number }[];
  lines: AttendanceLine[];
}
export interface AttendanceLine { orderRkey: string; buyer: string; email: string; className: string; priceCents: number; channel: Channel; orderStatus: string; ticketRkey: string; serial: number; ticketStatus: string; admittedAt: string; scannerId: string }

export function channelFor(provider: string): Channel {
  if (provider === "stripe" || provider === "square") return "card";
  if (provider === "cash" || provider === "check") return "cash";
  if (provider === "none") return "free";
  return "other";
}

export function reconcile(input: { event: Stored<Event>; classes: Stored<TicketClass>[]; orders: Stored<Order>[]; tickets: Stored<Ticket>[]; scans: Stored<DoorScanRecord>[]; donations: Stored<DonationRecord>[]; now?: Date }): Reconciliation {
  const { event, classes, orders, tickets, scans, donations } = input;
  const currency = classes[0]?.record.price.currency ?? "USD";
  const classByUri = new Map(classes.map((c) => [c.uri, c]));
  const orderByUri = new Map(orders.map((o) => [o.uri, o]));
  const lineByClass = new Map<string, ClassLine>(classes.map((c) => [c.uri, { name: c.record.name, kind: c.record.kind, issued: 0, admitted: 0, noShows: 0, card: 0, cash: 0, refunded: 0 }]));
  const ensureLine = (uri: string): ClassLine => {
    let l = lineByClass.get(uri);
    if (!l) { l = { name: "(removed class)", kind: "?", issued: 0, admitted: 0, noShows: 0, card: 0, cash: 0, refunded: 0 }; lineByClass.set(uri, l); }
    return l;
  };

  // Money from orders, by class and channel.
  let refunds = 0;
  for (const o of orders) {
    const st = o.record.status;
    if (st === "pending" || st === "failed" || st === "cancelled") continue;
    const ch = channelFor(o.record.paymentProvider);
    for (const it of o.record.items) {
      const l = ensureLine(it.ticketClass.uri);
      const amt = it.quantity * it.unitPrice.amountCents;
      if (st === "refunded") { l.refunded += amt; continue; }
      if (ch === "card") l.card += amt; else if (ch === "cash") l.cash += amt;
    }
    if (st === "refunded") refunds += o.record.total.amountCents;
    else if (st === "partiallyRefunded") refunds += o.record.refundedTotal?.amountCents ?? 0;
  }

  // Attendance: first admitted scan per ticket; extra admitted scans are double admits.
  const firstAdmit = new Map<string, Stored<DoorScanRecord>>();
  const door = { cashAdmits: 0, cashCents: 0, compAdmits: 0, duplicateAttempts: 0, invalidAttempts: 0, doubleAdmits: 0, offlineScans: 0 };
  const scannerStats = new Map<string, { scannerId: string; scans: number; admitted: number; offline: number }>();
  for (const s of [...scans].sort((a, b) => a.record.scannedAt.localeCompare(b.record.scannedAt))) {
    const r = s.record;
    const st = scannerStats.get(r.scannerId) ?? { scannerId: r.scannerId, scans: 0, admitted: 0, offline: 0 };
    st.scans++;
    if (r.offline) { st.offline++; door.offlineScans++; }
    scannerStats.set(r.scannerId, st);
    switch (r.result) {
      case "admitted":
      case "manualAdmit":
        if (r.ticket && !firstAdmit.has(r.ticket.uri)) { firstAdmit.set(r.ticket.uri, s); st.admitted++; }
        else door.doubleAdmits++;
        break;
      case "cashAdmit": door.cashAdmits++; door.cashCents += r.cashCollected?.amountCents ?? 0; st.admitted++; break;
      case "compAdmit": door.compAdmits++; st.admitted++; break;
      case "duplicate": door.duplicateAttempts++; break;
      default: door.invalidAttempts++;
    }
  }

  // Tickets: issued, admitted, no-shows, by class; attendance lines.
  const counts = { issued: 0, admitted: 0, noShows: 0, voided: 0 };
  const lines: AttendanceLine[] = [];
  for (const t of tickets) {
    const l = ensureLine(t.record.ticketClass.uri);
    const o = orderByUri.get(t.record.order.uri);
    const item = o?.record.items.find((i) => i.ticketClass.uri === t.record.ticketClass.uri);
    const admit = firstAdmit.get(t.uri);
    const voided = t.record.status !== "valid";
    if (voided) counts.voided++;
    else { counts.issued++; l.issued++; if (admit) { counts.admitted++; l.admitted++; } else { counts.noShows++; l.noShows++; } }
    lines.push({
      orderRkey: o?.rkey ?? "", buyer: o?.record.buyer.name ?? t.record.holderLabel ?? "", email: o?.record.buyer.email ?? "",
      className: classByUri.get(t.record.ticketClass.uri)?.record.name ?? l.name, priceCents: item?.unitPrice.amountCents ?? 0,
      channel: channelFor(o?.record.paymentProvider ?? "other"), orderStatus: o?.record.status ?? "", ticketRkey: t.rkey, serial: t.record.serial,
      ticketStatus: t.record.status, admittedAt: admit?.record.scannedAt ?? "", scannerId: admit?.record.scannerId ?? "",
    });
  }
  lines.sort((a, b) => a.buyer.localeCompare(b.buyer) || a.serial - b.serial);

  const don = { count: 0, card: 0, cash: 0, other: 0 };
  for (const d of donations) {
    if (d.record.status !== "completed") continue;
    don.count++;
    const ch = channelFor(d.record.paymentProvider);
    if (ch === "card") don.card += d.record.amount.amountCents; else if (ch === "cash") don.cash += d.record.amount.amountCents; else don.other += d.record.amount.amountCents;
  }

  const classLines = [...lineByClass.values()];
  const cardGross = classLines.reduce((s, l) => s + l.card, 0) + don.card;
  const cashGross = classLines.reduce((s, l) => s + l.cash, 0) + door.cashCents + don.cash;
  const platformFee = 0;
  return {
    event: { title: event.record.title, startsAt: event.record.startsAt, timezone: event.record.timezone, uri: event.uri },
    currency, generatedAt: (input.now ?? new Date()).toISOString(),
    classes: classLines, tickets: counts, door, donations: don,
    money: { cardGross, cashGross, refunds, platformFee, net: cardGross + cashGross - refunds - platformFee, cashToDeposit: cashGross },
    headcount: counts.admitted + door.cashAdmits + door.compAdmits,
    scanners: [...scannerStats.values()].sort((a, b) => a.scannerId.localeCompare(b.scannerId)),
    lines,
  };
}

export function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export function csv(rows: unknown[][]): string {
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
const dollars = (c: number) => (c / 100).toFixed(2);

export function summaryCsv(r: Reconciliation): string {
  const rows: unknown[][] = [["Open Music Performance reconciliation", r.event.title], ["Event start (UTC)", r.event.startsAt], ["Generated (UTC)", r.generatedAt], ["Currency", r.currency], []];
  rows.push(["Ticket class", "Kind", "Issued", "Admitted", "No-shows", "Card gross", "Cash gross", "Refunded"]);
  for (const c of r.classes) rows.push([c.name, c.kind, c.issued, c.admitted, c.noShows, dollars(c.card), dollars(c.cash), dollars(c.refunded)]);
  rows.push([], ["Door", "Count", "Amount"], ["Cash admits at door", r.door.cashAdmits, dollars(r.door.cashCents)], ["Comp admits", r.door.compAdmits, ""], ["Duplicate attempts (refused)", r.door.duplicateAttempts, ""], ["Invalid attempts (refused)", r.door.invalidAttempts, ""], ["Double admits (same ticket admitted twice)", r.door.doubleAdmits, ""], ["Offline scans", r.door.offlineScans, ""]);
  rows.push([], ["Donations", r.donations.count, dollars(r.donations.card + r.donations.cash + r.donations.other)], ["  by card", "", dollars(r.donations.card)], ["  cash or check", "", dollars(r.donations.cash)]);
  rows.push([], ["Totals", "", ""], ["Card gross (settles via the organizer's processor; fees are on that statement)", "", dollars(r.money.cardGross)], ["Cash gross", "", dollars(r.money.cashGross)], ["Refunds", "", dollars(r.money.refunds)], ["Platform fee", "", dollars(r.money.platformFee)], ["Net", "", dollars(r.money.net)], ["CASH TO DEPOSIT", "", dollars(r.money.cashToDeposit)], ["Headcount", r.headcount, ""]);
  rows.push([], ["Scanner", "Scans", "Admitted", "Offline"]);
  for (const s of r.scanners) rows.push([s.scannerId, s.scans, s.admitted, s.offline]);
  return csv(rows);
}

export function attendanceCsv(r: Reconciliation): string {
  const rows: unknown[][] = [["Order", "Buyer", "Email", "Class", "Price", "Channel", "Order status", "Ticket", "Serial", "Ticket status", "Admitted at (UTC)", "Scanner"]];
  for (const l of r.lines) rows.push([l.orderRkey, l.buyer, l.email, l.className, dollars(l.priceCents), l.channel, l.orderStatus, l.ticketRkey, l.serial, l.ticketStatus, l.admittedAt, l.scannerId]);
  return csv(rows);
}
