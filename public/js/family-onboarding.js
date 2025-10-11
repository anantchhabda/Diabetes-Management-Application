(function () {
  if (typeof document === "undefined") return;

  // helpers
  function t(key, fallback) {
    try {
      const dict = (window.__i18n && window.__i18n.dict) || {};
      if (key in dict) return String(dict[key]);
    } catch (_) {}
    return fallback != null ? String(fallback) : key;
  }
  function tMulti(keys, fallback) {
    for (const k of keys) {
      const val = t(k, null);
      if (val && val !== k) return val;
    }
    return fallback != null ? String(fallback) : keys[0] || "";
  }

  // JWT payload decode
  function decodeJwtPayload(token) {
    try {
      const part = token.split(".")[1] || "";
      const b64 =
        part.replace(/-/g, "+").replace(/_/g, "/") +
        "===".slice((part.length + 3) % 4);
      const json = atob(b64);
      return JSON.parse(json);
    } catch (_) {
      return null;
    }
  }

  // Prefill Family ID / Phone after DOM is ready
  function prefillFromToken() {
    try {
      const token = localStorage.getItem("onboardingToken");
      if (!token) return;

      const payload = decodeJwtPayload(token) || {};
      const profileId = payload.profileId || payload.id || "";
      const phone = payload.phoneNumber || payload.phone || "";

      const familyIdInput = document.getElementById("familyId");
      const phoneInput = document.getElementById("phone");
      if (familyIdInput) familyIdInput.value = profileId;
      if (phoneInput) phoneInput.value = phone;
    } catch (e) {
      console.error("[family-onboarding] prefill error:", e);
    }
  }

  // form handling
  function setupForm() {
    const form = document.getElementById("onboardingForm");
    const savedMsg = document.getElementById("savedMsg");
    if (!form) return;

    async function readResponseSafe(response) {
      const ct =
        (response.headers &&
          response.headers.get &&
          response.headers.get("content-type")) ||
        "";
      if (ct.includes("application/json")) {
        try {
          return { data: await response.json(), text: null };
        } catch (_) {}
      }
      try {
        return { data: null, text: await response.text() };
      } catch (_) {}
      return { data: null, text: null };
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (savedMsg) savedMsg.textContent = "";

      const data = Object.fromEntries(new FormData(form));
      const errors = {};

      const required = [
        ["fullName", ["error_fullName", "error_required"]],
        ["dateOfBirth", ["error_dateOfBirth", "error_dob", "error_required"]],
        [
          "fullAddress",
          ["error_fullAddress", "error_address", "error_required"],
        ],
      ];

      required.forEach(([field, keys]) => {
        if (!data[field] || String(data[field]).trim() === "") {
          errors[field] = tMulti(keys, "This field is required.");
        }
      });

      form
        .querySelectorAll("p[id^='error-']")
        .forEach((p) => (p.textContent = ""));
      Object.entries(errors).forEach(([field, msg]) => {
        const el = document.getElementById(`error-${field}`);
        if (el) el.textContent = msg;
      });

      if (Object.keys(errors).length > 0) return;

      try {
        const token = localStorage.getItem("onboardingToken");
        if (!token) {
          if (savedMsg)
            savedMsg.textContent = t(
              "error_session_expired",
              "Session expired, please register again"
            );
          return;
        }

        const res = await fetch("/api/auth/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.fullName,
            dob: data.dateOfBirth,
            address: data.fullAddress,
          }),
        });

        const { data: result, text } = await readResponseSafe(res);

        if (!res.ok) {
          const msg =
            (result && (result.error || result.message)) ||
            (text && text.trim()) ||
            t("onboarding_failed", "Onboarding failed");
          if (savedMsg) savedMsg.textContent = msg;
          return;
        }

        const authToken = result && (result.authToken || result.token);
        if (authToken) localStorage.setItem("authToken", authToken);

        if (savedMsg)
          savedMsg.textContent = t(
            "onboarding_success_redirect",
            "Onboarding successful! Redirecting to homepage"
          );
        window.location.href = "/family-homepage";
      } catch (err) {
        console.error("[family-onboarding] fetch error:", err);
        if (savedMsg)
          savedMsg.textContent = t(
            "error_network",
            "Network error, please try again."
          );
      }
    });
  }

  // init
  function init() {
    prefillFromToken();
    setupForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
