const VERSION = "v1.0.3"; // bumped for SW update
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

//pre-cache
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

// cache helpers
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

// fetch strategies
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // same-origin GETs only
  if (url.origin !== self.location.origin || req.method !== "GET") return;

  // network first then cache fallback
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

  // static assets
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

  // fallback to icon
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

  // SPA navigation: offline fallback
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/offline.html")));
    return;
  }

  // default: cache, else network
  event.respondWith(caches.match(req).then((c) => c || fetch(req)));
});

// Handle incoming push payloads
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    try {
      data = JSON.parse(event.data.text());
    } catch (_) {
      data = {};
    }
  }

  const title = data.title || "DMA Reminder";
  const body = data.body || "You have a reminder.";
  const url = data.url || "/reminders";

  const options = {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: data.tag || "dma-reminder",
    renotify: !!data.renotify,
    data: { url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url =
    (event.notification &&
      event.notification.data &&
      event.notification.data.url) ||
    "/reminders";

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const targetPath = new URL(url, self.location.origin).pathname;

      for (const client of allClients) {
        try {
          const clientPath = new URL(client.url).pathname;
          if (clientPath === targetPath) {
            await client.focus();
            return;
          }
        } catch (_) {}
      }
      await clients.openWindow(url);
    })()
  );
});
