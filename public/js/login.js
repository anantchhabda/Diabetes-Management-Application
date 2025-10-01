(function () {
  const form = document.getElementById("loginForm");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("error");
  const toggleBtn = document.getElementById("togglePassword");

  if (!form || !phoneInput || !passwordInput || !errorMsg || !toggleBtn) return;

  function t(key, fallback) {
    const dict = (window.__i18n && window.__i18n.dict) || {};
    return dict[key] || fallback || key;
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

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const phone = (phoneInput.value || "").trim();
    const password = passwordInput.value || "";

    if (!/^\d{7,15}$/.test(phone)) {
      setError(
        t(
          "error_invalid_phone",
          "Please enter a valid phone number (7–15 digits)."
        )
      );
      return;
    }

    if (!password) {
      setError(t("error_required", "Password cannot be empty"));
      return;
    }

    setError("");
    alert(`Logging in with:\nPhone: ${phone}\nPassword: ${password}`);
    window.location.href = "/homepage";
  });

  // password hide/unhide
  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    setToggleLabel();
  });

  // phone number digits only
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
