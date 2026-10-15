# @omp/server

The OMP API server and public pages. AGPL-3.0.

What it does today:

- **Record store** (`src/records.ts`): AT-shaped addressing (`at://did/collection/rkey`), every write validated against the `@omp/schemas` lexicons, strong refs by CID. SQLite via Node's built-in `node:sqlite`, one file, zero setup. Postgres comes when the hosted multi-tenant instance needs it.
- **Issuer keys** (`src/keys.ts`): one Ed25519 key per organization; private half in SQLite (encrypt at rest before any non-demo deployment, see the TODO in `db.ts`), public half published on the organization record.
- **Public pages**: organization page, event page with schema.org `MusicEvent` JSON-LD, program table, ticket classes with all-in prices and the fee disclosure, printable poster with QR code, order page with QR tickets.
- **Open feeds and data**: `/o/:did/calendar.ics`, `/e/:did/:rkey.ics`, `/export/:did/public.json` (every public record, in lexicon form, for anyone to index), `/e/:did/:rkey/status-list.json` and `/o/:did/issuer-keys.json` for scanners to pre-sync.
- **Free RSVP**: `POST /e/:did/:rkey/rsvp` creates a free order and issues signed tickets (`@omp/tickets`), enforcing per-order limit, capacity and the free-only rule.
- **Write API**: `POST /api/:did/:collection`, bearer-token guarded until organizer accounts exist, lexicon-validated.
- **Organizer admin** (`src/admin.ts`, `src/pages/admin.ts`) at `/admin`: sign in with the organization's organizer key (random, stored hashed, exchanged for an HttpOnly session cookie; passkeys are the planned replacement on the same session table), dashboard, new event (draft until published), event editor with ticket classes, program paste (`Title | Composer | Arranger | Performed by`, `INTERMISSION` lines), publish/unpublish/cancel, door-code display and rotation, organization settings with the default venue and timezone. Times are entered in the organization's timezone and stored as UTC (`src/time.ts`, DST-tested). Every successful POST redirects, so refresh never resubmits. The organizer session also opens the reconciliation sheet.
- **Portability** (`src/portability.ts`, `src/cli.ts`): `GET /admin/export.json` downloads every record the organization holds as one JSON bundle in the published schema, signed by the instance key published at `/.well-known/omp.json`; no secrets included. `npm run omp -- verify bundle.json [--origin]` checks the signature (and, with `--origin`, the source instance's current key). `npm run omp -- import bundle.json --db path` loads it into another instance under the same DID, keeps the old ticket-signing public keys so existing tickets still verify, provisions a new signing key, continues ticket serials, and prints a fresh organizer key. Idempotent.
- **First-run setup**: `/setup` (only while the instance has no organizations) creates the organization with a `did:web:<host>:org:<slug>` identifier, a signing key and an organizer key shown once, and signs you in. `/` redirects there on an empty instance.
- **Door endpoints**, guarded by a per-event door code: `GET /e/:did/:rkey/door.json` (the scanner's one-time sync pack) and `POST /e/:did/:rkey/scans` (idempotent scan-log upload, nonce as record key). The scanner PWA is served at `/scan/` from `apps/scanner/dist`.
- **Reconciliation sheet** (`src/reconcile.ts`, pure and tested): `GET /e/:did/:rkey/reconciliation` plus `reconciliation.csv` (summary) and `attendance.csv` (one row per ticket). Card and cash gross by class, refunds, door cash, comps, donations, headcount, no-shows, duplicate and invalid attempts, double admits across unsynced scanners, per-scanner audit, and the cash-to-deposit line. Card totals are gross; processor fees live on the organizer's own statement. Access: the event's door code entered once into a form and held in an HttpOnly session cookie, never in the URL, until organizer accounts exist.
- **Paid checkout** (`src/payments.ts`, `src/stripe.ts`): `POST /e/:did/:rkey/checkout` takes name, email and quantity, creates a `pending` order that holds the seats for 30 minutes, and redirects to a Stripe Checkout Session created as a **direct charge on the organizer's connected account** (`Stripe-Account` header; never `on_behalf_of`, never an application fee). `POST /webhooks/stripe` verifies the Connect webhook signature and on `checkout.session.completed` marks the order paid and issues signed tickets; `checkout.session.expired` releases the hold. The order page also asks Stripe about a pending session when the buyer lands on it, so a demo on localhost works without a webhook tunnel. Buyer cancellation expires the session at Stripe and releases the hold. Pay-what-you-want classes charge the buyer's offer above the floor. Organizers connect an account from `/admin/org`: Connect Standard OAuth when `OMP_STRIPE_CLIENT_ID` is set, or by pasting a connected account id (the test-mode path). The Stripe client is a 150-line fetch wrapper with an injectable transport, so the tests run the whole flow against a fake. Setup: [docs/STRIPE_SETUP.md](../docs/STRIPE_SETUP.md).

Run it:

```
cp server/.env.example server/.env   # or export the variables
npm run seed                         # loads the Lincoln High School demo (prints the door code and organizer key)
npm run dev                          # http://localhost:3000
```

Tests: `npm run test -w @omp/server` (node:test, in-memory SQLite, no network). For a clean demo state delete `data/omp.sqlite` and run `npm run seed` again.

Not yet: passkeys, email delivery of tickets, refunds from the admin (refund in the Stripe dashboard; the ticket then needs revoking by hand), encryption at rest for issuer private keys, donations UI, Eventbrite import, ActivityPub, AT Protocol publishing.
