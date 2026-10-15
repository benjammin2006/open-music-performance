import { esc, layout, whenLocal } from "../render.ts";
import type { Stored } from "../records.ts";
import type { Event, Organization } from "../types.ts";

export function orgPage(org: Stored<Organization>, events: Stored<Event>[], baseUrl: string): string {
  const o = org.record;
  const list = events.length
    ? events.map((e) => `<div class="card"><div class="row"><a href="/e/${esc(e.did)}/${esc(e.rkey)}"><strong>${esc(e.record.title)}</strong></a><span class="fine">${esc(whenLocal(e.record.startsAt, e.record.timezone, { dateStyle: "medium", timeStyle: "short" }))}</span></div><div class="fine">${esc(e.record.location.name)}</div></div>`).join("")
    : "<p class='fine'>No upcoming events.</p>";
  return layout({ title: o.name, description: o.description ?? o.name, body: `
<h1>${esc(o.name)}</h1>
${o.description ? `<p>${esc(o.description)}</p>` : ""}
${o.website ? `<p><a href="${esc(o.website)}">${esc(o.website)}</a></p>` : ""}
<h2>Events</h2>
${list}
<h2>Follow</h2>
<p class="fine">Calendar feed: <code>${esc(baseUrl)}/o/${esc(org.did)}/calendar.ics</code> · <a href="/export/${esc(org.did)}/public.json">Open data (JSON)</a></p>` });
}
