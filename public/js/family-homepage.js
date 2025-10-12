(function () {
  if (typeof document === "undefined") return;

  // i18n helpers
  function getDict() {
    const d = window.__i18n && window.__i18n.dict;
    return (typeof d === "function" ? d() : d) || {};
  }
  function t(key, fallback) {
    const dict = getDict();
    return (dict && dict[key]) != null ? String(dict[key]) : fallback;
  }

  // observe html lang and then render
  function observeLangChanges(onChange) {
    try {
      const target = document.documentElement;
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === "attributes" && m.attributeName === "lang") onChange();
        }
      });
      mo.observe(target, { attributes: true, attributeFilter: ["lang"] });
    } catch (_) {}
  }

  //API helpers
  function buildAuthHeaders() {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  async function getUserName() {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: buildAuthHeaders(),
        cache: "no-store",
      });
      if (!res.ok) return "Guest";
      const data = await res.json();
      return (data && data.profile && data.profile.name) || "Guest";
    } catch {
      return "Guest";
    }
  }

  // greeting
  async function setGreeting() {
    const userBtn = document.getElementById("userBtn");
    if (!userBtn) return;

    const guestTemplate = t("helloGuest", "Hello, Guest");

    try {
      const name = await getUserName();
      const safeName = name ? String(name) : t("guest", "Guest");
      const template = t("helloUser", "Hello, {name}");
      userBtn.textContent = template.replace("{name}", safeName);
    } catch {
      userBtn.textContent = guestTemplate;
    }
  }

  // navigation
  function wireNav() {
    const btn = document.getElementById("viewPatientsBtn");
    if (!btn || btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      window.location.href = "/family-connection";
    });
  }

  //init
  function init() {
    setGreeting();
    wireNav();
    observeLangChanges(setGreeting);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
