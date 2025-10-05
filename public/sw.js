const VERSION = "v1.0.2";
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const APP_SHELL = [
  "/",
  "/login",
  "/register",
  "/patient-onboarding",
  "/patient-homepage",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
];

// pre caching
async function precache(urls) {
  const cache = await caches.open(STATIC_CACHE);
  await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (res && res.ok) await cache.put(url, res.clone());
      } catch (_) {
        // skip on failure
      }
    })
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache(APP_SHELL));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
            .map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// safely cache a response
function safePut(event, req, res) {
  if (!res || !res.ok) return;
  const copy = res.clone();
  event.waitUntil(
    caches
      .open(RUNTIME_CACHE)
      .then((c) => c.put(req, copy))
      .catch(() => {})
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // same-origin GETs only
  if (url.origin !== self.location.origin || req.method !== "GET") return;

  // API: network-first, cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          safePut(event, req, res);
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  //static asset
  if (
    url.pathname.startsWith("/_next/static/") ||
    /\.(?:js|css|woff2?)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetching = fetch(req)
          .then((res) => {
            safePut(event, req, res);
            return res;
          })
          .catch(() => cached || fetch(req));
        return cached || fetching;
      })
    );
    return;
  }

  // cache first, fallback to logo icon
  if (/\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req)
            .then((res) => {
              safePut(event, req, res);
              return res;
            })
            .catch(() => caches.match("/icons/icon-192.png"))
      )
    );
    return;
  }

  // offline fallback
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/offline.html")));
    return;
  }

  // default cache
  event.respondWith(caches.match(req).then((c) => c || fetch(req)));
});
