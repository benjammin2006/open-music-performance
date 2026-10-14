# Decentralized Infrastructure Options for an Open Music-Performance Network (state as of Oct 2026)

Scope: protocol families and how they run in practice, per subsystem (identity, artist profile, venue event data, booking messaging, tickets and door validation, payments, discovery). Research date 2026-10-14. Many 2026 figures come from community trackers and secondary blogs. Each is flagged where primary data was missing.

## 1. Federation (ActivityPub / Fediverse): operations, cost, data loss, portability, events reach, big-platform adoption

### Takeaway
ActivityPub is mature and cheap to run in infrastructure terms: about $0.03 per registered user per month at Hachyderm scale, or $6–$89/mo managed for small instances. The hidden cost is unpaid admin and moderation labor. When an instance shuts down, posts are lost, because Mastodon migration moves followers but not content. Event federation exists (Mobilizon and Gancio interoperate) but is small and unevenly implemented. Large-platform adoption stalled: Threads is in "maintenance mode", while WordPress is the most active adopter.

### Cited Findings
**Hosting cost and admin burden**
- masto.host managed tiers: $6/mo (about 5 active users, 20 GB media), $19/mo (100 GB), $39/mo (200 GB), $89/mo (about 2,000 active users, 400 GB). Extra resources cost $10/mo per unit (4 threads, 4 GB DB, 40 GB media). Page undated, retrieved Oct 2026. — [masto.host pricing](https://masto.host/pricing/)
- toot.io: $29/mo for 100 active users, $49/mo for 250, $89/mo for 750, with bandwidth bundled. — [toot.io pricing](https://toot.io/pricing.html)
- Hachyderm (about 55,000 accounts, 9,700 MAU) cost about $1,600/mo at its Dec 2024 run rate. That is about $0.03 per user/month and $0.16 per active user/month for compute and storage, with all labor volunteered. The admin modeled a staff of 8 (moderation plus infrastructure) at +$80k/mo, which would bring the total to $81.6k/mo, or $8.41 per active user. — [Hachyderm admin post via Lemmy thread](https://lemmy.amethyst.name/post/19873/14806); earlier podcast estimate of $600, corrected to about $1,000/mo — [Ship It! #130](https://sv.player.fm/series/changelog-master-feed/hosting-hachyderm-ship-it-130)
- A personal single-user instance needed at least 2 GB RAM. 1 GB t4g.micro instances ran out of memory, and AWS charges $0.005/hr for a public IPv4 (since 2024-02-01). — [kingant.net, Feb 2025](https://kingant.net/2025/02/mastodon-the-cost-of-running-my-own-server/)
- types.pl community instance: $48/mo Linode 8 GB plus $10/mo backups. The admin says a 16 GB server ($96/mo) is needed to keep Elasticsearch stable. — [types.pl Patreon](https://patreon.com/typespoland)
- An Inkscape board estimate (Jul 2025) put 2,000 users at about $100/mo and argued that cost scales roughly linearly. — [Inkscape board list](https://lists.inkscape.org/hyperkitty/list/inkscape-board@lists.inkscape.org/message/TLK22B3YQWDBDPA2ALC4IIOMGAXKXEWH/)
- Media (static content) dominates storage and bandwidth cost. Most instances use S3 plus CloudFront (2022 analysis). — [Hackernoon "Mastodon Systemic Sustainability"](https://hackernoon.com/mastodon-systemic-sustainability-afe172699cb2)

**Instance shutdown and data loss**
- MedMastodon (a doctors' instance) went offline abruptly at the end of 2025 after its admin cancelled service. Users lost access to their data, and later posts say it came back. Community-sourced and unverified. — [Lemmy thread](https://lemmy.4d2.org/post/2409811/3205954)
- Mozilla.social shut down in an orderly way on 17 Dec 2024, with an export and migration window. It had about 270 active users. — [werd.io](https://werd.io/mozilla-exits-the-fediverse-and-will-shutter-its-mastodon-server/); [heise](https://heise.de/-9902189)
- Servers listed on joinmastodon.org must give users at least 3 months' warning before shutting down, under the server covenant. — [Lemmy thread](https://lemmy.4d2.org/post/2409811/3205954)

**Portable identity**
- Mastodon migration redirects followers, but posts do not move (Manton Reece, Apr 2025). — [manton.org](https://www.manton.org/2025/04/11/mastodons-incomplete-migration.html)
- FEP-ef61 ("portable objects", by silverpill) would make objects portable across domains, but both the source and destination software must implement it. FEP-1580 proposes moving content via a migration collection. I found no evidence that Mastodon has adopted either as of the sources found. — [SocialHub account migration thread](https://socialhub.activitypub.rocks/t/account-migration/3058/56); [Tantek on post-migration](https://tantek.com/2023/112/t2/account-migration-post-blog-archive-format)

**Events federation reach**
- Mobilizon has been maintained since 2024 by Kaihuri, a small volunteer French nonprofit funded by NLnet, after Framasoft handed it over. Last stable release on Wikipedia: 5.1.0 (7 Dec 2024). Docs were updated May 2026, with a talk at FOSDEM 2026. — [mobilizon.org/about](https://mobilizon.org/about/); [Wikipedia](https://en.wikipedia.org/wiki/Mobilizon)
- Gancio implements ActivityPub "Event". Mobilizon and Gancio admins can follow each other's instances to sync events. Interoperability has had bugs, for example Mobilizon waiting for an Announce before displaying Gancio events. — [Mobilizon docs: Gancio](https://docs.mobilizon.org/6.%20Fediverse/3.gancio/); [SocialHub federated events](https://socialhub.activitypub.rocks/t/federated-events/305)

**Adoption and scale**
- Mastodon MAU swung between about 720k and 1.03M across 2026 snapshots (Fediverse Observer). The tracker has known count errors, and the corrected figure is about 750k (Apr 2026). The peak was 2.6M+ in 2022. — [Growth of the Fediverse 20260720](https://peachpie.theatl.social/c/fedilytics@piefed.zip/p/365220/growth-of-the-fediverse-20260720); [20260419](https://piefed.keyboardvagabond.com/post/318121)
- About 12M registered and about 2M MAU fediverse-wide, per FediDB as cited by a secondary blog. A tracker author argues that FediDB overestimates MAU. — [voxbooster 2026](https://voxbooster.com/blog/bluesky-fediverse-statistics-2026)
- Threads: head Connor Hayes (late 2025) said the fediverse integration is in maintenance mode and not a growth priority. In Jan 2025, about 25k Threads accounts had federation on, and only about 800 followed anyone on mastodon.social. — [ActivityPub.space summary of Fediverse Report](https://activitypub.space/topic/534/in-short-fediverse-report-says-that-launching-threads-as-part-of-the-fediverse-is-basically-dead-in-the-water.); last feature expansion Jun 2025 — [TechCrunch](https://techcrunch.com/2025/06/17/threads-expands-open-social-web-integrations-with-fediverse-feed-user-profile-search)
- WordPress ActivityPub plugin: its 2026 roadmap focuses on discoverability, including support for "Fediverse Auxiliary Service Providers" (cross-instance search, recommendations, spam). — [Roadmap 2026](https://activitypub.space/topic/c45bcc3e-cd31-4078-b305-63aa402220c2/roadmap-2026-charting-the-stars-of-the-open-social-web)
- Flipboard federated its users and allowed following any fediverse account, including Threads (2024). No 2026 update found. — [TechCrunch Aug 2024](https://techcrunch.com/2024/08/13/flipboard-users-can-now-follow-anyone-in-the-fediverse-including-those-on-threads/)

### Inferences
- A small venue can technically run a Gancio or WordPress+ActivityPub instance for $6–20/mo. In practice it will not maintain one: no staff for upgrades, Elasticsearch, or moderation. A shared community instance per city or region (for example 20–50 venues plus their artists) on managed hosting at $39–89/mo is realistic, but only if a named steward org exists with the 3-month shutdown covenant and off-site backups.
- Given the lack of post portability, ActivityPub works well as a broadcast and discovery layer (events out to Mastodon, WordPress, and calendars). It is weak as the system of record for artist or venue data.
- WordPress plus the ActivityPub plugin is the lowest-friction path for venues that already run WordPress sites. This is an inference from the plugin's roadmap and adoption, not a measured venue count.

### Gaps
- No 2026 cost data found for Lemmy, PeerTube, or Gancio specifically. PeerTube video storage and egress costs are likely the largest of these but are unsourced.
- No count of Mobilizon or Gancio instances or event volume in 2026.
- FEP-ef61 and FEP-1580 implementation status in Mastodon 4.4/4.5 is unconfirmed.

## 2. AT Protocol (Bluesky): PDS reality, DIDs, lexicons, relay/AppView centralization, events, governance

### Takeaway
AT Protocol offers the best account and data portability among the social protocols: a signed repo plus a DID that moves between hosts, and lexicons let you define your own schemas. However, about 99% of accounts sit on Bluesky PBC hosts, and the expensive AppView layer is where centralization actually lives. Governance is improving: an IETF ATP working group was chartered in Apr 2026, and an independent Swiss PLC association exists. For a niche app whose AppView only indexes its own lexicons, the costs are small.

### Cited Findings
- Official PDS requirements: 1 GB RAM, 1 CPU, 20 GB SSD for 1–20 users. It needs a public IPv4, DNS, and ports 80/443, plus an SMTP service (for example Resend or SendGrid) for email verification. Blobs are stored on local disk by default with a 300 MB upload limit. It broadcasts to the relay at bsky.network by default. — [bluesky-social/pds README](https://github.com/bluesky-social/pds)
- Self-hosting share: one estimate puts about 11.7M accounts on Bluesky-hosted PDSs versus about 59,000 on independent servers across about 2,200 hosts, roughly 0.5%. This is a third-party estimate. — [SoftwareSeni](https://www.softwareseni.com/understanding-at-protocol-architecture-and-decentralised-social-networks/). Sifa stats show Bluesky at 70.2% of identities, with "Other" dominated by pds.trump.com (about 26.1M identities, counted by genesis operation and not current host). — [sifa.id/stats](https://sifa.id/stats)
- Blacksky community PDS reportedly runs on a $262/mo DigitalOcean storage-optimized droplet and is said to scale to about 1M users, with blob storage at $0.02/GB. Forum-sourced. — [SocialHub Bluesky Report #115](https://socialhub.activitypub.rocks/t/bluesky-report-115independent-atproto-infrastructure/5299)
- Relay after Sync v1.1: about 2 vCPU, 12 GB RAM, and 30 Mbps in/out handle thousands of events/sec. A 24-hour backfill needs a couple hundred GB of disk. — [atproto blog: Relay Updates for Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1). Community reports put full-network relays at $18–$34/mo. — [HN comment](https://hn.nuxt.dev/item/47301808); [Lemmy thread](https://lemmy.amethyst.name/post/421762/205941)
- A full AppView, PDS, and relay setup was reported at about $1,772/mo, with the AppView indexing the whole network (16 TB DB). — [HN comment](https://hn.nuxt.dev/item/47301808). Blacksky forked the reference AppView to handle about 42M users and 18.5B records. — [wikidocs writeup](https://wikidocs.net/blog/@jaehong/8999/). In Jul 2024, a $150/mo server was not enough to backfill the full relay history. — [same SocialHub report](https://socialhub.activitypub.rocks/t/bluesky-report-115independent-atproto-infrastructure/5299)
- Eurosky launched in Apr 2026 as European ATProto account hosting. Critics note it is mainly a PDS that still depends on Bluesky's AppView. Bluesky's relay at one point rejected the Eurosky PDS until its config was adjusted. — [SocialHub thread](https://socialhub.activitypub.rocks/t/this-weeks-atmosphere-bluesky-news-with-how-eurosky/8392); [bmannconsulting notes](https://bmannconsulting.com/notes/eurosky/)
- Governance: an IETF ATP working group was chartered and announced 2 Apr 2026 (chairs Justin Richer and Richard Barnes). Its scope is repo and sync. Lexicon, OAuth profile, PLC, and handles are excluded. — [atproto blog](https://atproto.com/blog/kicking-off-the-atp-working-group); [Taking AT to the IETF](https://atproto.com/blog/taking-at-to-the-ietf)
- PLC directory: in Sep 2025 Bluesky announced an independent Swiss association to run it. Later reports say it is registered, with a board drawn from Let's Encrypt, Google, Bluesky, W3C, and ICANN, bootstrapped by Bluesky funding. Bluesky says it does not expect this to be the final governance structure. — [atproto blog: PLC directory org](https://atproto.com/blog/plc-directory-org); [zeli.app](https://zeli.app/story/49883159)
- Bluesky (the company): about 43.5M registered users (Apr 2026). App DAU averaged about 3M in Jul 2026, down 25.6% year on year. Total funding about $123M, including a $100M Series B led by Bain Capital Crypto. Secondary aggregators. — [marketful](https://marketful.com/bluesky-statistics); [tangem news](https://tangem.com/en/news/investments/18949-bluesky-raises-100m-to-accelerate-decentralized-social-growth/)
- Smoke Signal (Nick Gerakines) is an atproto events and RSVP app aiming for a "stable lexicon" and minimal data ownership. The ATProtocol Dev community moved its calendar from Luma to Smoke Signal. — [Tech talk PDF, Sep 2024](https://atprotocol.dev/content/files/2024/09/ATProtocolDev-Tech-Talk-Smoke-Signal-Events-2024-09-05.pdf); [Luma page](https://luma.com/atprotocoldev)
- Independent PDS implementations exist, such as the Rust-based bluepds and tranquil-pds. — [bluepds](https://tangled.org/quilling.dev/bluepds); a GitHub project exists for an atproto music lexicon with "two independent PDS writers" — [junepark678/atproto_music#20](https://github.com/junepark678/atproto_music/issues/20)

### Inferences
- **Lexicons fit this project well**: for example `xyz.openmusic.performance`, `.venue.event`, `.booking.offer`, and `.ticket.class` records, each written to the owner's repo. Records are signed and portable, and any AppView can index them. A music-only AppView indexes only these collections, so it is closer to the relay's cost profile (tens to low hundreds of $/mo) than to Bluesky's 16 TB AppView. This is an inference, with no measured niche AppView cost found.
- Booking offers and settlements are private. AT repos are public by design, so private negotiation needs Matrix, E2EE DMs, or a separate private store (see section 4).
- On did:plc vs did:web, I found no new 2026 source. Known design trade-off: did:plc survives a domain or host loss through rotation keys but depends on the PLC directory (now a Swiss association). did:web is fully self-sovereign but dies with the domain. For venues with stable domains, did:web is viable. For artists, did:plc with a shared PDS host is more forgiving.
- The realistic deployment is a few community PDS hosts (city or genre co-ops) plus one reference AppView. That is the "credible exit" pattern: anyone can stand up a second AppView from the public firehose.

### Gaps
- No primary 2026 count of self-hosted PDSs. The 59k/2,200 figure is a third-party estimate.
- Smoke Signal's lexicon spec and 2026 usage numbers were not retrieved.
- Bluesky's private data / E2EE DM protocol status in 2026 was not checked.

## 3. Nostr: relays, keys, NIPs (events, marketplace, zaps), UX, adoption

### Takeaway
Nostr has the simplest primitives: keypair identity, signed events, and dumb relays. It has ready-made NIPs for calendar events (NIP-52), classified listings (NIP-99), and Lightning tips (NIP-57). Real usage is small and hard to measure, and key management remains a UX barrier for mainstream fans and venues. Its payments layer is Bitcoin/Lightning-centric.

### Cited Findings
- NIP-52 defines date-based events (kind 31922), time-based events (31923), calendars (31924), and RSVPs (31925). These are addressable, deletable via NIP-09, and some mirrors still label the spec a draft. — [NIP-52 mirror](https://nips.4rs.nl/nips/52)
- NIP-99 classified listings use kind 30402, with drafts as 30403. A Dec 2025 snapshot counted 895 listings from 266 sellers. — [NIP-99](https://nips.4rs.nl/nips/99)
- NIP-57 zaps use a zap request (kind 9734) and a receipt (kind 9735) from the recipient's LNURL endpoint. — [nostr.how/zaps](https://nostr.how/zaps); [NIP-57](https://scrapbox.io/nostr/NIP-57)
- Adoption: about 3,675 DAU of about 21,281 users (Oct 2025, one blog). Weekly 2026 recaps show conflicting metrics: npub.world "total users" around 5–7k/week, versus stats.andotherstuff.org around 4.96M "publishing users" (likely including bots and ephemeral keys). — [glukhov.org Oct 2025](https://glukhov.org/post/2025/10/nostr-overview-and-statistics/); [Nostr Recap #87, Aug 2026](https://nostr.ae/nevent1qqsw9v48y3hjuesy4as4melhne36k3tv0rw2p8sa7rfjq7dz54w8yrgzyqk7plaq4s34lazl5nxtj3xd8uel08l46g0ul90sr7v4z6akhdevc2fefdr)
- Top relays by NIP-65 listing (Aug 2026): relay.momostr.pink (about 315k), relay.damus.io (about 252k), relay.primal.net (about 216k). Many users still list dead relays. — [Nostr Recap #87](https://nostr.ae/nevent1qqsw9v48y3hjuesy4as4melhne36k3tv0rw2p8sa7rfjq7dz54w8yrgzyqk7plaq4s34lazl5nxtj3xd8uel08l46g0ul90sr7v4z6akhdevc2fefdr)

### Inferences
- Nostr is a strong fit for public, append-only announcements such as gig listings (NIP-52) and fan RSVPs, and for "no-one owns the relay" resilience. Relays offer no durability guarantee, so venues would still need to run or pay for a relay to keep their own history.
- Losing a raw nsec key is unrecoverable. Mainstream fans would need custodial signers or bunkers (NIP-46) or passkey-wrapped keys, which re-centralizes the system.
- Because it is Lightning-only, Nostr payments are a poor fit for venue settlement in USD.

### Gaps
- No sourced relay operator cost figures (2025–2026).
- No sourced NIP-52 event volumes and no music or ticketing Nostr apps with traction.
- No NIP-46 / passkey signer adoption data.

## 4. Solid, Matrix, DIDs/VCs, passkeys

### Takeaway
Matrix is the only mature, open, federated option for private, structured booking negotiation (E2EE rooms, bots, bridges), but Synapse is resource-heavy and the Foundation's finances are fragile. Solid is alive but niche: government and enterprise pilots, little consumer traction. W3C VC 2.0 and Bitstring Status List became Recommendations on 15 May 2025, which makes "ticket as a verifiable credential" standards-backed.

### Cited Findings
- **Matrix funding**: membership is the Foundation's largest revenue source, and Automattic's Gold membership alone is 50% of revenue. The Foundation says it is "disproportionately dependent on Element's in-kind donations", which it calls unsustainable. Premium accounts on matrix.org launched in late 2025. — [Matrix.org annual report, Mar 2026](https://matrix.org/blog/2026/03/annual-report/)
- **Synapse sizing** (third-party): 2 vCPU, 4 GB RAM, 60 GB NVMe for about 10 users. 4 vCPU, 8 GB, 100 GB+ for about 50 local users. Federation in public rooms drives load more than user count does. /sync and federation read paths saturate first and scale with workers. — [valebyte guide](https://valebyte.com/ru/blog/matrix-synapse-hardware-requirements-users-federation-and-sizing/); [Railway Synapse](https://railway.com/deploy/synapse)
- **Solid**: Inrupt sells an Enterprise Solid Server (closed). The Community Solid Server is open source. Deployments include UK NHS pilots and Flanders government data vaults. A 2024 estimate counted about 10 active SolidOS devs and about 100+ ecosystem devs. ODI and Inrupt were still active (Jul 2026 webinar with Berners-Lee). — [CERN codimd summary](https://codimd.web.cern.ch/p/-v7bPqz1V); [W3C list post Oct 2024](https://lists.w3.org/Archives/Public/public-swicg/2024Oct/0028.html); [EDM Council webinar Jul 2026](https://edmcouncil.org/wp-content/uploads/2026/08/EDMWebinar_Solid-and-ODI_Q-and-A_20260714.pdf)
- **VCs**: the VC Data Model 2.0 became a W3C Recommendation on 2025-05-15. — [w3.org REC](https://www.w3.org/TR/2025/REC-vc-data-model-2.0-20250515/). Bitstring Status List v1.0 became a Recommendation the same day. It is a compressed, privacy-preserving revocation list that the holder can "staple". — [w3.org Bitstring Status List](https://www.w3.org/TR/vc-status-list/)

### Inferences
- Booking and contract messaging: Matrix rooms per booking (venue, artist, agent) with custom event types for offers, counter-offers, and signed acceptance is the closest open fit. Most venues would use a shared or managed homeserver rather than run Synapse, since 8 GB+ RAM is heavy for a small venue. Lighter homeservers (Conduit/conduwuit/Tuwunel) exist, but I did not verify their 2026 maturity.
- Identity layering that avoids blockchain: did:web for venues and labels (domain-anchored), did:plc or did:key for artists, and passkeys (WebAuthn) for fan login. Artist "verified" badges and venue "licensed promoter" claims can be VCs issued by a community trust registry.
- Tickets as VCs: the issuer (venue) signs a credential. The scanner verifies the signature offline and checks a cached Bitstring Status List for refunds and transfers. This has the same double-spend limitation as signed QR codes (see section 6).

### Gaps
- No sourced managed-Matrix pricing (Element Server Suite, EMS) or 2026 per-user hosting cost.
- No passkey adoption statistics retrieved.
- No production deployment of event tickets as W3C VCs found. Academic papers on offline-verifiable tickets were not retrieved.

## 5. Content-addressed / P2P storage (IPFS, Filecoin, Hypercore/Pear, Holochain, libp2p)

### Takeaway
IPFS and Filecoin are cheap per GB, but someone still has to pin and serve the data. Pinned IPFS through Pinata costs about the same as S3 and is delivered through gateways that act as a CDN. Hypercore/Pear is solid tech (Tether-backed) but desktop and app-centric. Holochain remains pre-production with token-migration uncertainty. For press-kit audio and video, a central cache or CDN is effectively inevitable for performance. Content addressing is still valuable for integrity and mirrorability.

### Cited Findings
- Pinata: about $0.035/GB-month with a 1 GB free tier (Jan 2026 article). An aggregator lists plans as of May 2026: $10/mo for 50 GB, $25/mo for 250 GB, $75/mo for 1 TB. The sources conflict, so verify on Pinata's site. — [blockeden Jan 2026](https://blockeden.xyz/blog/2026/01/11/pinata-8-8-million-revenue-ipfs-storage-web3-infrastructure/); [Pinata pricing blog](https://pinata.cloud/blog/pinatas-new-pricing-no-more-pin-limits-more-storage-for-less)
- Filecoin Onchain Cloud is reportedly $2.50/TiB-month per copy (about $0.0024/GB-mo). Social-media mirror, unverified. — [Filecoin X mirror](https://nitter-canary.kareem.one/Filecoin)
- Pear Runtime launched in Feb 2024 (Holepunch, Tether-backed) and runs on the Bare JS runtime. Keet runs on it, including mobile. No 2026 production metrics found. — [pears.com news](https://pears.com/news/holepunch-unveils-groundbreaking-open-source-peer-to-peer-app-development-platform-pear-runtime/)
- Holochain: 0.6.0 beta at the end of 2025, with 0.6.x work continuing in 2026. A HOT→HoloFuel migration is scheduled for 1 Nov 2026, and its terms were still pending as of Sep 2026. "Holo Ventures" commercial arm created. — [Holochain blog](https://blog.holochain.org/holochain-foundation-establishes-holo-ventures-names-cameron-burgess-executive-director/); [securities.io](https://www.securities.io/pt/investing-in-holo/)

### Inferences
- Press kits: store the canonical files on the artist's chosen host (PDS blob or object storage), reference them by content hash (CID or sha256) in signed records, and let any mirror or CDN serve them. That gives integrity without depending on P2P availability. At Blacksky's quoted $0.02/GB-month blob storage, 20,000 artists × 1 GB is about $400/month in storage. Egress through a CDN would be the larger and more variable cost (unsourced).
- Holochain's funding and token transition looks fragile, so it is not recommended as a base layer in 2026.

### Gaps
- No 2026 IPFS gateway reliability or latency data.
- No sourced CDN egress price comparison.
- libp2p production usage was not researched.

## 6. Blockchain used narrowly: L2 fees, Solana cNFTs, smart wallets, regulation, stablecoin settlement

### Takeaway
Fees are no longer the blocker. Base, Arbitrum, and Optimism run cents per transaction, and Solana cNFTs cost fractions of a cent per mint. Passkey smart wallets with paymasters can hide wallets entirely. The open questions are regulatory. US federal posture has softened: the SEC chair's 2025 taxonomy calls tickets "digital tools", not securities, but that is opinion, not rule. GENIUS Act final rules missed their July 2026 deadline. Stripe stablecoin payouts are in private preview.

### Cited Findings
- L2 fees: median USDC transfer about $0.02 on Base and $0.04 on Arbitrum. Median Uniswap swap about $0.11 on Base and $0.18 on Arbitrum (week ending 24 Apr 2026, citing growthepie). — [eco.com Base vs Arbitrum](https://eco.com/support/en/articles/14798701-base-vs-arbitrum-which-l2-should-you-build-on). A separate source, with unclear method, reports Mar 2026 transfers at $0.08 on Base, $0.12 on Arbitrum, and $0.15 on Optimism. — [eco.com Arbitrum vs Optimism](https://eco.com/support/en/articles/15183711-arbitrum-vs-optimism-2026-fees-tvl-ecosystem). The sources conflict.
- Solana cNFT (Bubblegum v2): a tree for about 1M cNFTs costs about 8.5 SOL in rent, about 0.00001 SOL each. A 16,384-item tree costs about 0.34 SOL. Indexing requires a DAS-API RPC provider. — [Metaplex Bubblegum v2 docs](https://developers.metaplex.com/smart-contracts/bubblegum-v2). An older Helius estimate was about 17× lower. — [Helius](https://helius.dev/blog/solana-nft-compression)
- Smart wallets: Coinbase Smart Wallet launched 5 Jun 2024 (passkey, ERC-4337, multi-chain). EIP-7702 went live with Pectra in May 2025. Paymasters let apps sponsor gas. On CDP, sponsorship is a testnet default and must be configured on mainnet. — [CDP smart accounts docs](https://docs.cdp.coinbase.com/wallets/using-wallets/smart-accounts); [eco.com ERC-4337](https://eco.com/support/en/articles/15039719-what-is-erc-4337)
- SEC: Chair Atkins' Nov 2025 "Project Crypto" taxonomy names four categories. "Digital tools" (memberships, **tickets**, credentials) and digital collectibles are not securities when bought for use. This is framed as his opinion, and economic substance controls. Resale-royalty smart contracts were previously cited by the SEC as evidence of a security. — [Cooley](https://www.cooley.com/news/insight/2025/2025-1118-secs-project-crypto-chairman-atkins-outlines-regulatory-vision); [Sheppard Mullin](https://www.sheppard.com/insights/blogs/nfts-and-securities-law-issues-are-on-the-rise-sec-analysis-relies-on-resale-royalties)
- GENIUS Act: agencies missed the 18 Jul 2026 deadline for final rules and issued about 10 proposals instead (OCC, FDIC, NCUA, Treasury). The FDIC draft requires redemption within 2 business days. The Act takes effect 18 months after signing or 120 days after final rules, whichever is earlier. — [Sumsub Jul 2026](https://sumsub.com/media/news/genius-act-implementation-falls-behind-as-agencies-miss-deadline/); [Crowdfund Insider](https://www.crowdfundinsider.com/2026/07/292568-the-genius-act-deadline-passes-without-final-stablecoin-rules-from-us-regulators/); [Chapman tracker 07/16/26](https://www.chapman.com/assets/htmldocuments/Chapman-GENIUS-Act-Rulemaking-and-Reporting-Tracker-071626.pdf)
- Stripe stablecoin payouts (Connect): private preview, USDC first. The platform balance stays in fiat and Stripe converts. Access takes about 2 business days plus a due-diligence questionnaire. A third party says recipients must be individuals or sole proprietors, with businesses not yet eligible, on Base or Polygon wallets (unverified). — [Stripe docs](https://docs.stripe.com/connect/stablecoin-payouts); [getivy](https://www.getivy.io/blog/stripe-crypto-payouts)
- In the EU, MiCA may classify high-value passes as e-money (promotional source, low confidence). — [startmotionmedia Jul 2025](https://www.startmotionmedia.com/2025/07/28/nft-ticketing-trends-risks-and-predictions/)

### Inferences
- A public chain is only defensible for (a) a public transfer and resale log with price caps enforced in a contract, or (b) cross-venue ticket portability. Even then, an off-chain signed ticket plus a venue-run status list does the same job at zero fee. Recommend not using a chain for v1.
- For venue settlement, Stripe Connect (fiat) is the realistic default in 2026. Stablecoin payout is an optional, preview-gated add-on and not a reason to choose a chain.
- Avoid resale royalties paid to the issuer in any token design, given past SEC reasoning.

### Gaps
- No live L2Beat or Dune figures were pulled. Fee data is from secondary aggregators.
- Polygon PoS 2026 fees were not found.
- No 2026 SEC rule or guidance on ticket tokens. No analysis of state anti-scalping laws as applied to tokens.

## 7. Ticket validation at the door, offline

### Takeaway
Signature-based tickets (pretix's Ed25519 "signature scheme 1") validate fully offline, with no database. However, cryptography cannot prevent double entry: preventing passback needs shared state. pretix's answer is a local-network proxy (pretixSCAN Proxy) or accepting a sync-window risk. SafeTix uses TOTP-rotating PDF417 codes, which defeat screenshots but appear to need a server or venue lookup. DICE uses app-bound QR codes activated about 2h before the show.

### Cited Findings
- pretix default: a random 32-char secret. pretixSCAN downloads the full ticket DB to the device for offline use. The known weakness is that one ticket can be redeemed twice in quick succession on different offline scanners. — [pretix ticket secrets (user docs)](https://docs.pretix.eu/en/latest/user/events/ticket_secrets.html)
- pretix signature scheme: Ed25519-signed secrets encode product, variation, and date, and validate offline without a DB. Changes or cancellations put the old secret on a **revocation list** that scanners download. Repeat scans are possible offline "before data is synced". Recommended for events over 25k tickets, scanners that are usually offline, or when tickets must be valid instantly after purchase. 1D barcodes are not supported. — [pretix guide: ticket secrets](https://docs.pretix.eu/guides/ticket-secrets/)
- pretixSCAN Proxy is a local server on the venue LAN, so each ticket can be scanned only once per proxy. The check-in API supports a `force` flag for uploading offline scans and a `nonce` for dedupe. — [pretix check-in API](https://docs.pretix.eu/dev/api/resources/checkin.html); [pretixscan-proxy](https://awesome.ecosyste.ms/projects/github.com%2Fpretix%2Fpretixscan-proxy)
- A developer write-up states that double-scan or passback is a problem "cryptography alone cannot solve". It needs shared state. — [dev.to: QR check-in when venue Wi-Fi fails](https://dev.to/animesh_gupta_705a19fc6f8/designing-event-qr-check-in-that-works-when-the-venues-wi-fi-doesnt-i1l)
- Ticketmaster SafeTix (reverse-engineered): the PDF417 payload is a static 48-byte bearer token, two 6-digit TOTP codes (SHA-1, 15-second step; one from an event key, one from a customer key), and a timestamp. The client generates codes offline. Validation appears to look up the token and check the TOTPs against server-held secrets. — [conduition.io](https://conduition.io/coding/ticketmaster/). The DOJ alleges SafeTix forces all transfers onto Ticketmaster's platform. — [404 Media](https://www.404media.co/ticketmaster-used-revolving-barcodes-to-control-ticket-resale-market-and-surveil-customers-doj-alleges/)
- DICE: the ticket is activated in-app on the day, usually about 2h before the event, which generates the QR. After activation it cannot be transferred, and screenshots are invalid. Transfers go through a waitlist and resale. — [DICE event page FAQ](https://dice.fm/event/pyp26w-wet-leg-10th-jul-alexandra-palace-london-tickets); [Music Week](https://prod.musicweek.com/live/read/we-have-to-beat-the-touts-dice-announces-troxy-partnership/073653)

### Inferences
- **Recommended design** (no central server, bad cell service):
  1. The venue (issuer) signs tickets as compact Ed25519 tokens (or VCs) carrying event ID, ticket ID, class, and holder key.
  2. Optionally, the holder's app adds a rotating proof: a TOTP or a signature over the current timestamp with the holder key held in the device secure enclave or passkey. This defeats screenshots without a server.
  3. Scanners pre-sync the event's revocation/status list (a Bitstring Status List of a few KB) whenever online.
  4. Door scanners share an "admitted" set over the venue LAN or Wi-Fi hotspot (a pretixSCAN-Proxy-style approach, or a CRDT G-Set syncing peer-to-peer). With no LAN at all, assign tickets to specific doors or scanners, or accept a bounded passback risk and reconcile afterwards.
- This works with any of the identity and data layers above. The issuing venue is the only authority needed.

### Gaps
- DICE scanner offline behavior is undocumented in the sources found.
- No academic paper on offline double-spend prevention for tickets was retrieved.
- No measured double-entry fraud rates from offline mode.

## 8. Local-first software (CRDTs) for booking calendars and settlement sheets

### Takeaway
CRDT libraries are production-ready in 2026. Automerge 3 cut memory use by more than 10×, Loro 1.x has a stable encoding, and Loro shipped an open sync protocol and server in Jun 2026. Sync servers are optional and interchangeable. That is a good fit for venue calendars and settlement sheets edited offline at the venue and synced later.

### Cited Findings
- Ink & Switch's 2019 essay coined "local-first": the device copy is primary, and servers hold secondary copies for multi-device access. Its current projects include Keyhive (local-first access control with capabilities and E2EE, 2024–2026). — [Ink & Switch](https://www.inkandswitch.com/local-first-software/)
- Automerge 3.0 cuts memory by more than 10× in many cases, keeps the same file format as v2, is almost fully API-compatible, and can run with several independent sync servers or peer-to-peer. — [Automerge 3.0 blog](https://automerge.org/blog/automerge-3/)
- Loro: the 1.0 announcement brought a stable encoding and version control. The blog dates conflict (2024-10-23 vs 2025-09-22). A 2026-06-09 post introduced the Loro Protocol (multiplexed WebSocket sync) with open-source loro-websocket and Rust client and server. npm is at 1.5.x. — [loro.dev blog](https://www.loro.dev/blog); [loro-crdt npm](https://npmjs.com/package/loro-crdt)
- Local-First Conf ran 26–28 May 2025 in Berlin. — [wal.sh](https://wal.sh/events/localfirst-conf-2025)

### Inferences
- Settlement sheets involve money and need an audit trail. CRDT merges must be paired with signed "finalize" snapshots, where both parties sign a hash. Freeform concurrent edits to final numbers are not acceptable. Keyhive-style capability access control is still research-stage.
- A sync server per venue co-op (or relaying CRDT updates through Matrix rooms) avoids a central operator. The data's canonical copy lives on the venue's and artist's devices.

### Gaps
- No sourced Automerge sync-server sizing or cost.
- Yjs 2026 status was not checked.

## 9. Cost model: 1,000 venues + 20,000 artists (plus fans)

### Takeaway
At this scale, infrastructure is cheap under every model: roughly hundreds to low thousands of dollars per month in total. The real differences are who pays, labor (moderation, upgrades, support), and failure modes. Federation pushes cost and labor onto many small volunteer admins. AT-style hosting concentrates it in a few PDS hosts plus one AppView. A central cloud is cheapest, but it is the monopoly risk.

### Cited Findings (inputs used)
- Mastodon: about $0.03 per user/month infrastructure at Hachyderm scale. Managed instances cost $39–89/mo for hundreds to about 2,000 active users. — [Hachyderm admin](https://lemmy.amethyst.name/post/19873/14806); [masto.host](https://masto.host/pricing/)
- PDS: minimum 1 CPU / 1 GB / 20 GB for 1–20 users. A community PDS at $262/mo is claimed to scale to about 1M users. Blobs at $0.02/GB-mo. — [PDS README](https://github.com/bluesky-social/pds); [SocialHub #115](https://socialhub.activitypub.rocks/t/bluesky-report-115independent-atproto-infrastructure/5299)
- Relay: $18–34/mo (community reports). A full-network AppView+PDS+relay costs about $1,772/mo. — [HN](https://hn.nuxt.dev/item/47301808)
- Pinata at about $0.035/GB-mo. Filecoin at about $2.50/TiB-mo per copy (unverified). — see section 5
- Staffed moderation at Hachyderm scale would cost about $80k/mo for 8 people. — [Hachyderm admin](https://lemmy.amethyst.name/post/19873/14806)

### Inferences (rough order-of-magnitude, my arithmetic, not sourced totals)
Assumptions: 21,000 entity accounts, an average press kit of about 1 GB (20 TB total media), and fan accounts excluded except for tickets.
- **(a) ~50 community ActivityPub instances** (about 420 entities each, plus fans): $40–100/mo each, so about **$2k–5k/mo total** plus media storage (about $400–700/mo at $0.02–0.035/GB). Paid by each instance steward through dues or donations. The dominant cost is volunteer admin and moderation time, at roughly 50 part-time admins. Each instance is a single point of data loss for its members.
- **(b) AT-style PDS per entity**: if literally one VPS per entity at about $5/mo, that is about $105k/mo network-wide, paid by entities. That is unrealistic. If consolidated onto about 5–20 community PDS hosts ($262/mo class) plus blobs (about $400/mo) plus 1–2 relays (about $30/mo each) plus one music-only AppView (likely about $100–500/mo, unsourced), the total is about **$2k–7k/mo**. Accounts remain portable if a host dies, provided the user holds a rotation key or a backup.
- **(c) Central cloud**: one multi-tenant app plus Postgres plus object storage plus CDN, likely **$1k–5k/mo**, with egress the main variable. Cheapest and simplest, but the operator holds all data and is the monopoly risk.
- **(d) P2P** (Hypercore/IPFS/Nostr-style): near-zero server cost in theory. In practice, availability needs always-on seeders, pinning, and gateways at roughly the same storage cost as (b) or (c) ($400–700/mo for 20 TB pinned) plus gateway/CDN. Users bear device and battery costs, and fans with bad connectivity suffer.
- For any model, Stripe-style payment processing fees will exceed infrastructure costs by orders of magnitude at real ticket volumes.

### Gaps
- No sourced cost for a niche (non-Bluesky) AppView.
- No sourced CDN egress pricing.
- Moderation labor estimates for a professional (non-social) network are unknown and likely much lower than for general social media.

## 10. Hybrid precedents and governance against a new monopoly

### Takeaway
The working precedent is "open protocol plus reference host plus credible exit": a default provider runs the infrastructure, but users' data and identity can leave and a second host can bootstrap from public data. Bluesky (PLC moved to a Swiss association, IETF WG for sync) and Matrix (a Foundation separate from Element, though financially dependent on it) show both the pattern and its fragility. Signal shows that an open protocol with centralized servers is not decentralization.

### Cited Findings
- Bluesky is moving PLC to an independent Swiss association that will set policies and rate limits and hold the IP. It says this is not the final structure. — [atproto blog](https://atproto.com/blog/plc-directory-org)
- The IETF ATP WG (Apr 2026) gives the repo and sync protocol a home outside Bluesky PBC. — [atproto blog](https://atproto.com/blog/kicking-off-the-atp-working-group)
- The Matrix Foundation relies on Automattic for 50% of revenue and calls its dependence on Element "unsustainable". — [Matrix annual report 2026](https://matrix.org/blog/2026/03/annual-report/)
- Mobilizon survived its originator's (Framasoft's) exit only through a small volunteer association with NLnet grants. — [mobilizon.org/about](https://mobilizon.org/about/)
- Eurosky shows the limits of "independent" hosting when the AppView and relay stay with the incumbent: its PDS was temporarily rejected by Bluesky's relay. — [SocialHub](https://socialhub.activitypub.rocks/t/this-weeks-atmosphere-bluesky-news-with-how-eurosky/8392)
- Mastodon's server covenant (3-month shutdown notice) is a soft governance tool for instance hosts. — [Lemmy thread](https://lemmy.4d2.org/post/2409811/3205954)

### Inferences
- Governance guardrails for a reference host:
  1. Put the protocol, schemas, and lexicons and the trademark in a neutral nonprofit or foundation from day one, separate from any hosting company.
  2. Publish all public data as a firehose or bulk export, so a second indexer can stand up in days.
  3. Use DIDs whose rotation keys the entity holds, or a co-op, not the host.
  4. Cap the reference host's share by policy, or require at least two independent indexers before marketing claims of decentralization.
  5. Fund the foundation from membership across many venues and labels, not from one sponsor, to avoid the Matrix and Automattic concentration.
- **Per-subsystem recommendation sketch** (inference):
  - Identity: did:web for venues, did:plc for artists, passkeys for fans.
  - Artist profile and venue event data: AT Protocol lexicons on community PDS hosts, with ActivityPub/iCal bridges for reach.
  - Booking: Matrix rooms or E2EE plus local-first CRDT docs.
  - Tickets: venue-signed Ed25519/VC tokens with a status list and a LAN scanner mesh.
  - Payments: Stripe Connect fiat, with stablecoins optional later.
  - Discovery: one open-source AppView/indexer that anyone can rerun.

### Gaps
- No primary 2026 source on Signal's or email's governance as a model was retrieved; these rely on general knowledge and were not cited.
- No data on Mastodon relay usage in 2026.
