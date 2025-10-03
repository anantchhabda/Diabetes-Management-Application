(function () {
  // translation
  function t(key, fallback) {
    const d = window.__i18n && window.__i18n.dict;
    const dict = typeof d === "function" ? d() : d || {};
    return dict[key] ?? fallback ?? key;
  }

  function setErrorOn(form, msg) {
    const errorEl = form.querySelector("#error");
    if (errorEl) errorEl.textContent = msg || "";
  }

  // password constraints validated
  function isValidPassword(pw) {
    const rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,256}$/;
    return rules.test(pw);
  }

  // phone input (digits only, caret-safe)
  document.addEventListener(
    "input",
    function (e) {
      if (e.target && e.target.id === "phone") {
        const input = e.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = (input.value || "").replace(/\D/g, "");
        try { input.setSelectionRange(start, end); } catch (_) {}
      }
    },
    true
  );

  // submit handler
  document.addEventListener(
    "submit",
    async function (e) {
      const form = e.target.closest("#registerForm");
      if (!form) return;
      e.preventDefault();

      const phoneInput = form.querySelector("#phone");
      const passwordInput = form.querySelector("#password");
      const confirmInput = form.querySelector("#confirmPassword");
      const roleSelect = form.querySelector("#role");

      const phone = (phoneInput?.value || "").trim();
      const password = passwordInput?.value || "";
      const confirmPassword = confirmInput?.value || "";
      const role = roleSelect?.value || "";

      // phone: 8–15 digits (matches login)
      if (!/^\d{8,15}$/.test(phone)) {
        return setErrorOn(
          form,
          t("error_invalid_phone", "Please enter a valid phone number (8–15 digits).")
        );
      }

      if (!password) {
        return setErrorOn(form, t("error_required_password", "Password cannot be empty"));
      }

      // enforce password constraints
      if (!isValidPassword(password)) {
        return setErrorOn(
          form,
          t(
            "error_password_rules",
            "Password must be at least 8 characters long including 1 uppercase letter, 1 lowercase letter, and 1 digit."
          )
        );
      }

      if (password !== confirmPassword) {
        return setErrorOn(form, t("error_password_mismatch", "Passwords do not match."));
      }

      // clear any prior errors
      setErrorOn(form, "");

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: phone, password, role }),
        });

        const ct = res.headers.get("content-type") || "";
        const payload = ct.includes("application/json") ? await res.json() : {};

        if (!res.ok) {
          const msg =
            payload.error ||
            payload.message ||
            t("error_generic", "Something went wrong");
          return setErrorOn(form, msg);
        }

        // save onboarding token
        if (payload.token) {
          localStorage.setItem("onboardingToken", payload.token);
        }

        // role based redirection 
        const byRole = {
          "Patient": "/patient-onboarding",
          "Doctor": "/doctor-onboarding",
          "Family Member": "/family-onboarding",
        };
        window.location.href = byRole[role] || "/patient-onboarding";
      } catch (err) {
        console.error("Register fetch error:", err);
        setErrorOn(form, t("error_network", "Error, please try again"));
      }
    },
    true
  );
})();
