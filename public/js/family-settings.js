(function () {
  const form = document.getElementById("settingsForm");
  const savedMsg = document.getElementById("savedMsg");

  if (!form) return;

  // Load existing family member data when page loads
  async function loadUserData() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await fetch("/api/family/me/profile", {
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
      
      // Populate form fields with existing data
      const fields = {
        familyId: userData.profileId,
        fullName: userData.name,
        dateOfBirth: userData.dob,
        fullAddress: userData.address
      };

      Object.entries(fields).forEach(([fieldId, value]) => {
        const element = document.getElementById(fieldId);
        if (element && value) {
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
      "fullAddress",
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

    console.log("Submitting family settings form...");
    console.log("Form data:", data);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        if (savedMsg)
          savedMsg.textContent = "Session expired, please login again";
        return;
      }

      const res = await fetch("/api/family/me/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.fullName,
          dob: data.dateOfBirth,
          address: data.fullAddress,
        }),
      });

      const ct = res.headers.get?.("content-type") || "";
      console.log("settings response:", res.status, ct);
      const { data: result, text } = await readResponseSafe(res);

      if (!res.ok) {
        const msg =
          (result && (result.error || result.message)) ||
          (text && text.trim()) ||
          "Update failed";
        if (savedMsg) savedMsg.textContent = msg;
        return;
      }

      if (savedMsg)
        savedMsg.textContent = "Settings updated successfully!";

    } catch (err) {
      console.error("Family settings update error:", err);
      if (savedMsg) savedMsg.textContent = "Error, please try again";
    }
  });

  // Handle cancel button
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      window.location.href = "/family-homepage";
    });
  }

  // Load user data when page loads
  loadUserData();
})();