(function () {
  const form = document.getElementById("loginForm");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("error");
  const toggleBtn = document.getElementById("togglePassword");

  if (!form || !phoneInput || !passwordInput || !errorMsg || !toggleBtn) return;

  // i18n helper
  function t(key, fallback) {
    const d = window.__i18n && window.__i18n.dict;
    const dict = typeof d === "function" ? d() : d || {};
    return dict[key] ?? fallback ?? key;
  }

  function setError(msg) {
    errorMsg.textContent = msg || "";
  }

  function setToggleLabel() {
    const isPasswordHidden = passwordInput.type === "password";
    toggleBtn.textContent = isPasswordHidden
      ? t("show", "Show")
      : t("hide", "Hide");
  }

  // purge any cached log-data drafts & viewer context
  function purgeLogDrafts() {
    try {
      // viewer context
      sessionStorage.removeItem("viewerPatientID");
      // log-data drafts / old keys
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.startsWith("logdata:v2:") ||
            k.startsWith("__logdata_") ||
            k === "__active_profile_id__")
        ) {
          localStorage.removeItem(k);
        }
      }
    } catch {}
  }

  // hard clear of any prior session artifacts
  function clearAuth() {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("onboardingToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      sessionStorage.removeItem("viewerPatientID");
      document.cookie = "auth=; Max-Age=0; path=/";
    } catch (_) {}
  }

  // submit
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    setError("");

    const phone = (phoneInput.value || "").trim();
    const password = passwordInput.value || "";

    if (!/^\d{8,15}$/.test(phone)) {
      setError(
        t(
          "error_invalid_phone",
          "Please enter a valid phone number (8–15 digits)."
        )
      );
      return;
    }
    if (!password) {
      setError(t("error_required", "Password cannot be empty"));
      return;
    }

    try {
      // always clear any stale tokens BEFORE we attempt a new login
      clearAuth();

      const res = await fetch(`/api/auth/login?_=${Date.now()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ phoneNumber: phone, password }),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : {};

      if (!res.ok) {
        setError(
          data.error || data.message || t("error_generic", "Login failed")
        );
        return;
      }

      // If user must complete onboarding:
      if (data.token) {
        localStorage.removeItem("authToken");
        localStorage.setItem("onboardingToken", data.token);
        purgeLogDrafts(); // reset session artifacts on account switch
        if (data.role === "Patient") {
          window.location.href = "/patient-onboarding";
          return;
        }
        if (data.role === "Doctor") {
          window.location.href = "/doctor-onboarding";
          return;
        }
        if (data.role === "Family Member") {
          window.location.href = "/family-onboarding";
          return;
        }
      }

      // Fully onboarded -> got final session token
      if (data.authToken) {
        localStorage.removeItem("onboardingToken");
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("userRole", data.role || "");
        purgeLogDrafts(); // reset drafts for new user

        // 🔑 Store profile namespace for offline use
        try {
          if (data.profileId) {
            localStorage.setItem(
              "__active_profile_id__",
              String(data.profileId)
            );
          }
          // Minimal userData cache so homepage/log-data can restore namespace offline
          const cachedUser = {
            role: data.role || "",
            profile: { profileId: data.profileId || null, name: "" },
          };
          localStorage.setItem("userData", JSON.stringify(cachedUser));
        } catch {}

        if (data.role === "Patient") {
          window.location.href = "/patient-homepage";
          return;
        }
        if (data.role === "Doctor") {
          window.location.href = "/doctor-homepage";
          return;
        }
        if (data.role === "Family Member") {
          window.location.href = "/family-homepage";
          return;
        }
      }

      setError(
        t("error_generic", "Unexpected server response, please try again")
      );
    } catch (err) {
      console.error("Login fetch error:", err);
      setError(t("error_network", "Something went wrong, please try again"));
    }
  });

  // hide/unhide
  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    setToggleLabel();
  });

  // validation
  phoneInput.addEventListener("input", function () {
    const start = phoneInput.selectionStart;
    const end = phoneInput.selectionEnd;
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
    try {
      phoneInput.setSelectionRange(start, end);
    } catch (_) {}
  });

  setToggleLabel();
  window.addEventListener("i18n:change", setToggleLabel);
})();
