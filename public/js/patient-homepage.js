// public/js/patient-homepage.js
(function () {
  if (typeof document === "undefined") return;

  // ---------------------------
  // Query param helpers (read-only view)
  // ---------------------------
  function getParam(name) {
    try {
      return new URL(location.href).searchParams.get(name);
    } catch {
      return null;
    }
  }
  const VIEW_PATIENT_ID = getParam("patientID"); // Patient.profileId
  const IS_READONLY = getParam("readonly") === "1";

  // Persist patientID for safety so /log-data can recover if params are lost
  if (VIEW_PATIENT_ID) {
    try {
      sessionStorage.setItem("viewerPatientID", VIEW_PATIENT_ID);
    } catch {}
  }

  function withViewParams(href) {
    if (!IS_READONLY || !VIEW_PATIENT_ID) return href;
    const url = new URL(href, location.origin);
    if (!url.searchParams.get("patientID")) {
      url.searchParams.set("patientID", VIEW_PATIENT_ID);
    }
    if (!url.searchParams.get("readonly")) {
      url.searchParams.set("readonly", "1");
    }
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    setGreeting();
    wireNav();
    if (IS_READONLY) {
      renderExitReadonlyButton();
      showReadonlyPopup();
      hideReadonlyControls();
    }
    observeLangChanges(() => {
      setGreeting();
      // live-translate the Exit button label if it exists
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
        (data &&
          data.profile &&
          data.profile.name &&
          String(data.profile.name)) ||
        t("guest", "Guest");

      const template = t("helloUser", "Hello, {name}");
      userBtn.textContent = template.replace("{name}", name);
    } catch {
      userBtn.textContent = guestTemplate;
    }
  }

  // ---------------------------
  // Read-only UI helpers
  // ---------------------------
  function hideReadonlyControls() {
    // Hide "Set Reminders" & "View Connections" when readonly
    const setRemindersBtn = document.getElementById("setRemindersBtn");
    const viewConnectionsBtn = document.getElementById("viewConnectionsBtn");
    if (setRemindersBtn) setRemindersBtn.classList.add("hidden");
    if (viewConnectionsBtn) viewConnectionsBtn.classList.add("hidden");

    // Optionally disable a settings icon/button if present
    const settingsBtn = document.getElementById("settingsBtn");
    if (settingsBtn) {
      if ("disabled" in settingsBtn) settingsBtn.disabled = true;
      settingsBtn.classList.add("opacity-60", "cursor-not-allowed");
      settingsBtn.addEventListener("click", (e) => e.preventDefault());
    }
  }

  function showReadonlyPopup() {
    // Translatable one-shot banner
    const wrap = document.createElement("div");
    wrap.className =
      "fixed top-3 left-1/2 -translate-x-1/2 z-[9999] bg-black/80 text-white text-sm px-4 py-2 rounded shadow transition-opacity";
    wrap.textContent = t(
      "readonly_banner",
      "You’re viewing a patient page in read-only mode."
    );
    document.body.appendChild(wrap);
    setTimeout(() => {
      wrap.classList.add("opacity-0");
      setTimeout(() => wrap.remove(), 600);
    }, 3000);
  }

  function renderExitReadonlyButton() {
    // Add a small sticky exit button (only in read-only)
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
          // Send to a role-appropriate landing we KNOW exists
          if (role === "Doctor") return (location.href = "/doctor-connection");
          if (role === "Family Member")
            return (location.href = "/family-connection");
        }
      } catch {}
      // Fallback: best-effort back navigation
      if (
        document.referrer &&
        new URL(document.referrer).origin === location.origin
      ) {
        history.back();
      } else {
        // If no referrer, land them on their connections list as a safe default
        location.href = "/doctor-connection";
      }
    });

    document.body.appendChild(btn);
  }

  // ---------------------------
  // Navigation wiring
  // ---------------------------
  function wireNav() {
    // helper: bind single click handler
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

    // ✅ Forward patientID + readonly=1 into /log-data in read-only mode
    bindClickOnce("logDataBtn", "/log-data", { allowInReadonly: true });

    // These are hidden in read-only; still wire in normal mode
    bindClickOnce("setRemindersBtn", "/reminders", { disableInReadonly: true });
    bindClickOnce("viewConnectionsBtn", "/patient-connection", {
      disableInReadonly: true,
    });
  }
})();
