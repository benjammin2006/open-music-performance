import { esc, layout, money, whenLocal } from "../render.ts";
import type { Reconciliation } from "../reconcile.ts";

export function reconciliationPage(r: Reconciliation, base: string): string {
  const m = (c: number) => money(c, r.currency).replace("Free", "$0.00");
  const rows = r.classes.map((c) => `<tr><td>${esc(c.name)}</td><td>${c.issued}</td><td>${c.admitted}</td><td>${c.noShows}</td><td class="num">${m(c.card)}</td><td class="num">${m(c.cash)}</td><td class="num">${c.refunded ? m(c.refunded) : ""}</td></tr>`).join("");
  const scanners = r.scanners.map((s) => `<tr><td>${esc(s.scannerId)}</td><td>${s.scans}</td><td>${s.admitted}</td><td>${s.offline}</td></tr>`).join("");
  const lines = r.lines.map((l) => `<tr class="${l.ticketStatus !== "valid" ? "void" : l.admittedAt ? "" : "noshow"}"><td>${esc(l.buyer)}</td><td>${esc(l.className)}</td><td class="num">${m(l.priceCents)}</td><td>${esc(l.channel)}</td><td>#${l.serial}</td><td>${l.ticketStatus !== "valid" ? esc(l.ticketStatus) : l.admittedAt ? `in ${esc(whenLocal(l.admittedAt, r.event.timezone, { timeStyle: "short" }))}` : "no-show"}</td></tr>`).join("");
  const body = `
<p class="meta noprint"><a href="${esc(base)}">Back to event</a></p>
<h1>Reconciliation: ${esc(r.event.title)}</h1>
<p class="meta">${esc(whenLocal(r.event.startsAt, r.event.timezone))} · generated ${esc(whenLocal(r.generatedAt, r.event.timezone, { dateStyle: "medium", timeStyle: "short" }))}</p>
<div class="card"><div class="row"><div><div class="fine">Cash to deposit</div><div style="font-size:2rem;font-weight:700">${m(r.money.cashToDeposit)}</div></div><div><div class="fine">Card gross</div><div style="font-size:1.4rem;font-weight:600">${m(r.money.cardGross)}</div></div><div><div class="fine">Headcount</div><div style="font-size:1.4rem;font-weight:600">${r.headcount}</div></div></div>
<p class="fine">Card sales settle through the organizer's own payment account; processor fees appear on that statement, not here. Platform fee: ${m(r.money.platformFee)}. Refunds: ${m(r.money.refunds)}. Net: <strong>${m(r.money.net)}</strong>.</p></div>
<h2>By ticket class</h2>
<table><thead><tr><th>Class</th><th>Issued</th><th>Admitted</th><th>No-shows</th><th class="num">Card</th><th class="num">Cash</th><th class="num">Refunded</th></tr></thead><tbody>${rows}</tbody>
<tfoot><tr><th>Total</th><th>${r.tickets.issued}</th><th>${r.tickets.admitted}</th><th>${r.tickets.noShows}</th><th class="num">${m(r.classes.reduce((s, c) => s + c.card, 0))}</th><th class="num">${m(r.classes.reduce((s, c) => s + c.cash, 0))}</th><th class="num">${m(r.classes.reduce((s, c) => s + c.refunded, 0))}</th></tr></tfoot></table>
<h2>At the door</h2>
<table><tbody>
<tr><td>Cash admits (walk-ups)</td><td>${r.door.cashAdmits}</td><td class="num">${m(r.door.cashCents)}</td></tr>
<tr><td>Comp admits</td><td>${r.door.compAdmits}</td><td></td></tr>
<tr><td>Donations</td><td>${r.donations.count}</td><td class="num">${m(r.donations.card + r.donations.cash + r.donations.other)} <span class="fine">(${m(r.donations.card)} card, ${m(r.donations.cash)} cash)</span></td></tr>
<tr><td>Duplicate attempts refused</td><td>${r.door.duplicateAttempts}</td><td></td></tr>
<tr><td>Invalid attempts refused</td><td>${r.door.invalidAttempts}</td><td></td></tr>
<tr><td>Double admits <span class="fine">(same ticket admitted on two scanners before they synced)</span></td><td>${r.door.doubleAdmits ? `<strong>${r.door.doubleAdmits}</strong>` : 0}</td><td></td></tr>
<tr><td>Scans made offline</td><td>${r.door.offlineScans}</td><td></td></tr>
</tbody></table>
${scanners ? `<h2>Scanners</h2><table><thead><tr><th>Scanner</th><th>Scans</th><th>Admitted</th><th>Offline</th></tr></thead><tbody>${scanners}</tbody></table>` : ""}
<h2>Attendance</h2>
<p class="fine noprint">${r.lines.length} tickets. No-shows are dimmed; voided tickets are struck through.</p>
<table><thead><tr><th>Buyer</th><th>Class</th><th class="num">Price</th><th>Channel</th><th>#</th><th>Status</th></tr></thead><tbody>${lines || `<tr><td colspan="6" class="fine">No tickets issued.</td></tr>`}</tbody></table>
<p class="noprint"><a class="btn" href="${esc(base)}/reconciliation.csv">Summary CSV</a> <a class="btn" href="${esc(base)}/attendance.csv">Attendance CSV</a> <button type="button" onclick="window.print()">Print</button></p>
<style>.num{text-align:right} tr.noshow td{color:var(--muted)} tr.void td{color:var(--muted);text-decoration:line-through} tfoot th{border-top:2px solid var(--line)}</style>`;
  return layout({ title: `Reconciliation · ${r.event.title}`, body });
}

export function doorCodePrompt(title: string, action: string, bad = false): string {
  return layout({ title: `Organizer access · ${title}`, body: `
<h1>Organizer access</h1>
<p>Enter the door code for <strong>${esc(title)}</strong> to view the reconciliation sheet. Until organizer accounts exist, the door code is the organizer's key too.</p>
${bad ? `<p class="card" role="alert">That code was not accepted.</p>` : ""}
<form method="post" action="${esc(action)}"><label for="code">Door code</label><input id="code" name="code" autocomplete="off" autocapitalize="characters" required><p><button type="submit">Open sheet</button></p></form>` });
}
