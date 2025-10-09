(function () {
  if (typeof document === "undefined") return;

  // helpers for i18n translation
  function getDict() {
    // i18n set window
    return (window.__i18n && window.__i18n.dict) || {};
  }

  function t(key, fallback) {
    const dict = getDict();
    return (dict && dict[key]) != null ? String(dict[key]) : fallback;
  }

  // observe html lang so we can change lang
  function observeLangChanges(onChange) {
    try {
      const target = document.documentElement;
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === "attributes" && m.attributeName === "lang") {
            onChange();
          }
        }
      });
      mo.observe(target, { attributes: true, attributeFilter: ["lang"] });
    } catch (_) {}
  }

  // init sequence on loading
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    setGreeting(); // 
    wireNav(); // 
    observeLangChanges(setGreeting); // refresh greeting on language change
  }

  // logic for greeting
  async function setGreeting() {
    const userBtn = document.getElementById("userBtn");
    if (!userBtn) return;

    // default guest text
    const guestTemplate = t("helloGuest", "Hello, Guest");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        userBtn.textContent = guestTemplate;
        return;
      }

      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        userBtn.textContent = guestTemplate;
        return;
      }

      const data = await res.json();
      const name =
        (data &&
          data.profile &&
          data.profile.name &&
          String(data.profile.name)) ||
        t("guest", "Guest");

      // template to support name 
      const template = t("helloUser", "Hello, {name}");
      userBtn.textContent = template.replace("{name}", name);
    } catch {
      userBtn.textContent = guestTemplate;
    }
  }

  function wireNav() {
    // avoid double binding
    function bindClickOnce(id, to) {
      const el = document.getElementById(id);
      if (!el || el.dataset.bound === "1") return;
      el.dataset.bound = "1";
      el.addEventListener("click", () => {
        window.location.href = to;
      });
    }

    bindClickOnce("logDataBtn", "/log-data");
    bindClickOnce("setRemindersBtn", "/reminders");
    bindClickOnce("viewConnectionsBtn", "/patient-connection");
  }
})();
