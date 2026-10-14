# Open Music Performance (OMP)

Open Music Performance is a planned free, open-source platform for live music events: event pages, RSVPs, tickets, door check-in, and artist settlement. Its goal is to put independent and signed artists, and rooms from dive bars to arenas, on the same infrastructure footing, so artists and venues can deal directly without a middleman taking a cut of the door. It starts small, with school and community ensembles, where free events should stay free and a $5 ticket should not carry a $1 fee. OMP is not a Ticketmaster replacement, not a blockchain or token project, and not a company that holds anyone's money. There is no code yet.

## The problem

On April 15, 2026, a federal jury in the case brought by 33 states and DC found that Ticketmaster monopolized primary ticketing at major concert venues (reported by the New York Attorney General and NPR). The court record defines those as venues seating 8,000 or more, every remedy now in play targets that tier, and the DOJ's proposed settlement has no provisions specific to small venues or clubs (TicketNews). Final resolution is not expected before 2028, according to Crowell & Moring as reported by Hypebot.

Small stages are fragile: NIVA's State of Live study found that 64% of US independent stages were unprofitable in 2024. The research infers, without direct data, that ticket fees are often a rebate source for small venues, so a zero-fee tool may cost a venue money unless the venue can set its own disclosed fee.

School and community organizers face the most regressive pricing. GoFan's own FAQ lists a $1 buyer fee on tickets up to $10, which is a 10-20% surcharge on a $5-10 concert ticket. School audits, such as Seattle Public Schools' internal audit of late cash deposits, show that cash at the door carries real compliance risk for volunteers.

For independent artists, the research ranks settlement opacity (late, zero, or disputed pay) as the most acute pain that software can fix. The US evidence is anecdotal, such as Thor Harris's $0 settlement at Brooklyn's Sultan Room (reported by mxdwn), and the only frequency figure is an Australian comparator from MEAA: one in four performances violated contract terms.

One honest gap: the research found no survey of music educators' ticketing practices, and our first probe is meant to fill it.

## Principles

1. **The venue owns the door and the money.** Each organizer is the merchant of record on its own payment account, and the project never holds funds.
2. **Artists and venues own their records.** Every profile, event, performance, and settlement can be exported and moved to another host.
3. **Free events are free to everyone**, including families, with no fee on free tickets or RSVPs.
4. **The price shown is the price paid.** All-in pricing is enforced in code, not left to configuration.
5. **Open schemas before features.** Data formats are published and permissively licensed before the features that use them ship.
6. **Interoperate, don't replace.** OMP publishes open feeds, imports from existing tools, and its settlement tool works alongside any ticketing system.
7. **No wallets, no token, no blockchain in v1**, and no crypto wallet for fans ever.
8. **Two indexers before "decentralized."** Until at least two independent hosts or indexers exist, OMP describes itself as open, portable, and self-hostable.
9. **Compliance is the default path.** Refund policy is a required field, checkout uses the processor's hosted page, accessibility (WCAG 2.1 AA) is a release gate, and fan data stays with the organizer.
10. **Scope discipline.** One product, one hosted instance, and one schema document until real organizations depend on it.

## What we are building first

The first release is for school and community ensembles: K-12 concerts, college recitals, community bands and orchestras, and church and community concert series. It covers:

- A shareable event page with open feeds (iCal, JSON-LD, RSS).
- Free RSVP with capacity control and comp tickets.
- Optional paid tickets at all-in prices, charged on the organizer's own Stripe account.
- QR check-in plus an offline name list, on any phone, with no app install.
- Cash and door reconciliation with an audit-friendly export.
- Digital programs.
- Donations and free-will offerings.
- Full data export, including the organizer's own audience list.
- An Eventbrite importer.

Card processing fees (roughly 2.9% + 30 cents per charge) still apply to paid tickets. How the hosted instance covers its own costs is not settled yet; it will be published before anyone pays for anything.

## What comes next

1. **Settlement wedge.** A deal-memo-to-settlement tool for independent artists and venues, including those that signed UMAW's "Raise the Bar" pledge (no merch cuts, no pay-to-play, greater contract transparency). It is designed to work with any ticketing system. At first it generates the settlement sheet and the venue pays the artist from its own account, as venues already do.
2. **Clubs.** Small paid rooms, once we understand whether venues will give up fee rebates in exchange for a fee they set and disclose themselves.
3. **Mid-size venues**, if the Live Nation decree is approved and its carve-outs (one event per year, up to 20% of inventory under long contracts, up to 50% at amphitheaters) open inventory to other sellers.
4. **Large venues** are a 2028+ horizon at the earliest.

## Why not just use X

**Eventbrite.** It is fine for many events, and free events are free there today. Paid tickets cost 3.7% + $1.79 plus 2.9% processing. It charged a fee on free events in 2023 and later reversed it, and it was sold to Bending Spoons in 2026. OMP will ship an importer for anyone who wants to leave.

**GoFan and other "free to school" platforms.** They work for many athletics departments, and some districts are already under contract. They are free to schools because parents pay the fee, and GoFan's FAQ says it uses buyer emails for its own marketing. Our research did not review Hometown Ticketing's terms, so we make no claims about it.

**VenuePilot.** VenuePilot is good: $0.75 per online ticket, free door sales, the venue's own Stripe account, and no exclusivity. If it fits your club, use it. OMP differs by being open source, with published schemas and records you can move, and no single company that can be sold out from under you.

**DICE.** DICE has real anti-scalping tools, including phone-bound tickets and a face-value waitlist. It is sales-led, its fees are not published, and it is now owned by Fever. OMP is not aiming at the high-demand shows where those tools matter.

**pretix.** pretix is excellent, and OMP borrows its playbook: AGPL with a plugin exception, a hosted tier, and offline signed tickets. If pretix meets your needs, use it. OMP's reason to exist is the music-specific layer: ensembles, programs, deal memos, settlements, and portable artist and venue records. Whether to build on pretix rather than beside it is an open question.

**Mobilizon or Gancio.** Mobilizon shows that federated event publishing works, with 79 instances and about 377,000 events, but it handles no payments. We have not evaluated Gancio in our research. OMP will publish to the same open networks rather than compete with them.

**An NFT ticketing startup.** In roughly a decade, only one blockchain ticketing project reached multi-million volume, by its own count. It did so by hiding the chain from fans, and its main ticketing company was later sold. The Ethereum Foundation's own Devcon ran an on-chain ticketing RFP, selected no vendor, and kept self-hosted pretix. Verifiable tickets are a good idea, and signatures deliver them without a chain or a wallet.

## Architecture in one page

- One AGPL server application that anyone can self-host, plus a small hosted instance for people who don't want to run servers.
- Each organizer or venue connects its own Stripe account (Square later) and is the merchant of record. Charges go directly to that account, which bears refunds and chargebacks. The project never touches the money.
- Checkout uses the processor's hosted redirect page, so self-hosters do not have to manage payment-page script monitoring.
- Tickets are signed with the venue's key and verified offline at the door on any phone, with a revocation list, local duplicate-scan protection, and a printable name list as fallback.
- Artist, venue, event, performance, and settlement objects are published, permissively licensed schemas designed to map onto AT Protocol lexicons and schema.org MusicEvent.
- Outbound open feeds from day one: iCal, JSON-LD and RSS, with ActivityPub and AT Protocol later.
- Fan personal data stays with the organizer that collected it. Shared layers carry only public event data.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Status

OMP is in the planning stage, and no code exists yet. The landscape research was completed on 2026-10-14 and is in [reports/](reports/Open%20music%20ticketing%20landscape.md). Before any code is written, a four-week probe plan tests the riskiest assumptions, from educator demand to offline check-in in a gym with no Wi-Fi. See [docs/PROBE_PLAN.md](docs/PROBE_PLAN.md) and [docs/SCOPE_CHARTER.md](docs/SCOPE_CHARTER.md).

## How to help

**Developers.** We need help drafting the open schemas, prototyping the offline scanner PWA, building the Stripe Connect direct-charge flow, writing importers (Eventbrite first), packaging self-hosting, and running a spike on writing custom AT Protocol lexicon records to a self-hosted PDS and indexing them.

**Music educators and ensemble directors.** Take the survey (link TBD) about how you handle tickets, cash, and RSVPs today, including if the answer is "the district handles it." If you are willing, pilot one concert with us.

**Venue operators and independent artists.** Tell us in an interview how deals and settlements work for you now. Venues, especially pledge venues, can pilot a free settlement-sheet template and tell us whether it gets used.

**People with legal, fintech, or insurance knowledge.** We need an opinion on whether the direct-charge flow, and later automatic payout splits, stay outside state money-transmission rules. We also need data processing agreement (DPA) templates that school districts will accept.

## Governance and license

- The trademark and the schemas will be held by a fiscal sponsor (HCB or Open Source Collective), so no one, including the founder, can capture the project. **The fiscal sponsor application is pending, not done.**
- A separate founder-owned operator LLC may later run the hosted instance under a license from the sponsor.
- The server is licensed AGPL-3.0 with a plugin exception.
- Schemas and SDKs are licensed MIT or Apache-2.0 (final choice pending).
- Contributions are accepted under the Developer Certificate of Origin (DCO), not a CLA, so no one can later relicense your work.

## Non-goals

For v1, OMP will not build:

- Arena-scale on-sales
- Bot defense
- Dynamic pricing
- A resale marketplace
- A fan social network
- A booking marketplace
- Native apps (PWA first)
- Anything on a blockchain

---

contact: TBD
