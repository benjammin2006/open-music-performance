# @omp/tickets

Signed, offline-verifiable admission tokens. Dependency-free; runs in Node and in the browser (the door scanner PWA) on Web Crypto.

- **Token**: `OMP1.<base64url(JSON claims)>.<base64url(Ed25519 signature)>`. The signature covers the transmitted bytes of `OMP1.<payload>`, so there is nothing to canonicalize. Claims: `org` (issuer DID), `iss` (key id), `evt`, `cls`, `tid` (record keys), `ser` (serial), `exp`, optional `nbf` and `hb` (short holder binding). About 300 characters, under the 400-character QR budget.
- **Keys**: `generateIssuerKey(kid)` makes an Ed25519 pair; the public half is published on the organization record as a did:key-style multibase string (`z6Mk…`). Private keys export to JWK for the issuer key service.
- **Verification**: `verifyTicket(token, { resolveKey, now, statusList })` checks structure, issuer key, signature, time window (60 s skew), and revocation, and fails closed with a reason: `malformed`, `unsupported-version`, `unknown-key`, `bad-signature`, `not-yet-valid`, `expired`, `revoked`.
- **StatusList**: one bit per serial, gzip + base64url, in the shape of the W3C Bitstring Status List. A 10,000-ticket list encodes to well under 200 characters. Scanners download it whenever online.
- **DoorLedger**: the grow-only admitted set that catches replays. Two scanners merge ledgers in any order and converge, with the earliest admission kept. This is the shared state cryptography cannot replace (docs/ARCHITECTURE.md 5.4).

```
npm run test -w @omp/tickets     # node:test, no build step
npm run typecheck -w @omp/tickets
npm run build -w @omp/tickets    # emits dist/ with declarations
```

License: MIT.
