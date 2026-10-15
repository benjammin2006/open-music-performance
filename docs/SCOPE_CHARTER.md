# OMP Scope Charter

## 1. Purpose

Open Music Performance (OMP) gives school and community ensembles a free, open-source way to publish, sell and run live concerts without fees landing on families. This charter caps v1 at one product, one schema and one instance, because scope, not competition, is the project's biggest risk.

## 2. The one product

- Shareable event page with iCal and JSON-LD feeds
- Free RSVP
- Optional paid tickets: all-in price, paid to the organizer's own Stripe account
- Signed QR tickets plus an offline name-list check-in PWA
- Cash and door reconciliation sheet
- Digital program
- Donations
- CSV export
- Eventbrite import
- Organizer accounts with passkeys

## 3. The one schema

One published schema document defines: Organization, Act, Event, Performance, TicketClass, Ticket, Order, DoorScan, Program, Donation. None of these holds student records; v1 stores no student PII.

DealMemo, Advance and SettlementSheet are reserved in the schema namespace but not implemented in v1.

## 4. The one instance

The operator runs one hosted instance. Self-hosting is a single `docker compose` file. No per-region or per-district instances until a trigger in section 6 is met.

## 5. Not in v1

- Settlement and deal memos
- Booking marketplace
- Artist discovery
- Resale or ticket exchange
- Apple or Google Wallet passes
- Native apps
- Stripe Connect split payouts
- ActivityPub (actors and federation; outbound iCal, JSON-LD and RSS feeds are in)
- AT Protocol publishing
- Matrix
- Blockchain, wallets or tokens
- Arena-scale on-sales
- Bot defense
- Dynamic pricing
- Insurance
- Sponsorships
- A fan social network
- Multi-language support

## 6. Triggers for adding the next subsystem

v1 is "done", and the settlement wedge may start, only when all four hold:

- (a) At least 10 organizations have each run 3 or more real events on the hosted instance.
- (b) Probes 3 (venues accept zero platform fee), 6 (venues want transparent settlement) and 7 (VenuePilot leaves an unmet need) in `docs/PROBE_PLAN.md` have passed.
- (c) A fiscal sponsor agreement is signed.
- (d) A second maintainer has merged 10 or more pull requests.

AT Protocol publishing may be switched on only when a second independent host or indexer exists.

Stripe Connect split payouts may start only after a money-transmission counsel opinion and a legal entity to carry the liability.

## 7. Kill and pause criteria

- If probe 1 (educator survey, n of at least 40) fails, pivot to the settlement wedge.
- If probes 1 and 3 both fail, pause the project and publish the research.
- If the founder is still the only committer 12 months after the first commit, convert to maintenance mode.

## 8. Time box

12 months from first commit to the v1 "done" trigger, reviewed quarterly against this charter. Budget assumption: 10 hours per week. A quarterly review that finds work outside section 2 stops that work or amends this charter in writing first.

## 9. Demo track (amended 2026-10-15)

A working demo replaces weeks 1 to 4 of the probe plan; see `docs/DEMO_PLAN.md`. The demo is a subset of the section 2 product list and is the start of v1, not a throwaway: the schema document comes first, and ticket signing and verification get tests in the same diff. The decision gate is pilot commitments, counted after 10 showings or by December 20, 2026: 3 or more (at least one K-12) builds v1; 3 or more with no K-12 narrows v1 to community, church, college and booster-run events; fewer than 3 with venue interest moves the venue interviews forward; fewer than 3 and no venue interest pauses the project. Probes 8, 10, 11 and 12 survive; probes 1 and 2 become the five questions asked after every showing; probes 3, 5, 6, 7 and 9 move to the settlement wedge unchanged. Section 7's "probe 1 fails" condition is read as "the demo gate returns fewer than 3 commitments."

## 10. Change log

| Date | Change |
|---|---|
| 2026-10-14 | Charter created |
| 2026-10-15 | Demo track adopted: a walking-skeleton demo replaces probe weeks 1 to 4; gate is pilot commitments (section 9) |
| 2026-10-15 | Added rule: v1 holds no student PII (no student accounts or rosters), after finding NY Ed Law 2-d and IL SOPPA cover free teacher-adopted tools; district data agreements go through the SDPC NDPA when needed |
