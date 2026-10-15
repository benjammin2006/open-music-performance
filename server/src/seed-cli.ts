import { openDb } from "./db.ts";
import { loadLexicons } from "./lexicons.ts";
import { RecordStore } from "./records.ts";
import { IssuerKeys } from "./keys.ts";
import { seedDemo } from "./seed.ts";

const db = openDb(process.env["OMP_DB_PATH"] ?? "./data/omp.sqlite");
const store = new RecordStore(db, loadLexicons());
const { did, eventRkey } = await seedDemo(store, new IssuerKeys(db, store));
console.log(`seeded demo org ${did}; event page: ${process.env["OMP_BASE_URL"] ?? "http://localhost:3000"}/e/${did}/${eventRkey}`);
