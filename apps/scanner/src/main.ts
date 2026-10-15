// Scanner UI. Three screens: setup (sync a door pack), scan (camera + result), list (door list, printable).
import { Door, type Decision, type DoorPack } from "./core.ts";
import { Camera } from "./camera.ts";
import { clear, load, save, scannerId } from "./storage.ts";

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;
let door: Door | null = null;
let server = location.origin;
let doorCode = "";
let camera: Camera | null = null;

function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function show(screen: "setup" | "scan" | "list"): void {
  for (const s of ["setup", "scan", "list"]) $(`#${s}`).hidden = s !== screen;
  if (screen === "scan") void startCamera(); else camera?.stop();
  if (screen === "list") renderList();
}

async function startCamera(): Promise<void> {
  const video = $<HTMLVideoElement>("#video");
  camera ??= new Camera(video, (code) => void handleCode(code));
  try {
    await camera.start();
    $("#camera-status").textContent = `Camera on (${camera.engine})`;
  } catch (e) {
    $("#camera-status").textContent = "No camera. Paste or type the code below, or use the door list.";
  }
}

async function handleCode(code: string): Promise<void> {
  if (!door) return;
  const d = await door.scan(code);
  if (!d) return;
  showDecision(d);
}

function showDecision(d: Decision): void {
  const box = $("#result");
  const tone = d.result === "admitted" || d.result === "manualAdmit" || d.result === "cashAdmit" || d.result === "compAdmit" ? "ok" : d.result === "duplicate" ? "warn" : "bad";
  box.className = `result ${tone}`;
  box.innerHTML = `<div class="headline">${esc(d.headline)}</div><div class="who">${esc(d.holder ?? "")}${d.className ? ` · ${esc(d.className)}` : ""}${d.serial !== undefined ? ` · #${d.serial}` : ""}</div><div class="detail">${esc(d.detail)}</div>`;
  if ("vibrate" in navigator) navigator.vibrate(tone === "ok" ? 80 : [60, 60, 200]);
  persist();
  renderCounts();
  void uploadIfOnline();
}

function renderCounts(): void {
  if (!door) return;
  const c = door.counts();
  $("#counts").innerHTML = `<span><b>${c.admitted}</b> in</span><span><b>${c.duplicates}</b> dup</span><span><b>${c.cash}</b> cash ($${(c.cashCents / 100).toFixed(2)})</span><span><b>${c.comp}</b> comp</span><span class="${c.pending ? "pending" : ""}"><b>${c.pending}</b> to upload</span>`;
}

function renderList(filter = ""): void {
  if (!door) return;
  const q = filter.trim().toLowerCase();
  const rows = door.list().filter((r) => !q || r.holder.toLowerCase().includes(q) || String(r.serial) === q);
  $("#list-body").innerHTML = rows.map((r) => `<tr class="${r.admitted ? "done" : ""} ${r.status !== "valid" ? "void" : ""}">
    <td>${esc(r.holder)}</td><td>${esc(r.className)}</td><td>#${r.serial}</td>
    <td>${r.status !== "valid" ? "void" : r.admitted ? "in" : `<button data-admit="${esc(r.tid)}">Admit</button>`}</td></tr>`).join("") || `<tr><td colspan="4">No matches.</td></tr>`;
}

function persist(): void {
  if (door) save({ server, doorCode, state: door.toState() });
}

async function sync(): Promise<void> {
  const eventInput = $<HTMLInputElement>("#event").value.trim();
  server = $<HTMLInputElement>("#server").value.trim().replace(/\/$/, "") || location.origin;
  doorCode = $<HTMLInputElement>("#door-code").value.trim();
  const m = /\/e\/([^/]+)\/([^/.?#]+)/.exec(eventInput) ?? /^([^/]+)\/([^/]+)$/.exec(eventInput);
  if (!m) return setStatus("Paste the event page link, or did/rkey.", true);
  setStatus("Syncing…");
  try {
    const res = await fetch(`${server}/e/${m[1]}/${m[2]}/door.json`, { headers: { authorization: `Bearer ${doorCode}` } });
    if (res.status === 401) return setStatus("Door code rejected.", true);
    if (!res.ok) return setStatus(`Sync failed (${res.status}).`, true);
    const pack = (await res.json()) as DoorPack;
    door = door && door.pack.event.uri === pack.event.uri ? await door.resync(pack) : await Door.open({ pack, ledger: [], outbox: [], scannerId: scannerId() });
    door.online = navigator.onLine;
    persist();
    $("#event-title").textContent = `${pack.event.title} · ${pack.tickets.length} tickets · synced ${new Date(pack.syncedAt).toLocaleTimeString()}`;
    renderCounts();
    show("scan");
  } catch (e) {
    setStatus(`Could not reach ${server}. Offline? A previous sync keeps working.`, true);
  }
}

function setStatus(msg: string, bad = false): void {
  const el = $("#setup-status");
  el.textContent = msg;
  el.className = bad ? "bad" : "";
}

async function uploadIfOnline(): Promise<void> {
  if (!door || !navigator.onLine) return;
  const pending = door.pendingUploads();
  if (!pending.length) return;
  try {
    const { did, rkey } = door.pack.event;
    const res = await fetch(`${server}/e/${did}/${rkey}/scans`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${doorCode}` }, body: JSON.stringify({ scans: pending }) });
    if (res.ok) {
      const { accepted } = (await res.json()) as { accepted: string[] };
      door.markUploaded(accepted);
      persist();
      renderCounts();
    }
  } catch {
    /* stay pending */
  }
}

function boot(): void {
  const saved = load();
  if (saved) {
    server = saved.server;
    doorCode = saved.doorCode;
    $<HTMLInputElement>("#server").value = server;
    $<HTMLInputElement>("#door-code").value = doorCode;
    $<HTMLInputElement>("#event").value = `${server}/e/${saved.state.pack.event.did}/${saved.state.pack.event.rkey}`;
    void Door.open(saved.state).then((d) => {
      door = d;
      door.online = navigator.onLine;
      $("#event-title").textContent = `${d.pack.event.title} · ${d.pack.tickets.length} tickets · synced ${new Date(d.pack.syncedAt).toLocaleTimeString()}`;
      renderCounts();
      show("scan");
      void uploadIfOnline();
    });
  } else {
    $<HTMLInputElement>("#server").value = location.origin;
    show("setup");
  }

  $("#sync").addEventListener("click", () => void sync());
  $("#to-list").addEventListener("click", () => show("list"));
  $("#to-scan").addEventListener("click", () => show("scan"));
  $("#to-setup").addEventListener("click", () => { camera?.stop(); show("setup"); });
  $("#resync").addEventListener("click", () => { camera?.stop(); show("setup"); void sync(); });
  $("#forget").addEventListener("click", () => { if (confirm("Forget this event on this device? Unuploaded scans will be lost.")) { clear(); door = null; location.reload(); } });
  $("#manual-form").addEventListener("submit", (e) => { e.preventDefault(); const i = $<HTMLInputElement>("#manual-code"); if (i.value.trim()) void handleCode(i.value); i.value = ""; });
  $("#cash-form").addEventListener("submit", (e) => { e.preventDefault(); if (!door) return; const i = $<HTMLInputElement>("#cash-amount"); const cents = Math.round(Number(i.value) * 100); if (cents > 0) showDecision(door.admitCash(cents)); });
  $("#comp").addEventListener("click", () => { if (door) showDecision(door.admitComp(prompt("Comp note (optional)") ?? "")); });
  $("#list-filter").addEventListener("input", (e) => renderList((e.target as HTMLInputElement).value));
  $("#list-body").addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-admit]");
    if (b && door) { showDecision(door.admitFromList(b.dataset["admit"]!)); renderList($<HTMLInputElement>("#list-filter").value); }
  });
  $("#print").addEventListener("click", () => window.print());
  window.addEventListener("online", () => { if (door) door.online = true; $("#net").textContent = "online"; void uploadIfOnline(); });
  window.addEventListener("offline", () => { if (door) door.online = false; $("#net").textContent = "offline"; });
  $("#net").textContent = navigator.onLine ? "online" : "offline";
  if ("serviceWorker" in navigator) void navigator.serviceWorker.register("./sw.js");
}

boot();
