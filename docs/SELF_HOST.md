# Self-hosting OMP

One container for the app, one for HTTPS, one data volume. A school district, a university, or a venue co-op with someone who can run Docker can host its own instance; everyone else uses a hosted one and can leave with a signed export at any time.

## Requirements

- A Linux host with Docker and Docker Compose (a small VPS is plenty; a 300-seat sellout is 300 orders).
- A domain name pointing at the host, so Caddy can obtain a certificate automatically.
- Each organizer brings their own Stripe account when paid tickets arrive; the instance never holds money.

## Install

```bash
git clone https://github.com/benjammin2006/open-music-performance.git
cd open-music-performance
cp .env.example .env
# edit .env: OMP_DOMAIN, OMP_BASE_URL (https://your-domain), OMP_ADMIN_TOKEN (openssl rand -hex 24)
docker compose up -d
```

Then open `https://your-domain/setup`. The first visit to an empty instance creates its first organization: name, short id, timezone, default venue. You get an organizer key once and are signed in. From there: new event, ticket classes, program, publish; the scanner is at `/scan/` and its door code is on the event's manage page.

## What is where

| Thing | Where |
|---|---|
| Database (SQLite, one file) | the `omp-data` volume, `/data/omp.sqlite` in the container |
| TLS certificates | the `caddy-data` volume |
| Organizer keys, door codes, signing keys | in the database, hashed where they are secrets; the issuer private key is stored unencrypted (encrypt at rest before you depend on this for anything beyond a pilot, see `server/src/db.ts`) |
| Logs | `docker compose logs -f omp` |

## Backups and portability

- **Backup**: copy the volume (`docker compose cp omp:/data/omp.sqlite ./backup-$(date +%F).sqlite`), or better, have each organizer download their **signed export** from the dashboard. That file is the organizer's own copy in the published schema.
- **Verify a bundle**: `npm run omp -- verify bundle.json --origin` checks the signature and compares the signing key with what the source instance publishes at `/.well-known/omp.json`.
- **Move to another instance**: `npm run omp -- import bundle.json --db /path/to/omp.sqlite` loads the records under their original identifier, keeps the old ticket-signing public keys so existing tickets still verify, provisions a new signing key, and prints a new organizer key for that instance. Importing the same bundle twice is harmless.

## Upgrading

```bash
git pull
docker compose build
docker compose up -d
```

The database migrates itself on start. Keep a backup from before any upgrade.

## Without Docker

Node 24 is the only runtime dependency:

```bash
npm ci && npm run build
OMP_BASE_URL=https://your-domain OMP_ADMIN_TOKEN=... OMP_DB_PATH=/var/lib/omp/omp.sqlite node server/src/main.ts
```

Put any TLS-terminating reverse proxy in front of port 3000.

## Status of this document

The Docker image and compose file were written against the Dockerfile's exact steps and those steps were exercised on a clean checkout (install, build, start, `/healthz`, `/setup`), but the container itself has not yet been built on a Docker host. First person to run `docker compose up` on a real box: please open an issue with the result either way.
