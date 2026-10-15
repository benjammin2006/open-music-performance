# Demo plan: a walking skeleton before any survey

Status: adopted 2026-10-15 as an amendment to [SCOPE_CHARTER.md](SCOPE_CHARTER.md) section 9. It replaces weeks 1 to 4 of [PROBE_PLAN.md](PROBE_PLAN.md); the probes that stay are listed in section 8 below.

## 1. Purpose and the one metric

The demo exists to get real organizations to commit to running one real event on OMP. It is a probe, not a pitch. The only number that counts is **pilot commitments**: an organizer who says yes to running a specific upcoming concert on the hosted instance within 90 days. Applause, "interesting," and follow-up requests are logged but do not count.

Everything built for the demo is the start of v1, not a throwaway. That means the schema document exists before the first screen, and ticket signing and verification get tests in the same diff. It also means nothing goes in that is not on the charter's product list.

## 2. Audiences and formats

| Audience | What they need to see | Format |
|---|---|---|
| Music educators and ensemble directors (primary) | Free RSVP, zero fee to families, offline door, cash sheet a treasurer accepts, no district paperwork | Live demo at MEA sessions and in-person meetings; 3-minute recording for email |
| One or two small venues or pledge venues (secondary) | The same flow, plus the settlement mock-ups as "what's next" | Live demo in the venue, on their Wi-Fi-less door |
| Potential contributors | The schema doc, the signed-ticket design, the self-host command | README, ARCHITECTURE.md, the recording; not a live demo |
| Fiscal sponsors and advisors | The six "why" slides and the recording | Email |

Three artifacts from one build: the live script below, a screen recording of the same script, and six slides drawn from the research (the April 2026 verdict reaches only 8,000-plus seat venues; a $1 fee on a $5 ticket; 89% of theatre programs depend on box office; no student data by design; venue as merchant of record; what v1 is and is not).

## 3. The script (six minutes, one laptop, two phones)

Seeded data: organization "Lincoln High School Bands" (fictional), event "Winter Concert," Tuesday December 15, 2026, 7:00 pm, school auditorium, free RSVP class (capacity 400) and "$5 general admission, all-in" class, a pasted program of eight pieces, one poster image.

| # | Scene | Seconds | What the audience sees | Real or faked |
|---|---|---|---|---|
| 1 | Create the concert | 60 | Title, date, venue, two ticket classes with the all-in price shown, paste program, publish. Event page appears with a printable QR poster. | Real |
| 2 | Buy from the audience | 60 | A volunteer scans the poster with their own phone, buys the $5 ticket with Stripe's test card (or RSVPs free). The signed ticket arrives by email and on the page. Narrate: the organizer's own Stripe account took the money; OMP never held it. | Real (Stripe test mode, connected test account) |
| 3 | Doors, offline | 90 | Scanner phone goes into airplane mode on stage. Scan the volunteer's ticket: admitted. Scan it again: already used. Scan a forwarded screenshot: already used. Hand the second phone to someone and invite them to get in twice. | Real on one device. Two-device hub sync is faked by using one scanner for admits and the second only for "already used" demonstrations after a sync, or omitted |
| 4 | Reconciliation | 60 | Back online: card, cash logged at the door, comps, no-shows, deposit total. Export CSV. | Real |
| 5 | It's yours | 60 | Subscribe to the organization's iCal feed in Google Calendar live. Download the signed export bundle. Show the one-line self-host command. | Real (self-host runs on the laptop; no public self-host yet) |
| 6 | What's next | 30 | Three static screens: deal memo, settlement sheet, payout split for a club show. Say plainly they are mock-ups. | Faked, labeled |

Words to avoid on stage: decentralized, protocol, DID, blockchain, disrupt. Words to use: free, yours, works without Wi-Fi, your own Stripe account, no student data.

## 4. Build list

Stack per ARCHITECTURE.md D8: TypeScript server on Postgres, PWAs for event page, admin and scanner, Ed25519 via Web Crypto and libsodium. Deploy the hosted instance on a small VPS, not the HC VPS (no swap, memory-tight).

| Lane | Owner | Scope (allowlist) | Verify command |
|---|---|---|---|
| Schema doc | Claude | `schemas/` : org, act, event, performance, ticketClass, order, ticket, doorScan, program, donation as lexicon-shaped JSON, plus reserved NSIDs for dealMemo, advance, settlementSheet, payout | `npm run schema:check` validates every fixture against the schemas |
| Ticket signing and verification | Claude | `packages/tickets/` : token format, Ed25519 sign and verify, status list encode and decode, QR payload; tests for valid, revoked, expired, tampered, replayed | `npm test -w packages/tickets` |
| Payments | Claude | `server/payments/` : Stripe Connect Standard OAuth, Checkout session in redirect mode, `checkout.session.completed` webhook creating order and tickets, inventory hold with timer; never sets `on_behalf_of` | Stripe CLI webhook replay against a test account; one end-to-end test |
| Scanner PWA | Claude for verification core, Codex for UI | `apps/scanner/` : camera scan, offline verify, local admitted set, cash and comp logging, manual name-list check-in, printed list export | Scripted 300-scan test on two phones in airplane mode: 0 duplicate admits on one device, 15 scans/min (this is probe 8) |
| Event page, admin, reconciliation, poster | Codex from a bounded brief | `apps/web/` : create and publish, event page with JSON-LD and iCal, RSVP and buy flows, program, reconciliation sheet, CSV export, signed export bundle download | Playwright run of scenes 1, 2, 4, 5; axe accessibility check passes |
| Self-host | Codex | `docker-compose.yml`, `.env.example`, `docs/SELF_HOST.md` | Fresh clone to running instance in under 10 minutes on a clean machine |
| Settlement mock-ups | Done 2026-10-15 | Three static images in `docs/demo/mockups/` (HTML sources plus `render.sh`) | Reviewed, labeled "mock-up" in the image |

Rules for the lanes: every Codex lane gets an explicit file allowlist, an isolated branch and the verify command above; a boundary guard reverts out-of-allowlist writes; Codex never touches `packages/tickets/` or `server/payments/`. Claude reviews every lane's diff before merge.

Budget: 40 to 80 hours. Calendar: start Monday October 19, 2026; demo-ready by Sunday November 15; showings November 16 through mid-December, which is winter-concert season, so pilots can land in December or be booked for spring.

Definition of demo-ready: all six scenes run end to end on the real devices twice in a row without a reset; the recording is cut; the verify commands above all pass; the schema doc is committed and linked from the README.

## 5. Rehearsal and fallbacks

- Rehearse scene 3 on the actual phones in a dim room. Camera quality is the live-failure risk.
- Carry the printed name list from scene 3 and use it if scanning fails; it is also a feature.
- Pre-seed one purchased ticket in case the volunteer purchase in scene 2 stalls.
- Keep a local copy of the hosted instance on the laptop in case the venue has no internet; scenes 1, 3, 4 and 5 run locally, scene 2 runs from the pre-seeded ticket.
- Never demo with real card numbers or a live Stripe account.

## 6. After every showing: recover the discovery

Ask these five questions and log the answers in `docs/PROBE_RESULTS.md`, one row per showing (date, audience type, state, n present, answers, commitments, refusals and the stated reason):

1. How do you ticket and handle cash today, and who decided that?
2. Would your district or organization let you use this without an agreement, given that it stores no student data?
3. Which of the six scenes would you actually use, and which is missing something that would stop you?
4. Will you run a specific upcoming concert on it? Which one, when?
5. Who else should see this?

Questions 1 and 2 replace probes 1 and 2 at lower rigor. Question 4 is the metric.

## 7. Decision gate

After 10 showings or by December 20, 2026, whichever comes first:

| Outcome | Condition | Next |
|---|---|---|
| Build v1 for schools and community ensembles | 3 or more pilot commitments, at least one from a K-12 program | Run the pilots; v1 scope per the charter |
| Narrow | 3 or more commitments but none from K-12 (district blockers) | v1 for community, church, college and booster-run events; K-12 waits for the operator entity and an SDPC agreement |
| Settlement wedge instead | Fewer than 3 school or community commitments, but a venue asks to pilot the settlement sheet | Do not write settlement code yet; run the venue interviews from the probe plan first |
| Pause | Fewer than 3 commitments and no venue interest | Publish the demo, the research and the schemas; convert to maintenance mode |

## 8. What survives from the probe plan

- Probe 8 (offline scanning) is satisfied by the scanner lane's verify test.
- Probe 10 (fiscal sponsor emails) still runs in week 1; it costs an hour.
- Probe 12 (scope check) still runs at each quarterly review.
- Probe 11 (Eventbrite monitoring) stays as a trigger.
- Probes 1 and 2 are replaced by the post-showing questions; run the full survey later only if the gate result is "narrow" and the K-12 blocker needs sizing.
- Probes 3, 5, 6, 7 and 9 move to the settlement wedge and stage two, unchanged.
