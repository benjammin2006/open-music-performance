// Validates every fixture in fixtures/ against the lexicons in lexicons/.
// Exit code 1 on any failure. This is the `npm run schema:check` gate named in docs/DEMO_PLAN.md.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { Lexicons, jsonToLex } from "@atproto/lexicon";

const root = fileURLToPath(new URL("..", import.meta.url));
const lexDir = join(root, "lexicons");
const fixDir = join(root, "fixtures");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".json") ? [p] : [];
  });
}

const failures = [];
const docs = walk(lexDir).map((p) => {
  const doc = JSON.parse(readFileSync(p, "utf8"));
  const expected = relative(lexDir, p).replace(/\.json$/, "").split("/").join(".");
  if (doc.id !== expected) failures.push(`${relative(root, p)}: id "${doc.id}" does not match its path (expected "${expected}")`);
  return doc;
});

let lex;
try {
  lex = new Lexicons(docs);
} catch (e) {
  console.error("Lexicon set failed to load:", e.message);
  process.exit(1);
}

const recordIds = docs.filter((d) => d.defs?.main?.type === "record").map((d) => d.id);
const reserved = new Set(recordIds.filter((id) => {
  const r = docs.find((d) => d.id === id).defs.main.record;
  return r.properties?.reserved?.const === true;
}));

// Every reserved lexicon must say so in its description and must not have fixtures.
for (const id of reserved) {
  const d = docs.find((x) => x.id === id);
  if (!/^RESERVED/.test(d.description ?? "")) failures.push(`${id}: reserved record must start its description with RESERVED`);
}

const fixtures = readdirSync(fixDir).filter((f) => f.endsWith(".json"));
const covered = new Set();
for (const f of fixtures) {
  const path = join(fixDir, f);
  let value;
  try {
    value = jsonToLex(JSON.parse(readFileSync(path, "utf8")));
  } catch (e) {
    failures.push(`${f}: not valid JSON (${e.message})`);
    continue;
  }
  const type = value?.$type;
  if (typeof type !== "string") { failures.push(`${f}: missing $type`); continue; }
  if (!recordIds.includes(type)) { failures.push(`${f}: $type "${type}" is not a record lexicon`); continue; }
  if (reserved.has(type)) { failures.push(`${f}: fixtures for reserved record ${type} are not allowed`); continue; }
  try {
    lex.assertValidRecord(type, value);
    covered.add(type);
  } catch (e) {
    failures.push(`${f}: ${e.message}`);
  }
}

for (const id of recordIds) {
  if (!reserved.has(id) && !covered.has(id)) failures.push(`${id}: no valid fixture covers this record type`);
}

const summary = `${docs.length} lexicons, ${recordIds.length} record types (${reserved.size} reserved), ${fixtures.length} fixtures`;
if (failures.length) {
  console.error(`schema:check FAILED (${summary})`);
  for (const m of failures) console.error(" -", m);
  process.exit(1);
}
console.log(`schema:check OK (${summary})`);
