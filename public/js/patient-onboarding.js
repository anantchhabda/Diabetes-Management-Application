(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    const form = document.getElementById("onboardingForm");
    const savedMsg = document.getElementById("savedMsg");
    const currentYear = new Date().getFullYear();
    if (!form) return;

    // Pre-fill readonly fields from onboarding token (after DOM is ready)
    try {
      const token = localStorage.getItem("onboardingToken");
      if (token) {
        const base64 = token.split(".")[1];
        const payload = JSON.parse(atob(base64));
        const profileId = payload && payload.profileId;
        const phone = payload && payload.phoneNumber;
        const patientInput = document.getElementById("patientId");
        const phoneInput = document.getElementById("phone");
        if (patientInput) patientInput.value = profileId || "";
        if (phoneInput) phoneInput.value = phone || "";
      }
    } catch (err) {
      console.error("Failed to read onboarding token", err);
    }

    // Utility: safe JSON/text read
    async function readResponseSafe(response) {
      const ct = (response.headers && response.headers.get("content-type")) || "";
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

    // Clear & hide all error <p> helpers
    function resetErrors() {
      form.querySelectorAll("p[id^='error-']").forEach((p) => {
        p.textContent = "";
        p.classList.add("hidden");
      });
    }

    // Show one field error
    function showError(field, msg) {
      const el = document.getElementById(`error-${field}`);
      if (el) {
        el.textContent = msg;
        el.classList.remove("hidden");
      }
    }

    // Optional: inline clearing as user types/selects
    form.addEventListener("input", (e) => {
      const id = e.target && e.target.id;
      if (!id) return;
      const err = document.getElementById(`error-${id}`);
      if (err && err.textContent) {
        err.textContent = "";
        err.classList.add("hidden");
      }
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (savedMsg) savedMsg.textContent = "";
      resetErrors();

      const data = Object.fromEntries(new FormData(form));
      const errors = {};

      // Required fields (skip readonly fields)
      ["fullName", "dateOfBirth", "sex", "fullAddress", "yearOfDiagnosis", "diagnosisType"].forEach(
        (f) => {
          if (!data[f] || String(data[f]).trim() === "") {
            errors[f] = "Required";
          }
        }
      );

      // Year validation
      if (data.yearOfDiagnosis) {
        const y = Number(data.yearOfDiagnosis);
        if (!Number.isInteger(y) || y < 1900 || y > currentYear) {
          errors.yearOfDiagnosis = `Enter a year between 1900 and ${currentYear}`;
        }
      }

      // Render errors
      Object.entries(errors).forEach(([k, v]) => showError(k, v));
      if (Object.keys(errors).length > 0) return;

      // Submit
      try {
        const token = localStorage.getItem("onboardingToken");
        if (!token) {
          if (savedMsg)
            savedMsg.textContent = "Session expired, please register again";
          return;
        }

        const res = await fetch("/api/auth/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.fullName,
            dob: data.dateOfBirth,
            sex: data.sex,
            address: data.fullAddress,
            yearOfDiag: Number(data.yearOfDiagnosis),
            typeOfDiag: data.diagnosisType,
          }),
        });

        const { data: result, text } = await readResponseSafe(res);

        // Handle special “already completed” response (409)
        if (res.status === 409) {
          if (savedMsg) savedMsg.textContent = "Onboarding already completed";
          // proceed to homepage anyway
          window.location.href = "/patient-homepage";
          return;
        }

        if (!res.ok) {
          const msg =
            (result && (result.error || result.message)) ||
            (text && text.trim()) ||
            "Onboarding failed";
          if (savedMsg) savedMsg.textContent = msg;
          return;
        }

        const authToken = result && (result.authToken || result.token);
        if (authToken) localStorage.setItem("authToken", authToken);

        if (savedMsg)
          savedMsg.textContent = "Onboarding successful! Redirecting...";

        window.location.href = "/patient-homepage";
      } catch (err) {
        console.error("Onboarding fetch error:", err);
        if (savedMsg) savedMsg.textContent = "Error, please try again";
      }
    });
  });
})();
