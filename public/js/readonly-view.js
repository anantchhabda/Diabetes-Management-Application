(function () {
  if (typeof document === "undefined") return;

  // ✅ Prevent double-initialization if the script is included twice
  if (window.__RO_BANNER_INITED__) return;
  window.__RO_BANNER_INITED__ = true;

  // --- helpers ---
  function dict() {
    const d = window.__i18n && window.__i18n.dict;
    return (typeof d === "function" ? d() : d) || {};
  }
  function t(key, fallback) {
    const d = dict();
    return (d && d[key]) != null ? String(d[key]) : fallback ?? key;
  }
  function currentLang() {
    return document.documentElement.getAttribute("lang") || "en";
  }
  function whenI18nReady(fn, maxTries = 24) {
    const want = currentLang();
    let tries = 0;
    const tick = () => {
      const ready =
        window.__i18n &&
        window.__i18n.lang === want &&
        window.__i18n.dict &&
        Object.keys(
          typeof window.__i18n.dict === "function"
            ? window.__i18n.dict()
            : window.__i18n.dict
        ).length > 0;
      if (ready) return fn();
      if (++tries >= maxTries) return fn(); // fallback once
      setTimeout(tick, 50);
    };
    tick();
  }

  const readonly =
    new URL(window.location.href).searchParams.get("readonly") === "1";

  // --- singleton popup state ---
  let roPopupEl = null;
  let roPopupTimer = null;

  // Cleanup any stale banners (e.g., from very fast navigations)
  function removeAllExistingPopups() {
    try {
      document.querySelectorAll("#roPopup").forEach((n) => n.remove());
    } catch {}
  }

  function ensurePopup() {
    // Remove duplicates if any (extra safety)
    removeAllExistingPopups();

    if (roPopupEl && document.body.contains(roPopupEl)) return roPopupEl;
    const el = document.createElement("div");
    el.id = "roPopup";
    el.className =
      "fixed top-3 left-1/2 -translate-x-1/2 z-[9999] bg-black/80 text-white text-sm px-4 py-2 rounded shadow transition-opacity duration-300";
    el.style.opacity = "1";
    document.body.appendChild(el);
    roPopupEl = el;
    return el;
  }

  function setPopupText() {
    if (!roPopupEl) return;
    roPopupEl.textContent = t(
      "readonly_viewing_patient",
      "You’re viewing a patient page in read-only mode."
    );
  }

  function showReadonlyPopup() {
    if (!readonly) return;

    // ✅ Global once-only guard for this page load
    if (window.__RO_BANNER_SHOWN__) return;
    window.__RO_BANNER_SHOWN__ = true;

    const el = ensurePopup();
    setPopupText();

    if (roPopupTimer) {
      clearTimeout(roPopupTimer);
      roPopupTimer = null;
    }
    el.style.opacity = "1";

    roPopupTimer = setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
        if (roPopupEl === el) roPopupEl = null;
        roPopupTimer = null;
      }, 300);
    }, 3000);
  }

  // --- show once when i18n is ready (prevents EN->NE double fire) ---
  const start = () =>
    whenI18nReady(() => {
      // Queue to next frame to avoid racing with other onload handlers
      requestAnimationFrame(showReadonlyPopup);
    });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  // --- update text on language change (do NOT re-show) ---
  const target = document.documentElement;
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "attributes" && m.attributeName === "lang") {
        whenI18nReady(() => {
          // Only update text if a banner is currently visible
          if (roPopupEl) setPopupText();
          // If no banner, DO NOT show again on lang change
        });
      }
    }
  });
  mo.observe(target, { attributes: true, attributeFilter: ["lang"] });

  // --- handle back/forward cache restores cleanly ---
  window.addEventListener("pageshow", (e) => {
    // If BFCache restore happens, do NOT re-show; the guard prevents it anyway.
    // But we *do* want to refresh the text if element exists.
    if (e.persisted && roPopupEl) setPopupText();
  });
})();
