# Decentralized, Blockchain/NFT, and Open Ticketing for Live Events, 2017–2026: Prior Art and Post-Mortems

Research date: 2026-10-14. Method notes: status calls ("alive / dormant / dead") combine (a) press and company statements found via web search, (b) a live HTTP check of each project's domain run on 2026-10-14 from this machine (curl, following redirects), and (c) GitHub/Framagit API "last pushed / last activity" timestamps pulled on 2026-10-14. A domain that failed to respond is a strong signal but not proof of death (one check, one vantage point). Company volume claims are flagged as **[self-reported]** unless an independent source exists.

---

## Q1. Catalog: what each blockchain/NFT ticketing project promised, how it was built, who adopted it, and what happened

### Takeaway
Of roughly 20 blockchain ticketing efforts since 2017, only one, GET Protocol (later OPEN Ticketing Ecosystem), processed tickets at multi-million scale. It got there by hiding the chain from fans entirely: fiat purchase, an app instead of a wallet, and a cheap "digital twin" mirror of tickets sold by ordinary ticketing companies. Even GET was "out of runway" in June 2025, after its own ticketing company had been sold to a conventional vendor. The 2017 ICO wave (Aventus, Blocktix, crypto.tickets) and the 2021–22 NFT wave (YellowHeart, SeatlabNFT, Centaurify, Coinbase/FTX-hosted drops) are dead, dormant, or pivoted away from ticketing. The big incumbents (Ticketmaster, Live Nation) used NFTs only as collectibles or presale gates, never as the admission credential.

### Cited Findings

#### GET Protocol / GUTS Tickets / OPEN Ticketing Ecosystem (Netherlands, 2016–present). Status: ALIVE but precarious
- **Promise and structure:** GUTS Tickets was the Dutch ticketing company built on the Ethereum-based GET protocol. In 2017 the protocol was split out into a separate entity maintained by the GET Foundation. GUTS sold the tickets and the Foundation developed the protocol. — [GUTS Tickets wiki](https://en.everybodywiki.com/GUTS_Tickets); [BusinessCloud via INTIX, 2017](https://access.intix.org/Full-Article/it-takes-guts-to-tackle-ticket-touts-through-blockchain)
- **Early use case:** Dutch comedian Jochem Myjer used GUTS to fight touts. — [Decrypt](https://decrypt.co/4928/how-comedy-artist-jochem-myjer-beats-ticket-touts-with-guts-ticketing-blockchain?amp=1)
- **Timeline:** founded 2016 on Ethereum; ICO late 2017; white-label SaaS licensed early 2020; **moved to Polygon May 2021**; "Digital Twin" launched Sept 2021; DAO May 2022; V2 June 2022 with higher throughput and lower minting cost. — [Whitewash Substack, Oct 10, 2022](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once)
- **How the "digital twin" works:** each traditional ticket sold by an existing ticketing company is also issued as an NFT copy processed through the protocol. It was aimed at incumbents that wanted NFT features without heavy integration work. The first partner, YourTicket(provider), had sold more than 1.1M tickets. — [Chainstack case study](https://chainstack.com/get-on-chainstack-nft-adoption-across-the-ticketing-industry/). YourTicketProvider averages more than 2M tickets/year, mainly theaters and cinemas. — [GET Protocol FAQ/press via search summary](https://marketinsider.net/get-protocol-partners-yourticketprovider-to-bring-nfts-to-masses)
- **Fan custody and UX:** "Users pay with fiat and tickets are stored in a mobile app rather than a wallet." Crypto users could opt in to wallet delivery. The author argues the "NFT" label deters average consumers. — [Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once). GET's own line: a buyer "requires zero knowledge of blockchain or cryptocurrency." — [Chainstack](https://chainstack.com/get-on-chainstack-nft-adoption-across-the-ticketing-industry/)
- **Economics:** $0.02 flat per ticket for the digital twin vs 3% for white-label. — [Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once). Integrators pre-pay GET token "fuel" priced in USD, with fiat on-ramp and custodial top-up contracts. Early design had GET bought back and burned on each ticket state change. — [GET docs: Fuel](https://docs.get-protocol.io/docs/token-economics-fuel); [GET AMA recap 2020](https://medium.com/get-protocol/ama-recap-tehmoonwalker-7afe364006cf)
- **Transparency tool:** a public "NFT Ticket Explorer" shows all integrators' tickets and events on-chain. — [GET docs](https://docs.get-protocol.io/reference/ticket-explorer-overview)
- **Volume claims [self-reported unless noted], rising over time:**
  - ~300k tickets over ~3.5 years (2020 AMA). — [Medium AMA recap](https://medium.com/get-protocol/ama-recap-tehmoonwalker-7afe364006cf)
  - 2.7M lifetime, ~180k/month (~2M/yr run rate), about 2/3 from the digital twin (Oct 2022). Same source: Ticketmaster sells ~500M/year. — [Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once)
  - "North of four million tickets … across 121 countries" (July 2023, alongside a **$4.5M seed with Tezos Foundation participation**). — [Digital Music News](https://www.digitalmusicnews.com/2023/07/14/get-protocol-seed-round/)
  - 5M tickets since 2016 (2025 OPEN launch coverage). — [NFT Plazas](https://nftplazas.com/open-ticketing-ecosystem-launch/)
  - 8.5M tickets (OPEN X thread, June 26, 2025). — [OPEN on X](https://x.com/onopenxyz)
  - The only semi-independent check: the OpenSea "GET Protocol Ticket Market" collection on Polygon (launched June 2021) shows 2,626,613 items. — [OpenSea](https://opensea.io/fr/collection/get-protocol). The on-chain explorer would allow audit, but I did not run one.
- **Rebrand and multi-chain:** in 2024 GET became OPEN and the token became OPN. — [OPEN article "Turns out, we're not done" (X; paywalled to fetch, quoted via search snippet)](https://x.com/onopenxyz/article/2079243559669059758?lang=ar). OPEN is Animoca-backed and runs on Polygon, Base, Solana and Tezos. — [Crypto Briefing](https://cryptobriefing.com/open-coalition-ticketing-blockchain-disruption/); [NFT Plazas](https://nftplazas.com/open-ticketing-ecosystem-launch/). GET→OPN swap deadline was Oct 1, 2025, "no extensions." — [OPEN on X](https://x.com/onopenxyz)
- **GUTS sold to a conventional vendor:** in **February 2025 CM.com (Dutch CPaaS/payments firm) acquired GUTS Tickets**, offering "blockchain-based ticketing with dynamic QR codes." The founders then focused on OPEN. Terms undisclosed. — [Dutch IT Channel, Feb 26, 2025](https://www.dutchitchannel.nl/news/597022/cm-com-neemt-guts-tickets-over); [CM.com press](https://www.cm.com/nl-nl/pers/cmcom-neemt-guts-tickets-over/). As of 2026-10-14, **guts.tickets redirects to cm.com/ticketing**, and the CM.com product page leads with generic ticketing, not blockchain. — [guts.tickets live check](https://guts.tickets) → [cm.com/ticketing](https://www.cm.com/ticketing/)
- **Financial crisis:** June 26, 2025: "after eight years … out of runway and looking for a life boat," while claiming 8.5M tickets and real users. July 20, 2025: the "call for the right partner … worked," partner unnamed. — [OPEN on X](https://x.com/onopenxyz). A later OPEN article says "the runway had run out and we genuinely did not know whether the team would be able to continue." — [OPEN X article](https://x.com/onopenxyz/article/2079243559669059758?lang=ar)
- **Liveness evidence (2026-10-14):** onopen.xyz is live with the copy "Since 2016 our infrastructure has issued millions of onchain tickets" and an "OPEN Pass" sale. — [onopen.xyz](https://onopen.xyz). get-protocol.io now only says "GET Protocol is now OPEN Ticketing Ecosystem." — [get-protocol.io](https://get-protocol.io). The GitHub org's most recently pushed repo is `engine-open` (2026-06-22). Earlier repos (`core-contracts`, `OPNContractsV2`, `subgraph`) were last pushed 2024–2025. — [GETProtocol GitHub org](https://github.com/orgs/GETProtocol/repositories)

#### Aventus / Aventus Network (London, 2016–). Status: PIVOTED AWAY FROM TICKETING (company alive)
- 2017 ICO: the Aventus Protocol Foundation raised **$20M in an ICO that closed in seven minutes**, pitched as "Bitcoin-style event tickets that will eliminate fraud and touting." — [The Festivals UK](https://thefestivals.uk/bitcoin-tickets/)
- 2019 "Aventus Classic": a decentralized, open-source Ethereum ticketing protocol. — [Crowdfund Insider, Sept 2019](https://www.crowdfundinsider.com/2019/09/151603-aventus-inroduces-ethereum-based-platform-to-improve-ticketing-industry/)
- CB Insights now describes Aventus as enterprise blockchain for supply chain, loyalty and consumer engagement, and lists founder Alan Vey as *former* CEO. — [CB Insights](https://www.cbinsights.com/company/the-aventus-network/people)
- Live check 2026-10-14: aventus.io reads "Aventus DAO: Bringing Real-World Businesses Onchain … ~40,000 global nodes power Aventus Cloud and custom Enterprise Appchains." The landing text does not mention ticketing. aventus.network did not respond. — [aventus.io](https://aventus.io)
- No published ticket volumes found.

#### Blocktix (Maastricht, NL, 2017). Status: DEAD (probable)
- Ethereum-based, counterfeit-resistant ticket distribution and transfer. ICO July 7–25, 2017, with a $2.5M minimum and $7.5M maximum target. — [Cointelegraph ICO calendar](https://cointelegraph.com/ico-calendar/blocktix)
- CB Insights: the profile has never been claimed. — [CB Insights](https://www.cbinsights.com/company/blocktix/alternatives-competitors)
- blocktix.io did not respond on 2026-10-14. No news after the ICO era found.

#### crypto.tickets / Tickets Cloud (Russia/global, 2017). Status: DEAD (probable)
- ICO from Oct 5, 2017, aiming to raise **up to $23M** by selling 914,869,281 TKT tokens. — [Newswire press release](https://www.newswire.com/news/tickets-cloud-announces-the-ico-of-crypto-tickets-19967580); [Fintech Times](https://thefintechtimes.com/tickets-cloud-announces-crypto-tickets-ico)
- crypto.tickets did not respond on 2026-10-14. No post-ICO operating news found.

#### BitTicket (UK). Status: DORMANT / UNCLEAR
- The homepage is still up, but its subpage /about returns 404. Self-description: "We're not looking to ICO … No coins, no tokens, no cryptocurrency – just crypto-tickets," on its own "fast, private" blockchain, an explicit anti-ICO stance. — [bitticket.io, checked 2026-10-14](https://bitticket.io)
- No dated news, customers or volumes found.

#### Big Neon (US, 2018–2021). Status: DEAD (shut down ~March 2021)
- Co-created by Ticketfly co-founder Dan Teree. Mobile-only, anti-scalping, artist-controlled resale, planned on the Tari blockchain. It **"never even made it as far as the blockchain"** and ran as ordinary admission software. It missed its 2020 target to move to Tari and shut down citing COVID cancellations and the need to raise substantial capital. — [Inverse, March 8, 2021](https://www.inverse.com/input/culture/blockchain-concert-ticketing-startup-big-neon-shuts-down)

#### YellowHeart (NYC, 2017–). Status: DORMANT/DEAD (probable, not confirmed)
- Founded 2017 by Josh Katz. $2.9M seed in 2018 backed by The Chainsmokers; manager Adam Alpert co-founded. — [CB Insights](https://www.cbinsights.com/investor/yellowheart); [Pollstar 2019](https://news.pollstar.com/2019/11/06/yellowheart-founder-ceo-discusses-new-socially-responsible-ticketing-platform/)
- Promise: artists set resale rules, maximum resale prices and a profit share on resales. — [Hypebot](https://www.hypebot.com/yellowheart-gives-artists-promoters-ticket-resale-control/); [TechCrunch](https://techcrunch.com/?p=1899603)
- **Kings of Leon, March 2021:** YellowHeart minted 18 "golden tickets" (four front-row seats per tour for life, plus VIP perks) and auctioned 6, holding 12 back. DappRadar instead reports 4 auctions totalling 241.51 ETH (≈$441,963), top lot 89 ETH. The $50 album NFT sold ~4,000 copies. — [DappRadar](https://dappradar.com/blog/kings-of-leon-sells-lifetime-nft-fan-tickets-for-441-963); [Rolling Stone](https://www.rollingstone.com/pro/news/kings-of-leon-when-you-see-yourself-album-nft-crypto-1135192/). An unsourced 2026 blog gives ~$2M in direct sales. — [Chartlex (low reliability)](https://www.chartlex.com/blog/business/music-nft-web3-post-mortem-2026). Sources disagree on lot count.
- Oct 2021: wallet app storing tickets as NFTs on Ethereum and Polygon. — [CoinDesk](https://www.coindesk.com/business/2021/10/28/nft-ticketing-gets-boost-with-mobile-app-from-yellowheart)
- **Scale data point:** in its April 2022 MGM Grand/Jabbawockeez pilot, Katz said **"about 100" YellowHeart tickets had been sold** for the show so far. — [CoinDesk, Apr 14, 2022](https://www.coindesk.com/business/2022/04/14/mgm-grand-trials-nft-ticketing-in-yellowheart-tie-up). Also SCOPE Miami art fair NFT tickets in 2021–22. — [Modern Luxury](https://www.modernluxury.com/yellowheart-scope-nft/)
- Status evidence: no news after ~2023 found. yellowheart.io 301-redirects to yh.io, which **failed to respond** on 2026-10-14. One unsourced blog says the marketplace "wound down or quietly went dormant during 2023–2024." — [Chartlex](https://www.chartlex.com/blog/business/music-nft-web3-post-mortem-2026). A CB Insights item still calls it active (Jan 2026), but that is likely stale aggregator data. — [CB Insights](https://www.cbinsights.com/investor/yellowheart)

#### SeatlabNFT (UK, 2021–). Status: DORMANT / LOW ACTIVITY (site live)
- NFT tickets with organizer-controlled resale. $SEAT token IDO from May 24, 2022, with staking payouts and airdrop perks for holders. — [AccessAA](https://accessaa.co.uk/new-nft-powered-ticketing-service-seatlabnft-targets-secondary-market/); [INTIX](https://access.intix.org/Article-Admin/blockchain-technology-nfts-and-smart-contracts-are-eliminating-fraud-and-reducing-unauthorized-resales-for-live-event-ticketing)
- £1M creator fund; hired ex-Ticketmaster executive Paul Kelly as head of global strategy (Aug 2022). — [Dummy Mag](https://www.dummymag.com/news/seatlabnft-launches-1-million-creator-fund-for-the-live-events-industry/); [Festival Insights](https://www.festivalinsights.com/2022/08/ticketing-industry-veteran-paul-kelly-joins-seatlabnft/)
- Live check 2026-10-14: seatlabnft.com is up ("New, Fairer Ticketing … carbon-neutral blockchain"). The blog's latest visible date is Feb 25, 2025, recent posts are generic (an "International Fitness Summit" guide, a 2023 Midlands StartUp award), and no music volumes are given. — [seatlabnft.com/blog](https://www.seatlabnft.com/blog)

#### Centaurify (2021–22). Status: DEAD (probable)
- Multi-chain (Solana first, then Ethereum/BNB) NFT ticketing with a $CENT token for purchases and staking rebates. — [CardanoCube](https://cardanocube.com/projects/centaurify)
- KuCoin's price page shows blank market data and "not yet officially listed." — [KuCoin](https://www.kucoin.com/en-au/price/CENT). centaurify.com did not respond on 2026-10-14.

#### Ticketmaster NFT features (2022–2023). Status: NO SHUTDOWN ANNOUNCED; NO EVIDENCE OF CONTINUED USE FOUND
- First used Polygon for NFL collectibles, then **Flow** (Dapper Labs) for 70,000+ Super Bowl LVI ticket holders. Aug 31, 2022: Flow opened to all event organizers, with NFTs "before, during or after an event," and 5M+ NFTs minted on Flow via partners. — [CoinDesk](https://www.coindesk.com/business/2022/08/31/ticketmaster-partners-with-blockchain-firm-dapper-labs-to-issue-nfts-for-live-events); [TechCrunch](https://techcrunch.com/2022/08/31/ticketmaster-taps-the-flow-blockchain-to-let-event-organizers-issue-nfts-tied-to-tickets); [Billboard](https://www.billboard.com/pro/ticketmaster-nft-expansion-flow-dapper-labs/)
- **Token-gated sales (March 2023):** launched with Avenged Sevenfold's 10,000-NFT Deathbats Club (Ethereum; MetaMask/Coinbase wallets), giving early access to NYC/LA arena tickets, then opened to any artist with an NFT collection. By then Ticketmaster had minted ~15M digital collectibles on Flow and Polygon. — [The Block, Mar 27, 2023](https://www.theblock.co/post/223109/ticketmasters-latest-widget-gives-nft-holders-early-ticket-access); [Decrypt](https://decrypt.co/124607/ticketmaster-debuts-nft-gated-ticket-sales-starting-avenged-sevenfold); [Blockworks](https://blockworks.com/news/ticketmaster-goes-live-with-nft-gated-features)
- Architecture point: the NFT was always a **collectible or presale credential**. Admission stayed on Ticketmaster's centralized SafeTix (see Q4).

#### Live Nation "Live Stubs" (announced Oct/Nov 2021). Status: UNKNOWN; no trace after the 2022 pilot
- Free collectible NFTs mirroring section/row/seat for eligible Live Nation-promoted shows in Ticketmaster-powered venues. **"Not valid for entry."** Viewable, giftable and resellable on livenation.com. First set: Swedish House Mafia "Paradise Again" tour (2022). — [PR Newswire](https://www.prnewswire.com/news-releases/live-nation-unveils-live-stubs-digital-collectible-nft-ticket-stubs-minting-first-ever-set-for-the-swedish-house-mafia-paradise-again-tour-301412071.html); [NME](https://www.nme.com/news/music/live-nation-to-launch-nft-ticket-stubs-3085721)
- I found no wind-down announcement and no coverage after launch.

#### Coachella "Coachella Keys" (Feb 2022). Status: the canonical counterparty-failure case
- 10 lifetime-pass NFTs sold for ~$1.4M (some outlets say ~$1.5M). Holders had to redeem through FTX's systems each year. When **FTX went bankrupt (Nov 11, 2022)** the NFTs showed blank images and redemption was impossible. Coachella later re-issued the NFTs and honored the benefits, then tried again on Avalanche via OpenSea. — [Far Out](https://faroutmagazine.co.uk/coachella-lifetime-pass-nfts-collapse-ftx/); [Web3 Is Going Great](https://web3isgoinggreat.com/single/coachella-nfts-stop-working-due-to-ftx-collapse); [Blockworks](https://blockworks.co/news/coachella-nfts-opensea-partnership)

#### Smaller and regional pilots
- **Hellfest 2023 (France, Tezos, "Billy" platform):** 4-day pass holders received NFT "digital twins" (collectibles by stage). The stated reason for Tezos was low energy use. No outcome data found. — [Tezos Spotlight](https://spotlight.tezos.com/tezos-nfts-are-coming-to-hellfest-2023-2/)
- **NFT-TiX (New Jersey) with Exit Festival (2022)** and a multi-year deal with United Music Events (Transmission festivals, Melbourne/Prague/Sydney pilots 2022–23). Chain and volumes undisclosed. — [INTIX/Kingston Whig Standard](https://access.intix.org/Full-Article/nft-tix-announces-partnership-with-europes-major-music-festival-exit-festival); [The Ticketing Business](https://www.theticketingbusiness.com/?p=84114)
- **Mintbase / MetaCartel Demo Day (Berlin, 2019):** NFT tickets for one conference, "35 tickets so far," explicitly to test "real-life challenges." — [MetaCartel forum](https://forum.metacartel.org/t/1-dao-proposal-metacarel-demo-day-tickets/36/2)
- **Nextech3D.ai** (microcap) announced Ethereum ticketing with Coinbase/MetaMask wallet support on Oct 21, 2025 (press release only). — [Morningstar/Accesswire](https://www.morningstar.com/news/accesswire/1089662msn/nextech3dai-launches-blockchain-ticketing-on-the-ethereum-network-with-coinbase-and-metamask-integration)
- **Base (Coinbase L2):** the only ticketing projects found are hackathon entries (TIX, Archpass on ETHGlobal) and a small site, Unchained Tickets. No Coinbase-run ticketing product was found. — [ETHGlobal TIX](https://ethglobal.com/showcase/tix-yqoxe); [ETHGlobal Archpass](https://ethglobal.com/showcase/archpass-xi903); [Unchained Tickets](https://unchainedtickets.com/)

#### XP (Solana, 2023/24–). Status: ALIVE (as of May 2025 raise)
- **$6.2M seed (May 2025)** led by Blockchange. XP is a US/Canada *resale* marketplace with all-in pricing. Its "Tamperproof protocol" encrypts ticket codes as NFTs. Blockworks noted the **only visible crypto on the site was connecting a wallet and paying in USDC**. Founder Mike Saunders claims "millions of dollars in annualized ticket sales" **[self-reported]**. — [Blockworks](https://blockworks.com/news/solana-ticketing-platform-xp-raises-ticketmaster); [Lightspeed newsletter](https://lightspeed-4bed7b.beehiiv.com/p/xp-for-you-and-me)
- Note: the brief mentions "XP (formerly Xcelerate?)". I could not confirm any Xcelerate link. xp.events is an unrelated corporate-events production firm. — [xp.events](https://xp.events)

#### Unlock Protocol (open-source, Ethereum/L2s). Status: ALIVE, niche (crypto-native events)
- Smart-contract "locks" mint tickets as NFTs. Check-in is by an emailed QR or a wallet-browser QR, and the docs offer **a printed CSV check-in list as a fallback that "works in almost all cases."** Used heavily for ETHDenver side events, with OP-token airdrop incentives for organizers. — [Unlock ETHDenver guide](https://unlock-protocol.com/guides/ethdenver24tix/). The repo is active (pushed 2026-10-14). — [GitHub unlock-protocol/unlock](https://github.com/unlock-protocol/unlock)
- **Proposed to Devconnect 2025 (DIP-67, March 2025).** A Devcon team member pushed back on timing and privacy, called **"pretix (self hosted) + zuPass" more privacy friendly**, and the thread records no adoption. — [Devcon forum DIP-67](https://forum.devcon.org/t/dip-67-onchain-ticketing-for-everyone-for-devconnect-2025/6261)

#### Devcon (Ethereum Foundation's own conference): the most telling case
- 2020 RFP-1 sought Ethereum-based ticketing for Devcon 6. Requirements included serving attendees **"with or without Ethereum wallets,"** limiting open-market resale, sybil resistance (e.g. 2 tickets/person), automated refunds, and **check-in that works offline or with a dead phone battery**. Pretix had handled 3,000+ tickets and mobile check-in at Devcon 5. The RFP closed with no selected vendor. GET Protocol submitted a late proposal. — [Devcon forum RFP-1](https://forum.devcon.org/t/rfp-1-onchain-ticketing/34)
- What followed: Devcon kept **pretix** for sales and door scanning and layered **Zupass/POD zero-knowledge credentials** on top (Zuzalu → Devconnect → Devcon SEA 2024). Organizers said pretix's open-source plug-in system was "pivotal." — [Devcon forum DIP-46](https://forum.devcon.org/t/dip-46-pod-based-ticketing-at-devcon/3850); [Ethereum Foundation blog, Oct 31, 2024](https://blog.ethereum.org/2024/10/31/devcon-sea-schedule)

#### ERC-7439 "Prevent Ticket Touting" (Ethereum standard proposal)
- An ERC-721 extension with statuses Sold/Resell/Void/Redeemed. **Only `PARTNER_ROLE` accounts (agents, promoters, authorized resale platforms) can transfer**, so the token is non-transferable by its owner. It does **not** implement a price cap or identity binding, and the page lists no deployments. — [ERC-7439](https://ercs.ethereum.org/ERCS/erc-7439)

### Inferences
- The survivors converged on one design: **fiat checkout, app or email delivery, chain as a back-office ledger, and transfers permissioned by the issuer.** That is functionally a centralized ticketing database with a public audit log. ERC-7439 makes this explicit: owner-initiated transfer is disabled. Once you add the controls that stop scalping, the "decentralized" property mostly reduces to *public auditability of issuance and state changes*.
- GET's best volume came from the **digital twin**, a $0.02 mirror of tickets that conventional companies already sold. Blockchain won adoption only when it was a free add-on to an incumbent workflow, not a replacement for one.
- Selling GUTS (the fan-facing business) to CM.com while the protocol team nearly ran out of money suggests the ticketing operation was the saleable asset and the token/protocol was not. That reading rests on the timing of the two events (sale Feb 2025, runway crisis June 2025). No financial filings were found.
- Ethereum's flagship conference ran its own RFP and still chose pretix plus ZK credentials. That is about the strongest available signal that, even for crypto-native audiences, NFT tickets did not beat an open-source conventional stack on door reliability, privacy, refunds and offline operation.

### Gaps
- No audited ticket volumes for any blockchain ticketing project. GET's on-chain explorer could in principle verify its 8.5M claim, but I did not query it.
- OPEN's 2025 rescue partner is unnamed. Whether OPEN still processes live tickets for third parties in 2026 (vs. selling "OPEN Passes") is unverified.
- Live Stubs' chain and wind-down date, and whether Ticketmaster's Flow collectible and token-gate features still exist in 2026, were not found.
- Not researched or not found: "Fever/Yuga Labs event tokens," "Rather Labs," "Ticketbase" (ticketbase.io returns 401), Polkadot/Kusama event ticketing, and Tixbase's history. tixbase.com is live as an "Unified Enterprise Platform for Live Events" with no blockchain on the landing page. — [tixbase.com](https://www.tixbase.com). Any earlier tie between Tixbase and Aventus is unverified.

---

## Q2. Non-blockchain open and decentralized event and ticketing software: who uses it, and what it teaches about open-source adoption

### Takeaway
The open-source ticketing that actually works at scale is boring, single-organization, self-hostable software with a paid hosted tier: pretix, Indico, alf.io. It wins with conferences, cultural institutions and the public sector, not with music promoters. Federated event platforms (Mobilizon, Gancio, Smoke Signal on AT Protocol) do discovery and RSVP, but no payments or ticketing. They are small and grant- or volunteer-funded. Even Framasoft handed Mobilizon off.

### Cited Findings
- **pretix** (pretix GmbH, Germany): "Over 3,000 customers" **[self-reported]**. Logos include Messe Berlin, Stadt Wien/Uni Wien, taz, Shopware, KotlinConf and FOSSGIS. Hosted on renewable power with ISO 27001. — [pretix.eu about page](https://pretix.eu/about/en/)
  - Licensed AGPLv3. The hosted service is reported as **2.5% per paid ticket, capped at €15, no monthly fee**; self-hosting has no per-ticket fees. This is a third-party summary, so confirm against pretix pricing. — [Railway deploy page](https://railway.com/deploy/pretix)
  - Third-party resellers (e.g. France's DINAO) and one-click VPS installs (Hostinger) exist. — [DINAO](https://dinao.com/en/conteneur/pretix); [Hostinger](https://www.hostinger.com/de/applications/pretix)
  - Used for Devcon (3,000+ tickets with mobile check-in). — [Devcon RFP-1](https://forum.devcon.org/t/rfp-1-onchain-ticketing/34)
  - Very active: GitHub pushed 2026-10-14, 2,542 stars. — [github.com/pretix/pretix](https://github.com/pretix/pretix)
- **alf.io** (open-source, conference-oriented): active, with release 2.0-M5 on 2026-09-18 and 1,616 stars. — [github.com/alfio-event/alf.io](https://github.com/alfio-event/alf.io)
- **Attendize:** the most-starred repo of the group (4,283) but **last commit Jan 26, 2023**, i.e. dormant. — [github.com/Attendize/Attendize](https://github.com/Attendize/Attendize)
- **Indico** (CERN): more than 1M events organized at CERN; 300+ known instances; 200+ organizations including 11 UN agencies, with Indico.UN spreading to 50+ UN entities; also used by Canonical, GNOME and Linux Plumbers. Core developed at CERN with UN and Max-Planck contributions. — [CERN: Indico 20 years](https://home.cern/indico-20-years-event-managing/); [UNOG Indico help](https://indicohelp.unog.ch/?p=2223). Release v3.3.14 on 2026-10-13. — [github.com/indico/indico](https://github.com/indico/indico)
- **Mobilizon** (ActivityPub): launched by Framasoft in Oct 2020 and **handed to Kaihuri, a French volunteer non-profit, in 2024** with NLnet funding. As of Feb 7, 2025: **79 instances, 4,188 groups, 376,753 events**. Latest release 5.1.0 (Dec 2024). No ticketing or payments; organizers can manually approve participation requests. — [Wikipedia: Mobilizon](https://en.wikipedia.org/wiki/Mobilizon); [Fediverse Report, "5 years of Mobilizon"](https://fediversereport.com/?p=1383). Framasoft considered the original vision complete and moved its effort to PeerTube. — [mobilizon.org/about](https://mobilizon.org/about/). The Framagit repo (kaihuri/mobilizon) shows activity on 2026-10-14. — [Framagit](https://framagit.org/kaihuri/mobilizon)
- **Gancio** (ActivityPub): "a shared agenda for local communities (with activitypub support)." The Framagit repo shows activity on 2026-10-14. — [Framagit les/gancio](https://framagit.org/les/gancio). Gancio and Mobilizon publish ActivityPub Event objects. Mobilizon's carry remaining seat capacity, cancellation status and timezone. — [GDG Catania issue](https://github.com/GDGCatania/catania.community/issues/26). Events reach Mastodon but bridging to Bluesky is one-way or in progress. — [Bridgy Fed #1004](https://github.com/snarfed/bridgy-fed/issues/1004)
- **Smoke Signal** (AT Protocol; Nick Gerakines): events are stored in users' own PDS using the `community.lexicon.calendar.event` lexicon, with RSVPs as separate records. Gerakines first tried ActivityPub and the project "never matured." — [Smoke Signal blog](https://blog.smokesignal.events/posts/3lthgglsdlc2c-why-atprotocol); [AT Protocol tech talk](https://atprotocol.dev/tech-talk-smoke-signal-events/). Nov 2025 added cryptographically verified RSVPs and private content. — [Smoke Signal discourse](https://discourse.smokesignal.events/t/major-new-features-smoke-signal-november-2025-updates/163). **Live check 2026-10-14:** now positioned as a discovery app indexing **45,425 events and 7,121 RSVPs** "across the ATmosphere," pointing hosts to atmo.rsvp or OpenMeet. — [smokesignal.events](https://smokesignal.events)
- **Luma** (centralized contrast): $3M seed in Dec 2020 (Maven Ventures, Venrock), with no later round found. A Jan 2026 article claims a **team of six** full-time staff. 2020-era pricing took 10% on member-only paid events. lu.ma now resolves to luma.com. — [Fundediq](https://fundediq.co/luma-lu-ma-funding/); [Sacra](https://sacra.com/chat/h/35da2362-7528-4b03-bd06-9385fac61729/); [luma.com](https://luma.com)
- **Humanitix** (Australian not-for-profit ticketing): organizers pay nothing, attendees pay a booking fee, and 100% of profits go to charity. Forbes Australia: 50,000 tickets/day globally and 3M US tickets in a year. A G2 review cites 50M+ tickets, $1.5B+ and 250k hosts **[self/third-party reported]**. Donation totals conflict ($13.4M–$16.5M). — [Wikipedia: Humanitix](https://en.wikipedia.org/wiki/Humanitix); [Forbes Australia](https://www.forbes.com.au/?p=116647); [G2](https://g2.com/products/humanitix/reviews/humanitix-review-10639410)

### Inferences
- Open-source ticketing succeeds when **one organization owns its event, its data and its door**: CERN, the UN, Devcon, municipal and cultural institutions. These buyers value data control, invoicing, accessibility and compliance over network effects. pretix's model (AGPL core, hosted SaaS with a capped per-ticket fee, plug-in marketplace, resellers) is the most proven sustainability template in this set.
- Star counts do not predict survival. Attendize had the most stars and is dormant, while pretix and Indico, backed by a company or institution, are thriving. An open project needs a funded maintainer of record.
- Federation solved *event discovery and publishing*, not *ticketing*. None of the federated tools handle payment, capacity enforcement or door scanning. These need a single authoritative ledger per event, a merchant of record, and chargeback handling, all of which are naturally owned by the organizer, not the network.
- Humanitix and Dice show that the fan-trust problem ("the house always wins") can be attacked with **governance and business model** (non-profit fees, no resale markup) rather than with protocol.

### Gaps
- No independent volume data for pretix, alf.io, Gancio instance counts, or Luma event counts.
- Whether any US music venues self-host pretix or alf.io at meaningful scale was not found.

---

## Q3. Technical and regulatory post-mortems: gas, wallet drop-off, door latency, refunds and chargebacks, securities and money transmission

### Takeaway
There is almost no rigorous public post-mortem data. No project published wallet-funnel conversion, door throughput or chargeback numbers. The documented evidence is structural: every serious project hid wallets from fans; GET moved off Ethereum mainnet to Polygon in May 2021; door systems kept QR/barcode scanning with offline fallbacks; the worst real-world failure was custodial counterparty risk (Coachella/FTX), not the chain. Regulatory exposure came from **ICO token sales**, not from tickets themselves. No ticketing-specific enforcement action was found.

### Cited Findings
- **Fans and wallets.** GET's default was fiat purchase and app storage, with wallet delivery opt-in. The author argues the "NFT" label deters average consumers. — [Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once). Devcon required support for attendees "with or without Ethereum wallets" even for the Ethereum community's own conference. — [Devcon RFP-1](https://forum.devcon.org/t/rfp-1-onchain-ticketing/34). In an Unlock thread, an Ethereum Bolivia organizer reported that many newcomers minted tickets "with just an email," the wallet being optional. — [DIP-67 thread](https://forum.devcon.org/t/dip-67-onchain-ticketing-for-everyone-for-devconnect-2025/6261)
- **Vendor "autopsy" (biased):** Wicket, a facial-recognition entry vendor, lists wallet friction, operational complexity, scalability at high-volume onsales, regulatory uncertainty and NFT-market volatility. It argues biometrics displaced NFTs. It cites no data. — [Wicket blog, Aug 23, 2024](https://www.wicketsoft.com/insights/blog-nft-ticketing/)
- **Gas and cost:** GET moved to Polygon in May 2021, and its V2 (June 2022) brought "large throughput gain and lower minting costs." — [Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once). Devcon flagged keeping transfers "cheap and fast, possibly with a Layer 2." — [Devcon RFP-1](https://forum.devcon.org/t/rfp-1-onchain-ticketing/34). Its $0.02/ticket fee shows that per-ticket chain cost became negligible post-L2. — [Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once)
- **Door and scanning:** Unlock still scans QR codes and recommends a printed CSV list as a fallback. — [Unlock guide](https://unlock-protocol.com/guides/ethdenver24tix/). Devcon required offline and dead-battery check-in. — [Devcon RFP-1](https://forum.devcon.org/t/rfp-1-onchain-ticketing/34). GUTS's production solution (as described by acquirer CM.com) is "dynamic QR codes." — [Dutch IT Channel](https://www.dutchitchannel.nl/news/597022/cm-com-neemt-guts-tickets-over). A 2019 feature cites Ticketmaster experts saying mobile-only tickets slow venue entry. — [MN2S](https://mn2s.com/news/features/will-there-ever-be-a-ticket-tout-solution)
- **Counterparty and custody failure:** Coachella Keys were unredeemable after FTX's bankruptcy until re-issued. — [Far Out](https://faroutmagazine.co.uk/coachella-lifetime-pass-nfts-collapse-ftx/); [Web3 Is Going Great](https://web3isgoinggreat.com/single/coachella-nfts-stop-working-due-to-ftx-collapse). A token on a "permanent" chain did not save it, because redemption ran through a centralized custodian.
- **Refunds, scalping and resale interaction:** Devcon noted that offering no-questions refunds alongside resale creates scalping risk, and specified that the ticket must be forfeited before a refund is paid. — [Devcon RFP-1](https://forum.devcon.org/t/rfp-1-onchain-ticketing/34)
- **Securities:** the SEC's NFT actions were mostly settled (Impact Theory; the OpenSea Wells theory of "expectation of profit from efforts of others"). In Frye & Mann v. SEC (July 2024) the plaintiffs used **Taylor Swift tickets as an analogy** for why NFTs should not be securities. — [The Block, July 29, 2024](https://www.theblock.co/post/308185/artists-sue-sec-over-whether-nfts-are-securities-use-taylor-swift-tickets-as-example)
- **Token raises created the regulatory and incentive exposure:** Aventus ($20M ICO), crypto.tickets (target up to $23M), Blocktix ($2.5–7.5M), GET (2017 ICO), SeatlabNFT ($SEAT IDO with staking payouts), Centaurify ($CENT staking rebates). — sources in Q1. OPEN's survival messaging centered on a forced GET→OPN token migration with a hard deadline. — [OPEN on X](https://x.com/onopenxyz)

### Inferences
- "Fans don't want wallets" is supported by **revealed design choices** across every project that reached volume, not by a published funnel study. Treat it as strongly evidenced but unquantified.
- Post-L2, gas cost stopped being a constraint. The binding constraints became door reliability (offline, dead battery, speed), refunds and chargebacks (fiat payment rails dominate regardless of chain), and privacy. A public ledger of who holds which seat is a privacy liability, which is why Devcon preferred ZK credentials.
- Token-funded projects carried a structural conflict: revenue and attention depended on token price, while ticketing customers wanted stable, invisible plumbing. GET's buy-back-and-burn and SeatlabNFT's staking payouts are examples. No project's token outlived its ticketing relevance.

### Gaps
- No published data on wallet-onboarding drop-off rates, scan latency, chargeback rates, or refund handling for any NFT ticketing system.
- No US money-transmission or state ticket-resale enforcement against a blockchain ticketing firm was found. Whether stablecoin settlement (XP's USDC option) triggers MSB obligations was not researched.
- Outcome of Frye & Mann v. SEC not checked.

---

## Q4. Did anything succeed at anti-scalping, and which mechanisms worked?

### Takeaway
The anti-scalping results that exist come from **non-blockchain controls**: identity or device binding plus an issuer-controlled, face-value (or capped) exchange. Examples are Dice (app-locked tickets with a refund waitlist), TicketSwap (20% cap with barcode re-issue), GUTS (account-bound tickets with capped resale, later dynamic QR) and Ticketmaster SafeTix (rotating barcodes). Blockchain projects that claimed anti-scalping success (GUTS/GET) implemented these same controls; the chain added auditability, not enforcement. No independent measurement of scalping reduction was found for any system.

### Cited Findings
- **Dice:** tickets are locked to the buyer's phone. Resale and transfer are blocked except at the same price with the parties' permission. Fans who can't attend return tickets for a refund and the ticket goes to a waitlist, sellable up to moments before showtime. Accounts caught reselling were banned and the tickets resold. CEO claim: "zero Dice tickets on the secondary" **[self-reported, unverified]**. — [Billboard](https://www.billboard.com/?p=9544266); [Pollstar](https://news.pollstar.com/?p=255185); [MBW](https://www.musicbusinessworldwide.com/mobile-ticketing-firm-dice-launches-in-italy/). **Fever acquired Dice (June 5, 2025)**; Dice reported >10M MAU. — [MBW](https://www.musicbusinessworldwide.com/dice-acquired-by-live-events-discovery-platform-fever/); [Pollstar](https://news.pollstar.com/2025/06/05/ticketer-dice-acquired-by-events-discovery-platform-fever/). Criticism: requiring an app adds friction (rival's marketing). — [tickts.co.uk](https://tickts.co.uk/blog/tickts-vs-dice)
- **TicketSwap** (Amsterdam): resale capped at **20% above face** (scope may vary by market). SecureSwap integration with primary ticketers **invalidates the original barcode and issues a new one** on each resale, so only one valid ticket ever exists. — [Rolling Stone UK](https://www.rollingstone.co.uk/music/how-ticketswap-is-leading-the-way-for-fair-pricing-and-resales-27482/); [Stager help](https://help.stager.co/en/articles/3112105-ticketswap). Ticket Tailor added the same model in Sept 2026. — [Ticket Tailor updates](https://updates.tickettailor.com/156084-give-your-customers-a-safe-way-to-resell-tickets)
- **Ticketmaster SafeTix:** barcodes refresh every few seconds, so screenshots are useless. Ticketmaster used this to say 2024's stolen Eras Tour codes were "useless." — [Malwarebytes](https://www.malwarebytes.com/blog/news/2024/07/ticketmaster-says-stolen-taylor-swift-eras-tour-tickets-are-useless). But researchers reverse-engineered barcode generation, and a lawsuit described counterfeit tickets scanning as genuine. — [Digital Music News](https://www.digitalmusicnews.com/2024/07/11/ticketmaster-tickets-reverse-engineered/). Hackers released 38,745 non-rotating print-at-home tickets. — [heise](https://heise.de/-9794434). The DOJ argued the tech was "primarily implemented to prevent competition" from other resale platforms. — [Incogni blog summarizing DOJ case](https://blog.incogni.com/is-ticketmaster-safe/). Patent suit by EChanging Barcode (Oct 2025). — [Bloomberg Law](https://news.bloomberglaw.com/ip-law/live-nation-ticketmaster-sued-again-over-ticketing-tech-patent)
- **GUTS:** pitched as beating touts via blockchain for a top Dutch comedian. — [Decrypt](https://decrypt.co/4928/how-comedy-artist-jochem-myjer-beats-ticket-touts-with-guts-ticketing-blockchain?amp=1). Its acquirer describes the product's anti-fraud feature as **dynamic QR codes**. — [Dutch IT Channel](https://www.dutchitchannel.nl/news/597022/cm-com-neemt-guts-tickets-over)
- **YellowHeart** offered artist-set resale caps and royalties. — [Hypebot](https://www.hypebot.com/yellowheart-gives-artists-promoters-ticket-resale-control/). No outcome data was published.
- **ERC-7439** disables owner transfers entirely (partner-only). — [ERC-7439](https://ercs.ethereum.org/ERCS/erc-7439)

### Inferences
- The mechanism that works is **(1) bind the ticket to a person or device, (2) make the only legitimate transfer path an issuer-controlled exchange at face or capped price, and (3) re-issue the credential on transfer so stale copies die.** All three can be done by any single authoritative database, centralized or open-source. A blockchain neither enables nor prevents them.
- The chain's *transferability*, the property NFTs are built for, works **against** anti-scalping. Projects had to disable or permission it (ERC-7439, GET's app custody), at which point the "bearer asset" benefit is gone.
- The SafeTix–DOJ framing is a warning for any design: anti-scalping controls double as **lock-in controls**. An open project can distinguish itself by publishing the transfer rules and letting organizers choose any compliant resale venue (TicketSwap-style SecureSwap is a non-blockchain precedent for interoperable resale).

### Gaps
- No independent study measuring secondary-market leakage for Dice, TicketSwap-integrated events, GUTS, or SafeTix.

---

## Q5. Did any project get traction with small venues or independent artists?

### Takeaway
Mostly no. Blockchain ticketing chased headline artists and big partners: Kings of Leon, MGM Grand, the Super Bowl/NFL, Coachella, Exit, Hellfest. The one meaningful exception is GET/GUTS, whose volume came from Dutch mid-market ticketing companies (theaters, cinemas, comedians) via white-label and digital twin. The independent and small-event wins belong to non-blockchain players: Dice (independent venues/promoters), Humanitix (community, nonprofit and school events), pretix and Luma (meetups, conferences, community).

### Cited Findings
- YellowHeart's flagship deals were Kings of Leon and MGM Grand, with the MGM pilot at ~100 tickets sold. — [CoinDesk](https://www.coindesk.com/business/2022/04/14/mgm-grand-trials-nft-ticketing-in-yellowheart-tie-up); [DappRadar](https://dappradar.com/blog/kings-of-leon-sells-lifetime-nft-fan-tickets-for-441-963)
- Ticketmaster NFTs centered on the NFL/Super Bowl; token-gating on an arena band with an NFT collection. — [CoinDesk](https://www.coindesk.com/business/2022/08/31/ticketmaster-partners-with-blockchain-firm-dapper-labs-to-issue-nfts-for-live-events); [The Block](https://www.theblock.co/post/223109/ticketmasters-latest-widget-gives-nft-holders-early-ticket-access)
- GET's largest partner was YourTicketProvider (theaters/cinemas, ~2M tickets/yr). — [Market Insider](https://marketinsider.net/get-protocol-partners-yourticketprovider-to-bring-nfts-to-masses)
- SeatlabNFT's recent visible activity is non-music (a fitness summit guide). — [SeatlabNFT blog](https://www.seatlabnft.com/blog)
- Big Neon targeted venues but never shipped on-chain and died for lack of capital. — [Inverse](https://www.inverse.com/input/culture/blockchain-concert-ticketing-startup-big-neon-shuts-down)
- Humanitix: free to organizers, 250k+ hosts **[third-party reported]**. — [G2](https://g2.com/products/humanitix/reviews/humanitix-review-10639410); [Wikipedia](https://en.wikipedia.org/wiki/Humanitix)

### Inferences
- Big partners bought NFTs as **marketing and collectibles** (press, VIP lots, presale gates), which explains the headline-artist focus and the lack of persistence after 2022.
- Small venues' real pains are fees, payout speed, scanning hardware, refunds and fan data ownership. Blockchain projects did not lead with these; Dice, Humanitix and pretix did. For an open-source project targeting independents, the go-to-market lesson is to compete on fee structure and organizer control, and sell through existing small-venue ticketing vendors (the GET digital-twin pattern) rather than ask venues to switch.
- US relevance: nearly all blockchain ticketing volume was EU (NL especially) with fiat checkout. The US attempts (YellowHeart, Big Neon, Ticketmaster NFTs, Coachella) were either pilots or collectibles. XP (2025) is US/Canada resale with crypto largely hidden.

### Gaps
- No data on what share of GET/OPEN tickets came from independent music venues specifically.

---

## Q6. Are there active open standards for ticket interchange and event data?

### Takeaway
For *event data* there are usable open vocabularies: schema.org Event/MusicEvent with Offer, iCalendar, ActivityPub `Event` objects, the AT Protocol `community.lexicon.calendar.event`, and OpenActive in UK sport. For *tickets themselves* (issuance, transfer, redemption across vendors) there is no adopted open standard. The closest are ERC-7439 (no deployments found) and proprietary integrations such as TicketSwap SecureSwap. Major discovery APIs are open to read but closed to transact (Ticketmaster), or closed outright (Bandsintown).

### Cited Findings
- **OpenActive** (UK physical-activity open data): its Event types derive from schema.org/Event and carry `schema:Offer` pricing. — [OpenActive models (npm)](https://app.unpkg.com/@openactive/models-ts@1.0.4/files/src/oa/Event.ts)
- **ActivityPub:** Mobilizon/Gancio publish `Event` objects. Mobilizon includes remaining capacity and status fields. — [GDG Catania issue](https://github.com/GDGCatania/catania.community/issues/26)
- **AT Protocol:** `community.lexicon.calendar.event` plus RSVP records, stored in the user's PDS. — [Smoke Signal discourse: AT Protocol calendar architecture](https://discourse.smokesignal.events/t/at-protocol-calendar-events-architecture/36). Bridgy Fed bridges AT calendar events to the fediverse. — [Bridgy Fed #1004](https://github.com/snarfed/bridgy-fed/issues/1004)
- **Ticketmaster Discovery API:** public, 5,000 requests/day at 2 req/s. Transactions require the Partner API, limited to approved distributors. — [Ticketmaster developer docs](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)
- **Bandsintown API:** limited to artists and their representatives. No student or educational projects; others must apply to partnerships. — [Bandsintown help](https://help.artists.bandsintown.com/en/articles/3372745-can-i-have-access-to-the-api-and-an-app-id-if-i-m-not-an-artist)
- **ERC-7439:** a ticket-touting standard proposal with no deployments listed. — [ERC-7439](https://ercs.ethereum.org/ERCS/erc-7439)
- **"OPEN Ticketing Ecosystem":** a brand for GET's multi-chain protocol, not a published neutral specification. — [onopen.xyz](https://onopen.xyz); [GETProtocol GitHub](https://github.com/orgs/GETProtocol/repositories)
- **Zupass/POD (Devcon):** cryptographic ticket credentials layered on pretix, aimed at portable ZK proofs of ticket ownership usable on other platforms. — [DIP-46](https://forum.devcon.org/t/dip-46-pod-based-ticketing-at-devcon/3850)

### Inferences
- The unfilled niche is a **vendor-neutral ticket credential and transfer protocol**: a signed ticket (W3C Verifiable Credential- or POD-style) plus an issuer-hosted transfer and revocation endpoint and a published resale policy. It can be built without a blockchain and could optionally anchor to one. The Devcon/Zupass path is the closest working prior art.
- For event data, schema.org MusicEvent as the canonical model, with ActivityPub and AT Protocol as distribution channels, is mature enough to adopt now.

### Gaps
- Whether schema.org Event/Offer is consumed by any ticket marketplace for *inventory interchange* (vs. SEO) was not researched. W3C Verifiable Credentials ticketing pilots were not researched.

---

## Q7. Synthesis: what blockchain solved for ticketing, what it didn't, and which failures were go-to-market rather than technology

### Takeaway
Blockchain delivered one real thing: a **public, tamper-evident audit log of ticket issuance and state changes**, usable across vendors (GET's explorer and digital twin). Post-L2 it was cheap. It did not solve scalping (which needs identity binding and issuer-controlled transfer that negate NFT transferability), fan UX (wallets had to be hidden), door reliability (QR and offline fallbacks still required), refunds and chargebacks (fiat rails), or privacy (public seat ownership is a liability). Most deaths were go-to-market and financing failures: ICO and token-incentive misalignment, chasing headline collectible drops, the 2022 crypto crash, and COVID. The tech itself rarely failed.

### Cited Findings (summary pointers; full citations above)
- Real benefit, auditability: GET Ticket Explorer shows all integrators' tickets on-chain. — [GET docs](https://docs.get-protocol.io/reference/ticket-explorer-overview)
- Real benefit, cheap interop add-on: digital twin at $0.02/ticket drove ~2/3 of GET volume. — [Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once)
- Not solved, UX: wallets hidden by GET, optional at Devcon and Unlock. — [Whitewash](https://whitewash.substack.com/p/the-backend-to-solve-ticketing-once); [Devcon RFP-1](https://forum.devcon.org/t/rfp-1-onchain-ticketing/34)
- Not solved, scalping without permissioned transfer: ERC-7439 partner-only transfers. — [ERC-7439](https://ercs.ethereum.org/ERCS/erc-7439)
- Not solved, custody risk: Coachella/FTX. — [Far Out](https://faroutmagazine.co.uk/coachella-lifetime-pass-nfts-collapse-ftx/)
- Not solved, privacy: Devcon preferred pretix + ZK over NFT tickets. — [DIP-67](https://forum.devcon.org/t/dip-67-onchain-ticketing-for-everyone-for-devconnect-2025/6261)
- Go-to-market and financing failures: Big Neon (capital and COVID, never on-chain); GET out of runway despite millions of tickets; GUTS sold to CM.com; Aventus pivoted to enterprise appchains; 2017 ICO projects vanished. — [Inverse](https://www.inverse.com/input/culture/blockchain-concert-ticketing-startup-big-neon-shuts-down); [OPEN on X](https://x.com/onopenxyz); [Dutch IT Channel](https://www.dutchitchannel.nl/news/597022/cm-com-neemt-guts-tickets-over); [aventus.io](https://aventus.io)
- Non-blockchain successes: pretix, Indico, Dice (acquired by Fever), TicketSwap, Humanitix. — sources in Q2 and Q4

### Inferences: lessons for an open-source, decentralization-minded (but chain-agnostic) project
1. **Decentralize the right layer.** Ticket *validity* at the door must be authoritative and work offline, which in practice means one issuer per event. Decentralize what can be: event publishing and discovery (ActivityPub/AT Protocol), organizer data ownership (self-hostable, exportable), resale venue choice (an open transfer API), and auditability (signed issuance logs, optionally anchored to a chain).
2. **Never require a wallet.** Every project with volume hid it. If on-chain is offered, make it an opt-in export (GET-style), not the checkout path.
3. **Anti-scalping is policy plus identity, not tokens.** Ship device or account binding, face-value or capped exchange, and credential re-issue on transfer. Publish the rules so they cannot quietly become lock-in, which is the SafeTix/DOJ critique.
4. **Avoid a token.** Every token-funded project's incentives drifted toward token price, and several faced forced migrations or vanished. pretix's capped per-ticket hosted fee plus a free self-hosted AGPL core is the proven open business model in this space.
5. **Integrate before you replace.** The digital-twin and SecureSwap patterns, which plug into vendors venues already use, achieved more adoption than any rip-and-replace platform.
6. **Have a funded maintainer of record.** Attendize (dormant despite the most stars) and Mobilizon (handed off by Framasoft) show volunteer-only open-source event software stalls. pretix (company) and Indico (CERN/UN) endure.
7. **Small venues are winnable but were never targeted.** Lead with fees, payout speed, refunds and data ownership (the Dice/Humanitix playbook), not provenance or collectibles.
8. **Be skeptical in both directions.** The anti-blockchain "autopsies" are often vendor marketing (Wicket sells face recognition), and GET did process millions of real tickets. But no blockchain project published evidence that the chain itself reduced scalping or fraud versus the same controls in a database.

### Gaps
- No controlled comparison (blockchain vs. database with identical controls) exists in the public record. Lessons 1–8 are inferences from design convergence and outcomes, not experiments.
