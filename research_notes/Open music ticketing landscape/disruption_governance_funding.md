# Disruption Strategy, Governance and Funding for an Open Live-Music Ticketing Network (US, as of Oct 2026)

Research notes for the report writer. Scope: (1) Christensen-style disruption analysis of US live-music ticketing/booking plus open-source/open-protocol precedents; (2) governance, licensing and funding models for a solo founder who seeds an open project and later hands it to a community.

**Source-quality legend.** Items marked **[verified this session]** were confirmed by a web search or fetch on 2026-10-14. Items marked **[prior knowledge, canonical URL; not re-fetched]** are well-established facts with a stable primary URL that I did not re-open this session. The report writer should spot-check these before quoting them as current. Anything I could not source sits under Gaps.

---

## 1. Where is the non-consumption in US live music, and can it be quantified?

### Takeaway
A large share of US live music runs on no ticketing software at all: school concerts, church and community-band shows, open mics, house concerts and the cash-at-the-door or free nights at sub-300-capacity bars. That is real non-consumption, but this session found almost no hard national counts for it. The best number found is enrollment-based: about 24% of US high-school students take a band, choir or orchestra course at some point. Two caveats: K-12 is *not* pure non-consumption, because school-athletics ticketing vendors already sell into it, and the "share of US shows under 300 cap" figure needs primary data the brief should not invent.

### Cited Findings
- **School ensembles, scale.** In the NCES High School Longitudinal Study (class of 2013), 24% of students enrolled in at least one year of band, choir or orchestra: choir 13%, band 11%, orchestra 2%. These are cumulative four-year rates, not one-year headcounts. — [Elpus & Abril, *Journal of Research in Music Education* 2019 (SAGE)](https://journals.sagepub.com/doi/10.1177/0022429419862837); [NAfME *Teaching Music* summary, Apr 2020](https://digitaleditions.walsworth.com/article/Who+Enrolls+In+High+School+Music%3F+A+New+National+Profile/3626697/653680/article.html) **[verified this session]**
- Blog figures such as "8.4 million secondary students in school band programs in 2026" (Voxbooster) cite no primary report and contradict each other. **Do not use them.** — [Voxbooster](https://voxbooster.com/blog/school-band-program-statistics-2026/) **[verified as unreliable this session]**
- **Independent venues.** NIVA formed in 2020 with roughly 2,000 members across all 50 states, and 90% said they would close permanently without federal aid. No capacity breakdown was published. — [NPR, Jun 9 2020](https://www.npr.org/sections/coronavirus-live-updates/2020/06/09/873196748/americas-independent-music-venues-could-close-soon-due-to-coronavirus); [Wikipedia: NIVA](https://en.wikipedia.org/wiki/National_Independent_Venue_Association) **[verified this session]**
- NIVA's 2025 "State of Live" survey bills itself as the first economic study of the independent live sector (venues, promoters, PACs, festivals). Pollstar framed its subject as "the small rooms, the back bars, the 500-cap venues". The search did not surface a published capacity breakdown. — [Pollstar, Feb 21 2025](https://news.pollstar.com/2025/02/21/why-every-stage-matters-take-nivas-state-of-live-survey-now/); [Hypebot](https://www.hypebot.com/niva-independent-live-music-survey/) **[verified this session]**
- **K-12 is partly served.** High-school ticketing is a contested market. PlayOn's GoFan and HomeTown Ticketing sell digital ticketing to schools, mainly for athletics, and concerts/plays often ride along. — [GoFan](https://gofan.co/) **[prior knowledge, canonical URL; not re-fetched]**

### Inferences
- **Order of magnitude for K-12:** about 15M US public high-school students, with roughly a quarter passing through an ensemble, gives several million performers. With 2-4 concerts per ensemble per year, US high schools alone likely stage on the order of 10^5 concerts a year, and middle and elementary schools add more. This is an inference, not a sourced number. Most of these concerts are free, use paper or cash, or go through a district platform built for athletics. That is "good enough" non-consumption for a music-specific tool, but expect a GoFan-style incumbent wherever the district already has a contract.
- The cleanest non-consumption segments are those with **no money changing hands, or cash/Venmo at the door**: open mics, house concerts, church and community-band concerts, free school recitals, college ensemble recitals, and pay-what-you-want DIY shows. Their real "job" is mostly **discovery + RSVP/headcount + door list + artist payout split**, not fee-bearing ticket sales.
- Booking (artist-to-venue matching, holds, deal memos, settlements) is arguably a deeper non-consumption pocket than ticketing. At small capacities it is done by email, Instagram DM and spreadsheets. This is inference from industry norms; no survey was found.

### Gaps
- No primary source found for: the share of US shows under 300 capacity; the share of US shows that are free; the number of US K-12 or college music performances per year; counts of US community bands (the Association of Concert Bands membership would be a starting point), church concerts or house concerts. A dedicated data researcher should check: NIVA State of Live results (if published), the Arts Education Data Project, NAfME, the NEA Survey of Public Participation in the Arts (SPPA), the Association of Concert Bands, Chorus America's "Chorus Impact" study, and the house-concert platforms Sofar Sounds and Concerts in Your Home.
- No data found on which share of small venues use no ticketing software at all.

---

## 2. Low-end vs new-market disruption, and the "good enough" bar

### Takeaway
An open ticketing network fits **new-market disruption** best: it should serve events that buy no ticketing today (free, cash, RSVP-only, school and community shows), with **low-end disruption** of fee-bearing small-club ticketing as the second step. The performance bar incumbents overshoot is enterprise-grade on-sale infrastructure: bot defense, dynamic pricing, seat maps, resale controls. A 150-cap room needs a public event page, a QR or name-list door check, fast payouts, and fees close to zero.

### Cited Findings
- Christensen's definition, per the 2015 HBR piece: disruption starts in **low-end footholds**, where incumbents overserve their least-demanding customers, or **new-market footholds**, which "create a market where none existed" by turning non-consumers into consumers. Incumbents rationally ignore both because margins are unattractive. The same piece argues that Uber is *not* disruptive because it started in the mainstream market. — [Christensen, Raynor & McDonald, "What Is Disruptive Innovation?", HBR Dec 2015](https://hbr.org/2015/12/what-is-disruptive-innovation) **[prior knowledge, canonical URL; not re-fetched]**
- Incumbent pricing shows what overshoot looks like at the low end. Eventbrite's paid-ticket fees are reported at about 3.7% + $1.79 per ticket plus 2.9% processing; other sources quote 3.5% + $1.59 (Professional) or 2% + $0.79 (Essentials). Sources conflict, so check the official page. — [TickPick organizer blog 2026](https://www.tickpick.com/blog/organizer/eventbrite-2026-fee-changes); [Posh 2026 breakdown](https://university.posh.vip/university/post/eventbrite-fees-explained-2026) **[verified this session; competitor-authored, treat as approximate]**
- The DOJ's 2026 mid-trial settlement with Live Nation reportedly **caps Ticketmaster fees at 15%**, requires Live Nation to open its venues to rival ticketing services such as SeatGeek, and divests some amphitheaters. All of these remedies target the *major-venue* tier, not small rooms. — [Music Business Worldwide](https://www.musicbusinessworldwide.com/live-nation-antitrust-verdict-what-happened-what-it-means-and-what-comes-next/) **[verified this session]**

### Inferences
- **"Good enough" spec for the foothold:** (1) a shareable event page with an iCal/RSS/ActivityPub feed; (2) free RSVP and headcount; (3) optional paid tickets with all-in pricing; (4) QR plus offline name-list check-in on any phone; (5) payouts split among bands, door person and venue (the real pain at small shows); (6) organizer data export. Seat maps, waiting rooms, verified-fan bot defense, dynamic pricing and resale are explicitly **out of scope**. That overshoot is what this foothold exploits.
- **Why new-market beats low-end here:** for a free or cash show, the comparison is "nothing / Instagram post / Facebook event", not Eventbrite. The tool wins if it beats a flyer, which avoids a head-on fee war. For small paid shows the low-end attack is fee-based: all-in fees well under Eventbrite's ~6-7% effective rate. But card processing (about 2.9% + $0.30 via Stripe) is an irreducible floor that no open-source license removes.
- **Booking is the stronger disruptive wedge.** The DOJ remedies and fee caps pressure ticketing margins at the top, but nothing structured serves small-room booking. A booking/calendar tool for venues is single-player useful (see section 5).

### Gaps
- No primary measurement of what small venues pay all-in in ticketing fees today (DICE, Eventbrite, TicketWeb, Etix, Tixr, See Tickets). A competitor-landscape researcher should cover this.

---

## 3. Asymmetric motivation: why incumbents would (not) respond, and what happened in precedent cases

### Takeaway
Live Nation/Ticketmaster has no motivation to fight over free 150-cap shows: it makes its money on amphitheaters, arenas, sponsorship and fees at major venues, and it is now under a jury verdict plus a DOJ consent settlement. **Eventbrite is the incumbent whose motivation is asymmetric in the *other* direction.** Under Bending Spoons ownership since March 2026 (most staff laid off), the pattern to expect is margin extraction from the long tail. That *opens* room for an open tool rather than closing it. The Facebook Events, Bandcamp and Songkick precedents show that the threats to an open tool are aggregator distribution and acquisition, not price competition.

### Cited Findings
- **Live Nation legal posture.** On April 15, 2026 a Manhattan federal jury found for the states on every claim: Ticketmaster monopolized primary ticketing for major concert venues, Live Nation monopolized large amphitheaters, and it unlawfully tied promotion to amphitheaters. Overcharge was set at $1.72 per ticket across 22 states + DC. The DOJ had settled one week into trial: Ticketmaster stays with Live Nation, but venues must be opened to rival ticketers, fees capped at 15%, and some amphitheaters divested, subject to Tunney Act review by Judge Arun Subramanian. Live Nation said it would appeal and reportedly reserved $280M. — [MBW explainer](https://www.musicbusinessworldwide.com/live-nation-antitrust-verdict-what-happened-what-it-means-and-what-comes-next/); [JD Supra](https://www.jdsupra.com/legalnews/live-nation-and-ticketmaster-found-8033103/); [TheWrap](https://www.thewrap.com/industry-news/public-policy-legal/live-nation-liable-monopoly-federal-jury-states-antitrust-case/) **[verified this session; remedy, Tunney Act and appeal status after April not confirmed]**
- **Eventbrite free-event pricing history.** Eventbrite started charging organizers of free events with more than 25 attendees in 2023 (sources disagree on July vs. Sept/Oct). This drew strong complaints, and one source says it reverted to free unlimited free events from September 4, 2024. — [Zone of Genius](https://zoneofgenius.beehiiv.com/p/eventbrite-pricing-changes); [Checkoutpage](https://checkoutpage.com/blog/eventbrite-fees) **[verified this session; reversal not confirmed against Eventbrite's own announcement]**
- **Eventbrite ownership.** Bending Spoons agreed to buy Eventbrite for about $500M ($4.50/share), closed in March 2026, and in April let go of "most of the pre-acquisition staff". The new GM is Andrea Parodi; priorities are reliability, creator tools, discovery, ticketing and checkout. Bending Spoons has since listed on Nasdaq. — [IQ Magazine, Apr 2026](https://iqmagazine.com/2026/04/eventbrite-makes-layoffs-following-bending-spoons-acquisition/); [Ticket Tailor analysis](https://www.tickettailor.com/blog/bending-spoons-acquires-eventbrite-what-does-this-mean); [TechCrunch on Bending Spoons](https://techcrunch.com/2025/10/31/what-is-bending-spoons-everything-to-know-about-aols-acquirer/) **[verified this session]**
- **Bandcamp (artist-direct) was captured twice.** Epic bought it in 2022, then sold it to Songtradr in Sept 2023 alongside 830 layoffs (16%), with Tim Sweeney saying "we've been spending way more money than we earn". About 250 staff left via the Bandcamp/SuperAwesome divestitures. — [MBW](https://www.musicbusinessworldwide.com/songtradr-acquires-bandcamp-from-fortnite-maker-epic-games/); [CNBC, Sep 28 2023](https://www.cnbc.com/2023/09/28/epic-games-is-eliminating-16percent-of-its-workforce-and-selling-bandcamp.html) **[verified this session]**
- **Songkick.** It shut down its ticketing operations in late 2017, citing pressure from Live Nation/Ticketmaster (its antitrust suit settled for a reported $110M, a prior-knowledge item to verify). The discovery app went to Warner Music Group. Developer API access was later restricted: hobbyist and educational keys stopped, and a license reportedly costs from $500/month. — [Live for Live Music](https://liveforlivemusic.com/news/songkick-ticketmaster-live-nation/); [Exclaim](https://exclaim.ca/music/article/songkick_is_shutting_down); [Wikipedia: Songkick](https://en.wikipedia.org/wiki/Songkick) **[verified this session; the $500/mo figure comes via a Wikipedia mirror]**
- **Bandsintown** partnered with Facebook so that events added in Bandsintown generate Facebook events. This illustrates aggregator dependency. — [Live for Live Music](https://liveforlivemusic.com/news/songkick-ticketmaster-live-nation/) **[verified this session]**

### Inferences
- **When would Live Nation respond?** When an open network starts (a) taking 1,000-3,000-cap clubs that feed its promoter pipeline, (b) carrying artist-fan data that Ticketmaster's marketing relies on, or (c) becoming the *rival ticketing service* venues use under the new consent terms. Until then the asymmetry protects the project. The Songkick case shows the response when a rival reached its venues: exclusivity pressure and litigation.
- **Eventbrite is the more relevant incumbent for the foothold.** Its 2023 free-event fee and quick retreat show it understands that free events are its acquisition funnel. Under Bending Spoons, more monetization of the long tail is plausible: the Evernote, WeTransfer and Vimeo precedents involved price rises and staff cuts (prior knowledge; verify). Each such move creates an "exodus moment" for small organizers, and an open tool should have an importer ready. Mobilizon v4 shipped Eventbrite/Meetup import for exactly this reason (see section 4).
- **Facebook Events** is a cautionary tale. It "ate" small listings because it was free and had distribution, not because it was good, then withered as Facebook's reach declined (prior knowledge; no source pulled this session). Lesson: never depend on one aggregator's API for distribution. Publish to open feeds (iCal, RSS, ActivityPub) and to Google event structured data.
- **Substack/Patreon** show disaggregation working when the tool owns the payment relationship and lets creators export their audience (email list portability). For ticketing, the analogue is organizer-owned attendee lists and payouts that go directly to the organizer's own Stripe account. This is inference; no Substack or Patreon source was pulled this session.

### Gaps
- Status after April 2026 of the Live Nation remedy phase, Tunney Act ruling and appeal.
- Any Eventbrite pricing changes for free events under Bending Spoons (May-Oct 2026).
- Sources for Facebook Events' decline and Substack/Patreon disaggregation were not pulled this session.

---

## 4. Open-source / open-protocol precedents: what worked, what failed, and does a two-sided market with money at the door change the lesson?

### Takeaway
Open projects displaced incumbents when they (a) were a better *single-player tool* first (Linux, WordPress, Firefox, Pretix), (b) had a neutral, well-funded steward for shared infrastructure (Let's Encrypt, OpenStreetMap, IETF/SMTP), or (c) were mandated or subsidized by a regulator (UPI). They stalled when they asked users to switch for ideological reasons without a single-player advantage (Mobilizon, Matrix/XMPP for consumers, Mastodon vs. Twitter), or when they were co-ops without capital (Ampled). In ticketing, money and liability at the door (payments, chargebacks, refunds, tax, fraud) push value toward whoever runs the **hosted payment layer**. The open project therefore needs a sustainable hosted operator from day one, as Pretix and Humanitix have; volunteer infrastructure alone will not do.

### Cited Findings
- **Pretix (closest analogue).** Built and maintained by pretix GmbH in Germany. Open source with self-hosting, plus a hosted SaaS. Self-hosted installs pay no commission, so revenue comes from hosting, support and enterprise. Seed-funded in round 2 of Germany's Prototype Fund; founder Raphael Michel spoke on "Building a business on open-source applications" (FOSS Backstage 2022, video KN5CGzgPapY). — [Prototype Fund KB](https://kb.prototypefund.de/books/finanzen-und-finanzierung/page/building-a-business-on-open-source-applications-raphael-michel-auf-der-foss-backstage-2022/export/pdf); [Hostinger app listing](https://www.hostinger.com/applications/pretix) **[verified this session; the talk content itself was not readable]**
- Pretix's license is AGPLv3 with additional permissions, notably for plugins. It moved from Apache 2.0 to AGPL around 2021 to stop hosting providers competing on its own code without contributing. — [pretix license FAQ](https://docs.pretix.eu/en/latest/license/faq.html) **[prior knowledge, canonical URL; not re-fetched; verify date and exact terms]**
- **Humanitix (nonprofit ticketing at scale).** More than 20.8M tickets sold in 2025, 23.5% annual sales growth, A$453M processed over the trailing 12 months (April 2026 press). Official donations were US$6,516,300 in 2024, $2.65M in 2023 and about $1.12M in 2022. Sources conflict on cumulative totals: Wikipedia says $13.8M+, press says A$20.8M. — [Concrete Playground, Apr 2026](https://concreteplayground.com/brisbane/news-2/this-just-in-aussie-startup-humanitix-has-just-hired-an-a-list-hollywood-star-as-their-global-head-of-impact); [Humanitix donations FAQ](https://humanitix.com/faqs/how-do-your-donations-actually-work); [Humanitix Nov 2024 report](https://humanitix.com/reports/nov2024); [Wikipedia: Humanitix](https://en.wikipedia.org/wiki/Humanitix) **[verified this session; figures inconsistent across sources]**
- **Mobilizon (Framasoft): partial failure, now a handover.** After 5 years Framasoft declared it "mature", shipped a final v4 that added importing from Meetup/Eventbrite, stopped funding it, and noted "very few contributors outside Framasoft". It handed lead development to the French association Kaihuri (Keskonfai), which got NLnet/NGI funding and three freelance developers. — [Fediverse Report, "5 years of Mobilizon"](https://fediversereport.com/?p=1383); [Framacolibri v5.0.1 thread](https://framacolibri.org/t/mobilizon-demo-of-version-5-0-1/21643) **[verified this session]**
- **Mastodon.** In Jan 2025 it announced it would move the trademark and copyrights from the founder-controlled German GmbH to a new European nonprofit, targeting a Belgian AISBL. The GmbH had lost German charitable status; the US 501(c)(3) holds the trademark in the interim and acts as the fundraising hub. The Atwood family gave €2.2M. Eugen Rochko stepped down as CEO in Nov 2025. — [Mastodon blog, Jan 2025](https://blog.joinmastodon.org/2025/01/the-people-should-own-the-town-square/); [TechCrunch, Jan 13 2025](https://techcrunch.com/2025/01/13/mastodon-announces-transition-to-nonprofit-structure/); [TechCrunch, Nov 18 2025](https://techcrunch.com/2025/11/18/mastodon-ceo-steps-down-as-the-social-network-restructures/) **[verified this session; Belgian entity completion not confirmed]**
- **Bluesky.** Bluesky Social PBC was seeded with $13M from Twitter (Dec 2021) to build the AT Protocol. One source reports about $123M raised in total, including an undisclosed $100M Series B (April 2025), with almost no revenue and no ads. Critics argue PBC status alone does not create governance safeguards. — [Revenue Memo, "Who owns Bluesky"](https://www.revenuememo.com/p/who-owns-bluesky); [ImpactAlpha](https://impactalpha.com/plea-from-a-bluesky-user-now-is-the-time-to-invest-in-governance/) **[verified this session; single-source funding figures]**
- **UPI (regulation-driven open rails).** 185.8B transactions in FY25, +41.7%, and 83.7% of India's digital payment volume, against about 6.3B card transactions. India holds 48.5% of global real-time payment volume. Calendar 2025: 228.5B transactions, ₹299.74 trillion. — [Business Standard / RBI data](https://www.business-standard.com/finance/news/upi-s-contribution-to-payments-ecosystem-volume-grows-to-83-4-in-fy25-125052900871_1.html); [IANS](https://ianslive.in/upi-share-surges-to-837-pc-in-digital-transactions-for-fy25--20250530153004); [Worldline](https://worldline.com/en-in/home/top-navigation/media-relations/press-releases/worldline-reports-that-india-digital-payments-cross-new-milestones-as-upi-reaches-228-billion-transactions-in-2025) **[verified this session]**
- **Ampled (artist co-op): failed.** It wound down in 2023, with the board citing burnout and no resources to hire full-time staff. Because a co-op is technically for-profit, it was "not eligible for most grants geared towards nonprofits". — [E2C case study: Ampled](https://git.medlab.host/e2c/e2c-how/src/branch/main/content/case-studies/ampled.md); [Billboard Canada](https://ca.billboard.com/ampled-music-platform) **[verified this session]**
- **Resonate (artist/listener co-op, Berlin, 2015).** "Stream to own" model with multi-stakeholder ownership; raised $1M from Reflective Ventures in 2018 and relaunched in 2019. This session found **no source** confirming it "stalled". — [DJ Mag](https://djmag.com/content/ethical-streaming-platform-resonate-raises-1-million-investment); [FACT](https://factmag.com/2019/04/11/resonate-ethical-streaming-platform-relaunches) **[verified this session]**
- **Let's Encrypt.** The nonprofit ISRG launched free automated certificates in 2015-16. Most web pages now load over HTTPS, and it is funded by corporate sponsors and grants. — [Let's Encrypt stats](https://letsencrypt.org/stats/); [ISRG annual reports](https://www.abetterinternet.org/annual-reports/) **[prior knowledge, canonical URL; not re-fetched]**
- **Adversarial interoperability.** EFF/Cory Doctorow argue that incumbents entrench by blocking compatible third-party tools, and that new entrants historically won by interoperating without permission. — [EFF, "Adversarial Interoperability" (2019)](https://www.eff.org/deeplinks/2019/10/adversarial-interoperability) **[prior knowledge, canonical URL; not re-fetched]**

### Inferences (per analogy, compressed)
| Precedent | Why it worked or failed | Lesson for ticketing |
|---|---|---|
| SMTP/email | Neutral protocol, IETF standardized; the commercial layer (Gmail) re-centralized delivery | An open event/ticket *format* can win while hosting re-centralizes. Plan for that, and guarantee portability. |
| Linux vs Unix/Windows server | Better single-player tool for developers; corporate contributors (IBM, Red Hat) funded it; GPL kept improvements shared | Venues/promoters with in-house devs are the "IBM" equivalents; copyleft matters |
| WordPress | Free tool + hosted .com + plugin/theme economy; but 2024-25 Automattic/WP Engine dispute showed founder-controlled trademark risk (prior knowledge) | Put the trademark in a foundation the founder does not personally control |
| Matrix/XMPP | Technically sound, but no consumer single-player advantage; Element's funding strain led it to relicense to AGPL in 2023 (prior knowledge) | Protocol purity does not create adoption; the hosted operator's finances matter |
| Mastodon/Bluesky | Grew on incumbent "exodus moments" (Twitter 2022, X 2024); retention hard | Have importers and onboarding ready for Eventbrite/Ticketmaster backlash events |
| Signal | Nonprofit foundation, large founding donation (Brian Acton; prior knowledge) | Sustained nonprofit infra needs a major donor or earned revenue |
| Wikipedia vs Britannica | Non-consumption (free) + community + nonprofit + donation drives | Works for content; ticketing has payment liability that content lacks |
| Firefox | Search-royalty dependence on Google (prior knowledge) | Avoid single-revenue-source dependence on a competitor |
| Android | Open core captured via proprietary Google Play Services (prior knowledge) | The proprietary *network/service layer* captures an open core. Keep the directory/discovery layer open too |
| OpenStreetMap | Community data + foundation; corporations (Meta, Microsoft, Amazon) contribute because they need a non-Google map (prior knowledge) | Pitch to SeatGeek/DICE/AXS etc. as "a neutral small-venue data layer none of you own" |
| Let's Encrypt | Nonprofit made a paid commodity free and automated, with sponsor funding | Strongest analogue for a free "ticket-issuing commons", but needs ISRG-scale sponsors |
| Pretix | Better tool, AGPL, GmbH sells hosting; profitable niche in EU conferences | Most realistic template for a solo founder |
| Humanitix | Same product as Eventbrite, but fee profit goes to charity; free for free events | Shows a mission-branded *hosted* operator can grow fast in ticketing |
| UPI | Government mandated, zero-MDR policy, bank-neutral rails | No US regulator equivalent; the DOJ "open venues to rival ticketers" remedy is the nearest lever, but only at major venues |
| Craigslist/Reddit | Under-monetized incumbents persist through network inertia | The long tail tolerates "ugly but free"; good-enough beats polish |

- **Does money at the door change the lesson?** Yes, in three ways. (1) Payment-facilitator, KYC, chargeback and refund liability cannot be borne by a volunteer foundation; it must sit with a hosted operator, or with each venue's own Stripe account through a platform integration (Stripe Connect). (2) Physical check-in needs offline reliability, a higher operational bar than a social network. (3) Trust and fraud (fake events, scalping) need moderation. Net: copy the **Pretix/Humanitix hosted-operator model** on top of an open codebase and open event format, not the Mastodon "anyone runs a server" model.

### Gaps
- WordPress/WP Engine, Element AGPL relicensing, Signal's funding and Firefox's Google dependence are from prior knowledge and need source links if quoted.
- Pretix's revenue and team size were not found; the founder's talk is video-only.

---

## 5. Network effects and chicken-and-egg: what single-player utility, and which side to seed first?

### Takeaway
Seed the **supply side (venues, presenters, school and community ensembles)** with a tool that is useful with zero network: a public calendar, RSVP, door list, artist payout splits and booking holds. Fans arrive per event via links organizers already share. The network (a cross-venue discovery feed, artist routing) comes later, as Chris Dixon's "come for the tool, stay for the network" pattern describes.

### Cited Findings
- Chris Dixon's "come for the tool, stay for the network": attract users with a single-player tool, then get them to participate in a network. His examples include Delicious and Instagram's filters. — [cdixon.org, Jan 2015](https://cdixon.org/2015/01/31/come-for-the-tool-stay-for-the-network) **[prior knowledge, canonical URL; not re-fetched]**
- Humanitix's growth path ran supply-side first, through organizers (free for free events, charity framing), with buyers arriving per event. — [Humanitix donations FAQ](https://humanitix.com/faqs/how-do-your-donations-actually-work) **[verified this session; mechanism partly inferred]**
- Mobilizon v4 prioritized *importing* events from Meetup/Eventbrite, acknowledging that an empty network does not attract organizers. — [Fediverse Report](https://fediversereport.com/?p=1383) **[verified this session]**

### Inferences
- **Single-player features ranked by zero-network value:** (1) venue/ensemble calendar with an embeddable widget and iCal feed; (2) free RSVP + headcount + door list; (3) settlement/payout splitter (door split among 3 bands + sound person); (4) booking holds/avails calendar shared with talent buyers; (5) a school concert program generator and ticket QR. Each removes a spreadsheet or DM thread for one user.
- **Seed side:** venues/presenters, because each venue brings 50-300 events a year of supply and its own fan list. Artists are a weaker seed because a touring band's value depends on venues being on the network.
- **Network layer later:** an open event feed (ActivityPub/iCal plus schema.org Event markup) aggregated into a discovery directory. Keep the directory open so a proprietary discovery layer cannot become the "Play Services" that captures the project.
- Education is a strong single-player beachhead. A band director's job-to-be-done (publish the concert, manage free/donation tickets, print programs, collect boosters' cash) is unserved by Ticketmaster and badly served by athletics-first platforms.

### Gaps
- No usage data was found on how small venues currently handle settlement/payout splits.

---

## 6. Incumbent response options and how open projects have defended

### Takeaway
The incumbent playbook is exclusive contracts, acquisition, free tiers, API shutoff and app-store/aggregator gatekeeping. Open projects defend with structure and law: copyleft plus a foundation-held trademark (no acquisition target), data portability and open feeds (API shutoff can't strand users), web-first PWAs (app-store friction), and newly available antitrust remedies (exclusivity).

### Cited Findings
- **Exclusive contracts.** These were central to the 2026 verdict. The DOJ settlement requires Live Nation to open venues to rival ticketing services. — [MBW](https://www.musicbusinessworldwide.com/live-nation-antitrust-verdict-what-happened-what-it-means-and-what-comes-next/) **[verified this session]**
- **Acquisition.** Bandcamp was bought by Epic and then Songtradr; Eventbrite by Bending Spoons, which cut most staff. — [CNBC](https://www.cnbc.com/2023/09/28/epic-games-is-eliminating-16percent-of-its-workforce-and-selling-bandcamp.html); [IQ](https://iqmagazine.com/2026/04/eventbrite-makes-layoffs-following-bending-spoons-acquisition/) **[verified this session]**
- **API shutoff.** Songkick restricted API access to paid licenses; Bandsintown routed its events into Facebook. — [Wikipedia: Songkick](https://en.wikipedia.org/wiki/Songkick); [Live for Live Music](https://liveforlivemusic.com/news/songkick-ticketmaster-live-nation/) **[verified this session]**
- **Free tiers.** Eventbrite's free-event tier was briefly withdrawn (2023), then restored (2024). — [Zone of Genius](https://zoneofgenius.beehiiv.com/p/eventbrite-pricing-changes) **[verified this session]**
- **Structural defense.** Mastodon moved its trademark and copyrights to a nonprofit specifically so that "no single person" controls it. — [Mastodon blog](https://blog.joinmastodon.org/2025/01/the-people-should-own-the-town-square/) **[verified this session]**

### Inferences
- **Against acquisition:** a nonprofit or foundation holds the trademark and domain, and the code is AGPL. A buyer can acquire the *hosted operator* but not the project. Mastodon's restructuring and Pretix's AGPL switch are the models.
- **Against a "Live Nation fork":** AGPL forces a hosted fork to publish its modifications, and trademark policy stops it from using the name. A big incumbent can still fork and run a closed-network *service* built on separate code. Copyleft doesn't prevent competition; it prevents free-riding on improvements.
- **Against API shutoff:** build on open standards (iCal, schema.org Event, ActivityPub) so that discovery doesn't depend on any incumbent's API; never make Facebook/Instagram posting a core dependency.
- **Against app stores:** ship check-in and ticket wallet as a web app (PWA) plus Apple/Google Wallet passes, avoiding in-app-purchase rules on ticket sales. Physical-event tickets are generally exempt from Apple's IAP requirement (prior knowledge; verify the current App Store guideline 3.1.3/3.1.5).
- **Exclusivity:** small rooms seldom sign exclusive ticketing deals, but mid-size clubs often do (with signing bonuses or advances from Ticketmaster, AXS, Etix or DICE). An open tool cannot match advances, which reinforces staying at the bottom of the market initially.

### Gaps
- Current Bandsintown API terms were not found.
- Apple App Store guideline wording on event tickets was not re-verified.

---

## 7. Legal homes for a solo founder's open project (US)

### Takeaway
Realistic path for a solo founder with a day job: **start inside a fiscal sponsor** (HCB at 7%, or Open Source Collective at 10%), with the founder's LLC owning nothing critical. **Move the trademark into the sponsor or a foundation early**, and later spin up a separate hosted-operator entity: an LLC/PBC that sells hosting under a trademark license, on the Pretix/Element/Plausible pattern. Software Freedom Conservancy is selective and suits a mature project. A Linux Foundation sub-foundation needs corporate members paying dues and is not a solo path. Avoid a cooperative as the first vehicle: Ampled shows co-ops fall into a grant-eligibility gap.

### Cited Findings
- **Open Collective Foundation.** It announced dissolution in Feb 2024, citing the cost of its services and the fees it paid to Open Collective Inc. It stopped accepting donations March 15, 2024; required collectives to release employees by June 30 and transfer funds by Sept 30; and formally dissolved Dec 31, 2024. Some collectives had as little as 16 days' notice before donations stopped. — [OCF board update, Oct 2024](https://opencollective.com/foundation/updates/an-update-from-open-collective-foundations-board-of-directors); [The Scarlet](https://thescarlet.org/19390/news/the-see-you-collective-faces-significant-pause-after-closing-of-fiscal-sponsor); [May First discussion](https://comment.mayfirst.org/t/open-collective-foundation-shutdown-anyone-else-looking-to-find-or-willing-to-be-a-replacement-fiscal-host/2591) **[verified this session]**
- **HCB (The Hack Foundation).** A 7% fee on incoming funds; no startup or legal fees. It covers 501(c)(3) status, bookkeeping, taxes and payment processing on donations, with 24h support on weekdays. HCB says typical fiscal-sponsor fees run 7-14%, and its own software is open source. — [HCB help: fee](https://help.hcb.hackclub.com/article/18-what-is-the-fiscal-sponsorship-fee-and-how-much-is-it-why-does-hcb-take-a-fiscal-sponsorship-fee-how-does-it-compare-to-other-fiscal-sponsors); [hackclub.com/hcb](https://hackclub.com/hcb); [Fiscal Sponsor Directory](https://fiscalsponsordirectory.org/the-hack-foundation/) **[verified this session]**
- **Open Source Collective (OSC, 501(c)(6)).** A 10% host fee for operating costs (accounting, payments, tax reporting, legal liability, platform); Open Collective takes a 15% platform share of host fees. A GitHub issue questions whether the 10% figure is current. — [OSC apply page](https://opencollective.com/opensource/apply/intro); [gitoxide issue #1406](https://github.com/byron/gitoxide/issues/1406) **[verified this session]**
- **Software Freedom Conservancy (501(c)(3)).** Projects must be FLOSS under a license both FSF- and OSI-approved, developed publicly and not-for-profit. SFC is "selective and often refer[s] projects to other fiscal sponsors". — [SFC members/apply](https://sfconservancy.org/members/apply/) **[verified this session]**
- **Mastodon's layered model:** a US 501(c)(3) as fundraising hub and interim trademark holder; a planned Belgian AISBL; the GmbH as an operating subsidiary. **Bluesky's model:** a venture-funded PBC. — [TechCrunch](https://techcrunch.com/2025/01/13/mastodon-announces-transition-to-nonprofit-structure/); [Revenue Memo](https://www.revenuememo.com/p/who-owns-bluesky) **[verified this session]**
- **Co-op risk:** Ampled could not access nonprofit grants and closed amid burnout. — [E2C Ampled case study](https://git.medlab.host/e2c/e2c-how/src/branch/main/content/case-studies/ampled.md) **[verified this session]**

### Inferences
- **Recommended staged structure:**
  1. **Year 0-1 (solo, day job).** Code under AGPL on GitHub. Project name/trademark *filed* (USPTO, about $350 per class, prior knowledge) and assigned to a fiscal sponsor (HCB or OSC) at entry. Donations and grants flow through the sponsor. The founder's LLC does not hold the trademark.
  2. **Year 1-3 (first grant or hosted revenue).** A separate operator entity (an LLC or Delaware PBC) runs the hosted service under a trademark license from the sponsor/foundation. This is the Pretix GmbH / Element pattern. Revenue comes from hosting fees on paid tickets.
  3. **Year 3+ (community).** Either the project graduates to its own 501(c)(3)/(c)(6) with an elected steering council, or it joins SFC or the Commons Conservancy. A 501(c)(6) trade association of venues (NIVA-style) fits well if venues will pay dues, since it can lobby and run shared infrastructure for members.
- **OCF lesson:** keep a written exit plan from any fiscal sponsor (OCF gave 2-6 months), keep the code and domains under multiple maintainers' control, and keep donor lists exportable.
- **Solo-founder reality:** a Linux Foundation sub-foundation (corporate memberships, typically tens of thousands of dollars a year per member; prior knowledge) and a funded PBC à la Bluesky both **need a funded team**. HCB/OSC plus a small operator LLC is realistic part-time.

### Gaps
- Current terms of the Commons Conservancy, NumFOCUS and the Linux Foundation for new projects were not pulled this session.
- No legal source on the trademark-licensing mechanics between a fiscal sponsor and a for-profit operator; this needs an attorney (a nonprofit/IP lawyer, possibly via SFC or OSI resources).

---

## 8. Licensing: AGPL vs permissive vs MPL vs source-available; CLA vs DCO; preventing capture

### Takeaway
**Use AGPLv3 for the server, with a plugin exception (the Pretix pattern), a permissive license (MIT/Apache-2.0) for the open event/ticket format, schemas and client SDKs, a DCO instead of a CLA, and a foundation-held trademark with a clear policy.** This lets any venue self-host freely, forces a hosted fork (including one by a large incumbent) to share its modifications, and avoids the CLA "relicense later" trust problem. Functional/source-available licenses (BSL, FSL, SSPL) are not OSI open source and would disqualify the project from SFC and from many grants.

### Cited Findings
- SFC requires licenses approved by both FSF and OSI, which excludes BSL/FSL/SSPL-style source-available licenses. — [SFC members/apply](https://sfconservancy.org/members/apply/) **[verified this session]**
- Pretix uses AGPLv3 with additional permissions (plugins). — [pretix license FAQ](https://docs.pretix.eu/en/latest/license/faq.html) **[prior knowledge, canonical URL; not re-fetched]**
- The Sovereign Tech Agency requires free/open licenses for funded work. — [Kindora STF listing](https://www.kindora.co/en/funders/sovereign-tech-fund) **[verified this session; aggregator]**
- The Developer Certificate of Origin (used by the Linux kernel) has contributors certify their right to submit, without assigning copyright. — [developercertificate.org](https://developercertificate.org/) **[prior knowledge, canonical URL; not re-fetched]**

### Inferences
- **Why not MIT/Apache for the server:** a permissive license lets a well-funded incumbent take the code proprietary and out-ship the community. **Why not a CLA:** CLAs enable later relicensing (e.g. the 2023-24 Element/Matrix and HashiCorp-style changes, prior knowledge) and deter contributors. A DCO plus a foundation-held trademark is a stronger anti-capture signal.
- **Self-hosting stays free:** AGPL obligations apply only to *modified* versions offered over a network, so unmodified self-hosting by a venue costs nothing.
- **Trademark policy is the real anti-capture tool** for the hosted brand: forks may use the code but not the name, and certified hosts can license the mark (WordPress, Mozilla and Matrix all have such policies, prior knowledge).

### Gaps
- Heather Meeker's and OSI's analyses of source-available licenses were not pulled this session.

---

## 9. Funding sources: which are realistic, and current status (Oct 2026)

### Takeaway
For a US solo founder in 2026: the **EU grant pipeline is in flux** (NGI Zero closed its final Commons Fund call June 1, 2026, and NLnet paused open calls pending three new "Open Internet Stack" programmes after summer 2026), and the **Sovereign Tech Agency funds infrastructure, not user-facing apps**. The most realistic money is therefore (1) **hosted-service revenue**: a small per-ticket fee on *paid* tickets only, free for free events (the Humanitix/Pretix logic); (2) **US arts and community foundations** (Knight, the NEA for arts-org partners, state arts councils), most of which require a nonprofit partner or fiscal sponsor; (3) **venue membership dues** via a NIVA-style association; and (4) **small sponsorships** (GitHub Sponsors, Open Collective). NLnet-style grants remain worth applying for if the project frames itself as open infrastructure (an event-federation protocol), since they fund non-EU applicants when the work benefits the open internet.

### Cited Findings
- **NLnet / NGI.** NLnet paused its open calls (announced June 12, 2026) to take stock of a decade of NGI. Only the NGI Taler and NGI Fediversity pilots accepted proposals (deadline Aug 1, 2026). After summer, three new programmes under an "Open Internet Stack" umbrella, tied to the European Commission's Tech Sovereignty package. The final NGI Zero Commons Fund call closed June 1, 2026 (€6.1M budget, grants €5k-€50k). Ongoing projects are unaffected. — [NLnet news, Jun 12 2026](https://nlnet.nl/news/2026/20260612-NGIZero-stocktaking.html); [Cyprus funding portal listing](https://www.fundingprogrammesportal.gov.cy/en/call/ngi-zero-commons-fund-13th-open-call-reclaim-the-public-nature-of-the-internet-en-2026/) **[verified this session; new-programme details not yet found]**
- NLnet funded Mobilizon's continuation under Kaihuri, so event-federation software is within NGI's remit. — [Fediverse Report](https://fediversereport.com/?p=1383) **[verified this session]**
- **Sovereign Tech Agency (Germany).** More than €24.6M to 60+ projects since 2022. The minimum per project was lowered from €150k to €50k. It prioritizes digital base technologies; "prototypes and user-facing applications are not prioritized". Its 2025 budget got +€4M. Example: €1,285,200 to KDE for 2026-27. — [Sovereign Tech: new criteria](https://sovereign.tech/news/new-proposals-criteria-process-timeline); [Phoronix](https://www.phoronix.com/news/Sovereign-Tech-Fund-Lower-Limit); [Wikipedia: STA](https://en.wikipedia.org/wiki/Sovereign_Tech_Agency) **[verified this session]**
- **Prototype Fund (Germany)** seeded Pretix, but it is for German residents (eligibility from prior knowledge). — [Prototype Fund KB](https://kb.prototypefund.de/books/finanzen-und-finanzierung/page/building-a-business-on-open-source-applications-raphael-michel-auf-der-foss-backstage-2022/export/pdf) **[verified this session for Pretix funding]**
- **Humanitix revenue model:** booking fees charged on paid tickets, with profits donated (US$6.5M in 2024); free for free events. — [Humanitix donations FAQ](https://humanitix.com/faqs/how-do-your-donations-actually-work) **[verified this session]**
- **Mastodon funding:** donations plus sponsors, with a €2.2M Atwood family gift. **Bluesky:** about $123M in VC. — [TechCrunch](https://techcrunch.com/2025/01/13/mastodon-announces-transition-to-nonprofit-structure/); [Revenue Memo](https://www.revenuememo.com/p/who-owns-bluesky) **[verified this session]**
- **Fiscal-sponsor costs** reduce every grant or donation dollar by 7% (HCB) or 10% (OSC). — [HCB](https://help.hcb.hackclub.com/article/10-what-does-the-7-fee-cover-is-it-annual-monthly-etc); [OSC](https://opencollective.com/opensource/apply/intro) **[verified this session]**

### Inferences
- **Per-ticket economics (illustrative, not sourced data):** at a $1 platform fee on paid tickets only, 100 small venues × 150 events × 60 paid tickets ≈ 900k tickets ≈ $900k/yr gross platform revenue. That is enough for 3-5 staff, but it requires payment-facilitator operations (Stripe Connect fees, disputes, 1099-K reporting). Stripe Connect lets a platform add an application fee on top of the connected account's charge (prior knowledge; verify pricing at stripe.com/connect/pricing).
- **"Pay what you want" / donate-the-fee** (the Humanitix model) is a strong *marketing* differentiator for schools and community groups, but leaves less to fund development. A hybrid could cover hosting and maintenance costs first and send any surplus to music-education charities.
- **Realistic for a solo founder with a day job:** GitHub Sponsors/Open Collective (small sums); NLnet-style €5k-€50k milestone grants (if reopened and if the work is framed as protocol/infrastructure); a Knight Foundation or local community-foundation grant via a fiscal sponsor; first hosted revenue from a handful of pilot venues and school districts.
- **Needs a funded team:** Sovereign Tech Agency (€50k+ for mature infrastructure with maintenance plans); multi-year Ford/Omidyar/Mozilla programmes (typically to established orgs); VC-PBC (Bluesky); a Linux Foundation sub-foundation.
- **Web3 funds** (Gitcoin, Optimism RetroPGF, Filecoin/Protocol Labs) require crypto-native framing and have shrunk or become episodic since 2023 (prior knowledge; not verified). Low expected value for a music-ed audience, and reputational risk with venues.

### Gaps
- Current open programmes and amounts for the Knight Foundation, NEA Our Town (needs a nonprofit plus local government partnership; prior knowledge), the Mozilla Foundation, Ford, Omidyar Network, Bluesky/AT Protocol grants, Gitcoin and Optimism RetroPGF were **not verified this session**.
- Names and budgets of NLnet's post-summer-2026 "Open Internet Stack" programmes.
- Stripe Connect platform fee structure for 2026.

---

## 10. Community bootstrapping, governance process, timelines, and bus-factor risk

### Takeaway
Every precedent here took **5+ years** from launch to a self-sustaining contributor community, and most never got there without a paid core team. Mobilizon after 5 years still had "very few contributors outside Framasoft". Ampled died of burnout. Mastodon needed a decade and a €2.2M donation before the founder could step back. Plan for the founder to be the bus factor for years 0-3. The mitigations: a fiscal sponsor holding assets, two or more admins on every account, and a lightweight RFC process. A formal steering council should wait until there are about 5 regular non-founder contributors.

### Cited Findings
- Mobilizon had very few contributors outside its sponsor after 5 years; development continued only through NLnet-funded freelancers at a new association. — [Fediverse Report](https://fediversereport.com/?p=1383) **[verified this session]**
- Ampled's board cited burnout and lack of resources to hire full-time workers. — [Billboard Canada](https://ca.billboard.com/ampled-music-platform) **[verified this session]**
- Mastodon took about 9 years (2016 to 2025) to restructure so that "no single person" controls it, and the founder stepped down as CEO in Nov 2025. — [Mastodon blog](https://blog.joinmastodon.org/2025/01/the-people-should-own-the-town-square/); [TechCrunch](https://techcrunch.com/2025/11/18/mastodon-ceo-steps-down-as-the-social-network-restructures/) **[verified this session]**
- OCF's dissolution froze projects that had no independent asset control. — [OCF update](https://opencollective.com/foundation/updates/an-update-from-open-collective-foundations-board-of-directors) **[verified this session]**
- **Governance-process precedents:** Rust RFCs ([rust-lang/rfcs](https://github.com/rust-lang/rfcs)), Fediverse Enhancement Proposals ([codeberg.org/fediverse/fep](https://codeberg.org/fediverse/fep)), Nostr NIPs ([github.com/nostr-protocol/nips](https://github.com/nostr-protocol/nips)), and Home Assistant's Open Home Foundation, created 2024 to own the project and protect it from acquisition ([openhomefoundation.org](https://www.openhomefoundation.org/)). — **[prior knowledge, canonical URLs; not re-fetched]**

### Inferences
- **Lightweight governance ladder:** (1) README + CODE_OF_CONDUCT (Contributor Covenant) + CONTRIBUTING with DCO from day one; (2) a simple "event-format proposals" repo, NIP/FEP-style, so venues and other ticketing vendors can propose schema extensions without touching the server; (3) a maintainers group with at least 2 people holding admin on GitHub, domain, DNS, payments and trademark; (4) an elected steering council once there are about 5 regular non-founder contributors and about 2 organizational adopters.
- **Contributor attraction:** Home Assistant and Pretix grew contributors through a plugin/integration architecture, where people contribute to scratch their own itch. For ticketing, the analogues are payment-provider plugins, POS/door-hardware integrations, and school-district SSO.
- **Founder-burnout guardrails** (per Ben's over-building risk): one product (the venue/ensemble single-player tool), one hosted instance, one protocol doc. Defer federation, mobile apps and booking marketplace until 10+ organizations pay or depend on it.

### Gaps
- Mobilizon, Home Assistant, Signal and Nostr contributor-growth timelines (contributors by year) were not pulled this session.

---

## 11. Music-education networks and conferences as distribution channels

### Takeaway
Music-ed and venue-association conferences are high-leverage, low-cost distribution for a supply-side-first strategy. They gather the exact non-consuming organizers (band directors, community ensembles, small venues) in one room, and Ben already presents at music-ed conferences. This session verified only enrollment scale (section 1) and NIVA's membership (about 2,000 in 2020). Conference attendance figures need sourcing.

### Cited Findings
- NIVA formed with about 2,000 member venues and promoters across 50 states in 2020, and runs the "State of Live" research program. — [NPR](https://www.npr.org/sections/coronavirus-live-updates/2020/06/09/873196748/americas-independent-music-venues-could-close-soon-due-to-coronavirus); [Pollstar](https://news.pollstar.com/2025/02/21/why-every-stage-matters-take-nivas-state-of-live-survey-now/) **[verified this session]**
- About 24% of US high-school students pass through band, choir or orchestra. — [Elpus & Abril 2019](https://journals.sagepub.com/doi/10.1177/0022429419862837) **[verified this session]**

### Inferences
- **Channel fit by segment:** state MEA conferences (TMEA, the Midwest Clinic, etc.) and NAfME for school ensembles (free concerts, booster ticketing); NIVA conference/membership for 100-1,000-cap independent venues (fee relief, post-verdict "rival ticketing" options); A2IM for indie labels (artist tour data); NAMM for gear/education crossover (lower fit); SXSW for press and visibility (expensive, low conversion).
- **Partnership idea:** a NIVA or state-MEA "endorsed open tool" deal (membership benefit, co-branded hosted instance) would mirror the 501(c)(6) trade-association model and give the project a dues-backed funding line without VC.

### Gaps
- Attendance figures for TMEA, Midwest Clinic, NAfME, NAMM, A2IM Indie Week and the NIVA conference, and each conference's exhibitor/session application costs and deadlines, were not gathered this session.
- No evidence was found of NIVA or NAfME having endorsed any ticketing tool before.
