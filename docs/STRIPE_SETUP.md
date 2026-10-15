# Stripe setup for paid tickets

How paid tickets work, what an instance operator sets up once, what each organizer does, and how to run the demo purchase in test mode. Read [ARCHITECTURE.md](ARCHITECTURE.md) section 5.5 for why it is shaped this way.

## The shape

- The **instance** (the server you run) is a Stripe Connect *platform*. It holds a secret key and a webhook secret. It never receives money.
- Each **organizer** connects their own Stripe account to the instance (Connect **Standard**). Every charge is a *direct charge* on that account: the organizer is the merchant of record, pays Stripe's processing fee out of the all-in price, gets the payout, and handles refunds and disputes from their own Stripe dashboard. The instance never sets `on_behalf_of` and never takes an application fee.
- Buyers pay on **Stripe Checkout's hosted page**. No card data reaches the instance; the order keeps only the Checkout Session id.
- A pending order holds the seats for **30 minutes** (Stripe's minimum session lifetime). The hold is released when the session expires, when the buyer cancels, or when the webhook says so.
- Tickets are issued when Stripe confirms payment: by the **webhook** (`POST /webhooks/stripe`) or, if the webhook has not arrived when the buyer lands on the order page, by the server **asking Stripe** about that session. The second path is what makes a laptop demo on `localhost` work without a tunnel.

## Instance operator: once

1. Create a Stripe account for the instance (or use an existing one). Stay in **test mode** for anything that is a demo.
2. **Developers → API keys**: copy the *secret* key (`sk_test_...`). The publishable key is not needed; the hosted page does not use it.
3. **Connect → Settings**: complete the platform profile once Stripe asks for it. For test mode nothing else is required.
4. Optional, for the "Connect with Stripe" button: **Connect → Settings → Integration → OAuth**, enable OAuth for Standard accounts, add the redirect URI `https://<your-domain>/admin/stripe/callback`, and copy the client id (`ca_...`). Without it, organizers paste a connected account id instead, which is all a test-mode demo needs.
5. **Developers → Webhooks → Add endpoint**: URL `https://<your-domain>/webhooks/stripe`, and choose **Listen to events on Connected accounts** (not "your account"). Select `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`. Copy the signing secret (`whsec_...`).
6. Set the variables and restart:

```
OMP_STRIPE_SECRET_KEY=sk_test_...
OMP_STRIPE_WEBHOOK_SECRET=whsec_...
OMP_STRIPE_CLIENT_ID=ca_...        # optional (step 4)
```

Locally: put them in `server/.env` (gitignored; the server scripts load it). Docker: put them in the root `.env`, which `docker-compose.yml` passes through. The server logs `Stripe test mode` or `Stripe LIVE` on start.

## Organizer: once per organization

1. Sign in at `/admin`, open **Organization**, scroll to **Online payments**.
2. Either click **Connect with Stripe** (OAuth; sign in to or create your Stripe account, authorize the site), or paste your connected account id (`acct_...`) and click **Connect by id**.
3. Add a paid ticket class to an event and publish. The event page now shows a buy form for it.

In test mode, the account to paste comes from the instance's Stripe dashboard: **Connect → Accounts → Create**, type Standard, in test mode. Stripe creates a fake, already-onboarded account and shows its id.

## The demo purchase (scene 2)

```bash
# server/.env has OMP_STRIPE_SECRET_KEY (sk_test_) and, optionally, OMP_STRIPE_ACCOUNT=acct_<test connected account>
rm -f data/omp.sqlite && npm run seed     # OMP_STRIPE_ACCOUNT connects the demo org automatically
npm run dev
```

Open the event page, choose **General admission**, enter a name and email, click **Buy tickets**. On Stripe's page use card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP. Stripe sends the browser back to the order page, which shows the QR tickets. Scan one with the door scanner; it verifies offline.

Webhooks on a laptop: either rely on the order-page fallback (default: nothing to set up), or run Stripe CLI so the real webhook path is exercised:

```bash
stripe listen --forward-connect-to localhost:3000/webhooks/stripe
# put the printed whsec_... in server/.env as OMP_STRIPE_WEBHOOK_SECRET and restart
```

`--forward-connect-to` matters: Checkout sessions created on a connected account emit *Connect* events, which plain `--forward-to` does not deliver.

Replaying a delivery from the dashboard or `stripe events resend` is safe: fulfilment is idempotent, and a second delivery for a paid order issues nothing.

## What is stored, and where

| Data | Where |
|---|---|
| Instance secret key, webhook secret, client id | environment only |
| Organizer's connected account id | `payment_accounts` table; not in the organization record, the public export, or the signed bundle |
| Per order | status, total, the Checkout Session id as `paymentRef`, `paidAt`; buyer name and email (the organizer's data, see ARCHITECTURE section 7) |
| Card data, Stripe customer records | never; they live at Stripe |

## Going live

Not before the probe-5 legal review in [ARCHITECTURE.md](ARCHITECTURE.md) and an operator entity. When that day comes: live keys, a live webhook endpoint, the OAuth redirect URI on the live domain, and the Connect platform profile completed. Organizers reconnect their live accounts; test connections do not carry over. Also read the Stripe Connect platform agreement: the instance operator, not the project, is the platform.

## Known gaps

- No refund button yet. Refund in the organizer's Stripe dashboard; the ticket must then be revoked by hand (write API) so the status list catches it at the door.
- No email delivery: the order page is the ticket. Buyers should save or print it.
- Pay-what-you-want and paid classes are supported; donations without a ticket are not wired to Stripe yet.
- One webhook secret per instance. If you also want events from the platform's own account, add a second endpoint; this server only handles connected-account events.
