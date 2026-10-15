# OMP schema document

Generated from `schemas/lexicons/` by `npm run schema:docs`. Do not edit by hand; edit the lexicon JSON and regenerate. Fixtures in `schemas/fixtures/` are validated by `npm run schema:check`.

Records are AT Protocol lexicons (`lexicon: 1`, record key `tid`). Every record is owned by the account whose repo holds it (`ownerDid` is the repo DID, not a field). References between records are strong refs (`uri` + `cid`), so an order freezes the ticket class it was sold under.

STUBBORN_FACT: the NSID prefix `org.openmusicperformance` is a placeholder until the fiscal sponsor owns a domain (docs/ARCHITECTURE.md Q1). Rename by search-and-replace across `schemas/` only.

## Record types

| NSID | Status | Purpose |
|---|---|---|
| `org.openmusicperformance.act` | v1 | A performing unit: ensemble, band, choir, orchestra, or soloist. Owned by the act itself when it has its own account, otherwise by the organization that created it. Maps to schema.org MusicGroup or Person. |
| `org.openmusicperformance.advance` | reserved | RESERVED, not implemented in v1. Show advance for one performance: stage plot, input list, backline, hospitality, schedule, contacts. No open standard exists for this today; defining it is contributor-ready white space (docs/ARCHITECTURE.md 5.6). |
| `org.openmusicperformance.dealMemo` | reserved | RESERVED, not implemented in v1. The agreed terms between an organization and an act for one event: guarantee or door split, backend, merch terms, rider references, cancellation terms. Allocated now so the settlement wedge adds records instead of reshaping existing ones (docs/SCOPE_CHARTER.md section 3). |
| `org.openmusicperformance.donation` | v1 | A gift to the organization, optionally tied to an event. Collected on the organizer's own payment account or logged from cash. Maps to schema.org DonateAction. |
| `org.openmusicperformance.doorScan` | v1 | One check-in event at the door: a QR scan, a manual name-list admit, a cash sale, or a comp. Written by the scanner device, possibly offline, and uploaded with a nonce so replays are idempotent. The reconciliation sheet is computed from these. |
| `org.openmusicperformance.event` | v1 | A dated occurrence at a place, hosted by an organization. Maps to schema.org MusicEvent. Ticket classes, performances and the program are separate records that reference the event. |
| `org.openmusicperformance.order` | v1 | A purchase or free reservation of one or more tickets for one event. Private to the organizer; the buyer receives a copy. Maps to schema.org Order. The payment provider is the merchant of record relationship the organizer holds; OMP never holds funds. |
| `org.openmusicperformance.organization` | v1 | A school music program, ensemble organization, venue, concert series, or promoter. The owner of events, ticket classes, orders, tickets, scans, programs and donations. Maps to schema.org Organization, MusicVenue or MusicGroup depending on kind. |
| `org.openmusicperformance.payout` | reserved | RESERVED, not implemented in v1. A transfer of settled funds to a party, recorded when Stripe Connect split payouts exist. Gated by a money-transmission counsel opinion and a legal entity (docs/SCOPE_CHARTER.md section 6). |
| `org.openmusicperformance.performance` | v1 | One act performing at one event: the atom of the performance database. Maps to schema.org MusicEvent.performer and subEvent. Either act (a reference) or actName (free text for acts without a record) is required; validation of that rule is in the application layer. |
| `org.openmusicperformance.program` | v1 | The digital program for an event: repertoire, performers as the organizer chooses to credit them, and notes. This is organizer-entered public content, the same as a printed program; it is not a student record and holds no contact details. |
| `org.openmusicperformance.settlementSheet` | reserved | RESERVED, not implemented in v1. The signed, finalized reconciliation of gross sales, taxes, fees, approved expenses and the amount due to each party for one event. Concurrent edits are allowed until a signed finalize snapshot. |
| `org.openmusicperformance.ticket` | v1 | A single admission credential, signed by the organization's issuer key. The record is the organizer's ledger entry; the holder carries the compact signed token (see packages/tickets for the token format). Maps to schema.org Ticket. |
| `org.openmusicperformance.ticketClass` | v1 | A sellable or reservable class of admission for an event: free RSVP, paid general admission, donation-based, or comp. Maps to schema.org Offer. Price is the all-in price the buyer pays. |

## `org.openmusicperformance.act`

A performing unit: ensemble, band, choir, orchestra, or soloist. Owned by the act itself when it has its own account, otherwise by the organization that created it. Maps to schema.org MusicGroup or Person.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string (≤200 chars) | yes |  |
| `kind` | string (one of: ensemble, band, choir, orchestra, soloist, duo, other) | yes |  |
| `description` | string (≤3000 chars) |  |  |
| `genres` | array of string (≤50 chars) (max 10) |  |  |
| `website` | string (uri) |  |  |
| `links` | array of ref → defs#externalLink (max 20) |  |  |
| `homeLocation` | ref → defs#location |  |  |
| `avatar` | blob (image/png, image/jpeg, image/webp; ≤2 MB) |  |  |
| `createdAt` | string (datetime) | yes |  |

## `org.openmusicperformance.advance` (reserved)

RESERVED, not implemented in v1. Show advance for one performance: stage plot, input list, backline, hospitality, schedule, contacts. No open standard exists for this today; defining it is contributor-ready white space (docs/ARCHITECTURE.md 5.6).

| Field | Type | Required | Description |
|---|---|---|---|
| `reserved` | boolean | yes | Always true while this record type is reserved. Any instance in the wild is a bug. |
| `createdAt` | string (datetime) | yes |  |

## `org.openmusicperformance.dealMemo` (reserved)

RESERVED, not implemented in v1. The agreed terms between an organization and an act for one event: guarantee or door split, backend, merch terms, rider references, cancellation terms. Allocated now so the settlement wedge adds records instead of reshaping existing ones (docs/SCOPE_CHARTER.md section 3).

| Field | Type | Required | Description |
|---|---|---|---|
| `reserved` | boolean | yes | Always true while this record type is reserved. Any instance in the wild is a bug. |
| `createdAt` | string (datetime) | yes |  |

## `org.openmusicperformance.donation`

A gift to the organization, optionally tied to an event. Collected on the organizer's own payment account or logged from cash. Maps to schema.org DonateAction.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | ref → defs#strongRef |  |  |
| `amount` | ref → defs#money | yes |  |
| `donor` | ref → defs#contact |  |  |
| `anonymous` | boolean |  | If true, the donor is not credited publicly even when a contact is stored for receipts. Default: `false`. |
| `paymentProvider` | string (one of: stripe, square, cash, check, other) | yes |  |
| `paymentRef` | string |  |  |
| `status` | string (one of: pending, completed, refunded, failed) | yes |  |
| `message` | string (≤500 chars) |  |  |
| `createdAt` | string (datetime) | yes |  |

## `org.openmusicperformance.doorScan`

One check-in event at the door: a QR scan, a manual name-list admit, a cash sale, or a comp. Written by the scanner device, possibly offline, and uploaded with a nonce so replays are idempotent. The reconciliation sheet is computed from these.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | ref → defs#strongRef | yes |  |
| `ticket` | ref → defs#strongRef |  | Absent for cash and walk-up admits with no ticket. |
| `scannerId` | string | yes | Stable id of the scanning device or operator. |
| `nonce` | string | yes | Unique per scan; the server ignores a second upload with the same nonce. |
| `result` | string (one of: admitted, duplicate, invalid, revoked, expired, manualAdmit, cashAdmit, compAdmit, denied) | yes |  |
| `cashCollected` | ref → defs#money |  | Set on cashAdmit. Feeds the deposit total. |
| `offline` | boolean |  | True if the scanner had no connection to the hub or server at the moment of the scan. |
| `note` | string (≤300 chars) |  |  |
| `scannedAt` | string (datetime) | yes |  |

## `org.openmusicperformance.event`

A dated occurrence at a place, hosted by an organization. Maps to schema.org MusicEvent. Ticket classes, performances and the program are separate records that reference the event.

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string (≤200 chars) | yes |  |
| `description` | string (≤5000 chars) |  |  |
| `startsAt` | string (datetime) | yes |  |
| `endsAt` | string (datetime) |  |  |
| `doorsAt` | string (datetime) |  |  |
| `timezone` | string | yes | IANA timezone name used to display times. |
| `location` | ref → defs#location | yes |  |
| `venue` | string (did) |  | DID of the venue organization, when it is a distinct OMP organization. |
| `status` | string (one of: draft, published, cancelled, postponed, completed) | yes |  |
| `visibility` | string (one of: public, unlisted) |  |  Default: `public`. |
| `ageRestriction` | string |  | Free text such as 'All ages' or '21+'. |
| `refundPolicy` | ref → #refundPolicy | yes |  |
| `feeDisclosure` | ref → #feeDisclosure | yes |  |
| `taxNote` | string (≤500 chars) |  | Organizer-set statement of any sales or amusement tax included in the all-in price. |
| `poster` | blob (image/png, image/jpeg, image/webp; ≤5 MB) |  |  |
| `tags` | array of string (≤50 chars) (max 10) |  |  |
| `createdAt` | string (datetime) | yes |  |

### `#refundPolicy`

Machine-readable refund policy. Defaults are the fan-expected norm: full refund of the all-in price on cancellation.

| Field | Type | Required | Description |
|---|---|---|---|
| `onCancellation` | string (one of: full, none) | yes | What a buyer gets if the event is cancelled. |
| `onPostponement` | string (one of: full, honor, honorOrFull) | yes | honor: ticket is valid for the new date; honorOrFull: buyer may choose. |
| `buyerCancellation` | string (one of: none, untilDoors, custom) |  |  Default: `none`. |
| `text` | string (≤2000 chars) |  | Human-readable policy shown at checkout. |

### `#feeDisclosure`

What the all-in price includes. The platform fee is always disclosed; for OMP v1 it is zero.

| Field | Type | Required | Description |
|---|---|---|---|
| `platformFeeCents` | integer (≥0) | yes | Per-ticket platform fee included in the all-in price. 0 in OMP v1. |
| `organizerFeeCents` | integer (≥0) |  | Optional per-ticket fee the organizer sets and keeps, disclosed as its own line. |
| `processorNote` | string (≤300 chars) |  | Statement that card processing is paid by the organizer from the all-in price. |

## `org.openmusicperformance.order`

A purchase or free reservation of one or more tickets for one event. Private to the organizer; the buyer receives a copy. Maps to schema.org Order. The payment provider is the merchant of record relationship the organizer holds; OMP never holds funds.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | ref → defs#strongRef | yes |  |
| `items` | array of ref → #item (max 20) | yes |  |
| `buyer` | ref → defs#contact | yes |  |
| `status` | string (one of: pending, paid, free, refunded, partiallyRefunded, cancelled, failed) | yes |  |
| `paymentProvider` | string (one of: none, stripe, square, cash, check, other) | yes |  |
| `paymentRef` | string |  | Provider-side id, e.g. a Stripe Checkout Session id. Never card data. |
| `total` | ref → defs#money | yes |  |
| `refundedTotal` | ref → defs#money |  |  |
| `notes` | string (≤1000 chars) |  |  |
| `createdAt` | string (datetime) | yes |  |
| `paidAt` | string (datetime) |  |  |

### `#item`

| Field | Type | Required | Description |
|---|---|---|---|
| `ticketClass` | ref → defs#strongRef | yes | Strong ref freezes the class as sold, so later price edits do not rewrite history. |
| `quantity` | integer (≥1) | yes |  |
| `unitPrice` | ref → defs#money | yes |  |

## `org.openmusicperformance.organization`

A school music program, ensemble organization, venue, concert series, or promoter. The owner of events, ticket classes, orders, tickets, scans, programs and donations. Maps to schema.org Organization, MusicVenue or MusicGroup depending on kind.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string (≤200 chars) | yes |  |
| `kind` | string (one of: school, ensemble, venue, series, promoter, congregation, other) | yes |  |
| `description` | string (≤3000 chars) |  |  |
| `website` | string (uri) |  |  |
| `links` | array of ref → defs#externalLink (max 20) |  |  |
| `location` | ref → defs#location |  |  |
| `timezone` | string |  | IANA timezone name, e.g. America/Chicago. |
| `issuerKeys` | array of ref → defs#issuerKey (max 10) |  | Current and recently rotated ticket-signing keys. Scanners accept any listed key within its validity window. |
| `avatar` | blob (image/png, image/jpeg, image/webp; ≤2 MB) |  |  |
| `createdAt` | string (datetime) | yes |  |

## `org.openmusicperformance.payout` (reserved)

RESERVED, not implemented in v1. A transfer of settled funds to a party, recorded when Stripe Connect split payouts exist. Gated by a money-transmission counsel opinion and a legal entity (docs/SCOPE_CHARTER.md section 6).

| Field | Type | Required | Description |
|---|---|---|---|
| `reserved` | boolean | yes | Always true while this record type is reserved. Any instance in the wild is a bug. |
| `createdAt` | string (datetime) | yes |  |

## `org.openmusicperformance.performance`

One act performing at one event: the atom of the performance database. Maps to schema.org MusicEvent.performer and subEvent. Either act (a reference) or actName (free text for acts without a record) is required; validation of that rule is in the application layer.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | ref → defs#strongRef | yes |  |
| `act` | ref → defs#strongRef |  |  |
| `actName` | string (≤200 chars) |  |  |
| `role` | string (one of: headliner, support, ensemble, soloist, guest, opener) |  |  |
| `order` | integer (≥0) | yes | Position in the running order, 0 first. |
| `setStartsAt` | string (datetime) |  |  |
| `setEndsAt` | string (datetime) |  |  |
| `notes` | string (≤1000 chars) |  |  |
| `createdAt` | string (datetime) | yes |  |

## `org.openmusicperformance.program`

The digital program for an event: repertoire, performers as the organizer chooses to credit them, and notes. This is organizer-entered public content, the same as a printed program; it is not a student record and holds no contact details.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | ref → defs#strongRef | yes |  |
| `title` | string (≤200 chars) |  |  |
| `pieces` | array of ref → #piece (max 200) | yes |  |
| `notes` | string (≤5000 chars) |  | Director's notes, acknowledgements, sponsors. |
| `createdAt` | string (datetime) | yes |  |

### `#piece`

| Field | Type | Required | Description |
|---|---|---|---|
| `order` | integer (≥0) | yes |  |
| `title` | string (≤300 chars) | yes |  |
| `composer` | string (≤200 chars) |  |  |
| `arranger` | string (≤200 chars) |  |  |
| `performedBy` | string (≤500 chars) |  | Ensemble or performer credit as printed, e.g. 'Wind Ensemble' or 'Soloist: J. Rivera'. |
| `durationSeconds` | integer (≥0) |  |  |
| `notes` | string (≤2000 chars) |  |  |
| `isIntermission` | boolean |  |  Default: `false`. |

## `org.openmusicperformance.settlementSheet` (reserved)

RESERVED, not implemented in v1. The signed, finalized reconciliation of gross sales, taxes, fees, approved expenses and the amount due to each party for one event. Concurrent edits are allowed until a signed finalize snapshot.

| Field | Type | Required | Description |
|---|---|---|---|
| `reserved` | boolean | yes | Always true while this record type is reserved. Any instance in the wild is a bug. |
| `createdAt` | string (datetime) | yes |  |

## `org.openmusicperformance.ticket`

A single admission credential, signed by the organization's issuer key. The record is the organizer's ledger entry; the holder carries the compact signed token (see packages/tickets for the token format). Maps to schema.org Ticket.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | ref → defs#strongRef | yes |  |
| `ticketClass` | ref → defs#strongRef | yes |  |
| `order` | ref → defs#strongRef | yes |  |
| `serial` | integer (≥0) | yes | Per-event index; its bit in the event's status list marks revocation. |
| `status` | string (one of: valid, revoked, refunded, transferred) | yes |  |
| `holderBinding` | string |  | Hash of the holder's email or holder public key, carried in the token so a scanner can prompt for a name match. Never the raw email. |
| `holderLabel` | string (≤200 chars) |  | Name shown on the door list, as the buyer entered it. |
| `issuerKid` | string | yes |  |
| `token` | string |  | The compact signed token encoded in the QR code. Stored so the organizer can re-send it. |
| `issuedAt` | string (datetime) | yes |  |
| `revokedAt` | string (datetime) |  |  |
| `revocationReason` | string (≤300 chars) |  |  |

## `org.openmusicperformance.ticketClass`

A sellable or reservable class of admission for an event: free RSVP, paid general admission, donation-based, or comp. Maps to schema.org Offer. Price is the all-in price the buyer pays.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | ref → defs#strongRef | yes |  |
| `name` | string (≤100 chars) | yes |  |
| `kind` | string (one of: freeRsvp, paid, payWhatYouWant, comp) | yes |  |
| `price` | ref → defs#money | yes | All-in price. amountCents is 0 for freeRsvp and comp, and the suggested amount for payWhatYouWant. |
| `minimumPrice` | ref → defs#money |  | Floor for payWhatYouWant. |
| `capacity` | integer (≥0) |  | Maximum tickets in this class. Omit for unlimited. |
| `perOrderLimit` | integer (≥1) |  | Advertised and enforced per-order maximum. If advertised it must be enforced (BOTS Act posture). Default: `10`. |
| `salesStartAt` | string (datetime) |  |  |
| `salesEndAt` | string (datetime) |  |  |
| `description` | string (≤1000 chars) |  |  |
| `sortOrder` | integer (≥0) |  |  |
| `createdAt` | string (datetime) | yes |  |

## Shared definitions (`org.openmusicperformance.defs`)

### `#strongRef`

A reference to a specific version of another record.

| Field | Type | Required | Description |
|---|---|---|---|
| `uri` | string (at-uri) | yes |  |
| `cid` | string (cid) | yes |  |

### `#money`

An amount in minor units of an ISO 4217 currency. 500 USD cents is $5.00.

| Field | Type | Required | Description |
|---|---|---|---|
| `amountCents` | integer (≥0) | yes |  |
| `currency` | string | yes | ISO 4217 code, upper case. |

### `#location`

A physical place. Address fields are optional so a house concert can withhold its street address until RSVP.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string (≤200 chars) | yes |  |
| `streetAddress` | string (≤300 chars) |  |  |
| `locality` | string (≤100 chars) |  | City or town. |
| `region` | string (≤100 chars) |  | State or province. |
| `postalCode` | string (≤20 chars) |  |  |
| `country` | string |  | ISO 3166-1 alpha-2. |
| `capacity` | integer (≥0) |  |  |
| `accessibilityNotes` | string (≤1000 chars) |  |  |

### `#contact`

An adult contact collected by the organizer. Never a student record (docs/ARCHITECTURE.md section 7).

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string (≤200 chars) | yes |  |
| `email` | string |  |  |
| `phone` | string |  |  |
| `marketingConsent` | boolean |  | True only if the person opted in to be contacted about future events. |

### `#issuerKey`

The public half of an organization's Ed25519 ticket-signing key.

| Field | Type | Required | Description |
|---|---|---|---|
| `kid` | string | yes | Key id carried in every signed ticket. |
| `alg` | string (one of: Ed25519) | yes |  |
| `publicKeyMultibase` | string | yes | Multibase (base58btc, z-prefixed) encoding of the raw public key. |
| `validFrom` | string (datetime) |  |  |
| `validUntil` | string (datetime) |  |  |

### `#externalLink`

| Field | Type | Required | Description |
|---|---|---|---|
| `uri` | string (uri) | yes |  |
| `label` | string (≤100 chars) |  |  |
