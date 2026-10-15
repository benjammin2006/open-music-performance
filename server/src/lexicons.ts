import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import { Lexicons } from "@atproto/lexicon";

const require = createRequire(import.meta.url);

/** Load every lexicon shipped by @omp/schemas. */
export function loadLexicons(): Lexicons {
  const pkgDir = join(require.resolve("@omp/schemas/package.json"), "..");
  const docs = walk(join(pkgDir, "lexicons")).map((p) => JSON.parse(readFileSync(p, "utf8")));
  return new Lexicons(docs);
}

export function fixturesDir(): string {
  return join(require.resolve("@omp/schemas/package.json"), "..", "fixtures");
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".json") ? [p] : [];
  });
}

export const NS = "org.openmusicperformance";
export const C = {
  organization: `${NS}.organization`,
  act: `${NS}.act`,
  event: `${NS}.event`,
  performance: `${NS}.performance`,
  ticketClass: `${NS}.ticketClass`,
  order: `${NS}.order`,
  ticket: `${NS}.ticket`,
  doorScan: `${NS}.doorScan`,
  program: `${NS}.program`,
  donation: `${NS}.donation`,
} as const;
