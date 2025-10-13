// public/js/patient-homepage.js
(function () {
  if (typeof document === "undefined") return;

  // ---------------------------
  // Helpers
  // ---------------------------
  function getParam(name) {
    try {
      return new URL(location.href).searchParams.get(name);
    } catch {
      return null;
    }
  }
  const VIEW_PATIENT_ID = getParam("patientID");
  const IS_READONLY = getParam("readonly") === "1";

  // Persist patientID for safety
  if (VIEW_PATIENT_ID) {
    try {
      sessionStorage.setItem("viewerPatientID", VIEW_PATIENT_ID);
    } catch {}
  }

  function withViewParams(href) {
    if (!IS_READONLY || !VIEW_PATIENT_ID) return href;
    const url = new URL(href, location.origin);
    if (!url.searchParams.get("patientID"))
      url.searchParams.set("patientID", VIEW_PATIENT_ID);
    if (!url.searchParams.get("readonly"))
      url.searchParams.set("readonly", "1");
    return url.pathname + url.search + url.hash;
  }

  // ---------------------------
  // i18n helpers
  // ---------------------------
  function dict() {
    const d = window.__i18n && window.__i18n.dict;
    return (typeof d === "function" ? d() : d) || {};
  }
  function t(key, fallback) {
    const d = dict();
    return (d && d[key]) != null ? String(d[key]) : fallback;
  }
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

  // ---------------------------
  // Init
  // ---------------------------
  const start = () => init();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  function init() {
    setGreeting();
    wireNav();
    if (IS_READONLY) {
      renderExitReadonlyButton();
      hideReadonlyControls();
      // ⚠️ Banner is handled ONLY by readonly-view.js now (to avoid dupes)
    }

    observeLangChanges(() => {
      setGreeting();
      const exitBtn = document.getElementById("exitReadonlyBtn");
      if (exitBtn) {
        exitBtn.textContent = t("exit_patient_view", "Exit patient page");
      }
    });
  }

  // ---------------------------
  // Greeting logic
  // ---------------------------
  async function setGreeting() {
    const userBtn = document.getElementById("userBtn");
    if (!userBtn) return;

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
        (data?.profile?.name && String(data.profile.name)) ||
        t("guest", "Guest");

      const template = t("helloUser", "Hello, {name}");
      userBtn.textContent = template.replace("{name}", name);
    } catch {
      userBtn.textContent = guestTemplate;
    }
  }

  // ---------------------------
  // Read-only controls
  // ---------------------------
  function hideReadonlyControls() {
    const setRemindersBtn = document.getElementById("setRemindersBtn");
    const viewConnectionsBtn = document.getElementById("viewConnectionsBtn");
    if (setRemindersBtn) setRemindersBtn.classList.add("hidden");
    if (viewConnectionsBtn) viewConnectionsBtn.classList.add("hidden");

    const settingsBtn = document.getElementById("settingsBtn");
    if (settingsBtn) {
      if ("disabled" in settingsBtn) settingsBtn.disabled = true;
      settingsBtn.classList.add("opacity-60", "cursor-not-allowed");
      settingsBtn.addEventListener("click", (e) => e.preventDefault());
    }
  }

  function renderExitReadonlyButton() {
    const btn = document.createElement("button");
    btn.id = "exitReadonlyBtn";
    btn.type = "button";
    btn.className =
      "fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white text-sm px-3 py-2 rounded-md shadow hover:opacity-90";
    btn.textContent = t("exit_patient_view", "Exit patient page");

    btn.addEventListener("click", async () => {
      try {
        const token = localStorage.getItem("authToken") || "";
        const res = await fetch("/api/auth/me", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });
        if (res.ok) {
          const me = await res.json();
          const role = me?.role;
          if (role === "Doctor") return (location.href = "/doctor-connection");
          if (role === "Family Member")
            return (location.href = "/family-connection");
        }
      } catch {}
      if (
        document.referrer &&
        new URL(document.referrer).origin === location.origin
      ) {
        history.back();
      } else {
        location.href = "/doctor-connection";
      }
    });

    document.body.appendChild(btn);
  }

  // ---------------------------
  // Navigation wiring
  // ---------------------------
  function wireNav() {
    function bindClickOnce(
      id,
      to,
      { disableInReadonly = false, allowInReadonly = false } = {}
    ) {
      const el = document.getElementById(id);
      if (!el || el.dataset.bound === "1") return;
      el.dataset.bound = "1";

      if (IS_READONLY && disableInReadonly && !allowInReadonly) {
        if ("disabled" in el) el.disabled = true;
        el.classList.add("opacity-60", "cursor-not-allowed");
        el.addEventListener("click", (e) => e.preventDefault());
        return;
      }

      el.addEventListener("click", (e) => {
        e.preventDefault();
        const dest = withViewParams(to);
        location.href = dest;
      });
    }

    bindClickOnce("logDataBtn", "/log-data", { allowInReadonly: true });
    bindClickOnce("setRemindersBtn", "/reminders", { disableInReadonly: true });
    bindClickOnce("viewConnectionsBtn", "/patient-connection", {
      disableInReadonly: true,
    });
  }
})();
