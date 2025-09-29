(function () {
  const form = document.getElementById("registerForm");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const roleSelect = document.getElementById("role");
  const errorMsg = document.getElementById("error");

  if (!form || !phoneInput || !passwordInput || !confirmInput || !roleSelect || !errorMsg) return;

  // show error
  function setError(msg) {
    errorMsg.textContent = msg || "";
  }

  // phone number digits only
  phoneInput.addEventListener("input", function () {
    const start = phoneInput.selectionStart;
    const end = phoneInput.selectionEnd;
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
    phoneInput.setSelectionRange(start, end);
  });

  // handle form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const phone = (phoneInput.value || "").trim();
    const password = passwordInput.value || "";
    const confirmPassword = confirmInput.value || "";
    const role = roleSelect.value;

    if (!/^\d{7,15}$/.test(phone)) {
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

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({phoneNumber:phone, password: password, role: role})
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || data.message || 'Something went wrong');
        return;
      }
      console.log('User registered:', data);

      //save token to localStorage
      localStorage.setItem('onboardingToken', data.token);

      // redirect based on role
      if (role === 'Patient') {
        window.location.href = "/patient-onboarding";
      } else if (role === 'Doctor') {
        window.location.href = "/doctor-onboarding";
      } else if (role === 'Family') {
        window.location.href = "/family-onboarding";
      }

    } catch (err) {
      console.error('Error', err);
      setError('Error, please try again');
    }

  });
})();
