(function () {
  const form = document.getElementById("onboardingForm");
  const savedMsg = document.getElementById("savedMsg");
  const currentYear = new Date().getFullYear();

  if (!form) return;

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
      "sex",
      "fullAddress",
      "yearOfDiagnosis",
      "diagnosisType",
    ].forEach((f) => {
      if (!data[f] || data[f].trim() === "") {
        errors[f] = "Required";
      }
    });

    // year validation..is it required?
    if (data.yearOfDiagnosis) {
      const y = Number(data.yearOfDiagnosis);
      if (!Number.isInteger(y) || y < 1900 || y > currentYear) {
        errors.yearOfDiagnosis = `Enter a year between 1900 and ${currentYear}`;
      }
    }

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

    console.log("Submitting onboarding form...");
    console.log("Form data:", data);

    try {
      const token = localStorage.getItem('onboardingToken');
      if (!token) {
        savedMsg.textContent = 'Session expired, please register again'
        return;
      }
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, //send token
        },
        body: JSON.stringify({
          name: data.fullName,
          dob: data.dateOfBirth,
          sex: data.sex,
          address: data.fullAddress,
          yearOfDiag: data.yearOfDiagnosis,
          typeOfDiag: data.diagnosisType,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        savedMsg.textContent = result.error || 'Onboarding failed';
        return;
      }
      //save new auth token
      localStorage.setItem('authToken', result.authToken);
      
      //success feddback
      savedMsg.textContent = 'Onboarding successful! Redirecting to homepage';
      
      //redirect to [role] homepage
      setTimeout(() => {
        window.location.href = "/homepage";
      }, 1200);
    } catch (err) {
      console.error('Error', err);
      savedMsg.textContent = 'Error, please try again';
    }
  });
})();
