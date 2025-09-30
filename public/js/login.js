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

  // phone number digits only
  phoneInput.addEventListener("input", function () {
    const start = phoneInput.selectionStart;
    const end = phoneInput.selectionEnd;
    phoneInput.value = phoneInput.value.replace(/\D/g, "");
    phoneInput.setSelectionRange(start, end);
  });

  // password hide unhide
  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtn.textContent = isPassword ? "Hide" : "Show";
  });

  // handle form submition 
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    setError("");

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

    try {
       const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({phoneNumber: phone, password: password}),
       });
       const data = await res.json();
       if (!res.ok) {
        setError(data.error || data.message || 'Login failed');
        return;
       }
       //check scope onboarding or auth
       if (data.token) {
        //onboarding flow
        localStorage.setItem('onboardingToken', data.token);
        if (data.role == 'Patient') {
          window.location.href = '/patient-onboarding';
        } else if (data.role == 'Doctor') {
          window.location.href = '/doctor-onboarding';
        } else if (data.role == 'Family Member') {
          window.location.href = '/family-onboarding';
        }
        return;
       } else if (data.authToken) {
        //completed user
        localStorage.setItem('authToken', data.authToken);
        if (data.role == 'Patient') {
          window.location.href = '/patient-homepage';
        } else if (data.role == 'Doctor') {
          window.location.href = '/doctor-homepage';
        } else if (data.role == 'Family Member') {
          window.location.href = '/family-homepage';
        }
        return;
       }
       setError('Unexpected server response, please try again');
       } catch (err) {
        console.error('Error:', err);
        setError('Something went wrong, please try again');
       }

  });


})();
