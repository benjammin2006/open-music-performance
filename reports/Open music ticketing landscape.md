# Start where Ticketmaster has no customers

The US live-music ticketing monopoly is real and now legally confirmed. On April 15, 2026 a federal jury found that Ticketmaster monopolized primary ticketing at major concert venues. But every remedy in play targets venues of 8,000+ capacity, nothing will be final before 2027–2028, and none of it reaches the clubs, school auditoriums and community stages OMP wants to serve first. At that end of the market the lock-in comes from three other things: fee rebates and signing advances from mid-tier vendors, "free to school" platforms that shift fees onto parents, and in many cases no software at all. The best-evidenced pains that software can actually fix are opaque or missing artist settlements at small rooms, flat buyer fees that hit cheap school-concert tickets hardest, cash-handling and audit risk for volunteer organizers, and advancing done by hand. Bots and dynamic pricing are not the problem at this scale. A decade of blockchain ticketing shows the chain was never the hard part. The projects that survived hid the wallet, kept QR codes at the door and got adopted only as add-ons to existing vendors, and Ethereum's own flagship conference chose open-source pretix over NFT tickets. The recommended path has three parts:

- **Beachhead.** A new-market entry into school and community music: zero fees to families, free RSVP, door and cash reconciliation, programs and donations.
- **Second wedge.** A deal-memo-to-settlement tool for independent artists and pledge venues that works with any ticketing system.
- **Build model.** An AGPL open core run by a small hosted operator, with each venue as its own merchant of record and a portable data model so artists and venues can hold their own records.

The principle is to decentralize publishing, identity and data ownership while leaving the door, the money and the liability with the venue. The biggest risk is not Live Nation but scope. Six subsystems is a roadmap for a team, so a handful of cheap probes should come before any of it is built.

## Ticketmaster's lock-in is financial, and courts will not loosen it before 2028

### How the flywheel works at the top of the market

Live Nation is a concert promoter that also owns the dominant ticketer. In FY2025 it reported **$25.2B in revenue**: $20.9B from concerts, $3.1B from ticketing and $1.3B from sponsorship. Ticketing earned about **$1.1B in adjusted operating income, roughly a 35% margin**, against concerts' thin one. Ticketmaster distributed **646M tickets** for 10,500 clients ([LYV FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1335258/000133525826000009/lyv-20251231.htm)). The venue portfolio matters for OMP: Live Nation operates **460 venues, including 125 clubs and 112 theaters**, so it competes directly with independent rooms for touring acts below 3,000 capacity ([LYV FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1335258/000133525826000009/lyv-20251231.htm)).

The February 2026 summary-judgment record defines "major concert venues" as arenas and large amphitheaters seating 8,000+. At those venues Ticketmaster holds **75% of primary ticketing and 86% of primary concert ticketing**, a share that has been stable since 2017. Other figures from the same record:

- **65%** of these venues had fully exclusive Ticketmaster contracts in 2024.
- Only **3%** self-ticket, with testimony that ticketing systems are "too expensive and too difficult for venues to build themselves."

Source: [SDNY SJ Opinion, 2026-02-18](https://www.nysd.uscourts.gov/sites/default/files/2026-02/24cv3973%20Opinion%20&%20Order.pdf).

The lock-in mechanism is money flowing to the venue, not technology. Ticketmaster signs **3–5 year, mostly exclusive contracts** and pays venues "upfront payments, a portion of service fee revenue" ([LYV 10-K](https://www.sec.gov/Archives/edgar/data/1335258/000133525826000009/lyv-20251231.htm)). Ticketmaster says the venue normally keeps about **two-thirds of the service charge** ([Ticketmaster blog](https://blog.ticketmaster.com/the-truth-about-ticket-prices/), an interested party). Trial evidence filled in the rest:

- Sales staff earned bonuses for early renewals, with an internal Slack line urging them to "aggressively pursue early renewal opportunities to avoid RFP process" ([Big Tech on Trial](https://www.bigtechontrial.com/p/day-19-ticketmaster-exec-acknowledges)).
- Ticketmaster paid Oak View Group **$20M upfront plus up to ~$7.5M a year** to steer the venues it managed toward Ticketmaster, without telling those venues ([TheTicketingBusiness](https://www.theticketingbusiness.com/2025/07/doj-alleges-ticketing-provider-paid-millions-to-ovg-for-pushing-its-services/)).
- One venue deponent testified that choosing another ticketer meant "the possibility of concerts moving to a different venue was a distinct possibility," and called it a threat. SeatGeek responded by offering venues "make good" clauses against retaliation ([SDNY SJ Opinion](https://www.nysd.uscourts.gov/sites/default/files/2026-02/24cv3973%20Opinion%20&%20Order.pdf); [Pollstar](https://news.pollstar.com/2026/09/15/the-biz-objections-roll-in-as-judge-reviews-ln-settlement-umg-wraps-buyback/)).

The researcher's inference follows directly: a venue's financial incentive points toward *higher* fan fees, so a fee-transparent alternative is up against venues' own revenue line, not only Ticketmaster.

### The mid-tier copies the model, and the low end is a different market

The number two does not offer a structurally different model. AEG's AXS signs exclusive multi-venue deals with First Avenue and JAM Productions ([IAVM](https://blog.iavm.org/axs-and-first-avenue-sign-exclusive-deal/); [IAVM](https://blog.iavm.org/legendary-concert-promoter-jam-productions-signs-exclusive-ticketing-deal-with-axs/)). A competitor with its own venue arm testified it "would have loved" exclusivity at all its venues ([SDNY SJ Opinion](https://www.nysd.uscourts.gov/sites/default/files/2026-02/24cv3973%20Opinion%20&%20Order.pdf)).

Below roughly 2,500 capacity the market splits in two. **Self-serve platforms** publish prices and require no contract. **Sales-led platforms** negotiate fees, rebates, advances and exclusivity, and most publish no US rate card. That opacity is itself a finding. The tier consolidated fast in 2025–26:

- Fever bought DICE.
- Bending Spoons bought Eventbrite for about $500M (closed March 2026) and then let go of "most of the pre-acquisition staff" ([IQ Magazine](https://iqmagazine.com/2026/04/eventbrite-makes-layoffs-following-bending-spoons-acquisition/)).
- See Tickets US became Eventim, and ShowClix became Leap ([Pollstar](https://news.pollstar.com/2025/03/04/see-tickets-us-rebranded-as-eventim-following-2024-acquisition/); [Leap](https://leapevent.tech/en-au/?p=8152)).

A 2020 snapshot shows how deep the advance economy runs. A 1,000-cap room got a **$100k signing bonus** for a one-year deal plus an extra 15% fee, worth about $230k to the platform, or **~130% implied interest**. Mid and large venues often kept **up to 80%** of the listed service fee ([Water & Music](https://www.waterandmusic.com/signing-bonuses-used-to-run-the-ticketing-business-what-happens-now)).

| Vendor | Model | Published fee (source quality) | Lock-in lever |
|---|---|---|---|
| Eventbrite (Bending Spoons) | Self-serve | 3.7% + $1.79 per paid ticket + 2.9% processing; free events free ([official](https://www.eventbrite.com/organizer/pricing/)) | Discovery and email audience; payouts default to 3 days post-event with a 20% reserve ([Eventbrite Help](https://www.eventbrite.com/help/en-us/articles/115913/)) |
| VenuePilot | Self-serve, venue-built | $0.75/online ticket; door sales free; venue's own Stripe, daily payouts; "never exclusive" ([official](https://venuepilot.com/pricing)) | Free booking/settlement software; optional revenue-based advance |
| Humanitix (nonprofit) | Self-serve | 2.1% + $0.99; 1% + $0.99 for charities and schools; plus processing ([official](https://humanitix.com/us/pricing)) | Mission brand; profits to charity |
| Ticket Tailor | Self-serve | ~$0.85 flat, falling toward ~$0.30 with prepaid credits ([third-party](https://dupple.com/reviews/ticket-tailor)) | Low |
| Opendate | Sales-led | Average organizer fee 6.6% (range 0–24.6%), per its own benchmark ([TheTicketingBusiness](https://www.theticketingbusiness.com/?p=97679)) | Free booking software subsidized by ticketing; $14M Series A Jan 2026 ([ContentGrip](https://www.contentgrip.com/opendate-series-a-live-event-marketing-platform/)) |
| DICE (Fever), Etix, TicketWeb (Live Nation), Tixr, Prekindle, Eventim | Sales-led | Unpublished; competitor estimates only ([TickPick, vendor](https://www.tickpick.com/blog/organizer/best-ticketing-platform-small-venues)) | Negotiated rebates, advances, exclusivity |
| Prism.fm | Booking only | Example club pays $7,500/yr ([vendor page](https://prism.fm/opendate/)) | Ticketing partners sometimes subsidize the subscription |

The pattern that matters is VenuePilot: the venue's own Stripe account, daily payouts, a flat fee, no exclusivity and free booking software. It already exists commercially, so OMP's pitch cannot simply be "cheaper than Eventbrite." The differentiators left are zero platform fee, portable data and no counterparty risk.

### Where a ticket dollar goes

The best worked example is NITO's estimate for a $100 arena ticket ([Hypebot](https://www.hypebot.com/hypebot/2024/12/what-artists-earn-from-ticket-sales-a-revealing-revenue-breakdown.html)):

- About **$28 goes to fees**, shared among venue, promoter and ticketer, with nothing to the artist.
- About $30 covers production and staffing.
- The artist grosses about $41 and nets roughly **$8** after tour costs.

A *Wall Street Journal* graphic claiming artists get up to 98% is disputed in the same source. The GAO's dated sample found primary fees averaging **27% of face value**, about 30% for concerts, and 31% on resale ([GAO-18-347](https://www.gao.gov/products/gao-18-347)). The jury quantified the monopoly's share as a **$1.72-per-ticket overcharge** at major venues ([NY AG](https://ag.ny.gov/press-release/2026/attorney-general-james-and-coalition-states-win-trial-against-live-nation-and)).

No sourced worked example exists for a $30 club ticket. The researcher's extrapolation from GAO averages is about $8–9 in fees, and it is labeled as inference, not data. One fact cuts against the fee narrative at the small end: about **300M of Ticketmaster's 646M tickets in 2025 carried no service fee** ([LYV 10-K](https://www.sec.gov/Archives/edgar/data/1335258/000133525826000009/lyv-20251231.htm)). Box-office and low-price distribution is already a large, low-margin share of volume.

### Regulation as of October 14, 2026: a verdict, a pending settlement, no breakup

The DOJ settled mid-trial in March 2026 without a Ticketmaster divestiture. Thirty-three states plus DC continued and won a unanimous jury verdict on April 15. The jury found three violations ([NY AG](https://ag.ny.gov/press-release/2026/attorney-general-james-and-coalition-states-win-trial-against-live-nation-and); [NPR](https://www.npr.org/2026/04/15/nx-s1-5786715/live-nation-ticketmaster-antitrust-verdict-monopoly)):

- Ticketmaster monopolized ticketing at major concert venues.
- Live Nation monopolized large amphitheaters.
- Live Nation unlawfully tied amphitheater access to its promotion services.

Some law-firm memos also describe a "concert promotion" monopolization finding. That should be treated as **unverified**, because the February opinion dismissed the promotion-services market claim.

The DOJ's proposed final judgment includes ([TicketNews](https://www.ticketnews.com/2026/06/dojs-live-nation-settlement-fine-print-leaves-ticketmaster-at-center-of-ticketing-system/)):

- A $280M fund for state damages claims.
- A **15% fee cap that applies only at Live Nation-controlled amphitheaters**. Some outlets describe it more broadly, but the filed terms are narrower.
- Fully exclusive contracts capped at four years, with no auto-renewal.
- One event per year that venues may ticket elsewhere, and up to 20% of inventory for contracts with four or more years remaining.
- At amphitheaters, artists and promoters may route up to 50% of tickets elsewhere.
- An **"open distribution" requirement**: Ticketmaster must let qualifying third-party sellers sell venue inventory using Ticketmaster-issued barcodes. It must be operational within 275 days of final judgment, and the monitor-supervised "infrastructure" fees are uncapped.

The judgment contains **no provisions specific to small venues or clubs**.

As of October 14 no Tunney Act ruling had been found, although the judge signaled one between mid-September and mid-October. Live Nation's post-trial motions are pending. The states' remedies trial, where they seek Ticketmaster's divestiture, is expected **no earlier than February 2027** ([Hypebot](https://www.hypebot.com/live-nation-legal-battles-what-happens-next-in-2026-2027/); [Courthouse News](https://courthousenews.com/penalties-phase-of-live-nation-ticket-monopoly-trial-will-stretch-into-2027/)). Crowell & Moring expects final resolution no earlier than 2028 ([Hypebot](https://www.hypebot.com/live-nation-legal-battles-where-three-major-cases-stand-now.md)). Objectors include 18 attorneys general, AEG (which says the deal "tightens" Ticketmaster's grip and leaves it about 85% share) and NIVA (which wants a breakup and a cap on Live Nation's share of any tour) ([Pollstar](https://news.pollstar.com/2026/09/15/the-biz-objections-roll-in-as-judge-reviews-ln-settlement-umg-wraps-buyback/)).

Other enforcement is still moving:

- In the FTC and seven-state case over broker tolerance and drip pricing, the court denied the motion to dismiss (reported October 1) and held that **the BOTS Act applies to Ticketmaster** ([Pollstar](https://news.pollstar.com/2026/10/01/bots-act-applies-to-ticketmaster-judge-rules-allowing-prosecution-to-continue/)).
- DC's attorney general extracted $9.9M and a requirement to disclose **how each fee is divided** ([DC OAG](https://oag.dc.gov/release/attorney-general-schwalb-announces-live-nation)).

The fee rules themselves:

- **Federal.** The FTC Fees Rule has required all-in price display since May 12, 2025, but caps nothing ([CRS R48179](https://www.congress.gov/crs-product/R48179)). The TICKET Act passed the House 409–15 and has sat on the Senate calendar since April 2025 ([Congress.gov](https://www.congress.gov/bill/119th-congress/senate-bill/281/all-info)).
- **States.** Maryland and Minnesota require all-in pricing and ban speculative tickets. DC's RESALE Act caps resale at about 120% of face. Massachusetts and California resale caps are pending ([DC Council](https://dccouncil.gov/council-gives-final-approval-to-resale-act-regulating-ticket-sales-and-capping-ticket-resale-prices/); [TicketNews](https://www.ticketnews.com/2026/09/healey-massachusetts-ticket-resale-cap-budget/)).
- **Vermont** reportedly caps resale at 110% for venues of 3,000 seats or fewer. The notes flag the statute as needing verification ([TicketNews](https://www.ticketnews.com/2026/08/resale-industry-confronts-coordinated-statehouse-campaign-to-restrict-ticket-competition/)).

The planning implication: assume Ticketmaster stays integrated with Live Nation through 2027–2028. Treat the open-distribution API as a possible bridge upmarket, not a foundation. And recognize that the legal tide (all-in pricing, fee-split disclosure, resale caps) rewards a platform whose fees are small and transparent by design.

## Small stages hurt from opaque settlements and regressive fees, not bots

### Venues are fragile, and "no fees" can cost them money

**64% of US independent stages were unprofitable in 2024**, according to NIVA's first State of Live study ([Digital Music News](https://www.digitalmusicnews.com/2025/10/10/niva-study-hidden-economic-power-independent-venues/)). The June 2026 NIVA–Bandsintown Live Pulse (212+ operators) found:

- **56%** had advance sales down year over year.
- Top pressures were attendance (23%), artist guarantees (14%), staffing (10%) and insurance (7%).
- Marketing and awareness ranked at only **4%**.

Source: [Hypebot](https://www.hypebot.com/niva-bandsintown-survey-tracks-state-of-indie-live-events.md).

Ticketing fees do not appear as a top pressure, and the researcher draws a pointed inference from that. For small venues, ticket fees are mostly a pass-through and often a source of rebates. A zero-fee tool saves fans money but may *remove* a venue revenue line unless venues can set and keep their own disclosed fee, as VenuePilot allows.

Timing matters too. Eventbrite data shows **57% of tickets bought within a week of the show** ([Pollstar](https://news.pollstar.com/2024/06/04/last-minute-ticket-buying-eventbrite-releases-study-at-niva-24/)). An older, second-hand estimate puts door sales at about 75% for 250–1,500-cap rooms, which the notes treat as directional only. A tool that handles only advance sales misses much of the small-show economy.

### Artists lose money touring and often cannot see the settlement

Independent artists' gig pay is flat while costs rise:

- In a 2024 survey of 1,700 musicians, 54% said gig fees were unchanged and 29% said they had fallen. **72% made no profit touring** ([Hypebot/Pirate](https://www.hypebot.com/despite-higher-ticket-prices-musicians-earnings-remain-stagnant.md)).
- In 2026, Ditto found **74% of independent artists earned under $1,000** from music ([Hypebot](https://www.hypebot.com/74-of-musicians-earned-under-1k-82-cant-afford-to-tour/)).

That is structural, and no platform fixes it. What software *can* fix is the information gap at settlement. Three anecdotes show it:

- At Brooklyn's Sultan Room in 2025, Thor Harris posted a **$0 headline settlement** and said about a hundred artists told him they had been shorted there ([mxdwn](https://music.mxdwn.com/2025/08/11/news/thor-harris-shares-photo-of-venue-settlement-showing-0-earning-from-recent-nyc-show/)).
- In Colorado, a nonprofit booker won an unpaid-performer case by default after other artists were "nervous about joining the claim" ([Longmont Leader](https://longmontleader.com/local-news/music-first-wins-legal-case-against-longmont-social-over-unpaid-performer-10494092)).
- AFM Local 802 leafleted a jazz club over a settlement that was agreed but never paid ([Local 802](https://local802afm.org/allegro/articles/802-leaflets-employer-and-jazz-artist-gets-paid)).

The only number on how often this happens comes from Australia: one in four performances violated contract terms ([MEAA](https://www.meaa.org/mediaroom/time-for-9-billion-industry-to-pay-up-and-stop-exploiting-professional-musicians/)). That is a labeled comparator, not US data.

Merch cuts of 10–35% ([UMAW](https://www.unionofmusicians.org/my-merch)) and pay-to-play presale quotas are negotiation problems, but a platform can make those terms explicit. UMAW's July 2026 "Raise the Bar" pledge launched with **21 venues** committing to "no merch cuts, no pay-to-play, no door polling, and greater contract transparency" ([Hypebot](https://www.hypebot.com/umaws-raise-the-bar-campaign-promotes-fairer-treatment-of-artists-at-venues/)). Those venues are a ready-made early-adopter list.

Data lock-in is a real pain, but it sits mostly with segment (a), touring and signed artists at large venues. The ticketer and venue keep buyer data and the artist gets "limited reporting." NITO now urges members to write data-sharing into deal memos ([Pollstar](http://news.pollstar.com/2026/03/31/nito-call-on-ticketers-to-share-buyer-data-with-artists-guest-post/)), and the DOJ settlement includes an "Artist Transparency" clause ([Hypebot](https://www.hypebot.com/live-nation-settlement-transparency-clause-is-a-win-for-artists)).

### Advancing runs on email, and promotion is fragmented

Evidence on communication failures is almost entirely anecdotal:

- A double-booked wedding after 200 tickets had sold ([Ari's Take](https://aristake.com/how-to-properly-advance-your-shows-and-why-you-have-to/)).
- A technical director who "rarely" sees an actual rider and gets the advance less than a week out ([ControlBooth](https://www.controlbooth.com/threads/concert-promoter-venue-relationship.34648/latest)).

No open schema for stage plots, input lists or advance sheets was found. CSV input lists are the only de facto interchange, so advancing is re-keyed by hand between venue tools (Prism, VenuePilot) and artist tools (Master Tour, stage-plot apps) ([App Store, LiveTechPack](https://apps.apple.com/be/app/livetechpack-stage-plot/id6780525066)). That is a clear white space with low regulatory risk.

On promotion, organic social reach runs about 2–6% of followers ([Hypebot](https://www.hypebot.com/cracking-the-instagram-algorithm-a-2026-guide-for-musicians.md)). The main aggregator API is gated: Bandsintown requires written consent and scopes each key to one artist ([Bandsintown help](https://help.artists.bandsintown.com/en/articles/7053475-what-is-the-bandsintown-api)). Open discovery is a real gap but a poor beachhead because of cold start. It is better as a byproduct of capturing event creation.

### School and community organizers face the most regressive pricing

Segment (d), volunteer and educational organizers, is served by a patchwork: athletics-first school platforms, theater-first platforms, Eventbrite, donation tools and cash boxes. The common trick is to be "free to schools" by charging parents:

- GoFan's buyer fee is **$1 on tickets up to $10, and $1 + 5% above that**. It also uses buyer emails for its own marketing ([GoFan FAQ](https://gofan.playonsports.com/faq)).
- A K-12 reviewer reports On the Stage charging fees "on cash ticket sales AND comp tickets" under a year-long contract ([Capterra](https://www.capterra.ca/reviews/1038009/on-the-stage)).
- Ludus users say administrators "have trouble understanding the fee format" ([Capterra](https://www.capterra.com/p/136136/Ludus/reviews/)).

A flat $1 on a $5–10 concert ticket is a 10–20% surcharge (the researcher's arithmetic). Families notice. In Andover, Massachusetts, residents objected to digital-ticket fees, and the school committee chair said digital-only access "shifts the playing field" for families without cards or reliable internet ([Andover News](https://andovermanews.com/?p=15195)).

Cash handling carries real audit exposure:

- Seattle Public Schools audits found funds not deposited within the state-mandated 24-hour window ([SPS audit](https://www.seattleschools.org/wp-content/uploads/2021/07/RBHS-Final-Internal-Audit-Report-ADA-Compliant.pdf)).
- A Tennessee high school's JROTC program kept **$124k in off-book deposits** in 2026 ([Hoodline](https://hoodline.com/2026/03/bearden-high-jrotc-busted-over-secret-124k-bank-stash/)).

Community bands, orchestras and church series use free reserved tickets with a door box office, free-will offerings, food-pantry donations in place of tickets, and volunteers who scan tickets in exchange for free entry ([Westport Community Band](https://happeningnext.com/event/westport-community-band-free-concert-eid3a0dum97f0); [Niles orchestra](https://www.abc57.com/news/niles-orchestra-seeing-growth)). These needs fall between platforms, and no incumbent serves them well.

The caveat is important: **no survey of music educators' ticketing practices was found**. Segment (d) evidence is mostly vendor pages, reviews and audits, which makes it the thinnest in survey terms.

### Ranked pain catalog

| Rank | Pain | Segment | Evidence strength | Software-solvable |
|---|---|---|---|---|
| 1 | Settlement opacity; late, zero or disputed pay; handshake deals | Independent artists, small venues | Anecdote + trade (UMAW plank); AU survey comparator | Yes: shared deal memo, live ledger, settlement sheet |
| 2 | Flat buyer fees regressive on cheap tickets; fees on comps and cash; digital-only equity | School/community | Vendor pages, reviews, school-committee record | Yes: zero-fee, cash-friendly, no-app |
| 3 | Cash reconciliation and audit risk (24-hour deposit rules, booster fraud) | School/community, small venues | Audit reports | Yes: door POS with cash log and two-person count export |
| 4 | Advancing and rider failures; separate calendars | Artists, small venues | Anecdote only | Yes: shared, structured advance sheet |
| 5 | Free-event RSVP volatility; missing programs, donations, comps | School/community | Trade/vendor | Yes |
| 6 | Buyer data held by ticketer/venue | Touring artists, upper indie | Trade (NITO, DOJ clause), unquantified | Yes, by design (consented, owner-held lists) |
| 7 | Venue unprofitability; walk-up dependence | Small venues | Survey (NIVA) | Partly: door/walk-up tooling, memberships |
| 8 | Discovery fragmentation | All small segments | Trade; venues rank it 4% | Yes, but cold-start |
| 9 | Bots, speculative tickets, dynamic pricing | Large venues | Heavy policy and survey | Mostly policy; out of scope |

**What to solve first.** Combining pain, reachability and simplicity, the notes conclude that segment (d) fits best. The first tool would offer:

- zero fees to families
- free-RSVP capacity control
- comp allocation
- cash and card door reconciliation with an audit export
- digital programs
- donation and free-will collection
- a school-owned audience list

The strongest *second* wedge is a transparent deal → settlement → payout flow for independent artists, seeded with UMAW pledge venues. No surveyed group asked for "a new ticketing platform." The asks are for transparency, ownership and fairness, which software can embody without legislation.

## Blockchain ticketing proved the chain was never the bottleneck

Of roughly 20 blockchain ticketing efforts since 2017, only GET Protocol (now OPEN Ticketing Ecosystem) reached multi-million scale. Its volume claims grew from 2.7M lifetime tickets in 2022 to 8.5M in 2025, all **[self-reported]** apart from an OpenSea collection of about 2.6M items ([Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once); [OpenSea](https://opensea.io/fr/collection/get-protocol)). It got there by hiding the chain:

- Fans paid in fiat and stored tickets in an app, not a wallet.
- About two-thirds of volume came from a **"digital twin"**: a $0.02-per-ticket NFT mirror of tickets that ordinary Dutch ticketing companies had already sold ([Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once)).

Even so, GUTS Tickets, the ticketing company built on GET, was sold to CM.com in February 2025, and guts.tickets now redirects to a generic ticketing page ([Dutch IT Channel](https://www.dutchitchannel.nl/news/597022/cm-com-neemt-guts-tickets-over)). By June 2025 the protocol team said it was "out of runway and looking for a life boat" ([OPEN on X](https://x.com/onopenxyz)).

The rest is a graveyard:

- **2017 ICO wave.** Aventus raised $20M in seven minutes and has since pivoted to enterprise appchains ([The Festivals UK](https://thefestivals.uk/bitcoin-tickets/); [aventus.io](https://aventus.io)). Blocktix and crypto.tickets are probably dead.
- **YellowHeart.** Its April 2022 MGM Grand pilot had sold "about 100" tickets ([CoinDesk](https://www.coindesk.com/business/2022/04/14/mgm-grand-trials-nft-ticketing-in-yellowheart-tie-up)).
- **Big Neon.** Never made it onto its planned blockchain and shut down in 2021 ([Inverse](https://www.inverse.com/input/culture/blockchain-concert-ticketing-startup-big-neon-shuts-down)).
- **Ticketmaster.** Used NFTs only as collectibles and presale gates; admission stayed on SafeTix ([The Block](https://www.theblock.co/post/223109/ticketmasters-latest-widget-gives-nft-holders-early-ticket-access)).
- **Coachella.** The worst real failure was custodial, not technical. Its $1.4M lifetime-pass NFTs became unredeemable when FTX collapsed, until they were re-issued ([Far Out](https://faroutmagazine.co.uk/coachella-lifetime-pass-nfts-collapse-ftx/)).

The most telling case is Devcon, the Ethereum Foundation's own conference. Its 2020 RFP for on-chain ticketing required:

- support for attendees "with or without Ethereum wallets"
- sybil limits
- automated refunds
- check-in that works offline or with a dead phone battery

The RFP closed with no vendor selected. Devcon kept **pretix** and layered Zupass zero-knowledge credentials on top ([Devcon RFP-1](https://forum.devcon.org/t/rfp-1-onchain-ticketing/34); [DIP-46](https://forum.devcon.org/t/dip-46-pod-based-ticketing-at-devcon/3850)). When an NFT-ticketing proposal came back in 2025, a Devcon team member called "pretix (self hosted) + zuPass" more privacy-friendly ([DIP-67](https://forum.devcon.org/t/dip-67-onchain-ticketing-for-everyone-for-devconnect-2025/6261)).

Anti-scalping results that do exist come from non-blockchain controls. DICE binds tickets to the buyer's phone and offers a face-value waitlist ([Billboard](https://www.billboard.com/?p=9544266)). TicketSwap caps resale at 20% and re-issues the barcode on each resale ([Rolling Stone UK](https://www.rollingstone.co.uk/music/how-ticketswap-is-leading-the-way-for-fair-pricing-and-resales-27482/)). The researcher's synthesis is a three-step mechanism that any single authoritative database can implement:

1. Bind the ticket to a person or device.
2. Allow transfer only through an issuer-controlled, capped exchange.
3. Re-issue the credential on transfer.

NFT transferability works *against* this. ERC-7439, the Ethereum anti-touting standard, disables owner transfers entirely and lists no deployments ([ERC-7439](https://ercs.ethereum.org/ERCS/erc-7439)). The SafeTix lesson cuts the other way: the DOJ argued the rotating barcode was "primarily implemented to prevent competition" ([Incogni summary](https://blog.incogni.com/is-ticketmaster-safe/)), so anti-scalping controls double as lock-in unless the transfer rules are published.

Regulatory exposure came from **token sales, not tickets**. No ticketing-specific enforcement was found. SEC Chair Atkins' November 2025 taxonomy calls tickets "digital tools" rather than securities, but that is stated opinion, not rule ([Cooley](https://www.cooley.com/news/insight/2025/2025-1118-secs-project-crypto-chairman-atkins-outlines-regulatory-vision)).

Non-blockchain open software teaches the matching lesson:

- **Single-organization tools with a funded maintainer endure.** pretix (AGPL, hosted tier, "over 3,000 customers" **[self-reported]**) and CERN's Indico (300+ instances) are thriving ([pretix.eu](https://pretix.eu/about/en/); [CERN](https://home.cern/indico-20-years-event-managing/)). Attendize had the most GitHub stars and has been dormant since January 2023 ([GitHub](https://github.com/Attendize/Attendize)).
- **Federation solved discovery, not ticketing.** Framasoft handed Mobilizon to a volunteer nonprofit in 2024. It had 79 instances and about 377k events and offers no payments ([Wikipedia](https://en.wikipedia.org/wiki/Mobilizon)). Smoke Signal on AT Protocol now indexes **45,425 events and 7,121 RSVPs** ([smokesignal.events](https://smokesignal.events)).
- **No US music-venue adoption of open-source ticketing was found.** That is confirmed only as absence of evidence.

The lessons, which the notes label as inferences from design convergence rather than controlled experiments:

- Never require a wallet.
- Avoid a token.
- Integrate with what venues already use before trying to replace it.
- Fund a maintainer of record.
- Decentralize auditability and data, not door validity.

## Decentralize publishing and data ownership, not the door or the money

Each OMP subsystem has different needs, and the protocols sort cleanly against them.

**Public, portable records** (artist profiles, press kits, venue events, the performance history) fit **AT Protocol** best. AT accounts have a signed repo and a DID that moves between hosts, and custom lexicons let OMP define its own record types. The official PDS needs only 1 CPU, 1 GB RAM and 20 GB for up to 20 users ([bluesky-social/pds](https://github.com/bluesky-social/pds)). A community PDS is reported to serve about a million users on a $262/month droplet ([SocialHub](https://socialhub.activitypub.rocks/t/bluesky-report-115independent-atproto-infrastructure/5299)), which is forum-sourced.

AT has real caveats:

- About 99% of accounts sit on Bluesky-run hosts (a third-party estimate) ([SoftwareSeni](https://www.softwareseni.com/understanding-at-protocol-architecture-and-decentralised-social-networks/)).
- Bluesky's relay once rejected the independent Eurosky PDS until its configuration changed ([SocialHub](https://socialhub.activitypub.rocks/t/this-weeks-atmosphere-bluesky-news-with-how-eurosky/8392)).
- Repos are public by design.

Governance is improving. An IETF working group was chartered in April 2026 ([atproto blog](https://atproto.com/blog/kicking-off-the-atp-working-group)), and the PLC directory, which resolves AT account identifiers, is moving to a Swiss association ([atproto blog](https://atproto.com/blog/plc-directory-org)). Smoke Signal already stores events in users' own PDSs under `community.lexicon.calendar.event` ([Smoke Signal](https://blog.smokesignal.events/posts/3lthgglsdlc2c-why-atprotocol)). A music-only AppView, the indexing service, would cost relay-scale money (tens to low hundreds of dollars a month) rather than Bluesky's 16 TB index. That figure is the researcher's inference; no niche AppView cost was found.

**ActivityPub** is cheap broadcast:

- Managed instances run $6–89/month ([masto.host](https://masto.host/pricing/)).
- Hachyderm costs about $0.03 per user per month, but only because all its labor is volunteered ([Hachyderm admin](https://lemmy.amethyst.name/post/19873/14806)).
- Posts do not migrate when an account moves ([manton.org](https://www.manton.org/2025/04/11/mastodons-incomplete-migration.html)).
- Threads' integration is in "maintenance mode" ([ActivityPub.space](https://activitypub.space/topic/534/in-short-fediverse-report-says-that-launching-threads-as-part-of-the-fediverse-is-basically-dead-in-the-water.)).

That makes it a good outbound channel and a poor system of record. WordPress plus the ActivityPub plugin is the lowest-friction route for venues that already run WordPress (inference).

**Nostr** has ready-made specs for calendar events (NIP-52) and Lightning tips. Its user base is small and inconsistently measured, unrecoverable key loss is a mainstream UX barrier, and payments are Bitcoin-only ([NIP-52](https://nips.4rs.nl/nips/52); [glukhov.org](https://glukhov.org/post/2025/10/nostr-overview-and-statistics/)). That makes it a poor fit for USD settlement.

**Matrix** is the only mature, open, federated option for private, structured negotiation, but two cautions apply:

- Synapse needs about 8 GB of RAM for 50 users ([valebyte](https://valebyte.com/ru/blog/matrix-synapse-hardware-requirements-users-federation-and-sizing/)).
- The Matrix Foundation gets **50% of its revenue from one member** and calls its dependence on Element "unsustainable" ([Matrix.org annual report](https://matrix.org/blog/2026/03/annual-report/)).

**W3C Verifiable Credentials 2.0 and Bitstring Status List** became Recommendations on May 15, 2025 ([W3C](https://www.w3.org/TR/2025/REC-vc-data-model-2.0-20250515/); [W3C](https://www.w3.org/TR/vc-status-list/)). That makes a signed "ticket as credential" with a revocation list standards-backed, though no production ticket deployment was found.

**Offline door validation** is solved without a chain. pretix's Ed25519 signature scheme validates tickets offline, and scanners download a revocation list. But double entry is something "cryptography alone cannot solve," so it needs shared state. pretix handles that with a LAN proxy so each ticket scans once per venue network ([pretix guide](https://docs.pretix.eu/guides/ticket-secrets/); [dev.to](https://dev.to/animesh_gupta_705a19fc6f8/designing-event-qr-check-in-that-works-when-the-venues-wi-fi-doesnt-i1l)).

**Local-first CRDTs** are production-ready: Automerge 3 cut memory use by more than 10×, and Loro shipped an open sync protocol in June 2026 ([Automerge](https://automerge.org/blog/automerge-3/); [loro.dev](https://www.loro.dev/blog)). Settlement sheets still need signed "finalize" snapshots, because concurrent edits to final money figures are unacceptable (inference).

**Content-addressed storage** gives integrity, not free hosting. Pinata-pinned IPFS costs about the same as S3 ([blockeden](https://blockeden.xyz/blog/2026/01/11/pinata-8-8-million-revenue-ipfs-storage-web3-infrastructure/)), and Holochain is mid token-migration ([Holochain blog](https://blog.holochain.org/holochain-foundation-establishes-holo-ventures-names-cameron-burgess-executive-director/)).

**A public chain** is no longer blocked by fees: USDC transfers cost about $0.02 on Base ([eco.com](https://eco.com/support/en/articles/14798701-base-vs-arbitrum-which-l2-should-you-build-on)). It remains unnecessary. Stripe's stablecoin payouts are in private preview ([Stripe docs](https://docs.stripe.com/connect/stablecoin-payouts)), and GENIUS Act rules missed their July 2026 deadline ([Sumsub](https://sumsub.com/media/news/genius-act-implementation-falls-behind-as-agencies-miss-deadline/)).

| Subsystem | Best fit | Who runs it | Indicative cost | Why not the alternatives |
|---|---|---|---|---|
| Identity | did:web for venues (domain-anchored); did:plc for artists; passkeys for fans | Venue's own domain; artist holds rotation key or a co-op does | ~$0 | Nostr keys unrecoverable; wallets rejected by every project with volume |
| Artist profile / EPK | AT lexicon records on the artist's PDS; media referenced by content hash, served via mirror/CDN | Artist, on a community PDS by city/genre co-op or the operator's default host | ~$0.02/GB-month blobs; 20,000 artists × 1 GB ≈ $400/month (inference) | ActivityPub posts don't migrate; P2P needs pinning anyway |
| Venue event data / performance database | schema.org MusicEvent model, published as AT records plus iCal/ActivityPub bridges | Venue node or hosted operator; any party can index | Relay ~$18–34/month; niche AppView ~$100–500/month (unsourced) | Bandsintown/Songkick APIs closed or gated |
| Booking negotiation, contracts | Private store: Matrix rooms or operator-hosted E2EE docs, local-first CRDT with signed finalize | Shared or managed homeserver per region; canonical copy on venue and artist devices | Synapse heavy (8 GB+); lighter homeservers unverified | AT repos are public; email is unstructured |
| Tickets and door | Venue-signed Ed25519/VC tokens, cached status list, LAN scanner dedupe, printed list fallback | Venue is the sole issuer | Phone PWA scanners; $0 | Chains add transferability that fights anti-scalping |
| Payments and settlement | Venue's own Stripe/Square account (merchant of record) | Venue; later a legal entity running Stripe Connect for automatic splits | Processor fees only | Stablecoin rails preview-gated; Lightning not USD |
| Discovery | One open-source AppView/indexer that anyone can re-run from public data | Reference operator plus at least one independent indexer | Low hundreds/month (inference) | Proprietary discovery becomes the capture point |

The researcher's order-of-magnitude model for 1,000 venues and 20,000 artists shows that infrastructure cost does not decide the architecture. It does show who pays and who does the work:

| Model | Monthly cost | Who pays | Who does the labor | Main failure mode |
|---|---|---|---|---|
| ~50 community ActivityPub instances | $2k–5k plus $400–700 media | Each instance steward | ~50 volunteer admins | Each instance is a single point of data loss for its members |
| 5–20 community AT PDS hosts, relays and one music AppView | $2k–7k | Hosts | A few hosts | Accounts stay portable if a host dies |
| One central cloud | $1k–5k | The operator | The operator | Cheapest, but the operator becomes the monopoly risk |

At real ticket volumes, card processing fees exceed any of these costs by orders of magnitude. The model's inputs are Hachyderm's per-user cost, managed-instance and PDS pricing, and community relay reports ([Hachyderm admin](https://lemmy.amethyst.name/post/19873/14806); [masto.host](https://masto.host/pricing/); [PDS README](https://github.com/bluesky-social/pds); [HN](https://hn.nuxt.dev/item/47301808)).

The governance guardrails that follow from the Bluesky, Matrix and Eurosky precedents:

1. Put the schemas and trademark in a neutral nonprofit from day one.
2. Publish all public data as a firehose or bulk export.
3. Let the entity, not the host, hold its DID rotation keys.
4. Do not market "decentralized" until at least two independent indexers exist.

## Venue-as-merchant routes around most of what big ticketers provide

A big ticketer's "infrastructure benefits" turn out to be three things:

1. **Regulated or contracted relationships** it holds on venues' behalf: merchant account, money-transmission posture, insurer partnerships.
2. **A balance sheet** that absorbs risk: reserves, chargebacks, refunds on cancellation.
3. **Operational capacity**: on-sale scale, bot defense, app distribution.

An unfunded open project cannot hold the first two without becoming a company. The workable design is therefore "venue as merchant, pluggable regulated providers, venue carries the risk," with the software making compliance the default path.

### Payments

Each venue connects its own Stripe, Square or PayPal account, and the software creates direct charges on it. Under Stripe Connect's "Stripe handles pricing" model the platform pays **no account, payout or volume fees**. The connected account bears refunds and chargebacks, and Stripe carries loss liability ([Stripe Connect pricing](https://stripe.com/connect/pricing)). That keeps the project out of the money flow. FinCEN excludes payment processors acting as agent of the merchant from "money transmitter" ([FIN-2008-R006](https://www.fincen.gov/sites/default/files/administrative_ruling/fin-2008-r006.pdf)). **State law is the bigger risk**: California's DFPI has found specific payment-processing services *not* exempt as agent of payee ([CA DFPI](https://dfpi.ca.gov/rules-enforcement/laws-and-regulations/opinion-letters-by-law-subject/opinion-letter-payment-processing-service-not-exempt-as-agent-of-payee-or-factoring)), and no source analyzes ticket platforms under state money-transmitter laws.

Automatic multi-party splits (guarantee plus door split paid straight to the band) push the operator toward platform status. Stripe's "separate charges and transfers" pattern supports it ([Stripe docs](https://docs.stripe.com/connect/separate-charges-and-transfers)), but under "you handle pricing" the platform pays $2 per active account per month plus 0.25% + 25¢ per payout plus 0.25% of volume, and needs a legal entity. The recommended phasing:

- **MVP.** The software generates the settlement sheet and the venue pays the artist from its own account, as the industry already does.
- **Mature.** A foundation, co-op or hosting entity runs the Connect platform.

Holding funds until after the show is a risk decision, not a software feature. Eventbrite holds a **20% reserve** and settles three days post-event ([Eventbrite Help](https://www.eventbrite.com/help/en-us/articles/115913/)). OMP could offer an optional "self-escrow" mode using the processor's manual payout schedule, so the processor holds the money and the project never does (inference). Brown Paper Tickets shows the stakes: it withheld payouts "for months and, in some cases, for years" ([Tone Madison](https://tonemadison.com/articles/complaints-about-brown-paper-tickets-continue-to-roll-in/)).

For PCI, the January 2025 SAQ A revision lets redirect-based processor checkout avoid a new script-attack eligibility criterion that embedded iframes trigger ([SecurityMetrics](https://chat.securitymetrics.com/blog/big-changes-for-saq-a)). Default to hosted redirect checkout so no self-hosting operator has to manage script monitoring.

### Consumer protection and fraud

The FTC Fees Rule must be enforced in code: the all-in price applies on every render, and the check should fail closed. Refund policy should be a required, machine-readable field that defaults to a full refund on cancellation. Visa's 13.7 "cancelled services" dispute is lost when no refund was issued ([chargeback.io](https://www.chargeback.io/blog/visa-chargeback-reason-codes)).

Purchase limits now carry legal weight. The FTC's 2025 suit pursues Ticketmaster for turning "a blind eye to broker circumvention of ticket limits" ([Global Policy Watch](https://www.globalpolicywatch.com/2025/10/ftc-sues-live-nation-and-ticketmaster-for-deceptive-pricing-tactics/)). If OMP advertises "4 per customer," it must enforce that limit and log enforcement. Otherwise it should publish no limit.

### Privacy, messaging and accessibility

**Privacy.** Indiana, Kentucky and Rhode Island laws took effect January 1, 2026. Most state laws trigger at 100,000 residents, and Rhode Island's at 35,000 ([TrustArc](https://trustarc.com/resource/new-in-2026-state-privacy-laws-in-indiana-kentucky-and-rhode-island/)). A single 300-cap venue never hits those thresholds. A central multi-tenant service aggregating many venues' fans could. **Decentralization is therefore a privacy-compliance feature**: fan data stays with the venue, and shared layers carry only event metadata.

**SMS.** Text marketing requires 10DLC registration: a $4.50 brand fee, $41.50 vetting, plus monthly campaign fees ([Twilio](https://support.twilio.com/hc/en-us/articles/1260803965530)). That registration belongs on the venue's own Twilio account, not the project's.

**Accessibility.** This is the one compliance benefit open source can deliver to every venue at once. The DOJ pushed ADA Title II web deadlines to **April 26, 2027** for public entities serving 50,000+ people and **April 26, 2028** for smaller ones ([JD Supra](https://www.jdsupra.com/legalnews/doj-extends-title-ii-ada-web-2176958/)). For school customers that makes WCAG 2.1 AA a procurement gate.

### Taxes, apps and insurance

**Taxes.** The One Big Beautiful Bill Act restored the 1099-K threshold to more than $20,000 and more than 200 transactions, and under venue-as-merchant the processor files those forms ([Credit Karma](https://www.creditkarma.com/tax/library/irs-forms/1099-k-threshold/)). Venue-side obligations remain, and the software should calculate them and remind venues, not file:

- California withholds **7% from nonresident entertainers** paid more than $1,500 a year ([CA FTB](https://www.ftb.ca.gov/pay/withholding/withholding-on-nonresidents.html)).
- Chicago levies a 9% amusement tax, with small-venue exemptions that conflict across sources ([Kilpatrick Townsend](https://ktslaw.com/insights/perspectives/2024/3/chicago-and-cook-county-amusement-tax)).

**Apps.** Apple's guideline 3.1.3(e) requires non-in-app-purchase payment for services "consumed outside of the app," so in-person tickets owe Apple nothing. Livestream access may fall under the in-app-purchase rule in 3.1.3(d) ([Apple](https://developer.apple.com/app-store/review/guidelines/)).

**Insurance.** This is the clearest case where the venue must carry the risk. Insurers show "limited enthusiasm" for small venues, assault-and-battery coverage is often excluded, and event-cancellation cover is a separate rider ([HUB International](https://www.hubinternational.com/en-us/insights/articles/insurance-for-small-venues/)). Fan-side ticket protection (XCover) is the only insurance product a platform monetizes, and it requires an insurer partnership ([Ticket Tailor](https://www.tickettailor.com/en-us/refund-protection)).

### Gaps in the evidence

The notes flag several unsourced items:

- Contract templates (AFM forms, ESIGN/UETA enforceability), recorded as unverified background.
- School-specific requirements (student data-privacy agreements, VPATs, FERPA), also unverified background.
- Stripe's held-funds limits and stance on ticketing merchants.
- Insurance premiums for small venues.

| Capability | Who provides it in OMP | MVP (cost to project) | Mature (needs a legal entity) |
|---|---|---|---|
| Card acceptance, payouts | Venue's own processor account | Redirect checkout, direct charges ($0) | Connect platform for automatic splits |
| Fund holding, refunds, chargebacks | Venue (processor-enforced) | Self-escrow option, one-click bulk refund, refund policy as data | Ticket-protection plug-in, broker referrals |
| All-in pricing, fee disclosure | Software invariant | Fail-closed price module | Jurisdictional tax-rule data |
| Fraud and bots | Processor plus software | Processor fraud scoring, signed single-use QR, enforced limits | Rotating wallet passes, queue plug-in |
| Privacy and SMS | Venue node | PII minimization, consent logs, venue's own SMS account | Security audit; SOC 2 only if hosted |
| Accessibility | Software | WCAG 2.1 AA release gate | VPAT for school procurement |
| Insurance | Venue | Certificate-of-insurance fields and exchange in the deal flow | Insurer partnership (counsel needed) |
| App distribution | Web | PWA plus email/PDF QR | Entity-signed Wallet passes, white-label apps |

## Disruption theory says enter through non-consumption, then climb through settlement

Christensen distinguishes two footholds ([HBR 2015](https://hbr.org/2015/12/what-is-disruptive-innovation)):

- **Low-end footholds**, where incumbents overserve their least-demanding customers.
- **New-market footholds**, which "create a market where none existed" by turning non-consumers into consumers.

The same piece argues that starting in the mainstream market is not disruption. The parallel here is direct: attacking Ticketmaster at arenas is sustaining competition, the fight SeatGeek and AXS wage using the same exclusivity tools.

**Where the non-consumption is.** About **24% of US high-school students** take band, choir or orchestra at some point ([Elpus & Abril 2019](https://journals.sagepub.com/doi/10.1177/0022429419862837)). The researcher infers on the order of 10^5 high-school concerts a year, most of them free, paper or cash, or run through an athletics-first platform. That is labeled inference, not a sourced count. K-12 is *not* pure non-consumption, because GoFan-style vendors already sell into it. The cleanest non-consumers are shows where no money changes hands or cash goes in a box: open mics, house concerts, church and community bands, recitals and pay-what-you-want DIY shows. Their job-to-be-done is discovery, headcount, a door list and a payout split. Fee-bearing ticket sales are secondary.

**What "good enough" means.** The bar incumbents overshoot is enterprise on-sale infrastructure: seat maps, waiting rooms, verified-fan systems, dynamic pricing, resale controls. The foothold spec is much smaller:

- a shareable event page with an open feed
- free RSVP
- optional paid tickets with all-in prices
- QR plus offline name-list check-in on any phone
- multi-party payout splits
- data export

For free shows the comparison is a flyer or an Instagram post, not Eventbrite, which avoids a fee war. For paid shows, card processing (about 2.9% + 30¢) is a floor no license removes.

**Asymmetric motivation protects the foothold.** Live Nation earns its money at amphitheaters, arenas and major-venue fees, and it now operates under a jury verdict and a consent decree. The researcher infers it will respond only when an open network does one of three things:

- takes the 1,000–3,000-cap clubs that feed its promoter pipeline;
- carries artist–fan data that Ticketmaster's marketing depends on; or
- becomes the "rival ticketing service" venues use under the new decree.

Songkick shows what the response looks like once it comes: it shut its ticketing operation in 2017, citing Live Nation and Ticketmaster pressure ([Live for Live Music](https://liveforlivemusic.com/news/songkick-ticketmaster-live-nation/)).

The relevant incumbent for the foothold is **Eventbrite**. Its 2023 fee on free events, reversed by 2024, shows it treats free events as its acquisition funnel ([Checkout Page](https://checkoutpage.com/blog/eventbrite-fees)). Under Bending Spoons, the researcher considers further monetization of the long tail plausible but unconfirmed. Each such move is an "exodus moment," so OMP should have an Eventbrite importer ready. Mobilizon shipped Meetup and Eventbrite import for the same reason ([Fediverse Report](https://fediversereport.com/?p=1383)). Bandcamp, sold twice in two years ([CNBC](https://www.cnbc.com/2023/09/28/epic-games-is-eliminating-16percent-of-its-workforce-and-selling-bandcamp.html)), shows that the threat to an artist-direct tool is acquisition, not price competition.

**Come for the tool, stay for the network.** Chris Dixon's pattern ([cdixon.org](https://cdixon.org/2015/01/31/come-for-the-tool-stay-for-the-network)) points to seeding the supply side. Venues and ensembles each bring 50–300 events a year, plus their own audiences arriving through links organizers already share. Artists are a weaker seed, because a touring band's value depends on venues already being on the network. Cross-venue discovery and artist routing come later.

**The path upmarket** is where OMP's design either earns or forfeits its scaling story. The researcher's synthesis runs as follows:

1. **Settlement layer.** The deal-memo → advance → settlement layer is ticketing-neutral, so it can sit beside any ticketer at mid-size venues the way Prism does. It needs no ticketing switch, so a venue's exclusive contract does not block it.
2. **Artist-owned fan data.** Opt-in, artist-held fan lists match NITO's explicit ask and the DOJ's Artist Transparency clause. That gives agents and managers of signed acts a reason to require OMP data-sharing in deal memos.
3. **Decree carve-outs.** If the decree is approved, its carve-outs open slices of inventory to rivals even at Ticketmaster venues: one event per year, 20% of inventory under long contracts, and 50% at amphitheaters. The open-distribution API could then let a qualifying open seller sell Ticketmaster-backed inventory, subject to uncapped infrastructure fees and qualification gates.
4. **Large venues.** These require answers OMP cannot give early: capital advances (an optional revenue-based financing partner, VenuePilot-style, is the only plausible route), venue-set fees that replace rebate income, and on-sale scale.

Treat step 4 as a 2028+ horizon.

### Governance, licensing and funding for a solo founder

**Licensing.** The proven template is **AGPLv3 for the server with a plug-in exception**, the pretix pattern. pretix moved from Apache to AGPL to stop hosts competing on its code without contributing ([pretix license FAQ](https://docs.pretix.eu/en/latest/license/faq.html)). The rest of the licensing stack:

- A permissive license (MIT or Apache-2.0) for the event and ticket schemas and client SDKs, so other vendors can adopt the format.
- A **Developer Certificate of Origin rather than a CLA**, so no one can later relicense contributions.
- A trademark held by a nonprofit, not the founder. Mastodon moved its trademark to a nonprofit so "no single person" controls it ([Mastodon blog](https://blog.joinmastodon.org/2025/01/the-people-should-own-the-town-square/)).
- No source-available licenses (BSL, FSL, SSPL). They are not FSF/OSI-approved, which disqualifies the project from Software Freedom Conservancy ([SFC](https://sfconservancy.org/members/apply/)) and from many grants.

**Legal home.** Start inside a fiscal sponsor:

- **HCB at 7%** ([HCB](https://help.hcb.hackclub.com/article/18-what-is-the-fiscal-sponsorship-fee-and-how-much-is-it-why-does-hcb-take-a-fiscal-sponsorship-fee-how-does-it-compare-to-other-fiscal-sponsors)), or
- **Open Source Collective at 10%** ([OSC](https://opencollective.com/opensource/apply/intro)).

Assign the trademark to the sponsor at entry, and keep a written exit plan. Open Collective Foundation dissolved in 2024, and some projects had as little as 16 days' notice before donations stopped ([OCF update](https://opencollective.com/foundation/updates/an-update-from-open-collective-foundations-board-of-directors)). Once hosted revenue or a grant arrives, create a separate operator LLC or PBC that licenses the mark and runs the hosted service; this is the pretix GmbH pattern. Avoid a cooperative as the first vehicle. Ampled wound down partly because a co-op was "not eligible for most grants geared towards nonprofits" ([E2C case study](https://git.medlab.host/e2c/e2c-how/src/branch/main/content/case-studies/ampled.md)). A 501(c)(6) association of venues, NIVA-style, is the natural graduation home if venues will pay dues.

**Funding.** The pipeline is thinner than it looks:

- NLnet paused open calls in June 2026 pending new "Open Internet Stack" programmes ([NLnet](https://nlnet.nl/news/2026/20260612-NGIZero-stocktaking.html)), though it did fund Mobilizon's continuation.
- The Sovereign Tech Agency does not prioritize "user-facing applications" ([Sovereign Tech](https://sovereign.tech/news/new-proposals-criteria-process-timeline)).

The realistic order is:

1. Hosted-service revenue: a small fee on *paid* tickets only, with free events free (the Humanitix logic).
2. US arts and community foundations, reached through the fiscal sponsor.
3. Venue association dues.
4. Small sponsorships.

Knight, NEA and Bluesky grant terms were **not verified**. The researcher's illustration, not data: a $1 fee across 100 venues × 150 events × 60 paid tickets yields about $900k a year, enough for 3–5 staff, but only with payment-platform operations behind it. Avoid a token. Every token-funded ticketing project's incentives drifted toward token price.

**Timelines.** Every precedent took 5+ years to reach a self-sustaining contributor base:

- Mobilizon had "very few contributors outside Framasoft" after 5 years.
- Mastodon took about 9 years and a €2.2M gift before its founder could step back ([TechCrunch](https://techcrunch.com/2025/01/13/mastodon-announces-transition-to-nonprofit-structure/)).

Plan for the founder to be the bus factor through year 3. Mitigations: two admins on every account (GitHub, domain, DNS, payments, trademark), an RFC-style schema-proposal repo modeled on FEPs and NIPs, and a steering council only once there are about five regular non-founder contributors and two organizational adopters. The notes add a guardrail aimed squarely at over-building: one product, one hosted instance, one protocol document. Defer federation, native apps and a booking marketplace until 10+ organizations pay for or depend on the tool.

## Recommendation: ranked beachheads, three architectures, twelve probes

### Ranked beachhead

| Rank | Beachhead | Disruption type | Why it ranks here | Main risk |
|---|---|---|---|---|
| 1 | **School and community ensembles**: K-12 concerts, college recitals, community bands and orchestras, church series | New-market (plus low-end against "free to school" vendors) | Regressive flat fees and cash-audit pain; zero-fee to families is most valuable at $5–15 prices; simple GA events; Ben's music-ed conference channel; ADA Title II makes accessibility a selling point | Thinnest survey evidence; district procurement, mandated vendors, DPA/VPAT requirements; GoFan and Ludus already "free to school" |
| 2 | **Independent artists plus pledge venues** (UMAW Raise the Bar, #MyMerch "100% Venues"): deal memo → advance → settlement → payout | New-market for structured booking; ticketing-neutral | Most acute software-solvable pain (settlement opacity, unpaid shows); open stage-plot/advance schema is white space; builds the bridge upmarket | Venues that profit from opacity won't adopt; VenuePilot and Prism already offer settlement sheets |
| 3 | **DIY, house concerts, open mics** | Pure non-consumption | No incumbent; job is RSVP + door list + split | Little money, low organizational stability, hard to reach as a group |
| 4 | **Small paid clubs (100–500 cap)** | Low-end fee disruption | Fee savings are real | Competes with VenuePilot's $0.75 and Ticket Tailor; fee-rebate and advance economics favor incumbents |
| 5 | **Mid/large venues and signed artists** | Sustaining (not disruptive) | Long-term goal | Exclusivity, advances, on-sale scale; Live Nation retaliation; legal remedies pending until 2028+ |

### Candidate architectures

| Dimension | A. Open core + hosted operator (pretix/Humanitix pattern) | B. AT Protocol data plane + venue-signed tickets | C. Self-hosted, local-first venue nodes + federation |
|---|---|---|---|
| Shape | One AGPL app; operator runs a multi-tenant instance; anyone can self-host; outbound iCal/ActivityPub/schema.org feeds; full export | Artists and venues write OMP lexicon records (profile, EPK, event, ticket class) to their own or community PDS; open music AppView indexes; private booking in Matrix or E2EE store; venue issues signed tickets with status list | Each venue, district or co-op runs a node; CRDT calendars and settlements; ActivityPub publishing; Matrix booking |
| Meets "artists host profile, venues host events" | Weakly (export and self-host only) | **Strongly** (signed, portable records under the owner's DID) | Strongly for venues; weak for artists without a host |
| Solo-founder build cost | Lowest | Medium (lexicon design, AppView, PDS ops) | Highest (sync, ops, upgrades) |
| Running cost at 1,000 venues / 20,000 artists | ~$1k–5k/month, operator pays | ~$2k–7k/month across a few hosts | ~$2k–5k/month across many volunteer admins |
| Privacy-law posture | Aggregated fan data can cross state thresholds | Good if buyer data stays with venue issuer; public repos carry only public data | Best |
| Upmarket path | Easiest to integrate with decree APIs and ticketers | Good: neutral data layer other vendors can read | Poor: large venues won't run nodes |
| Capture and failure risk | Re-centralization; operator is the monopoly risk | Dependence on Bluesky relay and PLC; protocol churn | Mastodon/Mobilizon admin burnout; instance data loss |
| Evidence base | pretix, Humanitix, Indico thriving | Smoke Signal (45k events), IETF WG; no ticketing precedent | Mobilizon handoff, Attendize dormancy |

**Recommendation.** Build **A with B's data model**, and keep C as an option for institutions.

- **First 12–18 months.** Ship the beachhead as a hosted, self-hostable AGPL app with venue-as-merchant payments, offline signed tickets and outbound open feeds. A is the only architecture a solo founder can ship and support while meeting the door and payment bar.
- **Schemas from day one.** Define every artist, venue, event, advance and settlement object as a published, permissively licensed schema shaped to map onto AT Protocol lexicons and schema.org MusicEvent. This is what makes "artists own their profile" true later without a rewrite.
- **Switching on B.** Turn on AT publishing (the operator runs a default community PDS, and artists can point to their own) once a second independent host or indexer exists. That guards against Eurosky-style dependence and honors the "two indexers before claiming decentralization" rule.
- **Keeping C narrow.** Offer C only to districts, universities and venue co-ops with IT staff, because those are the organizations that self-host pretix and Indico today.

No architecture uses a blockchain in v1. A chain stays an optional, later audit anchor at most.

### Load-bearing assumptions to probe before building

| # | Assumption | Why it is load-bearing | Cheapest probe | What would falsify it |
|---|---|---|---|---|
| 1 | Music educators feel fee, cash and RSVP pain strongly enough to switch | Beachhead #1 rests on vendor pages and one school-committee record; no educator survey exists | 15-question survey to Ben's music-ed network and one conference session (n≥40): current tool, fees, cash handling, missing features | Most report "district handles it" or satisfaction with free-to-school vendors |
| 2 | Fine-arts ticketing is not locked to district-mandated vendors | Procurement can block adoption regardless of quality | Call five district fine-arts coordinators; ask about mandated vendors, DPA and VPAT requirements | Majority must use the athletics vendor or need a signed DPA from a legal entity |
| 3 | Venues accept zero platform fee despite losing fee-rebate income, if they can set their own disclosed fee | Inference from rebate economics; could invert the value proposition | Ten interviews with UMAW pledge venues and NIVA members | Venues prefer incumbents' rebates or advances |
| 4 | Organizers will connect their own processor account and carry refund and chargeback risk | The entire compliance posture depends on it | Concierge pilot: three organizers run one event each on Stripe Checkout links plus a spreadsheet settlement | Organizers balk at onboarding, or processors impose heavy reserves on event merchants |
| 5 | Direct charges on venue accounts keep the project and node operators outside state money-transmission rules | California DFPI precedent shows exemptions are narrow | One-hour fintech/MTL counsel opinion on the MVP flow and the later Connect-split flow | Counsel says splits or self-escrow trigger licensing in target states |
| 6 | Venues, not just artists, want transparent settlement | The Sultan Room pattern suggests some venues benefit from opacity | Offer a free settlement-sheet template to pledge venues; count repeat use over a month | Only artists use it; venues decline to share |
| 7 | VenuePilot (free booking, $0.75 tickets, non-exclusive) does not already satisfy the club wedge | If it does, OMP's club pitch reduces to "open source" | Interview five VenuePilot venues about what is missing | No unmet need beyond price |
| 8 | Offline signed-QR check-in on a phone PWA works in a gym or club with no Wi-Fi | Door failure is the fastest way to lose trust | One-day prototype; 300 scripted scans across two phones offline, measuring duplicate admits and throughput | Unacceptable duplicates or slow throughput without a LAN proxy |
| 9 | Custom AT lexicon records can be written, relayed and indexed cheaply by a niche AppView | Architecture B's cost and portability claims are unsourced inference | Spike: write 1,000 test records to a self-hosted PDS and confirm the public relay carries them and a minimal indexer picks them up | Relay drops or rejects records, or indexing needs full-network backfill |
| 10 | A fiscal sponsor will hold the trademark while a founder-owned operator licenses it | The governance structure depends on this split | Email HCB and OSC with the specific structure | Both refuse or require terms that block an operator entity |
| 11 | Eventbrite will create an "exodus moment" in the free and low-price segment | Precedents suggest it; not confirmed for 2026 | Monitor Eventbrite pricing pages monthly; keep an importer ready (trigger, not experiment) | Pricing stays stable through 2027 |
| 12 | The founder can sustain one narrow product for 3+ years | Every precedent took 5+ years; over-building is the stated failure mode | Write a one-page scope charter (one product, one instance, one schema doc) and time-box to 10 paying or dependent organizations before adding subsystems | Scope expands to 2+ subsystems before probe 1 returns |

## Conclusion

The research reframes the question. Ticketmaster is the monopoly, but it is not OMP's competitor for years, and the courts, not an open-source project, will decide its structure. OMP's real opponents at the bottom of the market are opacity and informality: unwritten deals, unseen settlements, cash boxes nobody reconciles, and "free" tools that bill parents and sell their email addresses. That makes the most valuable artifact OMP could create a **neutral, shared record of what was agreed, sold and paid**, not a new ticket. Venues, artists and organizers would each hold their own copy, and any vendor could read it. Tickets, discovery and the performance database all follow from owning event creation and settlement.

Two less obvious implications follow. First, decentralization pays off for compliance rather than ideology. Keeping fan data and merchant liability with each venue keeps OMP below state privacy thresholds and outside money transmission, which is exactly what a solo founder cannot afford to carry. Second, the climb upmarket runs through the settlement sheet, not the box office. A ticketing-neutral settlement and data layer can enter mid-size rooms that are locked into exclusive ticketing contracts, and it lines up with what agents (NITO), unions (UMAW) and regulators (the DOJ's transparency clause) are already demanding. If the first probes confirm educator pain and venue willingness, the right first build is small: one hosted tool for a school concert and a club settlement, built on schemas designed to outlive the tool.
