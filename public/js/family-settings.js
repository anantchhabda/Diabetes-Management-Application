(function () {
  const form = document.getElementById("settingsForm");
  const savedMsg = document.getElementById("savedMsg");
  if (!form) return;

  // Keep the message hidden until we explicitly show it
  if (savedMsg) savedMsg.classList.add("hidden");

  // --- Load existing family data ---
  async function loadUserData() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No auth token found");

      const res = await fetch("/api/family/me/profile", {
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
        familyId: profile.profileId,
        fullName: profile.name,
        dateOfBirth: profile.dob ? profile.dob.slice(0, 10) : "",
        fullAddress: profile.address,
        phone: phoneNumber,
      };

      Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el && val != null) el.value = val;
      });
    } catch (err) {
      console.error("Error loading family data:", err);
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

    // Reset message (hide + clear text) before validating/saving
    if (savedMsg) {
      savedMsg.textContent = "";
      savedMsg.classList.add("hidden");
    }

    const data = Object.fromEntries(new FormData(form));
    const errors = {};

    // Required fields for family profile
    ["fullName", "dateOfBirth", "fullAddress"].forEach((f) => {
      if (!data[f] || data[f].trim() === "") errors[f] = "Required";
    });

    // Clear old errors & hide them
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
        if (savedMsg) {
          savedMsg.textContent = "Session expired, please login again";
          savedMsg.classList.remove("hidden");
        }
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

      const { data: result, text } = await readResponseSafe(res);
      if (!res.ok) {
        const msg =
          (result && (result.error || result.message)) ||
          (text && text.trim()) ||
          "Update failed";
        if (savedMsg) {
          savedMsg.textContent = msg;
          savedMsg.classList.remove("hidden");
        }
        return;
      }

      // Success — now show the message (was hidden before submit)
      if (savedMsg) {
        savedMsg.textContent = "Settings updated successfully!";
        savedMsg.classList.remove("hidden");
      }
      window.location.href = "/family-homepage";
    } catch (err) {
      console.error("Family settings update error:", err);
      if (savedMsg) {
        savedMsg.textContent = "Error, please try again";
        savedMsg.classList.remove("hidden");
      }
    }
  });

  // --- Logout button handler (translatable via data-i18n="logout") ---
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      try {
        // auth/session
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");

        // viewer context (doctor/family viewing a patient)
        sessionStorage.removeItem("viewerPatientID");

        // purge any saved drafts/offline artifacts so a new patient on
        // the same device won't see old data
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (
            k &&
            (k.startsWith("logdata:v2:") ||
              k.startsWith("__logdata_") ||
              k === "__active_profile_id__")
          ) {
            localStorage.removeItem(k);
          }
        }
      } catch {}

      // finally redirect
      window.location.href = "/";
    });
  }

  loadUserData();

  // --- Touched-field live validation ---
  (function () {
    const fields = [
      { id: "fullName", err: "error-fullName" },
      { id: "dateOfBirth", err: "error-dateOfBirth" },
      { id: "fullAddress", err: "error-fullAddress" },
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
