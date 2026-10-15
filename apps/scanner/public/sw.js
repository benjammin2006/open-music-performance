// Cache-first for the app shell so the scanner opens with no network. API calls are never cached.
// __BUILD__ is replaced at build time so a new build invalidates the old cache.
const CACHE = "omp-door-__BUILD__";
const SHELL = ["./", "./index.html", "./app.js", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isShell = url.origin === location.origin && url.pathname.startsWith(new URL("./", location.href).pathname) && !url.pathname.includes("/door.json") && !url.pathname.includes("/scans");
  if (e.request.method !== "GET" || !isShell) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit ?? fetch(e.request)));
});
