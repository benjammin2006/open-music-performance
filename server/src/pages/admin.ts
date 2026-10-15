import { esc, layout, money, whenLocal } from "../render.ts";
import { utcToLocal } from "../time.ts";
import type { Stored } from "../records.ts";
import type { Event, Organization, Program, TicketClass } from "../types.ts";

const nav = (org: Stored<Organization> | null) => `<div class="meta noprint"><a href="/admin">Dashboard</a> · <a href="/admin/org">Organization</a> · <a href="/admin/events/new">New event</a> · <form method="post" action="/admin/signout" style="display:inline;margin:0"><button class="quiet" type="submit" style="background:none;color:var(--accent);padding:0">Sign out</button></form>${org ? ` <span class="fine">· ${esc(org.record.name)}</span>` : ""}</div>`;

export function signInPage(bad = false): string {
  return layout({ title: "Organizer sign-in", body: `
<h1>Organizer sign-in</h1>
<p>Enter your organizer key. Keys are issued when an organization is created and can be rotated by whoever holds one. Passkey sign-in is planned; until then, treat this key like a password.</p>
${bad ? `<p class="card" role="alert">That key was not accepted.</p>` : ""}
<form method="post" action="/admin/signin"><label for="key">Organizer key</label><input id="key" name="key" autocomplete="off" required><p><button type="submit">Sign in</button></p></form>` });
}

export function dashboardPage(org: Stored<Organization> | null, events: Stored<Event>[], counts: Map<string, number>): string {
  const rows = events.map((e) => `<div class="card"><div class="row"><div><a href="/admin/events/${esc(e.rkey)}"><strong>${esc(e.record.title)}</strong></a><div class="fine">${esc(whenLocal(e.record.startsAt, e.record.timezone, { dateStyle: "medium", timeStyle: "short" }))} · ${esc(e.record.location.name)}</div></div><div><span class="fine">${esc(e.record.status)}</span> · ${counts.get(e.uri) ?? 0} tickets</div></div></div>`).join("");
  return layout({ title: "Organizer dashboard", body: `${nav(org)}<h1>${esc(org?.record.name ?? "Your events")}</h1><p class="noprint"><a class="btn" href="/admin/events/new">New event</a></p>${rows || "<p class='fine'>No events yet.</p>"}` });
}

export interface EventFormValues { title: string; description: string; startsAt: string; endsAt: string; doorsAt: string; locationName: string; streetAddress: string; locality: string; region: string; postalCode: string; capacity: string; accessibilityNotes: string; ageRestriction: string; refundText: string; processorNote: string; tags: string }

export function eventFormValues(e: Stored<Event> | null, org: Stored<Organization> | null): EventFormValues {
  const tz = e?.record.timezone ?? org?.record.timezone ?? "America/Chicago";
  const loc = e?.record.location ?? org?.record.location;
  return {
    title: e?.record.title ?? "", description: e?.record.description ?? "",
    startsAt: e ? utcToLocal(e.record.startsAt, tz) : "", endsAt: e?.record.endsAt ? utcToLocal(e.record.endsAt, tz) : "", doorsAt: e?.record.doorsAt ? utcToLocal(e.record.doorsAt, tz) : "",
    locationName: loc?.name ?? "", streetAddress: loc?.streetAddress ?? "", locality: loc?.locality ?? "", region: loc?.region ?? "", postalCode: loc?.postalCode ?? "", capacity: loc?.capacity?.toString() ?? "", accessibilityNotes: loc?.accessibilityNotes ?? "",
    ageRestriction: e?.record.ageRestriction ?? "All ages",
    refundText: e?.record.refundPolicy.text ?? "If the event is cancelled you receive a full refund of the price you paid. If it is postponed your ticket is valid for the new date, or you may request a full refund.",
    processorNote: e?.record.feeDisclosure.processorNote ?? `The price shown is the price you pay. Card processing is paid by ${org?.record.name ?? "the organizer"} out of that price.`,
    tags: (e?.record.tags ?? []).join(", "),
  };
}

const field = (name: string, label: string, v: string, attrs = "", type = "text") => `<label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${esc(v)}" ${attrs}>`;
const area = (name: string, label: string, v: string, rows = 4, attrs = "") => `<label for="${name}">${label}</label><textarea id="${name}" name="${name}" rows="${rows}" ${attrs} style="width:100%;max-width:40rem;font:inherit;padding:.5rem .6rem;border:1px solid var(--line);border-radius:6px;background:transparent;color:var(--ink)">${esc(v)}</textarea>`;

export function eventForm(v: EventFormValues, tz: string, action: string, submitLabel: string, error?: string): string {
  return `${error ? `<p class="card" role="alert">${esc(error)}</p>` : ""}
<form method="post" action="${esc(action)}">
${field("title", "Title", v.title, "required maxlength=200")}
${area("description", "Description", v.description)}
<div class="row"><div>${field("startsAt", `Starts (${esc(tz)})`, v.startsAt, "required", "datetime-local")}</div><div>${field("doorsAt", "Doors", v.doorsAt, "", "datetime-local")}</div><div>${field("endsAt", "Ends", v.endsAt, "", "datetime-local")}</div></div>
<h2>Where</h2>
${field("locationName", "Venue name", v.locationName, "required maxlength=200")}
${field("streetAddress", "Street address", v.streetAddress)}
<div class="row"><div>${field("locality", "City", v.locality)}</div><div>${field("region", "State", v.region)}</div><div>${field("postalCode", "ZIP", v.postalCode)}</div><div>${field("capacity", "Capacity", v.capacity, "min=0", "number")}</div></div>
${area("accessibilityNotes", "Accessibility notes", v.accessibilityNotes, 2)}
<h2>Policies</h2>
${field("ageRestriction", "Age restriction", v.ageRestriction)}
${area("refundText", "Refund policy shown at checkout (full refund on cancellation is always honored)", v.refundText, 3)}
${area("processorNote", "Fee disclosure", v.processorNote, 2)}
${field("tags", "Tags (comma separated)", v.tags)}
<p><button type="submit">${esc(submitLabel)}</button></p>
</form>`;
}

export function newEventPage(org: Stored<Organization> | null, v: EventFormValues, tz: string, error?: string): string {
  return layout({ title: "New event", body: `${nav(org)}<h1>New event</h1><p class="fine">Saved as a draft. Nothing is public until you publish.</p>${eventForm(v, tz, "/admin/events", "Create draft", error)}` });
}

export interface EventAdminData {
  org: Stored<Organization> | null; event: Stored<Event>; classes: { cls: Stored<TicketClass>; issued: number }[]; program: Stored<Program> | null;
  doorCode: string | null; ticketCount: number; orderCount: number; baseUrl: string; notice?: string; error?: string;
}

export function eventAdminPage(d: EventAdminData): string {
  const e = d.event;
  const tz = e.record.timezone;
  const pub = `${d.baseUrl}/e/${e.did}/${e.rkey}`;
  const adm = `/admin/events/${e.rkey}`;
  const status = e.record.status;
  const classRows = d.classes.map(({ cls, issued }) => `<tr><td>${esc(cls.record.name)}</td><td>${esc(cls.record.kind)}</td><td class="num">${money(cls.record.price.amountCents, cls.record.price.currency)}</td><td>${cls.record.capacity ?? "∞"}</td><td>${cls.record.perOrderLimit ?? 10}</td><td>${issued}</td><td>${issued ? "" : `<form method="post" action="${adm}/classes/${esc(cls.rkey)}/delete"><button class="quiet" type="submit" style="background:none;color:var(--accent);padding:0">remove</button></form>`}</td></tr>`).join("");
  const programText = d.program ? d.program.record.pieces.slice().sort((a, b) => a.order - b.order).map((p) => p.isIntermission ? "INTERMISSION" : [p.title, p.composer ?? "", p.arranger ?? "", p.performedBy ?? ""].join(" | ").replace(/( \|)+$/, "")).join("\n") : "";
  return layout({ title: `Manage · ${e.record.title}`, body: `${nav(d.org)}
${d.notice ? `<p class="card ok" role="status">${esc(d.notice)}</p>` : ""}${d.error ? `<p class="card" role="alert">${esc(d.error)}</p>` : ""}
<h1>${esc(e.record.title)}</h1>
<div class="card"><div class="row"><div><strong>Status: ${esc(status)}</strong><div class="fine">${d.ticketCount} tickets across ${d.orderCount} orders</div></div>
<form method="post" action="${adm}/status" class="row" style="margin:0">
${status === "published" ? `<button name="status" value="draft" class="secondary" type="submit">Unpublish</button><button name="status" value="cancelled" type="submit" formnovalidate onclick="return confirm('Cancel this event? Buyers are owed a full refund.')">Cancel event</button>` : status === "draft" ? `<button name="status" value="published" type="submit">Publish</button>` : `<button name="status" value="published" type="submit">Re-publish</button>`}
</form></div>
<p class="fine">${status === "published" ? `Public page: <a href="${esc(pub)}">${esc(pub)}</a> · <a href="${esc(pub)}/poster">Poster</a>` : "Not public yet."} · <a href="${esc(pub)}/reconciliation">Reconciliation</a> · Door code for scanners: <code>${esc(d.doorCode ?? "none")}</code> <form method="post" action="${adm}/door-code" style="display:inline"><button class="quiet" type="submit" style="background:none;color:var(--accent);padding:0">rotate</button></form></p></div>

<h2>Tickets</h2>
<table><thead><tr><th>Class</th><th>Kind</th><th class="num">All-in price</th><th>Capacity</th><th>Per order</th><th>Issued</th><th></th></tr></thead><tbody>${classRows || `<tr><td colspan="7" class="fine">No ticket classes yet. Add a free reservation and a paid class below.</td></tr>`}</tbody></table>
<form method="post" action="${adm}/classes" class="card">
<div class="row"><div>${field("name", "Class name", "", "required maxlength=100 placeholder='General admission'")}</div>
<div><label for="kind">Kind</label><select id="kind" name="kind" style="font:inherit;padding:.5rem"><option value="freeRsvp">Free reservation</option><option value="paid">Paid</option><option value="payWhatYouWant">Pay what you want</option><option value="comp">Comp</option></select></div>
<div>${field("price", "All-in price (USD)", "0", "min=0 step=0.01", "number")}</div><div>${field("capacity", "Capacity (blank = unlimited)", "", "min=0", "number")}</div><div>${field("perOrderLimit", "Per order", "8", "min=1", "number")}</div></div>
${field("classDescription", "Short description", "", "maxlength=1000")}
<p><button type="submit" class="secondary">Add ticket class</button></p></form>

<h2>Program</h2>
<form method="post" action="${adm}/program">
${area("program", "One piece per line: Title | Composer | Arranger | Performed by. A line reading INTERMISSION is an intermission.", programText, 8, "placeholder='Sleigh Ride | Leroy Anderson | | Concert Band'")}
${field("programNotes", "Notes, acknowledgements, sponsors", d.program?.record.notes ?? "")}
<p><button type="submit" class="secondary">Save program</button></p></form>

<h2>Details</h2>
${eventForm(eventFormValues(e, d.org), tz, adm, "Save details")}
<style>.num{text-align:right} select{border:1px solid var(--line);border-radius:6px;background:transparent;color:var(--ink)}</style>` });
}

export function orgPage(org: Stored<Organization>, error?: string, notice?: string): string {
  const o = org.record;
  const l = o.location;
  return layout({ title: "Organization", body: `${nav(org)}
${notice ? `<p class="card ok" role="status">${esc(notice)}</p>` : ""}${error ? `<p class="card" role="alert">${esc(error)}</p>` : ""}
<h1>Organization</h1>
<form method="post" action="/admin/org">
${field("name", "Name", o.name, "required maxlength=200")}
<label for="kind">Kind</label><select id="kind" name="kind" style="font:inherit;padding:.5rem;border:1px solid var(--line);border-radius:6px;background:transparent;color:var(--ink)">${["school", "ensemble", "venue", "series", "promoter", "congregation", "other"].map((k) => `<option value="${k}" ${k === o.kind ? "selected" : ""}>${k}</option>`).join("")}</select>
${area("description", "Description", o.description ?? "")}
${field("website", "Website", o.website ?? "", "", "url")}
${field("timezone", "Timezone (IANA)", o.timezone ?? "America/Chicago", "required")}
<h2>Default venue</h2>
${field("locationName", "Venue name", l?.name ?? "")}
${field("streetAddress", "Street address", l?.streetAddress ?? "")}
<div class="row"><div>${field("locality", "City", l?.locality ?? "")}</div><div>${field("region", "State", l?.region ?? "")}</div><div>${field("postalCode", "ZIP", l?.postalCode ?? "")}</div><div>${field("capacity", "Capacity", l?.capacity?.toString() ?? "", "min=0", "number")}</div></div>
${area("accessibilityNotes", "Accessibility notes", l?.accessibilityNotes ?? "", 2)}
<p><button type="submit">Save</button></p></form>
<p class="fine">Public page: <a href="/o/${esc(org.did)}">/o/${esc(org.did)}</a>. Ticket-signing key id: <code>${esc(o.issuerKeys?.[0]?.kid ?? "none")}</code>.</p>` });
}
