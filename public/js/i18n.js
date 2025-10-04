(function () {
  const LANG_KEY = "app.lang";
  const SUPPORTED = ["en", "ne"];
  const CACHE = {};

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
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = String(v);
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n-placeholder")];
      if (v != null) el.setAttribute("placeholder", String(v));
    });
    root.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n-title")];
      if (v != null) el.setAttribute("title", String(v));
    });
    root.querySelectorAll("option[data-i18n]").forEach((opt) => {
      const v = dict[opt.getAttribute("data-i18n")];
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
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    const dict = await loadDict(lang);
    window.__i18n = { lang, dict };
    applyDict(dict, document);
    reflectActiveButtons(lang);
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

  // run post hydration to resolve hydration errors
  function safeInit() {
    const go = () => init();
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 1000 });
    else setTimeout(go, 0);
  }
  if (document.readyState === "complete") safeInit();
  else window.addEventListener("load", safeInit, { once: true });
})();
