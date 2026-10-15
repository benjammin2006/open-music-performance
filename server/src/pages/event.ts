import { esc, layout, money, whenLocal } from "../render.ts";
import type { Stored } from "../records.ts";
import type { Event, Organization, Performance, Program, TicketClass } from "../types.ts";

export interface EventPageData {
  org: Stored<Organization> | null;
  event: Stored<Event>;
  classes: { cls: Stored<TicketClass>; remaining: number | null }[];
  performances: Stored<Performance>[];
  program: Stored<Program> | null;
  baseUrl: string;
  notice?: string;
}

export function eventPage(d: EventPageData): string {
  const e = d.event.record;
  const url = `${d.baseUrl}/e/${d.event.did}/${d.event.rkey}`;
  const loc = e.location;
  const address = [loc.streetAddress, loc.locality, loc.region, loc.postalCode].filter(Boolean).join(", ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: e.title,
    description: e.description,
    startDate: e.startsAt,
    endDate: e.endsAt,
    doorTime: e.doorsAt,
    eventStatus: { published: "https://schema.org/EventScheduled", cancelled: "https://schema.org/EventCancelled", postponed: "https://schema.org/EventPostponed" }[e.status] ?? "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url,
    location: { "@type": "Place", name: loc.name, address: address || undefined },
    organizer: d.org ? { "@type": "Organization", name: d.org.record.name, url: d.org.record.website } : undefined,
    performer: d.performances.map((p) => ({ "@type": "MusicGroup", name: p.record.actName ?? "" })).filter((p) => p.name),
    offers: d.classes.map(({ cls, remaining }) => ({
      "@type": "Offer", name: cls.record.name, price: (cls.record.price.amountCents / 100).toFixed(2), priceCurrency: cls.record.price.currency, url,
      availability: remaining === 0 ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    })),
  };

  const classesHtml = d.classes.map(({ cls, remaining }) => {
    const c = cls.record;
    const soldOut = remaining === 0;
    const free = c.kind === "freeRsvp" || c.kind === "comp";
    const action = soldOut
      ? `<span class="fine">Sold out</span>`
      : free
        ? rsvpForm(d.event, cls)
        : `<form method="post" action="${esc(url)}/checkout" class="noprint"><input type="hidden" name="ticketClass" value="${esc(cls.rkey)}"><button type="submit">Buy tickets</button> <span class="fine">Secure checkout on the organizer's own payment account.</span></form>`;
    return `<div class="card"><div class="row"><div><strong>${esc(c.name)}</strong>${c.description ? `<div class="fine">${esc(c.description)}</div>` : ""}${remaining !== null && !soldOut && remaining <= 20 ? `<div class="fine">${remaining} left</div>` : ""}</div><div class="price">${money(c.price.amountCents, c.price.currency)}${free ? "" : " <span class=\"fine\">all in</span>"}</div></div>${action}</div>`;
  }).join("");

  const programHtml = d.program
    ? `<h2 id="program">Program</h2><table aria-labelledby="program"><thead><tr><th>Piece</th><th>Composer</th><th>Performed by</th></tr></thead><tbody>${d.program.record.pieces
        .slice().sort((a, b) => a.order - b.order)
        .map((p) => p.isIntermission
          ? `<tr class="intermission"><td colspan="3">${esc(p.title)}</td></tr>`
          : `<tr><td>${esc(p.title)}</td><td>${esc([p.composer, p.arranger ? `arr. ${p.arranger}` : ""].filter(Boolean).join(", "))}</td><td>${esc(p.performedBy ?? "")}</td></tr>`).join("")}</tbody></table>${d.program.record.notes ? `<p class="fine">${esc(d.program.record.notes)}</p>` : ""}`
    : "";

  const body = `
${d.notice ? `<p class="card ok" role="status">${esc(d.notice)}</p>` : ""}
<h1>${esc(e.title)}</h1>
${d.org ? `<p class="meta"><a href="/o/${esc(d.org.did)}">${esc(d.org.record.name)}</a></p>` : ""}
<div class="meta">
  <div><time datetime="${esc(e.startsAt)}">${esc(whenLocal(e.startsAt, e.timezone))}</time>${e.doorsAt ? ` · doors ${esc(whenLocal(e.doorsAt, e.timezone, { timeStyle: "short" }))}` : ""}</div>
  <div>${esc(loc.name)}${address ? `, ${esc(address)}` : ""}</div>
  ${e.ageRestriction ? `<div>${esc(e.ageRestriction)}</div>` : ""}
  ${e.status !== "published" ? `<div><strong>${esc(e.status.toUpperCase())}</strong></div>` : ""}
</div>
${e.description ? `<p>${esc(e.description)}</p>` : ""}
<h2>Tickets</h2>
${classesHtml || "<p class='fine'>No tickets yet.</p>"}
<p class="fine">Platform fee: ${money(e.feeDisclosure.platformFeeCents)}. ${esc(e.feeDisclosure.processorNote ?? "")} ${esc(e.refundPolicy.text ?? "")}</p>
${programHtml}
<h2>Add to your calendar</h2>
<p class="noprint"><a class="btn" href="${esc(url)}.ics">Download .ics</a> <span class="fine">or subscribe to the organizer's calendar feed: <code>${d.org ? `${esc(d.baseUrl)}/o/${esc(d.org.did)}/calendar.ics` : ""}</code></span></p>
${loc.accessibilityNotes ? `<h2>Accessibility</h2><p>${esc(loc.accessibilityNotes)}</p>` : ""}
<p class="fine noprint"><a href="${esc(url)}/poster">Printable poster with QR code</a> · <a href="/export/${esc(d.event.did)}/public.json">Open data</a></p>`;

  return layout({ title: `${e.title} · ${d.org?.record.name ?? "Event"}`, description: e.description ?? e.title, body, head: `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>` });
}

function rsvpForm(event: Stored<Event>, cls: Stored<TicketClass>): string {
  const limit = cls.record.perOrderLimit ?? 10;
  return `<form method="post" action="/e/${esc(event.did)}/${esc(event.rkey)}/rsvp" class="noprint">
  <input type="hidden" name="ticketClass" value="${esc(cls.rkey)}">
  <label for="name-${esc(cls.rkey)}">Your name</label><input id="name-${esc(cls.rkey)}" name="name" required autocomplete="name" maxlength="200">
  <label for="email-${esc(cls.rkey)}">Email (for your tickets)</label><input id="email-${esc(cls.rkey)}" name="email" type="email" autocomplete="email" maxlength="320">
  <label for="qty-${esc(cls.rkey)}">Seats (up to ${limit})</label><input id="qty-${esc(cls.rkey)}" name="quantity" type="number" min="1" max="${limit}" value="1" inputmode="numeric" style="max-width:6rem">
  <p><label style="font-weight:normal"><input type="checkbox" name="marketingConsent" value="1" style="width:auto"> The organizer may email me about future events.</label></p>
  <button type="submit">Reserve</button>
</form>`;
}

export function posterPage(event: Stored<Event>, org: Stored<Organization> | null, url: string, qrSvg: string): string {
  const e = event.record;
  return layout({ title: `Poster · ${e.title}`, body: `
<div style="text-align:center">
<h1 style="font-size:2.6rem">${esc(e.title)}</h1>
${org ? `<p style="font-size:1.3rem">${esc(org.record.name)}</p>` : ""}
<p style="font-size:1.2rem">${esc(whenLocal(e.startsAt, e.timezone))}<br>${esc(e.location.name)}</p>
<div class="qr" style="margin:1.5rem auto">${qrSvg}</div>
<p style="font-size:1.1rem">Scan to reserve or buy tickets<br><code>${esc(url)}</code></p>
<p class="fine">Free reservations stay free. The price shown is the price you pay.</p>
</div>` });
}
