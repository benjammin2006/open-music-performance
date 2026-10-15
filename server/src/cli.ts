// omp CLI: verify and import export bundles.
//   node server/src/cli.ts verify <bundle.json> [--origin]      # --origin also fetches the source instance's key
//   node server/src/cli.ts import <bundle.json> [--db path] [--allow-unsigned]
import { readFileSync } from "node:fs";
import { openDb } from "./db.ts";
import { loadLexicons } from "./lexicons.ts";
import { RecordStore } from "./records.ts";
import { IssuerKeys } from "./keys.ts";
import { Auth } from "./auth.ts";
import { importBundle, verifyBundle, type ExportBundle } from "./portability.ts";

const [cmd, file, ...rest] = process.argv.slice(2);
const flag = (name: string) => rest.includes(name);
const opt = (name: string) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };

if (!cmd || !file || !["verify", "import"].includes(cmd)) {
  console.error("usage: cli.ts verify <bundle.json> [--origin] | import <bundle.json> [--db path] [--allow-unsigned]");
  process.exit(2);
}
const bundle = JSON.parse(readFileSync(file, "utf8")) as ExportBundle;
const v = await verifyBundle(bundle);
console.log(`${file}: ${v.ok ? "signature OK" : `NOT OK (${v.reason})`} · ${bundle.records?.length ?? 0} records · did ${bundle.did} · exported ${bundle.exportedAt} from ${bundle.instance}`);

if (cmd === "verify") {
  if (flag("--origin") && bundle.signature) {
    try {
      const wk = (await (await fetch(new URL("/.well-known/omp.json", bundle.instance))).json()) as { publicKeyMultibase: string };
      console.log(wk.publicKeyMultibase === bundle.signature.publicKeyMultibase ? `origin key matches ${bundle.instance}` : `WARNING: signing key differs from the key ${bundle.instance} publishes now`);
    } catch (e) {
      console.log(`could not fetch origin key: ${(e as Error).message}`);
    }
  }
  process.exit(v.ok ? 0 : 1);
}

if (!v.ok && !flag("--allow-unsigned")) process.exit(1);
const db = openDb(opt("--db") ?? process.env["OMP_DB_PATH"] ?? "data/omp.sqlite");
const store = new RecordStore(db, loadLexicons());
const result = await importBundle(bundle, store, new IssuerKeys(db, store), new Auth(db), { allowUnsigned: flag("--allow-unsigned") });
console.log(`imported ${result.imported} records for ${result.did}${result.skipped.length ? `; skipped ${result.skipped.length}` : ""}`);
for (const s of result.skipped) console.log(`  skipped ${s.uri}: ${s.reason}`);
console.log(`new issuer key id: ${result.issuerKid} (earlier public keys kept, so existing tickets still verify)`);
console.log(`organizer key for this instance (shown once): ${result.organizerKey}`);
