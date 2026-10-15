# Probe plan: four weeks before any code

Source: `reports/Open music ticketing landscape.md`, section "Load-bearing assumptions to probe before building" (12 assumptions), plus segment (d) in `research_notes/Open music ticketing landscape/artist_venue_friction.md`.

Decisions already made, and not re-litigated here: v1 beachhead is school and community ensembles; the artist-to-venue settlement tool is the second wedge; no blockchain in v1; a fiscal sponsor (HCB or Open Source Collective) holds the trademark and schemas, with a later founder-owned operator LLC; AGPL open core plus a small hosted operator, each organizer as merchant of record on its own Stripe account, venue-signed offline-verifiable tickets, AT-Protocol-shaped schemas.

The point of this plan is to find out, cheaply, whether those decisions survive contact with real educators, districts, organizers and venues. No product code gets written in these four weeks. The only code is two throwaway one-day prototypes (probes 8 and 9).

## Budget and ground rules

- About 10 to 12 hours a week of evenings and weekends, roughly 45 hours over four weeks for the gating lane. The settlement lane adds about 20 hours, mostly in month 2.
- Out-of-pocket cost for the four weeks is close to $0. The only paid items are optional: a travel router for probe 8, a throwaway VM and possibly a domain for probe 9, and one hour of counsel for probe 5 (month 2 or later).
- Every result goes into `docs/PROBE_RESULTS.md` (create it with the first result; one section per probe: date, sample, raw counts, verdict). Decisions also go into `docs/SCOPE_CHARTER.md`, which probe 12 creates. No other new documents.
- If a probe's result is ambiguous, write down the ambiguity and the next cheapest test. Do not round an inconclusive result up to a pass.

## Order of work

Probes are ordered first by whether they gate the v1 beachhead decision, then by cost, with long-lead items (anything that waits on other people) started on day one.

| Order | # | Probe | Gates | Hours | Out of pocket | When |
|---|---|---|---|---|---|---|
| 1 | 12 | Scope charter | v1 | 2 | $0 | Week 1, day 1 |
| 2 | 10 | Fiscal sponsor emails (HCB, OSC) | v1 | 1.5 | $0 | Week 1 send; replies by week 4 |
| 3 | 11 | Eventbrite pricing monitor (set up baseline) | Trigger only | 0.5, then 0.25/month | $0 | Week 1, then monthly |
| 4 | 1 | Educator survey (n ≥ 40) | v1 | 10 | $0 | Opens week 1, closes end of week 3 |
| 5 | 2 | District fine-arts coordinator calls (5) | v1 | 6 | $0 | Schedule week 1, calls weeks 2-3 |
| 6 | 4 | Concierge pilot, 3 organizers on their own Stripe | v1 | 12 | $0 to Ben | Recruit week 1; onboarding verdict week 4; events late fall |
| 7 | 8 | Offline signed-QR scanning prototype | v1 | 8 | $0 to about $50 | Week 3 weekend |
| 8 | 3, 7 | Venue interviews (10 total, 5 of them VenuePilot users) | Settlement wedge | 14 | $0 | Recruit week 3; interviews week 4 and month 2 |
| 9 | 6 | Free settlement-sheet template, 30-day use count | Settlement wedge | 5 | $0 | Offer in week 4; count at day 30 |
| 10 | 9 | AT lexicon spike | Architecture B only | 8 | A few dollars | Any free weekend day; default month 2 |
| 11 | 5 | Money-transmission counsel, one hour | Connect splits and self-escrow | 3 | One billed hour (quote first; rate not researched) | Before any Connect split or self-escrow feature; not needed for the v1 MVP with direct charges |

Probe 11 (Eventbrite) is a monitoring trigger, not an experiment. Probe 9 can move to any week where there is slack, because it only informs when to switch on AT publishing, not the v1 decision. Probes 3, 6 and 7 can slip to month 2 without delaying the week-4 gate, except when the gate points to a pivot (see "Decision gate").

## Week-by-week schedule

Dates assume a start on Monday, October 19, 2026. Shift as needed.

| Week | Gating lane (v1) | Parallel lane (settlement wedge, optional) | Hours | Output by end of week |
|---|---|---|---|---|
| 1 (Oct 19-25) | P12 write scope charter. P10 send HCB and OSC emails. P11 save Eventbrite pricing baseline and set a monthly reminder. P1 build survey, test it on 2 colleagues, launch on first channels. P2 pick 5 to 8 coordinators, send call requests. P4 ask 4 to 5 organizers, aiming for 3 yeses. | None | 11 | Charter committed; survey live; calls requested; sponsor emails sent |
| 2 (Oct 26-Nov 1) | P1 second distribution round (MEA lists, Facebook groups after admin approval). P2 first 2 to 3 calls. P4 kickoff calls; organizers start Stripe onboarding on their own. | None | 10 | Survey at roughly half of target; first call notes in PROBE_RESULTS |
| 3 (Nov 2-8) | P8 one-day scanning prototype (weekend). P1 final reminder; close on day 21. P2 remaining calls. P4 check onboarding status; each organizer makes and refunds one test charge. | Send interview requests to Raise the Bar, #MyMerch and VenuePilot venues | 13 | P8 verdict; survey closed; all 5 calls done |
| 4 (Nov 9-15) | P1 analysis against EDUCATOR_SURVEY.md scoring. P2 synthesis. P4 onboarding verdict. P10 chase replies. P12 scope check. Write the gate memo. | First 2 to 3 venue interviews; offer P6 template | 11 | Decision gate memo in PROBE_RESULTS and SCOPE_CHARTER |
| Month 2 | P4 pilot events run (school winter concerts, community holiday concerts, church Advent series). P9 spike on a free weekend day. | Remaining venue interviews (P3, P7). P6 30-day count. P5 counsel only if Connect splits move onto the roadmap. | About 20 | Settlement-wedge verdict; pilot event results |

### Decision gate (end of week 4)

| Outcome | Conditions |
|---|---|
| **Proceed: build v1 for schools** | P1 passes; P2 passes; P4 onboarding passes (at least 2 of 3 organizers have live accounts); P8 passes or has a known fix; P10 has at least one positive reply or no refusals yet; P12 scope check passes. |
| **Proceed, narrowed** | P1 passes overall or for community, church and college respondents, but P2 fails for K-12 districts. Build v1 for community ensembles, church series, college recitals and booster-run events; revisit districts when the operator LLC can sign DPAs. |
| **Pivot to the settlement wedge** | P1 fails (educators are satisfied or "the district handles it"), while P4 and P12 pass. Do not write settlement code yet: make the venue lane (P3, P6, P7) the main month-2 work and build only if those pass. |
| **Stop and reassess** | Any of: P1 fails and the early venue interviews show no interest; P4 fails (organizers will not hold their own processor accounts, which breaks the compliance posture for both wedges); both sponsors refuse in P10; P12 fails (scope already spread to 2 or more subsystems). |

A P4 failure has one fallback worth checking before stopping: a v1 with no card sales at all (free RSVP, comps, door cash log and deposit report, programs, donation links to existing tools). That serves free concerts and cash reconciliation without anyone touching a processor.

---

## Probe details

### Probe 12: Scope charter

- **Goal.** Lock scope before research results tempt expansion. Over-building is the stated failure mode.
- **Assumption.** "The founder can sustain one narrow product for 3+ years."
- **Method.** Write a one-page `docs/SCOPE_CHARTER.md`: one product (the school and community concert tool), one hosted instance, one schema document. List the six planned subsystems (ticketing, settlement, contracts, promotion, performance database, artist-venue comms) and mark five as deferred. Time-box: no second subsystem until 10 paying or dependent organizations. Re-read it at the week-4 gate.
- **Sample size.** Not applicable.
- **Time.** 2 hours. **Out of pocket.** $0.
- **Decision rule.** Pass at week 4 if no code or design document exists for any subsystem outside the beachhead. Probe prototypes (P8, P9) and the P6 spreadsheet template are exempt because they are throwaway. Fail if scope has expanded to 2 or more subsystems before probe 1 returns, which is the report's falsifier.
- **On fail.** Archive the extra work in a `parked/` folder, re-sign the charter, and treat it as a stop-and-reassess signal at the gate.
- **Updates.** `docs/SCOPE_CHARTER.md` (created here), `docs/PROBE_RESULTS.md`.

### Probe 10: Fiscal sponsor structure

- **Goal.** Confirm the governance split works before building a brand on it.
- **Assumption.** "A fiscal sponsor will hold the trademark while a founder-owned operator licenses it."
- **Method.** One email each to HCB (7% fee) and Open Source Collective (10% fee) describing the exact structure: sponsor holds the OMP trademark and schema repository; a separate founder-owned LLC runs the hosted instance under a trademark license; AGPL code with a DCO, permissively licensed schemas. Ask three questions: Will you hold a trademark? Will you license it to a related for-profit operator, and on what terms? What is your exit process if the project leaves or you wind down? (Open Collective Foundation's 2024 dissolution gave some projects 16 days' notice.)
- **Sample size.** 2 sponsors.
- **Time.** 1.5 hours including follow-up. **Out of pocket.** $0.
- **Decision rule.** Pass if at least one sponsor confirms in writing that it will hold the mark and license it to a founder-owned operator on terms Ben can accept. Fail if both refuse, or both require terms that block an operator entity. No reply by week 4 counts as pending, not fail.
- **On fail.** Ask Software Freedom Conservancy (requires an OSI-approved license; membership is by application), or postpone trademark registration and publish a written commitment to transfer the mark to a nonprofit, then revisit with counsel. Do not let this block the build; it blocks only the trademark filing and public launch.
- **Updates.** `docs/SCOPE_CHARTER.md` (legal home section), `docs/PROBE_RESULTS.md`.

### Probe 11: Eventbrite exodus trigger (monitoring, not a probe)

- **Goal.** Notice an "exodus moment" in the free and low-price segment when it happens.
- **Assumption.** "Eventbrite will create an 'exodus moment' in the free and low-price segment."
- **Method.** Week 1: save a dated PDF of Eventbrite's organizer pricing page and payout help page as the baseline (currently 3.7% + $1.79 per paid ticket plus 2.9% processing; free events free; payouts default to 3 days post-event with a 20% reserve). Then check monthly on the 1st.
- **Sample size.** Not applicable.
- **Time.** 0.5 hours to set up, 15 minutes a month. **Out of pocket.** $0.
- **Trigger rule.** Fire if Eventbrite adds any fee on free events, raises the per-ticket fee, or tightens payout or reserve terms. On fire: move an Eventbrite importer up the v1 backlog and prepare a short "how to move your free events" page. The assumption is falsified if pricing stays stable through 2027; that changes nothing in v1 except the importer's priority.
- **Updates.** `docs/PROBE_RESULTS.md` (one line per monthly check).

### Probe 1: Educator survey

- **Goal.** Test whether the beachhead's pain is real for the people who would adopt the tool. The report notes that segment (d) evidence is the thinnest in survey terms and that no survey of music educators' ticketing practices was found.
- **Assumption.** "Music educators feel fee, cash and RSVP pain strongly enough to switch."
- **Method.** The 15-question instrument in `docs/EDUCATOR_SURVEY.md`, distributed through Ben's conference sessions, state MEA lists and Facebook groups, NAfME forums, college department listservs and community band association lists. One tagged link per channel so sources can be compared without asking location.
- **Sample size.** n ≥ 40 valid responses; stretch 80. Aim for at least 20 K-12 respondents so the district question (assumption 2) has a usable subgroup.
- **Time.** 10 hours (build and test 3, distribution and reminders 3, analysis 4). **Out of pocket.** $0 (Google Forms or similar).
- **Decision rule.** Use the "Scoring and decision rule" section of `docs/EDUCATOR_SURVEY.md`. Summary: pass if at least 50% of respondents are pain-positive (a 4 or 5 on fee, cash or RSVP pain), at least 25% are both pain-positive and open to switching, and at least 5 answer Yes to the pilot question with a contact email. Fail if fewer than 35% are pain-positive, or more than 50% are satisfied with no pain item at 4 or above, or fewer than 3 volunteer.
- **On fail.** Check subgroups first: a pass among community, church or college respondents supports the "Proceed, narrowed" outcome. A fail across all subgroups points to the settlement-wedge pivot.
- **Updates.** `docs/PROBE_RESULTS.md`; beachhead line in `docs/SCOPE_CHARTER.md`. Share an aggregate summary back to respondents and channels.

Background for interpreting answers (all from the research notes; labels kept):

| Vendor | Fee as found | Source quality |
|---|---|---|
| GoFan | Buyer pays $1 on tickets up to $10, $1 + 5% above; free to schools; uses buyer emails for its own marketing (opt-out). One district page shows $1 + 3%. | Vendor FAQ; district page |
| Hometown Ticketing | $1 per ticket, no license or monthly fee; Stripe 2.9% + 30¢ separate | President quoted in an undated article; vendor blog |
| Ludus | 5% + $0.75 per ticket, passed to patrons; patrons can pay cash to avoid fees | Competitor-reported fee; Capterra reviews |
| On the Stage | $1.85-3.85 per ticket (unverified); one K-12 reviewer reports fees on cash and comp tickets and a year-long contract | SoftwareFinder; Capterra |
| BookTix | "Free to your organization" online; buyer-fee terms not stated; may be UK-focused | Partner page |
| Eventbrite | 3.7% + $1.79 per paid ticket + 2.9% processing; free events free (a 2023 fee on free events was reversed in 2024) | Official pricing; competitor blogs |

### Probe 2: District fine-arts coordinator calls

- **Goal.** Find out whether procurement blocks adoption regardless of product quality.
- **Assumption.** "Fine-arts ticketing is not locked to district-mandated vendors."
- **Method.** 30-minute phone or video calls using the script below. Recruit from Ben's conference and MEA contacts. Mix at least two states and at least one large and one small district. Take notes in a fixed template (one row per question) so answers can be counted.
- **Sample size.** 5 coordinators (report target); call up to 3 more if the result is split.
- **Time.** 6 hours (scheduling 1, calls 3, notes and synthesis 2). **Out of pocket.** $0.
- **Decision rule.** Pass if at most 1 of 5 reports that fine-arts events must use a district-mandated vendor (such as the athletics vendor) AND at most 2 of 5 require a signed data privacy agreement (DPA) with a legal entity before a teacher can use a free tool that collects parent names or emails. Fail if 3 or more of 5 report a mandated vendor, OR 3 or more require a signed DPA from a legal entity. A 2-of-5 split on mandated vendors is inconclusive: make the extra calls.
- **On fail.** If the blocker is mandated vendors, K-12 district events are out of v1; narrow to community ensembles, church series, college recitals and booster-run events. If the only blocker is the DPA, K-12 waits for the operator LLC (an entity that can sign) and v1 narrows the same way meanwhile. Either way, record which states and district sizes said what.
- **Updates.** `docs/PROBE_RESULTS.md`; beachhead line in `docs/SCOPE_CHARTER.md`. The report lists school-specific requirements (DPAs, VPATs, FERPA) as unverified background; these calls are the first verification. Added 2026-10-15: the literature round found that New York Ed Law 2-d covers click-through terms a teacher accepts even for free tools, and Illinois SOPPA requires a posted written agreement with any operator holding student data, so the architecture now holds no student PII in v1. Include at least one New York or Illinois district in the five calls, and record whether the no-student-PII design changes the coordinator's answer to question 4.

#### Call script: district fine-arts coordinator (about 30 minutes)

Opening: "I'm a music educator researching how school concerts are ticketed and how money is handled at the door. I'm not selling anything. I'd like to understand your district's rules so that anything I build fits them."

1. How are band, choir and orchestra concerts ticketed across your district today? Is it the same for every school, or does each director decide?
2. Is there a district-mandated or district-contracted ticketing vendor? Does it cover fine arts, or only athletics? Could a director use a different tool for a concert?
3. Does a free tool, with no cost to the district, still go through procurement or approval? Above what dollar amount does a purchase need extra approval, and does "free to the school but fees to families" count as a purchase?
4. Does your district require a student data privacy agreement (DPA) before staff use a web tool? Would it apply if the tool collects only parent names and emails, not student records? Does the other party have to be a legal entity, such as a company or nonprofit, to sign it? Has the district adopted the Student Data Privacy Consortium's National Data Privacy Agreement (NDPA), and if a tool's provider signed it with one district in your state, would you accept that?
5. Do you require a VPAT or other accessibility documentation from software vendors? Is WCAG 2.1 AA, or the 2027-2028 ADA Title II web deadlines, part of your review yet?
6. What are the cash-handling rules for concert admissions: deposit deadline, two-person counts, receipt books or ticket logs, where the money must be deposited?
7. Where must ticket and donation money end up: a school activity account, a district account, or a booster club account? Can a booster club run its own card account for concerts?
8. Who signs software or terms-of-service agreements for a school program: the director, principal, business office, IT or the board?
9. What problems have you seen with concert ticketing or cash handling in the last few years: audit findings, family complaints about fees, access for families without cards or internet?
10. If a free tool met your rules, what would the approval path for a one-concert pilot look like, and who else should I talk to?

### Probe 4: Concierge pilot on organizers' own Stripe accounts

- **Goal.** Test the load-bearing compliance posture: each organizer is merchant of record and carries refund and chargeback risk.
- **Assumption.** "Organizers will connect their own processor account and carry refund and chargeback risk."
- **Method.** Three organizers (ideally one K-12 program or booster club, one community ensemble, one church series) each run one paid or donation event using Stripe Payment Links on their own Stripe account plus a spreadsheet settlement and door log that Ben provides. Ben never holds funds and never logs into their accounts; he helps by screen-share only. Each organizer makes one test charge and one refund before the event. Recruit from survey pilot volunteers if they arrive in time; otherwise from Ben's network in week 1. The pilot event itself must be a paid or donation event; a free RSVP event does not test this assumption.
- **Sample size.** 3 organizers, 3 events.
- **Time.** 12 hours (recruiting 2, kickoff and onboarding help 4, event support 3, reconciliation and write-up 3). **Out of pocket.** $0 to Ben. Organizers pay standard card processing (about 2.9% + 30¢) on their own accounts.
- **Decision rule.** Onboarding half, judged at week 4: pass if at least 2 of 3 organizers have charges and payouts enabled within 7 days of starting, with 2 hours or less of Ben's help each, and have completed the test charge and refund. Event half, judged after the events: pass if at least 2 events reconcile the spreadsheet to the Stripe payout within 3 days, and no more than 1 account has a reserve or payout hold beyond Stripe's standard schedule. Fail if 2 or more organizers balk at onboarding (will not create an account, cannot get permission from their school or board, or give up), or 2 or more accounts get reserves or holds that delay payouts past the event.
- **On fail.** Record why (permission, paperwork, fear of chargebacks, processor reserves). Consider the no-card-sales v1 described under the decision gate. If the cause is "the school cannot open an account but the booster club can," feed it back into probe 2's question 7.
- **Updates.** `docs/PROBE_RESULTS.md`; payments posture section of `docs/SCOPE_CHARTER.md`.

Timing note: school winter concerts mostly fall after week 4, so the gate uses the onboarding half and the event half confirms before any paid-ticket feature ships.

### Probe 8: Offline signed-QR scanning prototype

- **Goal.** Prove that phone-based door check-in works with no Wi-Fi and no cellular before promising it to a school gym or church hall.
- **Assumption.** "Offline signed-QR check-in on a phone PWA works in a gym or club with no Wi-Fi."
- **Method.** One-day prototype; spec below.
- **Sample size.** 300 scripted scans across 2 phones, run twice (without and with a LAN hub).
- **Time.** 8 hours. **Out of pocket.** $0 using a third phone's hotspot with cellular data off as the LAN; under $50 if a travel router is bought (estimate, not researched).
- **Decision rule.** Pass if, with the hub: 0 duplicate admits, throughput of at least 15 scans per minute per phone, 0 forged admits, 0 revoked admits, and 0 false rejects of valid first scans. Without the hub, duplicates are expected; record the count, which shows whether the hub is mandatory. Fail if any duplicate admit occurs with the hub, or throughput is under 15 scans per minute per phone.
- **On fail.** Duplicates with the hub: fix the hub's first-scan-wins check and rerun (half a day). Low throughput: try a smaller QR payload, a different decode library, or name-list check-in; if still under 15, v1 guidance becomes "more scanners per door plus printed list fallback." A P8 failure changes the door design; it does not block v1 by itself.
- **Updates.** `docs/PROBE_RESULTS.md`; door requirements in `docs/SCOPE_CHARTER.md` (hub required or optional).

#### One-day spec: probe 8

Design follows the pretix pattern from the report: Ed25519 signatures validate offline, scanners cache a revocation list, and double entry needs shared state, which a LAN proxy provides.

| Item | Spec |
|---|---|
| Ticket format | Compact payload: ticket ID (16 bytes), event ID, ticket class, issued-at, Ed25519 signature (64 bytes), base64url-encoded into a QR code. The scanner holds only the event's public key. |
| Issuer | Laptop script generates 250 tickets: 240 valid, 10 signed then revoked (refunded). Also generate 15 forged tickets (valid format, wrong key or altered payload). Print codes 8 per page on paper; paper is the hardest realistic case. |
| Scanner | PWA served from the laptop once, then installed to both phones' home screens and run with Wi-Fi and cellular off. Camera QR decode; Ed25519 verify with WebCrypto where the browser supports it, otherwise a small audited JS library. Revocation list cached at setup. Local log of every scan: timestamp, ticket ID, verdict, time to verdict in ms. Use one iPhone and one Android phone if possible. |
| LAN hub | Laptop running a small server with a SQLite table keyed by ticket ID (first scan wins, atomic insert). Network: a third phone's hotspot with cellular data off, or a travel router with no uplink. Phones ask the hub before showing green; if the hub does not answer within 500 ms they fall back to local-only mode and show a "hub offline" banner. |
| Script (300 scans) | 240 valid first scans split across both phones; 30 duplicates (10 same phone, 20 cross-phone, of which 10 are presented to both phones within 2 seconds as a race test); 15 revoked-ticket attempts (10 distinct plus 5 repeats); 15 forged tickets. Order randomized from a CSV; two helpers present codes at a natural pace. |
| Runs | Run A: no hub, each phone fully local. Run B: with hub. In run B, unplug the hub for 2 minutes mid-run, then reconnect; log duplicates admitted during the outage separately and check that the hub flags them on reconnect. |
| Location | A real space with no usable Wi-Fi if possible (school gym, church hall, basement); otherwise at home with Wi-Fi and cellular off on all devices. |
| Metrics | Duplicate admits (a ticket ID shown green more than once across both phones); forged admits; revoked admits; false rejects; scans per minute per phone over the whole run; median and 95th-percentile time to verdict; outage duplicates and whether they were flagged. |
| Pass bar | Run B: 0 duplicate admits outside the deliberate outage window, at least 15 scans/min per phone, 0 forged, 0 revoked, 0 false rejects. |
| Schedule | Hours 1-4 build issuer, scanner and hub. Hour 5 print and set up. Hours 6-7 run A and run B. Hour 8 tabulate and write up. |
| Output | Results table in `docs/PROBE_RESULTS.md`; prototype code kept in a throwaway branch or folder, not the product repo. |

### Probe 3: Venues accept zero platform fee if they can set their own disclosed fee

- **Goal.** Check whether "zero platform fee" is a selling point or a threat for venues that earn fee rebates or advances.
- **Assumption.** "Venues accept zero platform fee despite losing fee-rebate income, if they can set their own disclosed fee."
- **Method.** Ten interviews using the venue guide below. Recruit from UMAW Raise the Bar pledge venues (21 at launch, including The Lab SF, Club Passim and Johnny Brenda's), #MyMerch "100% Venues" (about 75) and NIVA members. Aim for at least 5 pledge venues and at least 3 non-pledge venues, and report the two groups separately, because pledge venues self-select toward transparency.
- **Sample size.** 10 venues (overlaps with probe 7 count).
- **Time.** 10 hours (recruiting 3, ten 45-minute interviews, notes). **Out of pocket.** $0.
- **Decision rule.** Pass if at least 6 of 10 say a tool with no platform fee and a venue-set, disclosed fee would be acceptable or better than their current rebate or advance arrangement. Fail if at least 6 of 10 prefer incumbent rebates or advances, or call losing them a deal-breaker. 4 or 5 is inconclusive; if the yeses are all pledge venues, treat the wedge as pledge-venue-only.
- **On fail.** The settlement wedge stays ticketing-neutral (a settlement tool beside any ticketer, as the report suggests for mid-size rooms) and drops the zero-fee pitch for venues. The school beachhead is unaffected: the rebate economics are an inference about clubs, not schools.
- **Updates.** `docs/PROBE_RESULTS.md`; second-wedge section of `docs/SCOPE_CHARTER.md`.

### Probe 6: Venues, not just artists, want transparent settlement

- **Goal.** Test demand from the side that might benefit from opacity.
- **Assumption.** "Venues, not just artists, want transparent settlement."
- **Method.** A free settlement-sheet template (Google Sheet: deal terms, gross, fees, costs, splits, merch terms defaulting to 0% cut, a "shared with artist" checkbox). Offer it to every pledge venue reached in probe 3 (target at least 10 venues offered) with a one-line ask: use it for your next shows and reply with a count after 30 days. Count copies and replies.
- **Sample size.** At least 10 venues offered; 30-day window.
- **Time.** 5 hours (template 3, outreach 1, follow-up 1). **Out of pocket.** $0.
- **Decision rule.** Pass if at least 3 venues use it for 2 or more shows each within 30 days and share at least one sheet with the artist. Fail if 0 or 1 venues use it, or if the only users are artists.
- **On fail.** Settlement becomes an artist-side record (what was agreed, what was paid) rather than a shared venue tool, and the settlement wedge drops to a later feature.
- **Updates.** `docs/PROBE_RESULTS.md`; second-wedge section of `docs/SCOPE_CHARTER.md`.

### Probe 7: VenuePilot does not already satisfy the club wedge

- **Goal.** Avoid building a free copy of a tool venues already like.
- **Assumption.** "VenuePilot (free booking, $0.75 tickets, non-exclusive) does not already satisfy the club wedge."
- **Method.** Five interviews with venues that sell through VenuePilot (identify them from VenuePilot-hosted ticket pages), using the venue guide below with emphasis on question 7.
- **Sample size.** 5 venues (may overlap with probe 3's ten).
- **Time.** 4 hours beyond probe 3's overlap. **Out of pocket.** $0.
- **Decision rule.** Pass if at least 3 of 5 name an unmet need other than price that they would adopt a tool for (for example artist-visible settlement, portable data, structured advancing). Fail if 1 or fewer name any non-price need.
- **On fail.** The club pitch reduces to "open source," as the report warns. Drop the club wedge and keep settlement as an artist-side or school-side feature.
- **Updates.** `docs/PROBE_RESULTS.md`; second-wedge section of `docs/SCOPE_CHARTER.md`.

#### Interview guide: venue operators (probes 3, 6, 7), about 45 minutes

Opening: "I'm researching how small venues handle ticketing, settlement and advancing. There are no right answers, and I'm not selling anything today."

1. What do you use for ticketing, booking and settlement today, and roughly how many shows a year do you run?
2. Is your ticketing contract exclusive? How long is it, and what happens if you want to sell some shows elsewhere?
3. Do you receive any part of the ticket service fee, a signing bonus or an advance from your ticketing company? You don't need to share numbers; I'm asking whether it matters to your budget.
4. If a ticketing tool charged no platform fee and let you set and keep your own fee, clearly shown to buyers, how would that compare with your current arrangement? What would make it a non-starter?
5. Walk me through your last settlement: who prepared it, who saw it, when and how was the artist paid?
6. In the last year, have you had a settlement dispute, or a show where the artist questioned the numbers? What would have prevented it?
7. (VenuePilot users) What does VenuePilot do well for you? What do you still do outside it, by hand or in another tool? What would make you add or switch tools?
8. How do you get stage plots, input lists and advance details from artists? How often do they arrive late or incomplete?
9. (Raise the Bar or #MyMerch venues) What changed in how you operate after you took the pledge? Is there anything you'd want help showing artists, such as no merch cut or a transparent settlement?
10. Would you try a free settlement sheet for your next few shows and tell me after 30 days whether you used it? Who else should I talk to?

### Probe 5: Money-transmission counsel

- **Goal.** Confirm that the MVP payment flow keeps the project and node operators outside state money-transmission rules, and learn where the line is for later features.
- **Assumption.** "Direct charges on venue accounts keep the project and node operators outside state money-transmission rules."
- **Method.** One-hour opinion from fintech or money-transmitter-licensing counsel. Send a two-page memo in advance describing (a) the MVP: direct charges on each organizer's own Stripe account, redirect checkout, the software never touches funds; (b) the later flow: Stripe Connect separate charges and transfers for automatic guarantee and door splits, and an optional "self-escrow" mode using the processor's manual payout schedule. Ask specifically about California, given the DFPI opinion that a payment-processing service was not exempt as agent of payee, plus the states where pilots run.
- **Sample size.** 1 opinion.
- **Time.** 3 hours (memo 2, call 1). **Out of pocket.** One billed hour; get a fixed quote first. Rates were not researched.
- **When.** Before any Connect split or self-escrow feature is designed. Not required before the v1 MVP with direct charges, which follows FinCEN's exclusion for processors acting as agent of the merchant; state law is the open risk the report flags.
- **Decision rule.** Pass if counsel's view is that the MVP flow needs no license in target states, and counsel names the conditions under which splits or self-escrow would. Fail if counsel says splits or self-escrow trigger licensing in target states.
- **On fail.** Keep settlement as a generated sheet with the venue paying the artist from its own account, which is the industry norm. Defer Connect splits until a legal entity can hold the platform role and its compliance. If counsel flags even the MVP flow, stop paid-ticket features until it is restructured; free RSVP and door tools are unaffected.
- **Updates.** `docs/PROBE_RESULTS.md`; payments posture section of `docs/SCOPE_CHARTER.md`.

### Probe 9: AT lexicon spike

- **Goal.** Replace the report's unsourced inference about AT publishing costs and portability with a measurement.
- **Assumption.** "Custom AT lexicon records can be written, relayed and indexed cheaply by a niche AppView."
- **Method.** One-day spike; spec below.
- **Sample size.** 1,000 records, 1 PDS, 1 minimal indexer.
- **Time.** 8 hours. **Out of pocket.** A few dollars for a throwaway VM billed hourly (estimate), plus a domain if Ben does not already control one for the NSID.
- **Decision rule.** Pass if all 1,000 creates and 100 deletes appear on the public relay's firehose, a filtered indexer captures them while running in 512 MB of RAM or less, and backfilling the test DID from the PDS alone reproduces the same record set without any full-network backfill. Fail if the relay refuses to crawl the PDS, drops 1% or more of records, or the indexer can only find the records through full-network backfill.
- **On fail.** Architecture B stays deferred; v1 publishes iCal, schema.org JSON-LD and full export only. Schemas are still written AT-shaped so a later switch needs no rewrite. Record the failure mode so it can be retested after the relay or PDS software changes.
- **Updates.** `docs/PROBE_RESULTS.md`; the schema document named in `docs/SCOPE_CHARTER.md`.

#### One-day spec: probe 9

| Item | Spec |
|---|---|
| Host | A throwaway cloud VM with a public IP. Not the HC VPS: it is memory-tight with no swap, and a new resident service risks OOM-killing production. Not the Mac Mini: the relay needs a public HTTPS hostname. Destroy the VM at the end of the day. |
| PDS | Official `bluesky-social/pds` installer (needs about 1 CPU, 1 GB RAM, 20 GB disk). DNS A record plus wildcard for handles; note the DNS change in the infra reference doc the same day. Create one test account. |
| Lexicon | One record type under an NSID Ben controls, for example `<reversed-domain>.omp.event`, with fields shaped after schema.org MusicEvent: name, start, end, venue reference, performers, admission type (free, RSVP, donation, paid), ticket URL. Do not write test records under `community.lexicon.calendar.event`: Smoke Signal indexes that collection and the tests would appear as public events. Instead compare its fields with OMP's on paper and note whether OMP should reuse it. |
| Data | 1,000 synthetic events with no personal data (AT repos are public). Write via `com.atproto.repo.applyWrites` in batches at a polite pace (about 10 records per second). Then update 50 and delete 100. |
| Relay | Call `com.atproto.sync.requestCrawl` on the main Bluesky relay. Relays apply limits to new, unknown PDS hosts; one account and 1,000 records should stay inside them, but record any throttling or rejection as a result. |
| Indexer | A single-process script consuming a public Jetstream instance filtered by the test collection (and DID), writing to SQLite. Measure peak RAM, CPU and disk. |
| Backfill | Stop the indexer, wipe SQLite, restart, and rebuild from the PDS alone (`com.atproto.sync.getRepo` or `com.atproto.repo.listRecords` for the collection). Confirm it matches the live-captured set. |
| Metrics | Records seen on the firehose out of 1,000; updates and deletes seen; median and 95th-percentile delay from write to firehose; indexer RAM, CPU, disk; backfill time and match; any relay errors. |
| Pass bar | 1,000/1,000 creates and 100/100 deletes seen; indexer at 512 MB RAM or less; per-DID backfill matches with no full-network backfill. |
| Limits | The spike tests feasibility, not cost at network scale. The report's "tens to low hundreds of dollars a month" for a niche AppView stays labeled inference until a larger test runs. |
| Schedule | Hours 1-2 VM, DNS, PDS. Hours 3-4 lexicon and writer script. Hours 5-6 indexer, firehose capture, backfill test. Hour 7 updates and deletes. Hour 8 write-up and teardown. |

---

## Status tracker

Update this table as results land. Details go in `docs/PROBE_RESULTS.md`.

| # | Probe | Gates | Status | Verdict | Date |
|---|---|---|---|---|---|
| 1 | Educator survey | v1 | Not started | | |
| 2 | District coordinator calls | v1 | Not started | | |
| 3 | Venue zero-fee interviews | Settlement | Not started | | |
| 4 | Concierge Stripe pilot | v1 | Not started | | |
| 5 | Money-transmission counsel | Connect splits | Not started | | |
| 6 | Settlement template use | Settlement | Not started | | |
| 7 | VenuePilot interviews | Settlement | Not started | | |
| 8 | Offline QR prototype | v1 | Not started | | |
| 9 | AT lexicon spike | Architecture B | Not started | | |
| 10 | Fiscal sponsor emails | v1 | Not started | | |
| 11 | Eventbrite monitor | Trigger | Not started | | |
| 12 | Scope charter | v1 | Not started | | |
