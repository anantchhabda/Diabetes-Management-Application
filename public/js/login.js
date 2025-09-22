(function () {
  const form = document.getElementById("loginForm");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const errorMsg = document.getElementById("error");
  const toggleBtn = document.getElementById("togglePassword");

  if (!form || !phoneInput || !passwordInput || !errorMsg || !toggleBtn) return;

  // show error
  function setError(msg) {
    errorMsg.textContent = msg || "";
  }

  // handle form submition 
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const phone = (phoneInput.value || "").trim();
    const password = passwordInput.value || "";

    if (!/^\d{7,15}$/.test(phone)) {
      setError("Please enter a valid phone number (7–15 digits)");
      return;
    }

    if (!password) {
      setError("Password cannot be empty");
      return;
    }

    setError("");
    alert(`Logging in with:\nPhone: ${phone}\nPassword: ${password}`);
  });

  // password hide unhide
  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtn.textContent = isPassword ? "Hide" : "Show";
  });

  // phone number digits only
  phoneInput.addEventListener("input", function () {
    const start = phoneInput.selectionStart;
    const end = phoneInput.selectionEnd;
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
    phoneInput.setSelectionRange(start, end);
  });
})();
