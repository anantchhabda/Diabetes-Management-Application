(function () {
  const form = document.getElementById("settingsForm");
  const savedMsg = document.getElementById("savedMsg");

  if (!form) return;

  // Load existing patient data when page loads
  async function loadUserData() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await fetch("/api/patient/me/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error("Failed to fetch user data:", response.status);
        return;
      }

      const result = await response.json();
      const userData = result.profile;
      const phoneNumber = result.phoneNumber;

      // Populate form fields with existing data
      const fields = {
        patientId: userData.profileId,
        fullName: userData.name,
        dateOfBirth: userData.dob ? userData.dob.slice(0, 10) : "",
        sex: userData.sex,
        fullAddress: userData.address,
        yearOfDiagnosis: userData.yearOfDiag,
        diagnosisType: userData.typeOfDiag,
        phone: phoneNumber
      };

      Object.entries(fields).forEach(([fieldId, value]) => {
        const element = document.getElementById(fieldId);
        if (element && value !== undefined && value !== null) {
          element.value = value;
        }
      });

    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

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

  // Handle form submission
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
      "diagnosisType"
    ].forEach((f) => {
      if (!data[f] || data[f].trim() === "") {
        errors[f] = "Required";
      }
    });

    form
      .querySelectorAll("p[id^='error-']")
      .forEach((p) => (p.textContent = ""));

    Object.entries(errors).forEach(([key, msg]) => {
      const el = document.getElementById(`error-${key}`);
      if (el) el.textContent = msg;
    });

    if (Object.keys(errors).length > 0) return;

    // Convert yearOfDiagnosis to number
    let yearOfDiag = Number(data.yearOfDiagnosis);
    if (isNaN(yearOfDiag)) yearOfDiag = undefined;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        if (savedMsg)
          savedMsg.textContent = "Session expired, please login again";
        return;
      }

      const res = await fetch("/api/patient/me/profile", {
        method: "PUT",
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

      const ct = res.headers.get?.("content-type") || "";
      const { data: result, text } = await readResponseSafe(res);

      if (!res.ok) {
        const msg =
          (result && (result.error || result.message)) ||
          (text && text.trim()) ||
          "Update failed";
        if (savedMsg) savedMsg.textContent = msg;
        return;
      }

      if (savedMsg) {
        savedMsg.textContent = "Settings updated successfully!";
        window.location.href = "/patient-homepage";
      }

    } catch (err) {
      console.error("Patient settings update error:", err);
      if (savedMsg) savedMsg.textContent = "Error, please try again";
    }
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      window.location.href = "/";
    });
  }

  loadUserData();
})();