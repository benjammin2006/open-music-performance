// Tiny server-side HTML helpers. No framework: the public pages must be fast, printable and accessible.
export function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function money(amountCents: number, currency = "USD"): string {
  if (amountCents === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amountCents / 100);
}

export function whenLocal(iso: string, timeZone: string, opts: Intl.DateTimeFormatOptions = { dateStyle: "full", timeStyle: "short" }): string {
  try {
    return new Intl.DateTimeFormat("en-US", { ...opts, timeZone }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function layout(opts: { title: string; body: string; head?: string; description?: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(opts.title)}</title>
${opts.description ? `<meta name="description" content="${esc(opts.description)}">` : ""}
<style>
  :root { --ink:#1b1b1f; --muted:#5c5f66; --line:#e2e3e8; --bg:#fbfbfc; --accent:#2a5bd7; --accent-ink:#fff; --ok:#1d7a4a; }
  @media (prefers-color-scheme: dark) { :root { --ink:#e8e8ec; --muted:#a3a6ad; --line:#2e3036; --bg:#121317; --accent:#7ea2ff; --accent-ink:#0b1430; --ok:#5ccf8a; } }
  * { box-sizing: border-box; }
  body { margin:0; font: 16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color:var(--ink); background:var(--bg); }
  main { max-width: 42rem; margin: 0 auto; padding: 1.25rem 1rem 3rem; }
  header.site { border-bottom:1px solid var(--line); } header.site div { max-width:42rem; margin:0 auto; padding:.6rem 1rem; font-size:.9rem; color:var(--muted); }
  a { color: var(--accent); } a:hover { text-decoration-thickness: 2px; }
  h1 { font-size: 1.9rem; line-height:1.15; margin:.2rem 0 .4rem; } h2 { font-size:1.2rem; margin:1.8rem 0 .5rem; }
  .meta { color:var(--muted); margin:0 0 1rem; } .meta div { margin:.15rem 0; }
  .card { border:1px solid var(--line); border-radius: 10px; padding: 1rem; margin: .75rem 0; background: color-mix(in srgb, var(--bg) 92%, var(--ink) 8%); }
  .row { display:flex; justify-content:space-between; gap:1rem; align-items:baseline; flex-wrap:wrap; }
  .price { font-weight:600; white-space:nowrap; }
  button, .btn { font: inherit; background:var(--accent); color:var(--accent-ink); border:0; border-radius: 8px; padding:.6rem 1rem; cursor:pointer; text-decoration:none; display:inline-block; }
  button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
  label { display:block; margin:.6rem 0 .2rem; font-weight:600; } input { font:inherit; width:100%; max-width: 24rem; padding:.5rem .6rem; border:1px solid var(--line); border-radius:6px; background:transparent; color:var(--ink); }
  table { border-collapse: collapse; width:100%; } td, th { text-align:left; padding:.4rem .3rem; border-bottom:1px solid var(--line); vertical-align:top; } th { color:var(--muted); font-weight:600; font-size:.85rem; }
  .intermission td { color:var(--muted); font-style: italic; }
  .fine { color:var(--muted); font-size:.9rem; } .ok { color: var(--ok); font-weight:600; }
  .qr { width: min(70vw, 18rem); height:auto; background:#fff; padding:.5rem; border-radius:8px; }
  footer { margin-top:3rem; color:var(--muted); font-size:.85rem; border-top:1px solid var(--line); padding-top:1rem; }
  @media print { header.site, footer, form, .btn, button, .noprint { display:none !important; } body { background:#fff; color:#000; } .card { break-inside: avoid; } }
</style>
${opts.head ?? ""}
</head>
<body>
<header class="site"><div>Open Music Performance</div></header>
<main>
${opts.body}
<footer>Powered by Open Music Performance, free and open source. The price shown is the price you pay. Your information stays with the organizer.</footer>
</main>
</body>
</html>`;
}
