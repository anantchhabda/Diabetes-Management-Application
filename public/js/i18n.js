(function () {
  const LANG_KEY = "app.lang";
  const SUPPORTED = ["en", "ne"];
  const CACHE = Object.create(null);

  // formatter for greeting
  function formatString(tpl, vars = {}) {
    if (typeof tpl !== "string") return tpl;
    return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
  }

  function getLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (_) {}
    const nav = (navigator.language || "").split("-")[0];
    return SUPPORTED.includes(nav) ? nav : "en";
  }

  async function loadDict(lang) {
    if (CACHE[lang]) return CACHE[lang];
    try {
      const res = await fetch(`/i18n/${lang}.json`, { cache: "no-store" });
      if (!res.ok) throw new Error(res.statusText);
      const dict = await res.json();
      CACHE[lang] = dict;
      return dict;
    } catch (e) {
      console.error("[i18n] failed to load", lang, e);
      if (lang !== "en") return loadDict("en");
      return {};
    }
  }

  function applyDict(dict, root = document) {
    // text content
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.getAttribute("data-i18n-mode") === "manual") return; // opt-out
      const key = el.getAttribute("data-i18n");
      const v = dict[key];
      if (v != null) el.textContent = String(v);
    });

    // placeholder
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      if (el.getAttribute("data-i18n-mode") === "manual") return;
      const key = el.getAttribute("data-i18n-placeholder");
      const v = dict[key];
      if (v != null) el.setAttribute("placeholder", String(v));
    });

    // title
    root.querySelectorAll("[data-i18n-title]").forEach((el) => {
      if (el.getAttribute("data-i18n-mode") === "manual") return;
      const key = el.getAttribute("data-i18n-title");
      const v = dict[key];
      if (v != null) el.setAttribute("title", String(v));
    });

    // <option> labels
    root.querySelectorAll("option[data-i18n]").forEach((opt) => {
      if (opt.getAttribute("data-i18n-mode") === "manual") return;
      const key = opt.getAttribute("data-i18n");
      const v = dict[key];
      if (v != null) opt.textContent = String(v);
    });
  }

  function reflectActiveButtons(lang) {
    const enBtn = document.getElementById("lang-en");
    const neBtn = document.getElementById("lang-ne");
    [enBtn, neBtn].forEach((btn) => {
      if (btn) {
        btn.classList.remove("ring-2");
        btn.setAttribute("aria-pressed", "false");
      }
    });
    const active = lang === "ne" ? neBtn : enBtn;
    if (active) {
      active.classList.add("ring-2");
      active.setAttribute("aria-pressed", "true");
    }
  }

  async function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = "en";
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (_) {}

    try {
      document.documentElement.lang = lang;
    } catch (_) {}

    const dict = await loadDict(lang);
    // expose current dict for scripts
    window.__i18n = { lang, dict };

    // apply translations to DOM
    applyDict(dict, document);

    // reflect active UI lang buttons
    reflectActiveButtons(lang);

    // let pages know language changed so they can re-render dynamic strings
    try {
      window.dispatchEvent(
        new CustomEvent("i18n:changed", { detail: { lang } })
      );
    } catch (_) {}
  }

  function wireButtons() {
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      if (!btn.dataset.i18nWired) {
        btn.dataset.i18nWired = "1";
        btn.addEventListener("click", () => {
          const lang = btn.getAttribute("data-lang");
          setLanguage(lang);
        });
      }
    });
  }

  async function init() {
    if (window.__i18nInitDone) return;
    window.__i18nInitDone = true;

    const lang = getLang();
    await setLanguage(lang);
    wireButtons();
  }

  // run post hydration to reduce hydration mismatches
  function safeInit() {
    const go = () => init();
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 1000 });
    else setTimeout(go, 0);
  }

  if (typeof window !== "undefined") {
    if (document.readyState === "complete") safeInit();
    else window.addEventListener("load", safeInit, { once: true });
  }

  // Public helpers
  window.__i18nFormat = (key, vars = {}) => {
    const dict = (window.__i18n && window.__i18n.dict) || {};
    const raw = dict[key];
    if (raw == null) return null;
    return formatString(raw, vars);
  };

  window.__t = (key, fallback) => {
    const dict = (window.__i18n && window.__i18n.dict) || {};
    return key in dict ? dict[key] : fallback ?? key;
  };
})();
