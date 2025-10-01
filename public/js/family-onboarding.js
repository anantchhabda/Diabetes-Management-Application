(function () {
  const form = document.getElementById("onboardingForm");
  const savedMsg = document.getElementById("savedMsg");
  const currentYear = new Date().getFullYear();

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // clear previous saved message
    if (savedMsg) savedMsg.textContent = "";

    const data = Object.fromEntries(new FormData(form));
    const errors = {};

    // required fields, skipping readonly fields 
    [
      "fullName",
      "dateOfBirth",
      "fullAddress",
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

      window.location.href = "/homepage";
  });
})();
