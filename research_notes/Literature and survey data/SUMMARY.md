# Literature and survey data: what exists for OMP's open questions

Date: 2026-10-15. Synthesizes three notes in this folder: `pizzolitto_2024_review.md` (the attached systematic review), `demand_side_datasets.md`, `technical_policy_literature.md`. Each claim's source and verification status is in those files.

## Verdict by question

| Open question | Existing data or literature? | Best source | What it gives | Still needs |
|---|---|---|---|---|
| A. How educators and ensembles ticket, take RSVPs, handle cash | **No US survey exists.** Closest analog is theatre, not music | EdTA / Utah State High School Theatre Survey 2011-12 (1,200+ schools) | 89% of theatre teachers receive box-office revenue; ticket sales are the only regular funding source for most programs; median 5 productions/yr. No channel or payment-method items | Probe 1 (our survey) is the only route |
| B. Share of small shows that are door-only, cash-only, free | **Not found for the US** | Live DMA 2019-22 (EU) | Tickets ≈ 33% of venue income; ≈ 20% of visitors enter free | US figure must come from venue interviews (probes 3, 6, 7) |
| C. Count of K-12, college, community, church concerts per year | **Not found.** Every dataset counts programs, enrollment, or budgets, not performances | Give a Note 2017 (nationally weighted, ~103k schools); NASM HEADS; League of American Orchestras; Chorus America; National Congregations Study | Band offered at 91% of middle and 93% of high schools; 38% of HS music programs fund mostly by fundraising; ~2,200 orchestras; >1,000 community bands (secondhand lower bound); 41.9% of congregations have a choir | Multiply program counts by the "events per year" item in our survey |
| D. Venue dependence on ticket-fee rebates | **Not found for the US.** NIVA State of Live publishes headlines only, no method | Music Venue Trust 2025 (UK): 53.8% of venues no profit, 2.5% margin | Comparator only | Venue interviews |
| E. Frequency of late, short, or missing artist pay | **No US frequency data** | Musicians Australia 2025 survey | 68% paid for every gig (so ~32% not always) | Venue and artist interviews; UMAW could be asked to add an item |
| F. Whether artists get ticket-buyer data | **No survey.** Advocacy (NITO) and the DOJ settlement's transparency clause only | NITO position, March 2026 | Asks, not measurements | Artist interviews |
| G. Fan behavior with wallets or NFT tickets | **No peer-reviewed study of NFT-ticket adoption or wallet drop-off found** | None | Our prior-art note's "every project with volume hid the wallet" remains the only evidence | Nothing to chase; design already avoids wallets |
| H. Musicians' willingness to use business tools | **Yes, qualitative** | Everts & Haynes 2021; Schediwy et al. 2018 (via Pizzolitto) | Musicians spend time on creative work, find paid promotion too costly, yet "enjoy the entrepreneurial part" | Read the primaries before designing the settlement wedge UX |
| I. Volunteer-run event ops, cash handling | **Thin.** Festival literature covers experience and segmentation, not ops | State auditor reports (NY, OH, AL, LA, IN, MS) on school gate-cash controls | Documented control failures, mostly athletics; cannot show prevalence | Treat as supporting color for probe 1, not as evidence |
| J. Platform and commons models for live music | **Leads only** | Azzellini, Greer & Umney 2021, "Why isn't there an Uber for live music?" | Directly about platformizing live music; must read | Read it |
| Offline double-entry prevention | **No standard or paper prevents double entry across offline, non-syncing scanners** | pretix signature scheme 1 + pretixSCAN Proxy; UIC rail barcodes; Zupass | All detect after the fact or require shared local state | Our hub/mesh design is the right shape; confirms probe 8's pass bar |
| Money transmission posture of direct charges | **Better footing than round 1** | Stripe "merchant of record" docs + FinCEN FIN-2014-R009 | With direct charges the connected account is merchant of record; a party that never possesses merchant funds is not a money transmitter | Counsel still needed for splits; watch the `on_behalf_of` parameter, which shifts merchant of record |
| K-12 procurement and student privacy | **Yes, and it bites** | NY Ed Law 2-d (8 NYCRR 121) FAQ; Illinois SOPPA (105 ILCS 85); SDPC National Data Privacy Agreement | In NY, click-through terms a teacher accepts are covered contracts even for free tools; in IL the district needs a posted written agreement. Runestone Academy (open-source edu project) signed the SDPC NDPA with one district and others adopted it | Design v1 to hold no student PII; plan the NDPA path |
| All-in pricing effect on sales | **Yes, strong** | Blake, Moshary, Sweeney & Tadelis 2021, *Marketing Science* (StubHub experiment) | Showing the full price upfront cut purchases and seat quality; drip pricing raised spend | OMP's honest-pricing principle has a measurable conversion cost; say so to organizers |
| Ticket fee economics at small venues | **No peer-reviewed study** | Courty 2019; Mortimer, Nosko & Sorensen 2012 (concert demand boost strongest for smaller acts) | Adjacent, citable | None available |

## What this changes in the plan

1. Probe 1 (educator survey) is confirmed as the only way to get questions A and C. Keep the "events per year" item; it is the multiplier for every program count above.
2. Probe 2 (district calls) should ask specifically about Ed Law 2-d / SOPPA-style laws and whether the district has adopted the SDPC National Data Privacy Agreement.
3. Architecture: add a v1 rule that the hosted instance stores no student PII (no rosters, no student accounts; program listings are organizer-entered public content), so a teacher in NY or IL can use it without a district contract, and plan the NDPA signature as the path for districts that want more.
4. Architecture 5.5: cite FIN-2014-R009 and the Stripe merchant-of-record doc; never set `on_behalf_of` in v1.
5. Add to the reading list before the settlement wedge: Azzellini et al. 2021; Everts & Haynes 2021; Blake et al. 2021.
6. Email Pizzolitto for the full 145-article coding spreadsheet (offered in the paper, pp. 1444 and 1467).

## Not reached this round

ASBO guidance, Sound Diplomacy city studies, MusiCares surveys, College Music Society, the full Austin Music Census, SPPA codebook, NTEN/TechSoup data on open-source adoption, Connecticut student-privacy law, district procurement dollar thresholds, EU Digital Identity Wallet ticket pilots, FIN-2008-R006 text, Texas and New York money-transmitter positions.
