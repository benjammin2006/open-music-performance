// Bundles the scanner into dist/ with esbuild and stamps the service worker cache name with a build id.
import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

mkdirSync("dist", { recursive: true });
await build({ entryPoints: ["src/main.ts"], bundle: true, format: "esm", target: "es2022", outfile: "dist/app.js", minify: true, sourcemap: true, logLevel: "warning" });
cpSync("public", "dist", { recursive: true });
const stamp = createHash("sha256").update(readFileSync("dist/app.js")).digest("hex").slice(0, 12);
writeFileSync("dist/sw.js", readFileSync("public/sw.js", "utf8").replace("__BUILD__", stamp));
console.log(`scanner built (build ${stamp})`);
