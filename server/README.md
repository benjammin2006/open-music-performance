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
- **Paid checkout**: `POST /e/:did/:rkey/checkout` returns 501 until the payments lane lands.

Run it:

```
cp server/.env.example server/.env   # or export the variables
npm run seed                         # loads the Lincoln High School demo
npm run dev                          # http://localhost:3000
```

Tests: `npm run test -w @omp/server` (node:test, in-memory SQLite, no network).

Not yet: organizer accounts and passkeys, email delivery of tickets, Stripe checkout, the reconciliation sheet, donations UI, Eventbrite import, ActivityPub, AT Protocol publishing.
