import { openDb } from "./db.ts";
import { loadLexicons } from "./lexicons.ts";
import { RecordStore } from "./records.ts";
import { IssuerKeys } from "./keys.ts";
import { seedDemo, DEMO_DOOR_CODE, DEMO_ORGANIZER_KEY } from "./seed.ts";
import { Auth } from "./auth.ts";

const db = openDb(process.env["OMP_DB_PATH"] ?? "data/omp.sqlite");
const store = new RecordStore(db, loadLexicons());
const { did, eventRkey } = await seedDemo(store, new IssuerKeys(db, store), new Auth(db));
const base = process.env["OMP_BASE_URL"] ?? "http://localhost:3000";
console.log(`seeded demo org ${did}\n  event page: ${base}/e/${did}/${eventRkey}\n  scanner:    ${base}/scan/  (door code ${DEMO_DOOR_CODE})\n  admin:      ${base}/admin  (organizer key ${DEMO_ORGANIZER_KEY})`);
