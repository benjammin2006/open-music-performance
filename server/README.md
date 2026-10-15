# @omp/server

The OMP API server and public pages. AGPL-3.0.

What it does today:

- **Record store** (`src/records.ts`): AT-shaped addressing (`at://did/collection/rkey`), every write validated against the `@omp/schemas` lexicons, strong refs by CID. SQLite via Node's built-in `node:sqlite`, one file, zero setup. Postgres comes when the hosted multi-tenant instance needs it.
- **Issuer keys** (`src/keys.ts`): one Ed25519 key per organization; private half in SQLite (encrypt at rest before any non-demo deployment, see the TODO in `db.ts`), public half published on the organization record.
- **Public pages**: organization page, event page with schema.org `MusicEvent` JSON-LD, program table, ticket classes with all-in prices and the fee disclosure, printable poster with QR code, order page with QR tickets.
- **Open feeds and data**: `/o/:did/calendar.ics`, `/e/:did/:rkey.ics`, `/export/:did/public.json` (every public record, in lexicon form, for anyone to index), `/e/:did/:rkey/status-list.json` and `/o/:did/issuer-keys.json` for scanners to pre-sync.
- **Free RSVP**: `POST /e/:did/:rkey/rsvp` creates a free order and issues signed tickets (`@omp/tickets`), enforcing per-order limit, capacity and the free-only rule.
- **Write API**: `POST /api/:did/:collection`, bearer-token guarded until organizer accounts exist, lexicon-validated.
- **Door endpoints**, guarded by a per-event door code: `GET /e/:did/:rkey/door.json` (the scanner's one-time sync pack) and `POST /e/:did/:rkey/scans` (idempotent scan-log upload, nonce as record key). The scanner PWA is served at `/scan/` from `apps/scanner/dist`.
- **Reconciliation sheet** (`src/reconcile.ts`, pure and tested): `GET /e/:did/:rkey/reconciliation` plus `reconciliation.csv` (summary) and `attendance.csv` (one row per ticket). Card and cash gross by class, refunds, door cash, comps, donations, headcount, no-shows, duplicate and invalid attempts, double admits across unsynced scanners, per-scanner audit, and the cash-to-deposit line. Card totals are gross; processor fees live on the organizer's own statement. Access: the event's door code entered once into a form and held in an HttpOnly session cookie, never in the URL, until organizer accounts exist.
- **Paid checkout**: `POST /e/:did/:rkey/checkout` returns 501 until the payments lane lands.

Run it:

```
cp server/.env.example server/.env   # or export the variables
npm run seed                         # loads the Lincoln High School demo
npm run dev                          # http://localhost:3000
```

Tests: `npm run test -w @omp/server` (node:test, in-memory SQLite, no network). For a clean demo state delete `data/omp.sqlite` and run `npm run seed` again.

Not yet: organizer accounts and passkeys, email delivery of tickets, Stripe checkout, donations UI, Eventbrite import, ActivityPub, AT Protocol publishing.
