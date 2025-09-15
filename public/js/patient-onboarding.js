(function () {
  const form = document.getElementById("onboardingForm");
  const savedMsg = document.getElementById("savedMsg");
  const currentYear = new Date().getFullYear();

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    savedMsg.textContent = "";

    const data = Object.fromEntries(new FormData(form));
    const errors = {};

    // fields
    [
      "fullName",
      "dateOfBirth",
      "sex",
      "phone",
      "fullAddress",
      "yearOfDiagnosis",
      "diagnosisType",
    ].forEach((f) => {
      if (!data[f] || data[f].trim() === "") {
        errors[f] = "Required";
      }
    });

    // validate phone
    if (data.phone && !/^\+?[0-9 ()-]{7,}$/.test(data.phone)) {
      errors.phone = "Invalid phone number";
    }

    // validate year
    if (data.yearOfDiagnosis) {
      const y = Number(data.yearOfDiagnosis);
      if (!Number.isInteger(y) || y < 1900 || y > currentYear) {
        errors.yearOfDiagnosis = `Enter a year between 1900 and ${currentYear}`;
      }
    }

    // reset error
    form
      .querySelectorAll("p[id^='error-']")
      .forEach((p) => (p.textContent = ""));

    // show error
    Object.entries(errors).forEach(([key, msg]) => {
      const el = document.getElementById(`error-${key}`);
      if (el) el.textContent = msg;
    });

    if (Object.keys(errors).length > 0) return;

    setTimeout(() => {
      savedMsg.textContent = "Saved at " + new Date().toLocaleTimeString();
    }, 300);
  });
})();
