(function () {
  // i18n helper 
  function t(key, fallback) {
    const d = window.__i18n && window.__i18n.dict;
    const dict = typeof d === "function" ? d() : d || {};
    return dict[key] ?? fallback ?? key;
  }

  // Cache DOM by ID
  const form = document.getElementById("registerForm");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const roleSelect = document.getElementById("role");
  const errorMsg = document.getElementById("error");
  const togglePwBtn = document.getElementById("togglePassword");
  const toggleConfirmBtn = document.getElementById("toggleConfirmPassword");

  if (
    !form ||
    !phoneInput ||
    !passwordInput ||
    !confirmInput ||
    !roleSelect ||
    !errorMsg ||
    !togglePwBtn ||
    !toggleConfirmBtn
  )
    return;

  function setError(msg) {
    errorMsg.textContent = msg || "";
  }

  function setToggleLabel(btn, input) {
    const isHidden = input.type === "password";
    btn.textContent = isHidden ? t("show", "Show") : t("hide", "Hide");
  }

  // Submit 
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    setError("");

    const phone = (phoneInput.value || "").trim();
    const password = passwordInput.value || "";
    const confirmPassword = confirmInput.value || "";
    const role = roleSelect.value || "";

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
      setError(t("error_required_password", "Password cannot be empty"));
      return;
    }

    var rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,256}$/;
    if (!rules.test(password)) {
      setError(
        t(
          "error_password_rules",
          "Password must be at least 8 characters long including 1 uppercase letter, 1 lowercase letter, and 1 digit."
        )
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(t("error_password_mismatch", "Passwords do not match."));
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, password, role }),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : {};

      if (!res.ok) {
        setError(
          data.error ||
            data.message ||
            t("error_generic", "Something went wrong")
        );
        return;
      }

      if (data.token) {
        localStorage.setItem("onboardingToken", data.token);
      }

      const byRole = {
        Patient: "/patient-onboarding",
        Doctor: "/doctor-onboarding",
        "Family Member": "/family-onboarding",
      };
      window.location.href = byRole[role] || "/patient-onboarding";
    } catch (err) {
      console.error("Register fetch error:", err);
      setError(t("error_network", "Error, please try again"));
    }
  });

  // Show/Hide
  togglePwBtn.addEventListener("click", function (e) {
    e.preventDefault();
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
    setToggleLabel(togglePwBtn, passwordInput);
  });

  toggleConfirmBtn.addEventListener("click", function (e) {
    e.preventDefault();
    confirmInput.type = confirmInput.type === "password" ? "text" : "password";
    setToggleLabel(toggleConfirmBtn, confirmInput);
  });

  // Phone digits-only 
  phoneInput.addEventListener("input", function () {
    const start = phoneInput.selectionStart;
    const end = phoneInput.selectionEnd;
    phoneInput.value = (phoneInput.value || "").replace(/\D/g, "");
    try {
      phoneInput.setSelectionRange(start, end);
    } catch (_) {}
  });

  // initialize labels & update on i18n change
  function initLabels() {
    setToggleLabel(togglePwBtn, passwordInput);
    setToggleLabel(toggleConfirmBtn, confirmInput);
  }
  initLabels();
  window.addEventListener("i18n:change", initLabels);
})();
