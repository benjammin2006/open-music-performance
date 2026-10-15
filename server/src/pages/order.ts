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

/** A paid order that is not settled: still pending at Stripe, cancelled, or failed. */
export function pendingOrderPage(event: Stored<Event>, order: Stored<Order>): string {
  const e = event.record;
  const st = order.record.status;
  const eventUrl = `/e/${esc(event.did)}/${esc(event.rkey)}`;
  const body = st === "pending"
    ? `<h1>Finishing your order</h1>
<p role="status">We are waiting for the payment confirmation for <strong>${esc(e.title)}</strong>. This page refreshes itself; your tickets will appear here as soon as the payment clears. If you closed the payment page without paying, you can cancel below and nothing will be charged.</p>
<p class="fine">Order ${esc(order.rkey)} · ${esc(order.record.buyer.name)} · total ${esc((order.record.total.amountCents / 100).toFixed(2))} ${esc(order.record.total.currency)}</p>
<p class="noprint"><a class="btn" href="/order/${esc(order.did)}/${esc(order.rkey)}">Check again</a> <form method="post" action="/order/${esc(order.did)}/${esc(order.rkey)}/cancel" style="display:inline"><button type="submit" class="secondary">Cancel this order</button></form></p>`
    : `<h1>${st === "cancelled" ? "Order cancelled" : "Order not completed"}</h1>
<p role="status">${st === "cancelled" ? "Nothing was charged and the seats were released." : "This order did not go through. If you were charged, the organizer will refund you; please contact them with the order id below."}</p>
<p class="fine">Order ${esc(order.rkey)}${order.record.notes ? ` · ${esc(order.record.notes)}` : ""}</p>
<p class="noprint"><a class="btn" href="${eventUrl}">Back to the event</a></p>`;
  return layout({ title: `${st === "pending" ? "Finishing your order" : "Order"} · ${e.title}`, body, ...(st === "pending" ? { head: `<meta http-equiv="refresh" content="6">` } : {}) });
}
