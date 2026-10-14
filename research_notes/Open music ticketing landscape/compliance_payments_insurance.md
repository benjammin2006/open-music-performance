# Infrastructure Benefits of a Large Ticketing Company (US, 2026): Payments, Compliance, Insurance, Security, Fraud, Scale, and How an Open-Source Network Could Provide or Route Around Each

Scope note for the report writer: research run 2026-10-14, about 20 search/fetch calls. Primary sources were fetched where possible (Stripe Connect pricing, Apple App Review Guidelines, Eventbrite help center, CA FTB, FinCEN ruling, City of Chicago guidance). Many findings come from law-firm advisories and vendor blogs; these are flagged. Anything I know from background but did not verify this session is labeled "background, unverified this session" and kept out of Cited Findings. Each section ends its Inferences with a requirements-brief style table: what it is, why it matters, exposure if missing, how incumbents do it, open-source options (MVP / mature).

Cross-cutting framing (inference): nearly every "infrastructure benefit" a big ticketer provides is actually one of three things: (1) a regulated or contracted relationship it holds on behalf of venues (merchant account, money-transmission posture, insurer partnership, card-network standing), (2) a balance sheet that absorbs risk (fund holding, reserves, chargebacks, refunds on cancellation), or (3) operational capacity (on-sale scale, bot defense, app/wallet distribution, legal monitoring). An open-source, decentralized project cannot hold (1) or (2) without becoming a company; the realistic design is "venue-as-merchant + pluggable regulated providers + venue carries the risk," with the software making compliance the default path.

---

## 1. Payments: processing, PCI scope, money-transmission posture, fund holding, chargebacks, splits

### Takeaway
The cheapest legally safe design is "each venue (or promoter) is its own merchant of record on its own Stripe/Square/PayPal account," with the open-source software only orchestrating a hosted checkout. That keeps the project out of PCI service-provider scope and out of money transmission. Multi-party splits (venue/artist/promoter) and holding funds until after the show are exactly where a platform starts to look like a payment facilitator or money transmitter. A US project should get them from Stripe Connect (or a similar platform product) and not build them.

### Cited Findings
**Stripe Connect pricing and liability (fetched primary source):**
- Connect has two pricing models. With "Stripe handles pricing," Stripe charges connected accounts directly, and there are no platform fees: no account fee, payout fee, or volume fee. With "You handle pricing," the platform pays $2 per monthly active account, 0.25% + 25¢ per payout, 0.25% of payout volume for "funds routing and platform management," and $2.99 per IRS 1099 e-file plus $1.49 per state e-file. Instant payouts cost 1% of payout volume under both models, and the platform can mark this up. Cross-border payouts start at 0.25%. — [Stripe Connect pricing](https://stripe.com/connect/pricing)
- For direct charges on a connected account, the connected account bears the cost of Stripe fees, refunds, and chargebacks, and the page says Stripe covers loss liability for those connected accounts. Standard card processing starts at 2.9% + 30¢. — [Stripe Connect pricing](https://stripe.com/connect/pricing)
- Stripe documents "separate charges and transfers" as the pattern for creating a charge on the platform account and transferring funds to multiple connected accounts. This is the multi-party split pattern for venue/artist/promoter, with variants for Checkout, Elements, iOS, Android, and React Native. — [Stripe docs: separate charges and transfers](https://docs.stripe.com/connect/separate-charges-and-transfers)

**Money transmission (FinCEN and state):**
- FinCEN has no "agent of payee" exemption, but its regulations exclude "payment processors" from "money transmitter." That exclusion applies when the processor facilitates the purchase of goods or services through a clearance and settlement system that admits only BSA-regulated institutions, under a formal agreement that is at minimum with the seller or creditor that receives the funds. — [Modern Treasury: agent of payee exemption](https://moderntreasury.com/learn/what-is-an-agent-of-the-payee-exemption); [FinCEN ruling FIN-2008-R006](https://www.fincen.gov/sites/default/files/administrative_ruling/fin-2008-r006.pdf)
- FIN-2008-R006 concluded that a processor collecting consumer payments as agent of the merchant it contracted with, not on behalf of consumers, is not a money transmitter. — [FinCEN FIN-2008-R006](https://www.fincen.gov/sites/default/files/administrative_ruling/fin-2008-r006.pdf)
- State law is the bigger constraint. California Financial Code §2010(l) expressly exempts agent-of-payee transactions under a preexisting written contract where delivery to the agent satisfies the payor's obligation. California DFPI has, however, issued opinion letters finding specific payment-processing services not exempt. Commentators note many states lack an express agent-of-payee exemption. — [CA DFPI opinion letter: payment processing not exempt as agent of payee](https://dfpi.ca.gov/rules-enforcement/laws-and-regulations/opinion-letters-by-law-subject/opinion-letter-payment-processing-service-not-exempt-as-agent-of-payee-or-factoring); [Faisal Khan: agent of payee exemption](https://faisalkhan.com/?p=5163)
- I found no source that specifically analyzes ticket platforms under money transmitter law. The search tool's synthesis offered the inference that a platform holding buyer funds and paying sellers later looks more like a transmitter. That is inference, not a sourced finding.

**Who holds the money between sale and show (incumbent behavior):**
- Eventbrite's default sends payouts 3 days after the event. Eligible organizers can opt into weekly or twice-monthly pre-event payouts. Eligibility requires a prior paid event and a prior payout. Eventbrite holds a 20% reserve of net sales "to help cover potential refunds, chargebacks, and cancellations," plus a cap on pre-event money, and settles the remainder 3 days after the event. — [Eventbrite Help: Set up a payout schedule](https://www.eventbrite.com/help/en-us/articles/115913/)

**PCI DSS scope (changed in 2025):**
- The PCI SSC revised SAQ A on 31 Jan 2025 and removed Requirements 6.4.3 (payment-page script inventory/authorization), 11.6.1 (tamper detection), and 12.3.1. In their place it added two eligibility criteria: all payment-page elements must originate only and directly from a PCI-compliant third-party service provider or processor, and the merchant must confirm its site "is not susceptible to attacks from scripts." FAQ 1588 (28 Feb 2025) says the merchant can satisfy this by implementing the 6.4.3/11.6.1 controls or by getting the processor to confirm that its iframe protects against script attacks. Redirect-based flows reportedly fall outside the new criteria. — [SecurityMetrics: Big changes for SAQ A](https://chat.securitymetrics.com/blog/big-changes-for-saq-a); [Report URI: SAQ A FAQ](https://blog.report-uri.com/pci-dss-4-0-1-saq-a-and-client-side-security-a-plain-english-faq/); [Adyen: SAQ A eligibility](https://docs.adyen.com/development-resources/pci-dss-compliance-guide/saq-a-eligibility)
- Service providers, SAQ D merchants, and merchants with onsite assessments must still meet 6.4.3 and 11.6.1. — [cside: PCI DSS 4.0.1 6.4.3/11.6.1 guide](https://cside.com/blog/pci-dss-4-0-1-requirements-6-4-3-11-6-1-client-side-compliance-guide)

**Chargebacks on cancelled events:**
- The Visa dispute code for cancelled services is 13.7 ("Cancelled Merchandise/Services"). 13.5 is "Misrepresentation," for which the network can disregard the merchant's refund policy. 13.6 is "Credit not processed." Proof of refund is the main defense. These are vendor summaries, not Visa Core Rules. — [chargeback.io: Visa reason codes](https://www.chargeback.io/blog/visa-chargeback-reason-codes); [TabaPay: Visa reason codes](https://developers.tabapay.com/docs/visa-2)

### Inferences
- **Venue-as-merchant beats platform-as-merchant for an unfunded project.** If each venue connects its own Stripe Standard account (or Square/PayPal account) and the software creates direct charges on that account, then the venue is merchant of record, bears refunds and chargebacks, and holds its own PCI SAQ A attestation. Per the Stripe pricing page, Stripe carries loss liability against the connected account, and the project pays $0 under "Stripe handles pricing." The project never touches funds, which is the cleanest posture under both the FinCEN processor exclusion and state MTLs (inference from the cited rules).
- **Splits are the hard part.** A guarantee-plus-door-split settlement, paid automatically to the artist from ticket revenue, requires either (a) separate charges and transfers on a platform account, which makes someone the platform holding a Stripe platform relationship and its liability, or (b) the venue paying the artist after the show from its own account. That is how the industry already works: the venue or promoter settles with the artist on settlement night. Recommendation: MVP uses (b), with the software generating the settlement sheet and a payout instruction. The mature option is (a), run by a legal entity such as a foundation, co-op, or hosting provider that operates the Stripe platform account.
- **Holding funds until after the show is a risk decision, not a software feature.** Eventbrite's 20% reserve plus post-event settlement exists because the platform is on the hook if the organizer vanishes. In venue-as-merchant, the venue receives funds at normal processor speed (background, unverified this session: Stripe's standard US payout is about 2 business days) and is directly liable to fans for refunds. The processor itself may impose reserves on high-risk merchants. Event ticketing is a known "future delivery" risk category for acquirers (background, unverified this session). The software could offer an optional "self-escrow" mode that delays payouts to after the event, using the processor's manual payout schedule. That builds fan trust at no regulatory cost, because the processor holds the money, not the project.
- **PCI:** Use only processor-hosted checkout (Stripe Checkout redirect or Payment Links, Square hosted checkout). Per the 2025 SAQ A change, redirect flows avoid the new script-attack eligibility question. An embedded iframe makes the venue's own page subject to the "not susceptible to script attacks" criterion. A self-hosted node operator should not be required to manage CSP and script monitoring. Default to redirect.
- **Requirements-brief row: Payments**

| Element | Detail |
|---|---|
| What | Card acceptance, payout, splits, reserves, 1099 reporting |
| Why it matters | Without it there is no revenue, and mishandled funds create regulatory exposure |
| Exposure if missing/wrong | State MTL violations if the project or node operator holds and forwards others' money unlicensed (state penalties, cease-and-desist); PCI non-compliance fines passed through by acquirer; chargeback losses |
| Incumbent approach | Ticketer is merchant of record (or payfac), holds funds to post-event, carries reserves, pays venue at settlement |
| MVP (no money) | Venue-as-merchant via Stripe Standard/Express direct charges or Square/PayPal; hosted redirect checkout only (SAQ A); project never touches funds; settlement sheet generated in software, artist paid by venue off-platform. Cost to project: $0; venue pays ~2.9% + 30¢ plus any optional platform fee |
| Mature | A legal entity (nonprofit foundation, co-op, or commercial host) operates a Stripe Connect platform account using separate charges and transfers for automatic splits, with "you handle pricing" economics of $2/active account/month + 0.25% + 25¢ per payout + 0.25% volume, plus instant payouts at 1%. Adyen for Platforms is an alternative (pricing not researched) |
| Pluggable? | Yes. A "payment adapter" interface (Stripe, Square, PayPal, Adyen) is the right abstraction |

### Gaps
- Adyen for Platforms, Square, and PayPal marketplace pricing and liability terms were not researched this session.
- Stripe's limit on how long a platform can hold funds before transferring under separate charges and transfers was not retrieved; the fetched doc page was only an index. Background, unverified this session: Stripe requires transfers to be linked to charges and has held-funds limits that vary by country, roughly 90 days in the US for non-platform-owned balances. Verify before design.
- No source found that analyzes ticket platforms specifically under state MTLs. A fintech/MTL attorney opinion would be needed before the project or any node operator holds funds.
- Stripe's acceptable-use or "restricted business" stance on event ticketing (reserves on future-delivery merchants) was not verified.

---

## 2. Refunds and cancellation: law, FTC, chargebacks, ticket protection, event cancellation insurance

### Takeaway
As of 2026, the binding federal rule for primary ticket sellers is the FTC Unfair or Deceptive Fees Rule (effective 12 May 2025): all-in pricing everywhere a price appears. Federal refund rules for cancelled events come mostly through FTC Act Section 5 deception theory, card-network chargeback rights, and state law, not a single federal refund statute. Fan-facing "ticket protection" (XCover/Cover Genius and others) is a revenue-sharing opt-in product that a platform can plug in. Event cancellation insurance for the venue/promoter is a separate, broker-placed policy.

### Cited Findings
- The FTC Rule on Unfair or Deceptive Fees took effect 12 May 2025 and covers live-event tickets and short-term lodging, including third-party platforms and resellers. Sellers must clearly and conspicuously disclose the total ("all-in") price wherever a ticket price is displayed, including in ads, and must disclose what fees are for. — [TechCrunch: FTC bans hidden fees for live events, effective May 12](https://techcrunch.com/2025/05/05/ftc-bans-hidden-fees-for-live-events-and-short-term-rentals-effective-may-12/)
- Sources conflict on whether the rule bans labels like "service fee." The more consistent reading is that it requires prominent disclosure rather than banning such fees. — [Live for Live Music](https://liveforlivemusic.com/news/ftc-bans-junk-fees-concert-tickets) vs. [AGG analysis](https://www.agg.com/news-insights/publications/that-dont-make-it-junk-the-proposed-junk-fee-ban-will-fundamentally-change-concert-ticketing/)
- The first major enforcement action under the fees rule was a reported $10M FTC settlement with StubHub over failing to disclose all-in prices up front. The JD Supra article is undated in search results; the report writer should confirm the year. — [JD Supra: FTC v. StubHub $10M settlement](https://www.jdsupra.com/legalnews/ftc-v-stubhub-10-million-settlement-8021470/)
- On 18 Sep 2025 the FTC and seven states (CO, FL, IL, NE, TN, UT, VA) sued Live Nation/Ticketmaster in N.D. Cal. The suit alleges deceptive drip pricing under FTC Act §5, with fees adding 24–44%, and BOTS Act violations. — [Alston & Bird advisory, Sep 22 2025](https://www.alston.com/en/insights/publications/2025/09/ftc-state-lawsuit-live-nation-ticketmaster); [Global Policy Watch](https://www.globalpolicywatch.com/2025/10/ftc-sues-live-nation-and-ticketmaster-for-deceptive-pricing-tactics/)
- Chargeback code for cancelled services: Visa 13.7. See section 1. — [chargeback.io](https://www.chargeback.io/blog/visa-chargeback-reason-codes)
- **Ticket protection (fan-side):** AXS has used XCover (Cover Genius) since January 2023. Ticket Tailor offers XCover-powered refund protection in which buyers opt in at checkout and the organizer keeps "a portion of the price they pay as profit"; the split is undisclosed. — [Cover Genius live-event ticketing](https://covergenius.com/insurance/live-event-ticketing-protection/); [Ticket Tailor refund protection](https://www.tickettailor.com/en-us/refund-protection)
- Published price points are scarce. One XCover-backed example is "from £10" on a £90 ticket, about 11%. A secondary explainer says AXS ticket insurance is "typically around $8 per ticket," which is unverified. — [Motorsport Tickets booking protection](https://motorsporttickets.com/en/bookingprotection); [Shunins (secondary)](https://shunins.com/article/what-is-axs-ticket-insurance)
- **Event cancellation insurance (organizer-side):** usually a separate rider or policy that reimburses covered losses when an event is cancelled or postponed for covered causes. Some venue-user policies explicitly exclude it. Brokers report insurers are reluctant to underwrite small entertainment venues and costs have risen. — [HUB International: insurance for small venues](https://www.hubinternational.com/en-us/insights/articles/insurance-for-small-venues/)

### Inferences
- The all-in-price rule is a software requirement the open-source project must hard-code, and it is cheap to build. Every price render (listing, embed, social card, email, wallet pass) must show the total including mandatory fees. This should be a fail-closed invariant in the pricing module, not a per-venue setting. The FTC/BOTS/Ticketmaster litigation shows enforcement in this space is active, not theoretical.
- **Refund policy as data:** the software should require each event to carry a machine-readable refund policy covering cancellation, postponement, and venue change. It should default to "full refund of all-in price on cancellation." This is the standard fans expect. It is also the cheapest chargeback defense, because a 13.7 dispute is lost if no refund was issued.
- In venue-as-merchant, the venue funds refunds on cancellation. If it has already spent the money, the processor debits its account or bank, and the venue takes the loss and the chargeback fees. This is the real "balance sheet" benefit incumbents provide, and an OSS project cannot replace it. Options: (a) optional self-escrow (delayed payouts, section 1); (b) recommend event cancellation insurance via broker for larger shows; (c) offer fan-side ticket protection as a plug-in.
- **Requirements-brief row: Refunds and cancellation**

| Element | Detail |
|---|---|
| What | Refund execution on cancel/postpone, fee transparency, optional fan ticket protection, organizer cancellation insurance |
| Exposure if missing | FTC fees-rule violations (per-violation civil penalties; one 2023 analysis cited $50,120 per violation, unverified for 2026); state UDAP claims; chargebacks plus fees; class actions (COVID-era refund suits were not researched this session) |
| Incumbent approach | Platform executes bulk refunds, sometimes fronts them, then claws back from the organizer; sells opt-in ticket protection (XCover etc.) and shares revenue |
| MVP | All-in price invariant; mandatory refund policy field; one-click bulk refund through the venue's processor; self-escrow option. Cost: $0 |
| Mature | Plug-in for a ticket-protection insurer (XCover/Cover Genius or similar) with revenue share to the venue; a referral directory of brokers who write event cancellation for small venues. Insurer partnerships require a legal entity and possibly producer licensing (not researched) |

### Gaps
- COVID-era refund lawsuits against Live Nation/StubHub and their outcomes were not researched this session.
- State ticket-refund statutes were not researched. Background, unverified this session: New York Arts & Cultural Affairs Law Article 25 requires refunds for cancelled events, and several states passed ticketing laws in 2024–2025 (e.g., all-in pricing and speculative-ticket bans). Verify the state list before publication.
- Vertical Insure and Protect Group did not appear in any results. Their pricing and small-venue availability are unknown.
- No published premium figures were found for event cancellation insurance for a 300-cap room.

---

## 3. Fraud and bots

### Takeaway
For a small venue the real fraud risks are stolen-card purchases that come back as chargebacks, and screenshotted or duplicate QR codes, not industrial bots. The BOTS Act binds the people circumventing controls, but the 2025 FTC suit shows regulators now also expect a primary seller to actually enforce its own purchase limits. An OSS project needs processor-side fraud scoring (Stripe Radar), single-use signed tickets with online scan validation, per-buyer limits that are actually enforced, and an optional waiting-room plug-in for rare hot on-sales.

### Cited Findings
- A March 2025 executive order directed the FTC to prioritize BOTS Act enforcement. In August 2025 the FTC sued a Maryland broker over Eras Tour purchases. In September 2025 it sued Ticketmaster for allegedly turning "a blind eye to broker circumvention of ticket limits" and is seeking BOTS Act penalties of up to about $53,000 per violation. Ticketmaster denies wrongdoing. — [Global Policy Watch](https://www.globalpolicywatch.com/2025/10/ftc-sues-live-nation-and-ticketmaster-for-deceptive-pricing-tactics/); [PYMNTS](https://www.pymnts.com/news/regulation/2025/ftc-sues-ticketmaster-alleging-illegal-coordination-with-brokers-bait-and-switch-pricing/); [Bloomberg Law](https://news.bloomberglaw.com/litigation/ticketmaster-live-nation-sued-by-ftc-over-ticket-resales)
- Stripe Radar is priced separately from Connect. The amounts were not listed on the Connect pricing page. — [Stripe Connect pricing](https://stripe.com/connect/pricing)

### Inferences
- **Change in 2025–2026:** the enforcement theory now reaches a primary seller that publishes purchase limits but doesn't enforce them. Requirement: if the software advertises "4 per customer," it must enforce that by account, card fingerprint, and device or IP heuristics, and log the enforcement. Otherwise, publish no limit.
- **Counterfeit QR codes:** tickets should be signed tokens, using a per-event key on the venue's node. Rotating time-based codes, like Ticketmaster SafeTix, defeat screenshots but need an app or wallet pass that refreshes. That is background knowledge, unverified this session. MVP: signed static QR with online "first scan wins" validation at the door, plus an offline fallback list. Mature: rotating codes in a wallet pass or app.
- **Bots/queues:** a 300-cap room rarely needs a queue. For a hot show, a plug-in waiting room helps; Queue-it is commercial and its pricing wasn't researched. An open-source alternative is a simple token-bucket queue in front of checkout. Identity binding, like Verified Fan, is heavy and privacy-costly, so offer it only as an optional module (e.g., presale codes to mailing-list members).
- **Requirements-brief row: Fraud/bots**

| Element | Detail |
|---|---|
| Exposure if missing | Chargeback losses plus fees on the venue; processor account termination if dispute rate is too high; reputational harm from duplicate tickets at the door; potential FTC exposure if advertised limits aren't enforced |
| MVP | Processor fraud tools (Radar on by default in Stripe), signed single-use QR, online scan dedupe, enforced per-order limits. Cost: $0 beyond processor |
| Mature | Rotating-code wallet passes, queue plug-in, optional presale identity binding, shared deny-list across federated nodes (careful: privacy law implications) |

### Gaps
- Queue-it pricing, Radar pricing (background, unverified this session: about 5¢/screened transaction on standard pricing, included on some plans), and card-network dispute-rate thresholds (Visa VAMP changes in 2025) were not researched.

---

## 4. Security and privacy: breach law, state privacy acts, TCPA/10DLC, CAN-SPAM, COPPA, ADA, PCI

### Takeaway
Most state comprehensive privacy laws have thresholds (typically 100,000 state residents) that a single small venue won't hit. A shared hosted service aggregating many venues could hit them, and that is an argument for decentralization. SMS marketing requires 10DLC brand and campaign registration, which is cheap but mandatory. Accessibility is the most likely real-world lawsuit vector for ticket websites. The DOJ Title II web rule, which matters for public schools and universities, was delayed one year in April 2026.

### Cited Findings
- **New state privacy laws, 2026:** Indiana, Kentucky, and Rhode Island comprehensive privacy laws took effect 1 Jan 2026, bringing the count to 18–19 states depending on the source. Indiana and Kentucky apply at 100,000 residents, or 25,000 residents plus more than 50% of revenue from data sales. Rhode Island applies at 35,000 residents, or 10,000 plus more than 20% of revenue from data sales. Rhode Island reportedly has no cure period. One applicability chart (PBN) appears to swap the IN/RI thresholds. — [TrustArc: new in 2026](https://trustarc.com/resource/new-in-2026-state-privacy-laws-in-indiana-kentucky-and-rhode-island/); [Baker Donelson](https://bakerdonelson.com/privacy-laws-ring-in-the-new-year-state-requirements-expand-across-the-us-in-2026); [JD Supra: three more state privacy laws](https://www.jdsupra.com/legalnews/no-slowing-down-three-more-state-8826203/); conflicting chart: [PBN applicability triggers 2026](https://pbnlaw.com/webfiles/State-Data-Privacy-Laws_Applicability-Triggers_2026-class.pdf.pdf)
- **TCPA:** the Eleventh Circuit vacated the FCC's "one-to-one consent" rule on 24 Jan 2025, so a consent can cover multiple sellers again. Existing TCPA consent obligations are unchanged. — [Morrison Foerster](https://mofo.com/resources/insights/250130-eleventh-circuit-vacates-fcc-s-tcpa-one-to-one-consent-rule); [Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/eleventh-circuit-vacates-tcpa-11-consent-rule)
- **10DLC fees (changed 1 Aug 2025):** brand registration is $4.50 (was $4.00) and standard vetting is $41.50 (was $40.00). A new $12.50 authentication fee applies to public for-profit brands. Monthly campaign fees are unchanged and billed separately. Vonage lists enhanced vetting at $101.50 and a $15 campaign vetting fee effective 15 Jul 2025. — [Twilio support](https://support.twilio.com/hc/en-us/articles/1260803965530); [Vonage 10DLC fees](https://api.support.vonage.com/hc/en-us/articles/360058158511-10-DLC-Pricing-and-Fees)
- **ADA Title II web rule (changed April 2026):** a DOJ interim final rule published 20 Apr 2026 extended compliance dates. Public entities serving 50,000+ people now have until 26 Apr 2027 (was 24 Apr 2026). Smaller entities and special districts have until 26 Apr 2028 (was 26 Apr 2027). The standard stays WCAG 2.1 AA. Comments closed 22 Jun 2026. DOJ is considering a separate rulemaking that could revise scope for K-12. — [JD Supra: DOJ extends Title II deadlines](https://www.jdsupra.com/legalnews/doj-extends-title-ii-ada-web-2176958/); [Plante Moran](https://plantemoran.com/explore-our-thinking/insight/2026/04/doj-extends-ada-title-ii-web-accessibility-compliance-deadlines); [Illinois Lawyer Now](https://www.illinoislawyernow.com/2026/04/doj-extends-title-ii-ada-web-content-accessibility-compliance-deadlines/); [AASA](https://www.aasa.org/resources/blog/doj-delays-website-accessibility-compliance-for-1-year)
- **PCI:** see section 1 for the SAQ A change in 2025. — [SecurityMetrics](https://chat.securitymetrics.com/blog/big-changes-for-saq-a)

### Inferences
- **Decentralization is a privacy-compliance feature.** Each venue node holds only its own fans' data, so a 300-cap venue is far below the 100,000-resident thresholds and usually below Rhode Island's 35,000. A central hosted multi-tenant service run by the project would aggregate data and could cross thresholds as a processor or controller. Requirement: the default deployment keeps fan PII on the venue's node. Any shared directory or discovery layer carries only event metadata, not buyer data.
- Data-breach notification laws (all 50 states) apply regardless of size, which is background knowledge, unverified this session. Minimizing stored PII matters: no card data (the processor holds it), email plus name only, and an auto-purge setting.
- **SMS:** the project should not send SMS itself. A plug-in using the venue's own Twilio/Vonage account puts 10DLC registration on the venue, at about $4.50 brand + $41.50 vetting one-time + a monthly campaign fee. The software must capture and log express written consent with timestamp and wording, and honor STOP. Email (CAN-SPAM) needs an unsubscribe link and physical address in every marketing email (background, unverified this session), so templates should hard-code these.
- **Accessibility:** the project should treat WCAG 2.1 AA as a release gate, using automated axe checks plus manual screen-reader passes on checkout. This is the one compliance area where open-source software can fully deliver the benefit for every venue at once. For public school and university users, the Title II rule makes it a procurement requirement by April 2027/2028.
- COPPA only matters if the service is directed to children under 13 or knowingly collects their data. Recommended: tickets are bought by adults, and no child accounts. Background, unverified this session: the FTC's amended COPPA rule took effect June 2025 with an April 2026 compliance date. Verify.
- **Requirements-brief row: Security/privacy**

| Element | Detail |
|---|---|
| MVP | PII minimization; data stays on the venue node; privacy policy template; consent logging; CAN-SPAM-compliant templates; WCAG 2.1 AA gate; SAQ A via redirect checkout; breach-response runbook template. Cost $0 |
| Mature | Third-party security audit of the core (roughly a few $k–$30k+; no source found), SOC 2 only if a hosted service exists, VPAT/ACR document for school procurement, bug bounty |

### Gaps
- No Title III ticket-website litigation-trend data was retrieved this session.
- CCPA/CPRA 2026 changes (the CPPA regulations on risk assessments, cybersecurity audits, and ADMT, finalized in 2025 with phased dates) were not verified this session.
- Cyber insurance for small venues was not researched.

---

## 5. Taxes and reporting

### Takeaway
2026 federal reporting is simpler than feared: OBBBA restored the 1099-K threshold to more than $20,000 and more than 200 transactions. Card processors still report all card volume, and Stripe files 1099-Ks for connected accounts, so in venue-as-merchant the project files nothing. The real tax burden falls on venues: local amusement taxes (e.g., Chicago 9%, with a small-venue exemption), state nonresident entertainer withholding (California 7% over $1,500), 1099-NEC for artist payments, and PRO licenses. The software can calculate and remind but should not file.

### Cited Findings
- **1099-K (changed July 2025):** the One Big Beautiful Bill Act (signed 4 Jul 2025) amended IRC §6050W(e) back to more than $20,000 and more than 200 transactions for third-party settlement organizations, retroactively. The IRS issued IR-2025-107 and Fact Sheet 2025-08 on 23 Oct 2025. Card processors (payment card transactions) have no de minimis threshold. Sources are secondary tax-software sites; the IRS fact sheet itself was not fetched. — [Credit Karma](https://www.creditkarma.com/tax/library/irs-forms/1099-k-threshold/); [Beancount: 2026 threshold reverts](https://beancount.io/blog/2026/05/08/form-1099-k-2026-threshold-reverts-20000-200-transactions-obbba-payment-app-reporting-guide); [TaxAct](https://blog.taxact.com/4-common-misconceptions-about-the-new-1099-k-reporting-threshold/)
- One blog claims inflation indexing of the $20,000 threshold starting 2027. This is unverified against statute. — [Beancount](https://beancount.io/blog/2026/05/15/1099-k-threshold-whiplash-2026-gig-workers-online-sellers-reconcile-marketplace-forms-20000-200-transactions-obbba-guide)
- Stripe Connect 1099 filing: free digital copies under "Stripe handles pricing." Under "you handle pricing," it costs $2.99 per IRS e-file, $1.49 per state e-file, and $2.99 per mailed copy. — [Stripe Connect pricing](https://stripe.com/connect/pricing)
- **California nonresident entertainer withholding:** a payer must withhold 7% of the gross California-source payment, not net of agent commissions, to nonresident entertainers if total payments exceed $1,500 per calendar year. This applies even if paid to an agent. Reporting uses Forms 592/592-B. Waivers and reductions go only through FTB (Forms 588/589). — [CA FTB: withholding on nonresidents](https://www.ftb.ca.gov/pay/withholding/withholding-on-nonresidents.html); [UC Davis: entertainers and performers](https://afs.ucdavis.edu/finance/tax-reporting-compliance/entertainers)
- **Chicago amusement tax:** 9% of charges, including related markups. — [City of Chicago: Is your event subject to the amusement tax?](https://www.chicago.gov/content/dam/city/depts/rev/supp_info/TaxSupportingInformation/AmusementTaxGeneralInfo-UpdatedFor2018.pdf). The live-performance small-venue exemption threshold conflicts across sources: 750 (1999 ordinance, city guidance era) vs. 1,500 (2017 proposal; a 2024 Kilpatrick Townsend analysis states 1,500 is current for the city). Cook County exempts at 750 or less and charges 1% for 750–5,000 capacity (3% general rate). — [Kilpatrick Townsend 2024](https://ktslaw.com/insights/perspectives/2024/3/chicago-and-cook-county-amusement-tax)
- Illinois Supreme Court held municipalities can't require online resale intermediaries to collect amusement tax. — [Winston & Strawn](https://www.winston.com/a/web/1043/1043.html)
- **PRO licenses (ASCAP/BMI/SESAC):** no current live-venue rate card found. A Pollstar report (undated) cites capacity-tiered percentages of ticket revenue (about 0.08% for venues of 2,500 or fewer) and one operator going from $3,000 to over $15,000/year. Older anecdotes cite BMI at $735/yr and ASCAP at $1,700/yr for small venues. — [Pollstar: BMI and the little fella](https://news.pollstar.com/?p=173491); [Phoenix New Times](https://www.phoenixnewtimes.com/?p=40532101); [Dallas Observer](https://www.dallasobserver.com/?p=40499526)

### Inferences
- In venue-as-merchant with Stripe Standard/Express accounts, the processor issues 1099-Ks to each venue, and the project has no filing duty (inference from the TPSO/processor rule and the Stripe pricing page). In the mature platform model ("you handle pricing"), 1099 reporting becomes a per-account cost the platform entity pays.
- The software should include a tax-rule module that is pluggable and data-driven per jurisdiction. It would cover: amusement and sales tax rate and exemptions by venue location, so they are included in the all-in price; a nonresident withholding calculator on the settlement sheet (CA 7% over $1,500 as the reference rule); a 1099-NEC flag when artist payments reach the 2026 threshold; and PRO license status as a venue profile field. Rules would be maintained as community-curated data with citations, not code. Background, unverified this session: OBBBA raised the 1099-NEC/MISC threshold from $600 to $2,000 starting with payments made in 2026, indexed after. That is a 2025 change worth verifying.
- Sales tax on admissions varies widely by state. Some states tax admissions and many exempt them or let cities levy amusement taxes. A national rule table is a mature-phase community project. MVP: venue enters its own combined tax rate.

### Gaps
- A multi-state list of nonresident entertainer withholding regimes (e.g., MN, MO, NY, etc.) was not retrieved. Only California was confirmed.
- 2026 PRO venue rate schedules were not found. Venues must request quotes. GMR (Global Music Rights) was not covered.
- A state-by-state admissions sales tax survey was not researched.

---

## 6. Contracts: deal memos, AFM forms, e-signature, settlement

### Takeaway
No sources were retrieved this session on contracts. The notes below are background knowledge, so treat them as unverified and get them independently sourced before the report relies on them.

### Cited Findings
- None retrieved this session.

### Inferences
- Background, unverified this session: a standard club-level deal memo covers date, venue, set length, compensation structure (flat guarantee; door deal; "versus" deals such as guarantee vs. X% of net box office after expenses; backend percentage after a promoter split point), ticket price and capacity (gross potential), production/hospitality rider, merch split (often venue takes 0–25% of soft merch), radius clause, cancellation and force majeure, deposit terms, and settlement procedure. Settlement on show night reconciles gross ticket sales, taxes, fees, and approved expenses, then pays the artist with a signed settlement sheet.
- Background, unverified this session: the AFM publishes standard engagement contract forms (e.g., B-forms for local engagements), and AFM locals may require them for union members. ESIGN (federal) and UETA (adopted in 49 states plus DC) make e-signatures generally enforceable for these commercial contracts.
- Requirement inference: this is a software-native benefit an OSS project can fully provide. It needs templated deal memos with structured fields that drive automatic settlement math, artist and venue e-sign (a simple click-to-sign audit trail is enough under ESIGN/UETA), and a settlement sheet generated from actual ticket data. A settlement computed from the same ledger the fans paid into is one of the strongest "artists and venues work directly" value propositions. Cost: $0 to build into the core. Mature: optional DocuSign/Dropbox Sign adapter.

### Gaps
- AFM contract templates, sample deal memos and settlement sheets, and ESIGN/UETA applicability were not sourced this session and need a dedicated pass.

---

## 7. Mobile apps, wallet passes, and scale

### Takeaway
Apple's guidelines put tickets to real-world events squarely outside in-app purchase. Guideline 3.1.3(e) requires non-IAP payment for "services that will be consumed outside of the app." That means no 15–30% Apple cut, and Wallet passes are explicitly sanctioned for tickets. Scale for a 300-cap room is trivial. Ticketmaster-class on-sale load is a different problem that an OSS network only needs to handle if one node hosts a huge on-sale.

### Cited Findings
- App Review Guideline 3.1.3(e): "If your app enables people to purchase physical goods or services that will be consumed outside of the app, you must use purchase methods other than in-app purchase to collect those payments, such as Apple Pay or traditional credit card entry." — [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Guideline 3.2.1(iv): Wallet passes "can be used to make or receive payments, transmit offers, or offer identification (such as movie tickets, coupons, and VIP credentials)." Other uses may result in rejection and revocation of Wallet credentials. — [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- Contrast: Guideline 3.1.3(d) says one-to-few and one-to-many *real-time* services must use IAP. This targets digital live services such as livestreams, and was flagged by developers as a risk area. A livestreamed concert ticket would likely require IAP, while an in-person ticket would not (my reading). — [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/); [Apple Developer Forums thread 723322](https://developer.apple.com/forums/thread/723322)
- US storefront: guideline 3.1.1(a) states the external-purchase-link entitlements "are not required for developers to include buttons, external links, or other calls to action in their United States storefront apps." — [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Inferences
- **App distribution requires a legal entity and developer accounts.** Background, unverified this session: Apple Developer Program costs $99/yr and Wallet pass signing requires a Pass Type ID certificate from a paid account. Google Play is a one-time $25 registration, and the Google Wallet API is free with issuer approval. A decentralized project faces a key-custody question here. Pass signing certificates belong to one developer account, so either the project entity signs passes for all nodes (a centralization point and a liability), or each venue gets its own Apple account (impractical). MVP: skip native apps. Use a PWA (installable web app) plus email/PDF QR tickets, and optionally a project-entity-signed Apple/Google Wallet pass service as an opt-in hosted module. Mature: a white-label app published by the project entity, or per-region operators, with external card checkout per 3.1.3(e).
- Avoid selling livestream access inside an iOS app without IAP (3.1.3(d) risk).
- **Scale:** a 300-cap sellout is 300 orders, which fits on a $5–10/month VPS (background, unverified this session). Ticketmaster-scale on-sales involve millions of concurrent users plus bot traffic. An OSS node should only need a queue plug-in and processor-hosted checkout, since Stripe absorbs payment load, so the node only serves inventory holds. The design requirement is atomic seat/GA inventory decrements with short hold timers.
- **Requirements-brief row: Apps/scale**

| Element | Detail |
|---|---|
| MVP | PWA; QR in email/PDF; door-scanner PWA using the phone camera; single-VPS node. Cost ~$0–$10/mo per venue |
| Mature | Project-entity Apple/Google developer accounts ($99/yr + $25 one-time), Wallet pass signing service, white-label native apps, CDN plus queue module for hot on-sales |

### Gaps
- Apple Wallet and Google Wallet pass costs and requirements were not fetched this session. Neither were actual on-sale traffic figures for Ticketmaster.

---

## 8. Insurance for venues and promoters

### Takeaway
Insurance is the clearest case where the venue must carry the risk itself. GL, liquor liability, and assault-and-battery coverage are placed through brokers with venue programs, and pricing is opaque and rising. Ticketing platforms monetize fan-side ticket protection, not venue liability coverage. No source showed a ticketing platform bundling GL or liquor coverage for small venues.

### Cited Findings
- Insurers have "limited enthusiasm" for small entertainment venues, and coverage costs have risen. One broker estimates catastrophic weather drove venue property rates up about 20%. CGL forms for bars and nightclubs routinely exclude assault and battery, but dedicated venue-program carriers include it. Event cancellation is typically a separate rider. — [HUB International: what operators of small entertainment venues need to know](https://www.hubinternational.com/en-us/insights/articles/insurance-for-small-venues/)
- Liquor liability is priced as an add-on. Controls such as professional bartenders, ID checks, wristbands, and last call reduce premium. Host liquor is sometimes an endorsement in GL packages. — [Blake Insurance Group festival guide](https://blakeinsurancegroup.com/?p=38421); [HUB venue users' insurance](https://www.hubinternational.com/en-ca/affinity/venue-users-insurance/)
- Fan-side ticket protection (XCover etc.) is sold through ticketing platforms with revenue share to the platform or organizer. See section 2. — [Ticket Tailor refund protection](https://www.tickettailor.com/en-us/refund-protection); [Cover Genius](https://covergenius.com/insurance/live-event-ticketing-protection/)

### Inferences
- **Venue carries the risk** for GL, liquor, property, workers' comp, and event cancellation. The OSS project's role: (a) a venue profile field for certificate of insurance status and expiry, (b) a COI exchange between artist and venue in the deal-memo flow, since riders often require a COI naming the artist or promoter as additional insured, and (c) a directory of venue-program brokers. Day-of-event "special event" policies for one-off shows by non-venue promoters exist in the market, but no source was retrieved this session.
- **Ticket protection as a plug-in** is the only insurance item a platform can monetize. It requires an insurer partnership, which needs a legal entity, and possibly an insurance producer license depending on how it is sold. This was not researched; flag for counsel.

### Gaps
- No small-venue premium numbers were found for GL or liquor or event cancellation. Vertical Insure, Protect Group, Eventbrite, and Humanitix insurance offerings were not found in results. Producer licensing requirements for platforms embedding insurance were not researched.

---

## 9. Nonprofit and school specifics

### Takeaway
Few sources were retrieved this session. The cited change is the ADA Title II web rule delay (section 4), which governs public schools' and universities' ticketing pages. Compliance is now April 2027 for entities serving 50,000+ and April 2028 for smaller ones, with a possible K-12 rescoping.

### Cited Findings
- Title II deadlines moved to 26 Apr 2027 (50,000+ population) and 26 Apr 2028 (smaller entities and special districts). DOJ is considering a separate K-12 rulemaking. — [JD Supra](https://www.jdsupra.com/legalnews/doj-extends-title-ii-ada-web-2176958/); [AASA](https://www.aasa.org/resources/blog/doj-delays-website-accessibility-compliance-for-1-year)

### Inferences
- Background, unverified this session: 501(c)(3) ticket sales are generally not tax-deductible donations except for amounts above fair market value. Ticketing a fundraiser needs a quid-pro-quo disclosure for payments over $75. FERPA applies only if the software touches education records such as student rosters, so the requirement is to never import student rosters; sell to parents as the public. Districts often require a signed student-data-privacy agreement (e.g., state DPA templates via the Student Data Privacy Consortium) and an accessibility conformance report (VPAT) before approving software. An open-source project without a legal entity cannot sign DPAs, which is a concrete reason the mature path needs a foundation or commercial host.
- Requirement: a "school mode" that collects no student data and only buyer email, runs on the district's own payment processor account (many districts already have one), and ships a VPAT/ACR and a template DPA.

### Gaps
- FERPA, district procurement rules, 501(c)(3) quid-pro-quo thresholds, and school payment practices were not sourced this session and need a dedicated pass.
