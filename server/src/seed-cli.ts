import { openDb } from "./db.ts";
import { loadLexicons } from "./lexicons.ts";
import { RecordStore } from "./records.ts";
import { IssuerKeys } from "./keys.ts";
import { seedDemo, DEMO_DOOR_CODE, DEMO_ORGANIZER_KEY } from "./seed.ts";
import { Auth } from "./auth.ts";
import { PaymentAccounts } from "./payments.ts";

const db = openDb(process.env["OMP_DB_PATH"] ?? "data/omp.sqlite");
const store = new RecordStore(db, loadLexicons());
const { did, eventRkey } = await seedDemo(store, new IssuerKeys(db, store), new Auth(db));
const base = process.env["OMP_BASE_URL"] ?? "http://localhost:3000";
// OMP_STRIPE_ACCOUNT=acct_... connects the demo organization to a Stripe test account, so a reseed keeps paid checkout working.
const acct = process.env["OMP_STRIPE_ACCOUNT"];
if (acct && /^acct_[A-Za-z0-9]+$/.test(acct)) { new PaymentAccounts(db).set(did, acct, false); console.log(`  stripe:     connected ${acct} (test mode)`); }
console.log(`seeded demo org ${did}\n  event page: ${base}/e/${did}/${eventRkey}\n  scanner:    ${base}/scan/  (door code ${DEMO_DOOR_CODE})\n  admin:      ${base}/admin  (organizer key ${DEMO_ORGANIZER_KEY})`);
