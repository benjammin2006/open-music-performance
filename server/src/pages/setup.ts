import { esc, layout } from "../render.ts";

export function setupPage(baseUrl: string, error?: string): string {
  return layout({ title: "Set up this instance", body: `
<h1>Welcome. Create your organization.</h1>
<p>This instance at <code>${esc(baseUrl)}</code> has no organizations yet. Create the first one here. You will get an organizer key once; keep it like a password.</p>
${error ? `<p class="card" role="alert">${esc(error)}</p>` : ""}
<form method="post" action="/setup">
<label for="name">Organization name</label><input id="name" name="name" required maxlength="200" placeholder="Lincoln High School Bands">
<label for="slug">Short id (letters, digits, dashes)</label><input id="slug" name="slug" required pattern="[a-z0-9-]{2,40}" placeholder="lincoln-bands">
<label for="kind">Kind</label><select id="kind" name="kind" style="font:inherit;padding:.5rem;border:1px solid var(--line);border-radius:6px;background:transparent;color:var(--ink)">${["school", "ensemble", "venue", "series", "promoter", "congregation", "other"].map((k) => `<option value="${k}">${k}</option>`).join("")}</select>
<label for="timezone">Timezone (IANA)</label><input id="timezone" name="timezone" required value="America/Chicago">
<label for="locationName">Default venue name</label><input id="locationName" name="locationName" maxlength="200">
<div class="row"><div><label for="locality">City</label><input id="locality" name="locality"></div><div><label for="region">State</label><input id="region" name="region"></div></div>
<label for="website">Website</label><input id="website" name="website" type="url">
<p><button type="submit">Create organization</button></p>
</form>` });
}

export function setupDonePage(name: string, did: string, organizerKey: string): string {
  return layout({ title: "Organization created", body: `
<h1>${esc(name)} is set up</h1>
<p>Its identifier is <code>${esc(did)}</code>.</p>
<div class="card"><div class="fine">Organizer key (shown once; store it somewhere safe)</div><div style="font-size:1.4rem;font-weight:700;word-break:break-all"><code>${esc(organizerKey)}</code></div></div>
<p>You are signed in on this browser. <a class="btn" href="/admin/events/new">Create your first event</a> <a class="btn" href="/admin" style="background:#2a2c33;color:var(--ink)">Dashboard</a></p>` });
}
