import { esc, layout, whenLocal } from "../render.ts";
import type { Stored } from "../records.ts";
import type { Event, Order, Ticket } from "../types.ts";

export function orderPage(event: Stored<Event>, order: Stored<Order>, tickets: { ticket: Stored<Ticket>; qrSvg: string }[]): string {
  const e = event.record;
  return layout({ title: `Your tickets · ${e.title}`, body: `
<p class="ok" role="status">You're in. ${tickets.length === 1 ? "Here is your ticket." : `Here are your ${tickets.length} tickets.`} Save or print this page; it is your ticket.</p>
<h1>${esc(e.title)}</h1>
<div class="meta"><div>${esc(whenLocal(e.startsAt, e.timezone))}</div><div>${esc(e.location.name)}</div></div>
${tickets.map(({ ticket, qrSvg }, i) => `<div class="card" style="text-align:center">
  <div class="qr" style="margin:0 auto">${qrSvg}</div>
  <div><strong>${esc(ticket.record.holderLabel ?? order.record.buyer.name)}</strong> · ticket ${i + 1} of ${tickets.length}</div>
  <div class="fine">Serial ${ticket.record.serial} · Show this code at the door, or give your name. Works printed or on a dead-zone phone, the door does not need a signal.</div>
</div>`).join("")}
<p class="noprint"><button type="button" onclick="window.print()">Print tickets</button> <a class="btn" href="/e/${esc(event.did)}/${esc(event.rkey)}">Back to event</a></p>` });
}
