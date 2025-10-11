(function () {
  if (typeof document === "undefined") return;

  //i18n helpers
  function getDict() {
    return (window.__i18n && window.__i18n.dict) || {};
  }

  function t(key, fallback) {
    const dict = getDict();
    return (dict && dict[key]) != null ? String(dict[key]) : fallback;
  }

  // observe html lang then render change
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

  // init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    setGreeting();
    wireNav();
    observeLangChanges(setGreeting); // refresh greeting on language change
  }

  // greeting logic
  async function setGreeting() {
    const userBtn = document.getElementById("userBtn");
    if (!userBtn) return;

    // show Hello Dr..
    const waitingTemplate = t("hello_doctor_ellipsis", "Hello, Dr. ...");
    userBtn.textContent = waitingTemplate;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // fall back to waitingTemplate if not logged in
        userBtn.textContent = waitingTemplate;
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
        userBtn.textContent = waitingTemplate;
        return;
      }

      const data = await res.json();
      const name =
        (data &&
          data.profile &&
          data.profile.name &&
          String(data.profile.name)) ||
        t("guest", "Guest");

      // template supports 
      const template = t("hello_doctor_user", "Hello, Dr. {name}");
      userBtn.textContent = template.replace("{name}", name);
    } catch {
      userBtn.textContent = waitingTemplate;
    }
  }

  // navigation - binds once
  function wireNav() {
    function bindClickOnce(id, to) {
      const el = document.getElementById(id);
      if (!el || el.dataset.bound === "1") return;
      el.dataset.bound = "1";
      el.addEventListener("click", () => {
        window.location.href = to;
      });
    }

    bindClickOnce("viewPatientsBtn", "/doctor-connection");
  }
})();
