# Open Music Performance server + scanner, one image. Node 24 ships node:sqlite and native TypeScript stripping,
# so the image runs the sources directly; the only build step is the scanner bundle and the tickets package.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY schemas/package.json schemas/
COPY packages/tickets/package.json packages/tickets/
COPY apps/scanner/package.json apps/scanner/
COPY server/package.json server/
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:24-alpine
ENV NODE_ENV=production OMP_PORT=3000 OMP_DB_PATH=/data/omp.sqlite
WORKDIR /app
COPY --from=build /app /app
RUN mkdir -p /data && chown -R node:node /data /app
USER node
VOLUME ["/data"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "server/src/main.ts"]
