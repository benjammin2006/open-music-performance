# @omp/scanner

The door scanner PWA. Syncs once while online, then verifies tickets, catches duplicates, logs cash and comps, and serves the door list with no connection at all. AGPL-3.0.

How it works:

1. **Setup**: enter the event page link and the per-event door code. The scanner fetches one "door pack" from `/e/:did/:rkey/door.json`: event details, the organization's issuer public keys, the revocation status list, ticket classes, and the door list (holder name, serial, class, status).
2. **Scan**: the camera reads QR codes with the native `BarcodeDetector` where available and a pure-JS fallback (jsQR) elsewhere; there is also a paste-or-type field for devices without a camera. Every code is verified locally with `@omp/tickets` (signature, key, time window, revocation) and checked against the local admitted set. Results are big and color-coded: green admitted, amber already used (with when and where it was first admitted), red invalid with the reason.
3. **Door list**: searchable, tap to admit someone who lost their code, printable as the all-phones-dead fallback.
4. **Cash and comp**: logged as scan entries so the reconciliation sheet sees them.
5. **Upload**: every decision goes into a local outbox and is posted to `/e/:did/:rkey/scans` whenever online. Uploads are idempotent by nonce, so retries never double count.

State (pack, ledger, outbox) persists in `localStorage`; the app shell is cached by a service worker so it opens offline.

Not yet: hub or mesh sync between scanners (two fully offline scanners will each admit the same ticket once until they sync; see docs/ARCHITECTURE.md 5.4), holder proof against screenshots, Apple or Google Wallet passes.

```
npm run build -w @omp/scanner      # bundles to dist/ (served by the server at /scan/)
npm run test -w @omp/scanner       # core decision logic, node:test
npm run typecheck -w @omp/scanner
```
