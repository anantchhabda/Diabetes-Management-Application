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
    toggleBtn.textContent = isPasswordHidden ? t("show", "Show") : t("hide", "Hide");
  }

  // submit
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    setError("");

    const phone = (phoneInput.value || "").trim();
    const password = passwordInput.value || "";

    
    if (!/^\d{8,15}$/.test(phone)) {
      setError(t("error_invalid_phone", "Please enter a valid phone number (8–15 digits)."));
      return;
    }
    if (!password) {
      setError(t("error_required", "Password cannot be empty"));
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, password })
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : {};

      if (!res.ok) {
        setError(data.error || data.message || t("error_generic", "Login failed"));
        return;
      }

      // onboarding token
      if (data.token) {
        localStorage.setItem("onboardingToken", data.token);
        if (data.role === "Patient")      { window.location.href = "/patient-onboarding"; return; }
        if (data.role === "Doctor")       { window.location.href = "/doctor-onboarding";  return; }
        if (data.role === "Family Member"){ window.location.href = "/family-onboarding";  return; }
      }

      if (data.authToken) {
        localStorage.setItem("authToken", data.authToken);
        if (data.role === "Patient")      { window.location.href = "/patient-homepage"; return; }
        if (data.role === "Doctor")       { window.location.href = "/doctor-homepage";  return; }
        if (data.role === "Family Member"){ window.location.href = "/family-homepage";  return; }
      }

      setError(t("error_generic", "Unexpected server response, please try again"));
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
    try { phoneInput.setSelectionRange(start, end); } catch (_) {}
  });

  setToggleLabel();
  window.addEventListener("i18n:change", setToggleLabel);
})();
