(function () {
  const form = document.getElementById("onboardingForm");
  const savedMsg = document.getElementById("savedMsg");
  const currentYear = new Date().getFullYear();

  if (!form) return;

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

    // clear previous saved message
    if (savedMsg) savedMsg.textContent = "";

    const data = Object.fromEntries(new FormData(form));
    const errors = {};

    // required fields, skipping readonly fields 
    [
      "fullName",
      "dateOfBirth",
      "clinicAddress",
      "clinicName",
    ].forEach((f) => {
      if (!data[f] || data[f].trim() === "") {
        errors[f] = "Required";
      }
    });

    // reset all previous error messages
    form
      .querySelectorAll("p[id^='error-']")
      .forEach((p) => (p.textContent = ""));

    // show new errors
    Object.entries(errors).forEach(([key, msg]) => {
      const el = document.getElementById(`error-${key}`);
      if (el) el.textContent = msg;
    });

    // stop if errors
    if (Object.keys(errors).length > 0) return;

    try {
      const token = localStorage.getItem('onboardingToken');
      if (!token) {
        if (savedMsg)
          savedMsg.textContent = 'Session expired, please register again';
        return;
      }
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.fullName,
          dob: data.dateOfBirth,
          clinicName: data.clinicName,
          clinicAddress: data.clinicAddress,
        }),
      });
      const {data: result, text} = await readResponseSafe(res);
      if (!res.ok) {
        const msg =
          (result && (result.error || result.message)) ||
          (text && text.trim()) ||
          'Onboarding failed';
        if (savedMsg) savedMsg.textContent = msg;
        return;
      }
      const authToken = result && (result.authToken || result.token);
      if (authToken) localStorage.setItem('authToken', authToken);
      if (savedMsg)
        savedMsg.textContent = 'Onboarding successful! Redirecting to hompage';
      window.location.href = "/doctor-homepage";
    } catch (err) {
      console.error('Onboarding fetch error:', err);
      if (savedMsg) savedMsg.textContent = 'Error, please try again';
    }
  });
})();
