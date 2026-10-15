// Renders docs/SCHEMA.md from the lexicons so the human-readable schema document cannot drift.
// Run with `npm run schema:docs`; commit the output.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const lexDir = join(root, "lexicons");
const out = join(root, "..", "docs", "SCHEMA.md");

function walk(dir) {
  return readdirSync(dir).sort().flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".json") ? [p] : [];
  });
}
const docs = walk(lexDir).map((p) => JSON.parse(readFileSync(p, "utf8")));
const byId = Object.fromEntries(docs.map((d) => [d.id, d]));
const esc = (s = "") => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");

function typeOf(prop) {
  switch (prop.type) {
    case "ref": return `ref → ${prop.ref.startsWith("#") ? prop.ref : prop.ref.replace("org.openmusicperformance.", "")}`;
    case "array": return `array of ${typeOf(prop.items)}${prop.maxLength ? ` (max ${prop.maxLength})` : ""}`;
    case "string": {
      const bits = [];
      if (prop.format) bits.push(prop.format);
      if (prop.knownValues) bits.push(`one of: ${prop.knownValues.join(", ")}`);
      if (prop.maxGraphemes) bits.push(`≤${prop.maxGraphemes} chars`);
      return `string${bits.length ? ` (${bits.join("; ")})` : ""}`;
    }
    case "integer": return `integer${prop.minimum !== undefined ? ` (≥${prop.minimum})` : ""}`;
    case "blob": return `blob (${(prop.accept ?? ["*"]).join(", ")}; ≤${Math.round((prop.maxSize ?? 0) / 1e6)} MB)`;
    default: return prop.type;
  }
}

function objectTable(obj) {
  const req = new Set(obj.required ?? []);
  const rows = Object.entries(obj.properties ?? {}).map(([name, p]) =>
    `| \`${name}\` | ${esc(typeOf(p))} | ${req.has(name) ? "yes" : ""} | ${esc(p.description ?? "")}${p.default !== undefined ? ` Default: \`${p.default}\`.` : ""} |`
  );
  return ["| Field | Type | Required | Description |", "|---|---|---|---|", ...rows].join("\n");
}

const lines = [];
lines.push("# OMP schema document");
lines.push("");
lines.push("Generated from `schemas/lexicons/` by `npm run schema:docs`. Do not edit by hand; edit the lexicon JSON and regenerate. Fixtures in `schemas/fixtures/` are validated by `npm run schema:check`.");
lines.push("");
lines.push("Records are AT Protocol lexicons (`lexicon: 1`, record key `tid`). Every record is owned by the account whose repo holds it (`ownerDid` is the repo DID, not a field). References between records are strong refs (`uri` + `cid`), so an order freezes the ticket class it was sold under.");
lines.push("");
lines.push("STUBBORN_FACT: the NSID prefix `org.openmusicperformance` is a placeholder until the fiscal sponsor owns a domain (docs/ARCHITECTURE.md Q1). Rename by search-and-replace across `schemas/` only.");
lines.push("");
lines.push("## Record types");
lines.push("");
lines.push("| NSID | Status | Purpose |");
lines.push("|---|---|---|");
for (const d of docs) {
  if (d.defs?.main?.type !== "record") continue;
  const reserved = d.defs.main.record.properties?.reserved?.const === true;
  lines.push(`| \`${d.id}\` | ${reserved ? "reserved" : "v1"} | ${esc(d.description)} |`);
}
lines.push("");
for (const d of docs) {
  if (d.defs?.main?.type !== "record") continue;
  const reserved = d.defs.main.record.properties?.reserved?.const === true;
  lines.push(`## \`${d.id}\`${reserved ? " (reserved)" : ""}`);
  lines.push("");
  lines.push(d.description ?? "");
  lines.push("");
  lines.push(objectTable(d.defs.main.record));
  lines.push("");
  for (const [name, def] of Object.entries(d.defs)) {
    if (name === "main" || def.type !== "object") continue;
    lines.push(`### \`#${name}\``);
    lines.push("");
    if (def.description) { lines.push(def.description); lines.push(""); }
    lines.push(objectTable(def));
    lines.push("");
  }
}
const defs = byId["org.openmusicperformance.defs"];
if (defs) {
  lines.push("## Shared definitions (`org.openmusicperformance.defs`)");
  lines.push("");
  for (const [name, def] of Object.entries(defs.defs)) {
    lines.push(`### \`#${name}\``);
    lines.push("");
    if (def.description) { lines.push(def.description); lines.push(""); }
    lines.push(objectTable(def));
    lines.push("");
  }
}
writeFileSync(out, lines.join("\n"));
console.log(`wrote ${relative(join(root, ".."), out)} (${lines.length} lines)`);
