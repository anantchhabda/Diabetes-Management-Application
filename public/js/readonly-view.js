(function () {
  if (typeof document === "undefined") return;

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
  function whenI18nReady(fn, maxTries = 20) {
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
      if (++tries >= maxTries) return fn();
      setTimeout(tick, 25);
    };
    tick();
  }

  // --- detect readonly from query param ---
  const readonly =
    new URL(window.location.href).searchParams.get("readonly") === "1";

  // --- singleton popup state ---
  let roPopupEl = null;
  let roPopupTimer = null;

  function ensurePopup() {
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

    const el = ensurePopup();
    setPopupText();

    // reset timer
    if (roPopupTimer) {
      clearTimeout(roPopupTimer);
      roPopupTimer = null;
    }
    el.style.opacity = "1";

    // fade out after 3 seconds
    roPopupTimer = setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
        if (roPopupEl === el) roPopupEl = null;
        roPopupTimer = null;
      }, 300);
    }, 3000);
  }

  // --- run on load ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      whenI18nReady(showReadonlyPopup)
    );
  } else {
    whenI18nReady(showReadonlyPopup);
  }

  // --- update on language change ---
  const target = document.documentElement;
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "attributes" && m.attributeName === "lang") {
        whenI18nReady(() => {
          if (readonly) {
            if (roPopupEl) {
              setPopupText();
            } else {
              showReadonlyPopup();
            }
          }
        });
      }
    }
  });
  mo.observe(target, { attributes: true, attributeFilter: ["lang"] });
})();
