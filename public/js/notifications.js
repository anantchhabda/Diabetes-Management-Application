(function () {
  const LOG_PREFIX = "[DMA][notifications]";
  const log = (...a) => console.log(LOG_PREFIX, ...a);
  const err = (...a) => console.error(LOG_PREFIX, ...a);

  // helpers

  function base64UrlToUint8Array(base64Url) {
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }

  function safeGetAuthToken() {
    try {
      const t = localStorage.getItem("authToken");
      return t || null;
    } catch {
      return null;
    }
  }

  function decodeJwtPayload(token) {
    // returns {} if anything fails
    try {
      const parts = token.split(".");
      if (parts.length < 2) return {};
      const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json);
    } catch {
      return {};
    }
  }

  function getCurrentProfileId() {
    const token = safeGetAuthToken();
    if (!token) return null;
    const payload = decodeJwtPayload(token);
    return payload?.profileId || null;
  }

  function getBoundProfileId() {
    try {
      return localStorage.getItem("dma_push_bound_profileId");
    } catch {
      return null;
    }
  }

  function setBoundProfileId(pid) {
    try {
      if (pid) localStorage.setItem("dma_push_bound_profileId", pid);
    } catch {}
  }

  async function getRegistration() {
    if (!("serviceWorker" in navigator)) throw new Error("SW not supported");
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) throw new Error("No active service worker registration");
    return reg;
  }

  async function fetchVapidKey() {
    const r = await fetch("/api/push/public-key", { cache: "no-cache" });
    if (!r.ok) throw new Error("Failed to fetch VAPID public key");
    const { key } = await r.json();
    if (!key || key.length < 32) throw new Error("Invalid VAPID key");
    return key;
  }

  async function subscribeBrowser(reg) {
    const pub = await fetchVapidKey();
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToUint8Array(pub),
    });
    return sub;
  }

  async function saveSubscriptionToServer(subscription) {
    const token = safeGetAuthToken();
    if (!token) throw new Error("No authToken in localStorage");

    // device info
    const ua = navigator.userAgent || "";
    let deviceLabel = "Browser";
    try {
      const uaData = navigator.userAgentData;
      if (uaData?.brands?.length) {
        deviceLabel =
          (uaData.brands.map((b) => b.brand).join(", ") || "Browser") +
          (uaData.platform ? ` on ${uaData.platform}` : "");
      }
    } catch (_) {}

    const payload = {
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
      deviceLabel,
      userAgent: ua,
    };

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // server links to patient via JWT
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(`subscribe API failed: ${json?.error || res.status}`);
    }
    return json;
  }

  async function showLocalToast(
    reg,
    title = "Notifications enabled",
    body = "You’ll receive reminders."
  ) {
    try {
      await reg.showNotification(title, {
        body,
        icon: "/icons/icon-192.png",
        tag: "dma-enable",
      });
    } catch (_) {}
  }

  //one subscription per user, subscription updates to the latest user which logins into a "particular" device
  async function ensureSubscribedForCurrentUser(silent = false) {
    try {
      const token = safeGetAuthToken();
      const profileId = getCurrentProfileId();

      if (!token || !profileId) {
        log("No auth token/profileId — not binding.");
        return false;
      }

      if (!("Notification" in window))
        throw new Error("Notifications not supported");
      if (Notification.permission !== "granted") {
        log("Permission is not granted — cannot auto-bind.");
        return false;
      }

      const reg = await getRegistration();
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        // permission is granted but no push subscription yet — create one
        sub = await subscribeBrowser(reg);
        log("Created new PushSubscription for current user.");
      } else {
        log("Found existing PushSubscription — will re-bind to this user.");
      }

      await saveSubscriptionToServer(sub);
      setBoundProfileId(profileId);
      log("Subscription saved and bound to profile:", profileId);

      await showLocalToast(
        reg,
        "Notifications ready",
        "This device is linked to your account."
      );

      return true;
    } catch (e) {
      if (!silent) err("ensureSubscribedForCurrentUser error:", e);
      return false;
    }
  }

  // public API for the button
  window.enableNotifications = async function enableNotifications() {
    try {
      if (!("Notification" in window))
        throw new Error("Notifications API not supported");
      if (!("serviceWorker" in navigator))
        throw new Error("Service Worker not supported");

      log("Enable clicked; permission =", Notification.permission);

      // ask permission if needed
      let perm = Notification.permission;
      if (perm === "default") {
        perm = await Notification.requestPermission();
        log("Notification.requestPermission() ->", perm);
      }
      if (perm !== "granted") throw new Error("User denied notifications");

      const reg = await getRegistration();

      // always (re)bind to the current user when the user explicitly clicks
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await subscribeBrowser(reg);
        log("pushManager.subscribe() -> ok");
      } else {
        log("pushManager.getSubscription() -> existing");
      }

      await saveSubscriptionToServer(sub);

      const pid = getCurrentProfileId();
      if (pid) setBoundProfileId(pid);

      await showLocalToast(reg);

      // fade away prompt only on success
      const box = document.getElementById("notificationPrompt");
      if (box) {
        box.classList.add("opacity-0");
        setTimeout(() => box.remove(), 600);
      }

      return true;
    } catch (e) {
      err("enableNotifications error:", e);
      throw e;
    }
  };

  // UI wiring

  function shouldHidePrompt() {
    const pid = getCurrentProfileId();
    const bound = getBoundProfileId();
    return (
      Notification?.permission === "granted" && pid && bound && pid === bound
    );
  }

  function wireButton() {
    const btn = document.getElementById("enableNotificationsBtn");
    const promptBox = document.getElementById("notificationPrompt");
    if (!btn || !promptBox) return;

    if (shouldHidePrompt()) {
      promptBox.classList.add("opacity-0");
      setTimeout(() => promptBox.remove(), 600);
      return;
    }

    //update subscription
    if (Notification?.permission === "granted") {
      btn.textContent = "Enable notifications for this account";
    }

    if (!btn.dataset.wired) {
      btn.dataset.wired = "1";
      btn.addEventListener("click", async () => {
        try {
          await window.enableNotifications();
        } catch (_) {}
      });
    }
  }

  // init

  (async function init() {
    log(
      "notifications.js loaded; permission =",
      typeof Notification !== "undefined" ? Notification.permission : "n/a"
    );

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        console.log(
          " ",
          " Service Worker registered:",
          (reg && reg.scope) || location.origin
        );
      });
    }

    const onReady = async () => {
      wireButton();
      // if permission is already granted, try silently to re-bind subscription
      // to the currently logged-in user
      if (Notification?.permission === "granted") {
        const bound = await ensureSubscribedForCurrentUser(true);
        // re-evaluate UI after silent bind
        wireButton();
        if (!bound) {
          //if not bound, keepm button visible but a rare case
        }
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady, { once: true });
    } else {
      onReady();
    }
  })();
})();
