(function () {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const SW_URL = "/sw.js";

  // wait for the page to finish loading
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register(SW_URL, { scope: "/" })
      .then((reg) => {
        console.log("Service Worker registered:", reg.scope);

        // if an update is waiting, activate immediately
        if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });

        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          if (!newSW) return;
          newSW.addEventListener("statechange", () => {
            if (newSW.state === "installed") {
              console.log("New Service Worker installed");
            }
          });
        });
      })
      .catch((err) =>
        console.error("Service Worker registration failed:", err)
      );
  });
})();
