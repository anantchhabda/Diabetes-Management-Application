(function () {
  const form = document.getElementById("settingsForm");
  const savedMsg = document.getElementById("savedMsg");
  if (!form) return;

  // --- Load existing doctor data ---
  async function loadUserData() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No auth token found");

      const res = await fetch("/api/doctor/me/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return console.error("Failed to fetch:", res.status);

      const result = await res.json();
      const profile = result.profile;
      const phoneNumber = result.phoneNumber;

      const fields = {
        doctorId: profile.profileId,
        fullName: profile.name,
        dateOfBirth: profile.dob ? profile.dob.slice(0, 10) : "",
        clinicAddress: profile.clinicAddress,
        clinicName: profile.clinicName,
        phone: phoneNumber,
      };

      Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el && val != null) el.value = val;
      });
    } catch (err) {
      console.error("Error loading doctor data:", err);
    }
  }

  async function readResponseSafe(res) {
    const ct = res.headers.get?.("content-type") || "";
    if (ct.includes("application/json")) {
      try {
        return { data: await res.json(), text: null };
      } catch {}
    }
    try {
      return { data: null, text: await res.text() };
    } catch {}
    return { data: null, text: null };
  }

  // --- Form submission handler ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (savedMsg) savedMsg.textContent = "";

    const data = Object.fromEntries(new FormData(form));
    const errors = {};

    ["fullName", "dateOfBirth", "clinicAddress", "clinicName"].forEach((f) => {
      if (!data[f] || data[f].trim() === "") errors[f] = "Required";
    });

    // Clear all old error messages & hide them
    form.querySelectorAll("p[id^='error-']").forEach((p) => {
      p.textContent = "";
      p.classList.add("hidden");
    });

    // Show new errors
    Object.entries(errors).forEach(([key, msg]) => {
      const el = document.getElementById(`error-${key}`);
      if (el) {
        el.textContent = msg;
        el.classList.remove("hidden");
      }
    });

    if (Object.keys(errors).length > 0) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        if (savedMsg)
          savedMsg.textContent = "Session expired, please login again";
        return;
      }

      const res = await fetch("/api/doctor/me/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.fullName,
          dob: data.dateOfBirth,
          clinicAddress: data.clinicAddress,
          clinicName: data.clinicName,
        }),
      });

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
        window.location.href = "/doctor-homepage";
      }
    } catch (err) {
      console.error("Doctor settings update error:", err);
      if (savedMsg) savedMsg.textContent = "Error, please try again";
    }
  });

  // --- Logout button handler ---
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      window.location.href = "/";
    });
  }

  loadUserData();

  // --- Touched-field live validation ---
  (function () {
    const fields = [
      { id: "fullName", err: "error-fullName" },
      { id: "dateOfBirth", err: "error-dateOfBirth" },
      { id: "clinicAddress", err: "error-clinicAddress" },
      { id: "clinicName", err: "error-clinicName" },
    ];

    const touched = Object.create(null);
    const required = (v) => v != null && String(v).trim() !== "";

    function validateOne(fid, eid) {
      const f = document.getElementById(fid);
      const e = document.getElementById(eid);
      if (!f || !e) return true;
      const ok = required(f.value);
      e.classList.toggle("hidden", !touched[fid] || ok);
      return ok;
    }

    fields.forEach(({ id, err }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const mark = () => {
        touched[id] = true;
        validateOne(id, err);
      };
      el.addEventListener("blur", mark);
      el.addEventListener("input", () => validateOne(id, err));
      el.addEventListener("change", () => validateOne(id, err));
    });
  })();
})();
