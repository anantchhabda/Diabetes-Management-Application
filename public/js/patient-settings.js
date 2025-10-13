// public/js/patient-settings.js
(function () {
  const form = document.getElementById("settingsForm");
  const savedMsg = document.getElementById("savedMsg");

  // --- i18n helpers (same pattern as other pages) ---
  function dict() {
    const d = window.__i18n && window.__i18n.dict;
    return (typeof d === "function" ? d() : d) || {};
  }
  function t(key, fallback) {
    const d = dict();
    return (d && d[key]) != null ? String(d[key]) : fallback ?? key;
  }
  function whenI18nReady(fn, maxTries = 20) {
    let tries = 0;
    const want =
      (document.documentElement && document.documentElement.lang) || "en";
    const tick = () => {
      const D = window.__i18n && window.__i18n.dict;
      const ready =
        window.__i18n &&
        window.__i18n.lang === want &&
        D &&
        Object.keys(typeof D === "function" ? D() : D).length > 0;
      if (ready) return fn();
      if (++tries >= maxTries) return fn();
      setTimeout(tick, 25);
    };
    tick();
  }

  // helpers for the banner
  function hideSavedMsg() {
    if (!savedMsg) return;
    savedMsg.textContent = "";
    savedMsg.classList.add("hidden");
  }
  function showSavedMsg(text) {
    if (!savedMsg) return;
    savedMsg.textContent = text || "";
    savedMsg.classList.remove("hidden");
  }

  // Ensure hidden from the start
  hideSavedMsg();

  if (!form) return;

  // Load existing patient data
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
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Failed to fetch user data:", response.status);
        return;
      }

      const result = await response.json();
      const userData = result.profile || {};
      const phoneNumber = result.phoneNumber || "";

      const fields = {
        patientId: userData.profileId,
        fullName: userData.name,
        dateOfBirth: userData.dob ? String(userData.dob).slice(0, 10) : "",
        sex: userData.sex,
        fullAddress: userData.address,
        yearOfDiagnosis:
          typeof userData.yearOfDiag === "number"
            ? String(userData.yearOfDiag)
            : "",
        diagnosisType: userData.typeOfDiag || "",
        phone: phoneNumber,
      };

      Object.entries(fields).forEach(([fieldId, value]) => {
        const element = document.getElementById(fieldId);
        if (element && value !== undefined && value !== null) {
          element.value = value;
        }
      });

      hideSavedMsg();
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

  // Submit handler
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideSavedMsg();

    const data = Object.fromEntries(new FormData(form));
    const errors = {};

    // Required fields ONLY: name, dob, sex, address
    ["fullName", "dateOfBirth", "sex", "fullAddress"].forEach((f) => {
      if (!data[f] || data[f].trim() === "") {
        errors[f] = t("required", "Required");
      }
    });

    // Optional: yearOfDiagnosis (if present, must be 4 digits)
    if (data.yearOfDiagnosis && data.yearOfDiagnosis.trim() !== "") {
      if (!/^\d{4}$/.test(data.yearOfDiagnosis.trim())) {
        errors.yearOfDiagnosis = t(
          "enter_4_digit_year",
          "Enter a 4-digit year (e.g., 2021)"
        );
      }
    }
    // Optional: diagnosisType — no validation if empty

    // Reset inline error labels
    form.querySelectorAll("p[id^='error-']").forEach((p) => {
      p.textContent = "";
      p.classList.add("hidden");
    });

    // Render errors
    Object.entries(errors).forEach(([key, msg]) => {
      const el = document.getElementById(`error-${key}`);
      if (el) {
        el.textContent = msg;
        el.classList.remove("hidden");
      }
    });

    if (Object.keys(errors).length > 0) return;

    // Build payload with optionals only when provided
    const payload = {
      name: data.fullName,
      dob: data.dateOfBirth,
      sex: data.sex,
      address: data.fullAddress,
    };

    const y = (data.yearOfDiagnosis || "").trim();
    if (y && /^\d{4}$/.test(y)) payload.yearOfDiag = Number(y);

    const type = (data.diagnosisType || "").trim();
    if (type) payload.typeOfDiag = type;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showSavedMsg(
          t("session_expired", "Session expired, please login again")
        );
        return;
      }

      const res = await fetch("/api/patient/me/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const { data: result, text } = await readResponseSafe(res);

      if (!res.ok) {
        const msg =
          (result && (result.error || result.message)) ||
          (text && text.trim()) ||
          t("update_failed", "Update failed");
        showSavedMsg(msg);
        return;
      }

      // Success — show message only now
      showSavedMsg(
        t("settings_updated_successfully", "Settings updated successfully!")
      );
      window.location.href = "/patient-homepage";
    } catch (err) {
      console.error("Patient settings update error:", err);
      showSavedMsg(t("error_try_again", "Error, please try again"));
    }
  });

  // Hide any banner while the user types/changes fields
  form.addEventListener(
    "input",
    function () {
      hideSavedMsg();
    },
    { passive: true }
  );
  form.addEventListener(
    "change",
    function () {
      hideSavedMsg();
    },
    { passive: true }
  );

  // --- Logout (translatable) ---
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    // make sure it uses the i18n key
    logoutBtn.setAttribute("data-i18n", "logout");
    logoutBtn.setAttribute("data-i18n-title", "logout");

    // (optional) set the label immediately; your i18n script can overwrite later
    logoutBtn.textContent = "Log Out";

    logoutBtn.addEventListener("click", () => {
      try {
        // clear auth/session
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");

        // clear viewer context (doctor/family read-only flows)
        sessionStorage.removeItem("viewerPatientID");

        // purge any cached log-data drafts so a new patient on the same device
        // won't see the previous patient's values
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

      // redirect to landing
      window.location.href = "/";
    });
  }

  // Initial load
  loadUserData();

  // --- Minimal touched-only validation (year/type optional) ---
  (function () {
    const fields = [
      { id: "fullName", err: "error-fullName", required: true },
      { id: "dateOfBirth", err: "error-dateOfBirth", required: true },
      { id: "sex", err: "error-sex", required: true },
      { id: "fullAddress", err: "error-fullAddress", required: true },
      { id: "yearOfDiagnosis", err: "error-yearOfDiagnosis", required: false },
      { id: "diagnosisType", err: "error-diagnosisType", required: false },
    ];

    const touched = Object.create(null);
    function validateOne(fid, eid, req) {
      const f = document.getElementById(fid);
      const e = document.getElementById(eid);
      if (!f || !e) return true;

      const val = String(f.value || "").trim();
      let ok = true;

      if (req) ok = val !== "";
      if (fid === "yearOfDiagnosis" && val !== "") {
        ok = /^\d{4}$/.test(val);
      }

      e.textContent =
        fid === "yearOfDiagnosis" && val !== "" && !/^\d{4}$/.test(val)
          ? t("enter_4_digit_year", "Enter a 4-digit year (e.g., 2021)")
          : t("required", "Required");
      e.classList.toggle("hidden", !touched[fid] || ok);
      return ok;
    }

    fields.forEach(({ id, err, required }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const mark = () => {
        touched[id] = true;
        validateOne(id, err, required);
      };
      el.addEventListener("blur", mark);
      el.addEventListener("input", () => validateOne(id, err, required));
      el.addEventListener("change", () => validateOne(id, err, required));
    });
  })();
})();
