document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const roleSelect = document.getElementById("role");
  const errorMsg = document.getElementById("error");

  function setError(msg) {
    errorMsg.textContent = msg || "";
  }

  //phone input only digits
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
  });

  // validate form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const role = roleSelect.value;

    if (!/^[0-9]{7,15}$/.test(phone)) {
      setError("Please enter a valid phone number (7–15 digits)");
      return;
    }

    if (!password) {
      setError("Password cannot be empty");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    alert(`Registering with:\nPhone: ${phone}\nRole: ${role}`);
  });
});
