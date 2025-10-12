const VERSION = "v1.0.6"; // bumped for SW update
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const APP_SHELL = [
  "/",
  "/login",
  "/register",
  "/patient-onboarding",
  "/patient-homepage",  
  "/patient-connection",
  "/log-data",
  "/reminders",
  "/doctor-onboarding",
  "/doctor-homepage",
  "/doctor-connection",
  "/family-onboarding",
  "/family-homepage",
  "/family-connection",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
  "/logos/DMA-logo-green.png",
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

// --- NEW: fetch each page and cache its asset deps --------------------------
async function warmHtmlDeps(cache, pages) {
  for (const page of pages) {
    // only same-origin paths
    if (!page.startsWith('/')) continue;
    try {
      const res = await fetch(page, { cache: 'no-cache' });
      if (!res.ok) continue;

      // cache the HTML itself
      await cache.put(page, res.clone());

      const html = await res.text();

      // find <script src="..."> and <link href="...">
      const urls = Array.from(
        html.matchAll(/<(?:script|link)\s[^>]*(?:src|href)="([^"]+)"/gi)
      ).map(m => m[1]);

      for (const asset of urls) {
        const u = new URL(asset, self.location.origin);
        // same-origin + likely a build asset
        const isBuild =
          u.origin === self.location.origin &&
          (u.pathname.startsWith('/_next/static/') ||
           /\.(?:js|css|woff2?)$/.test(u.pathname));
        if (!isBuild) continue;

        try {
          const aRes = await fetch(u.href, { cache: 'no-cache' });
          if (aRes.ok) await cache.put(u.href, aRes.clone());
        } catch {}
      }
    } catch {}
  }
}


self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    // cache your shell list
    await cache.addAll(APP_SHELL);
    // 🔥 also cache each page's referenced CSS/JS/fonts
    await warmHtmlDeps(cache, APP_SHELL);
  })());
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

  // SPA navigation: online-first, then cached route/app-shell, then offline page
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        // keep fresh when online
        return await fetch(req);
      } catch {
        // offline path: try exact route first
        const staticCache = await caches.open(STATIC_CACHE);

        // 1) exact route cached?
        let hit = await staticCache.match(req.url);
        if (hit) return hit;

        // 2) app-shell fallbacks you precached
        //    (order them by your preference)
        hit = await staticCache.match("/");
        if (hit) return hit;

        // 3) final fallback: offline page
        const offline = await cache.match("/offline.html");
        return offline || new Response("Offline", { status: 503 });
      }
    })());
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


