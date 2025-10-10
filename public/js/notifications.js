(function () {
  const LOG_PREFIX = "[DMA][notifications]";
  const log = (...a) => console.log(LOG_PREFIX, ...a);
  const err = (...a) => console.error(LOG_PREFIX, ...a);

  // util
  function base64UrlToUint8Array(base64Url) {
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }
  function getAuthToken() {
    const t = localStorage.getItem("authToken");
    if (!t) throw new Error("No authToken in localStorage");
    return t;
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
    const token = getAuthToken();
    // basic device info
    const ua = navigator.userAgent || "";
    let deviceLabel = "Unknown";
    try {
      const uaData = navigator.userAgentData;
      if (uaData && uaData.brands) {
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
        Authorization: `Bearer ${token}`, // patientID subscribe via
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

  // exposed helpers
  window.enableNotifications = async function enableNotifications() {
    try {
      if (!("Notification" in window))
        throw new Error("Notifications API not supported");
      if (!("serviceWorker" in navigator))
        throw new Error("Service Worker not supported");

      log(
        "Clicked enableNotificationsBtn; permission =",
        Notification.permission
      );

      // ask permission
      let perm = Notification.permission;
      if (perm === "default") {
        perm = await Notification.requestPermission();
        log("Notification.requestPermission() ->", perm);
      }
      if (perm !== "granted") throw new Error("User denied notifications");

      // get sw registration
      const reg = await getRegistration();
      log("getRegistration() -> found");

      // ensure pushsubscription
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await subscribeBrowser(reg);
        log("pushManager.subscribe() -> ok");
      } else {
        log("pushManager.getSubscription() -> existing");
      }

      // save to our backend table
      const resp = await saveSubscriptionToServer(sub);
      log("subscribe API ->", resp);

      await showLocalToast(reg);

      return true;
    } catch (e) {
      err("enableNotifications error:", e);
      throw e;
    }
  };

  // wire the enable button if present
  function wireButton() {
    const btn = document.getElementById("enableNotificationsBtn");
    const promptBox = document.getElementById("notificationPrompt");
    if (!btn) return;
    if (Notification && Notification.permission === "granted" && promptBox) {
      promptBox.classList.add("opacity-0");
      setTimeout(() => promptBox.remove(), 600);
      return;
    }
    if (btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", async () => {
      try {
        await window.enableNotifications();
        // fade away
        const box = document.getElementById("notificationPrompt");
        if (box) {
          box.classList.add("opacity-0");
          setTimeout(() => box.remove(), 600);
        }
      } catch (_) {}
    });
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
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", wireButton, { once: true });
    } else {
      wireButton();
    }
  })();
})();
