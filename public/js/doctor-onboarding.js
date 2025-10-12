(function () {
  const form = document.getElementById("onboardingForm");
  const savedMsg = document.getElementById("savedMsg");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form) return;

  // clear pre filled texts
  if (savedMsg) savedMsg.textContent = "";

  // avoid double submits
  let inFlight = false;

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

    if (inFlight) return;
    inFlight = true;

    // clear msg and disable button
    if (savedMsg) savedMsg.textContent = "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
    }

    const raw = Object.fromEntries(new FormData(form));
    // trim strings
    const data = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [
        k,
        typeof v === "string" ? v.trim() : v,
      ])
    );

    const errors = {};

    const required = [
      ["fullName", ["error_fullName", "error_required"]],
      ["dateOfBirth", ["error_dateOfBirth", "error_dob", "error_required"]],
      [
        "clinicAddress",
        ["error_clinicAddress", "error_address", "error_required"],
      ],
      ["clinicName", ["error_clinicName", "error_required"]],
    ];

    required.forEach(([field, keys]) => {
      if (!data[field] || String(data[field]).trim() === "") {
        errors[field] = tMulti(keys, "This field is required.");
      }
    });

    // reset previous error messages
    form
      .querySelectorAll("p[id^='error-']")
      .forEach((p) => (p.textContent = ""));

    // show new errors
    Object.entries(errors).forEach(([field, msg]) => {
      const el = document.getElementById(`error-${field}`);
      if (el) el.textContent = msg;
    });

    if (Object.keys(errors).length > 0) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
      }
      inFlight = false;
      return;
    }

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
          clinicName: data.clinicName,
          clinicAddress: data.clinicAddress,
        }),
      });

      const { data: result, text } = await readResponseSafe(res);

      if (!res.ok) {
        const serverMsg =
          (result && (result.error || result.message)) ||
          (text && text.trim()) ||
          null;
        if (savedMsg)
          savedMsg.textContent =
            serverMsg || t("onboarding_failed", "Onboarding failed");
        return;
      }

      const authToken = result && (result.authToken || result.token);
      if (authToken) localStorage.setItem("authToken", authToken);

      if (savedMsg)
        savedMsg.textContent = t(
          "onboarding_success_redirect",
          "Onboarding successful! Redirecting to homepage"
        );

      // show message briefly, then redirect
      setTimeout(() => {
        window.location.href = "/doctor-homepage";
      }, 900);
    } catch (err) {
      console.error("Onboarding fetch error:", err);
      if (savedMsg)
        savedMsg.textContent = t(
          "error_network",
          "Network error, please try again."
        );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
      }
      inFlight = false;
    }
  });
})();
