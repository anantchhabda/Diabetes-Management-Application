(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function purgeLogDrafts() {
    try {
      sessionStorage.removeItem("viewerPatientID");
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
  }

  // Try to decode a JWT (best-effort, no validation; just for prefill UX)
  function decodeJwtPayload(token) {
    try {
      const base64 = token.split(".")[1];
      // atob expects plain base64, not base64url; fix if needed
      const fixed = base64.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(fixed);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  onReady(function () {
    const form = document.getElementById("onboardingForm");
    const savedMsg = document.getElementById("savedMsg");
    const currentYear = new Date().getFullYear();
    if (!form) return;

    // pre-fill fields after dom ready
    try {
      const token = localStorage.getItem("onboardingToken");
      const payload = token ? decodeJwtPayload(token) : null;
      const profileId = payload && payload.profileId;
      const phone = payload && payload.phoneNumber;
      const patientInput = document.getElementById("patientId");
      const phoneInput = document.getElementById("phone");
      if (patientInput) patientInput.value = profileId || "";
      if (phoneInput) phoneInput.value = phone || "";
    } catch (err) {
      console.error("Failed to read onboarding token", err);
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

    function resetErrors() {
      form.querySelectorAll("p[id^='error-']").forEach((p) => {
        p.textContent = "";
        p.classList.add("hidden");
      });
    }

    function showError(field, msg) {
      const el = document.getElementById(`error-${field}`);
      if (el) {
        el.textContent = msg;
        el.classList.remove("hidden");
      }
    }

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

      ["fullName", "dateOfBirth", "sex", "fullAddress"].forEach((f) => {
        if (!data[f] || String(data[f]).trim() === "") {
          errors[f] = "Required";
        }
      });

      if (data.yearOfDiagnosis) {
        const y = Number(data.yearOfDiagnosis);
        if (!Number.isInteger(y) || y < 1900 || y > currentYear) {
          errors.yearOfDiagnosis = `Enter a year between 1900 and ${currentYear}`;
        }
      }

      Object.entries(errors).forEach(([k, v]) => showError(k, v));
      if (Object.keys(errors).length > 0) return;

      try {
        const token = localStorage.getItem("onboardingToken");
        if (!token) {
          if (savedMsg)
            savedMsg.textContent = "Session expired, please register again";
          return;
        }

        const payload = {
          name: data.fullName,
          dob: data.dateOfBirth,
          sex: data.sex,
          address: data.fullAddress,
        };
        if (data.yearOfDiagnosis)
          payload.yearOfDiag = Number(data.yearOfDiagnosis);
        if (data.diagnosisType) payload.typeOfDiag = data.diagnosisType;

        const res = await fetch(`/api/auth/onboarding?_=${Date.now()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          body: JSON.stringify(payload),
        });

        const { data: result, text } = await readResponseSafe(res);

        if (res.status === 409) {
          if (savedMsg) savedMsg.textContent = "Onboarding already completed";
          // proceed to homepage anyway
          purgeLogDrafts();

          // 🧭 Make sure offline namespace is ready even in this edge case
          try {
            const meRes = await fetch(`/api/auth/me?_=${Date.now()}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  localStorage.getItem("authToken") || token
                }`,
              },
              cache: "no-store",
            });
            if (meRes.ok) {
              const me = await meRes.json();
              localStorage.setItem("userData", JSON.stringify(me));
              if (me?.profile?.profileId) {
                localStorage.setItem(
                  "__active_profile_id__",
                  String(me.profile.profileId)
                );
              }
            }
          } catch {}

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

        // Expect an auth token back
        const authToken = result && (result.authToken || result.token);
        if (authToken) localStorage.setItem("authToken", authToken);

        // ✅ Align with login.js: cache userData + __active_profile_id__ so patient-homepage + log-data work offline
        try {
          const meRes = await fetch(`/api/auth/me?_=${Date.now()}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken || ""}`,
            },
            cache: "no-store",
          });
          if (meRes.ok) {
            const me = await meRes.json();
            localStorage.setItem("userData", JSON.stringify(me));
            if (me?.profile?.profileId) {
              localStorage.setItem(
                "__active_profile_id__",
                String(me.profile.profileId)
              );
            }
          } else {
            // fallback: at least store a minimal object to keep namespace
            const ob = decodeJwtPayload(authToken || "") || {};
            const cachedUser = {
              role: "Patient",
              profile: {
                profileId: ob.profileId || null,
                name: data.fullName || "",
              },
            };
            localStorage.setItem("userData", JSON.stringify(cachedUser));
            if (cachedUser.profile.profileId) {
              localStorage.setItem(
                "__active_profile_id__",
                String(cachedUser.profile.profileId)
              );
            }
          }
        } catch {
          // safe fallback if /me fails
          const ob = decodeJwtPayload(authToken || "") || {};
          const cachedUser = {
            role: "Patient",
            profile: {
              profileId: ob.profileId || null,
              name: data.fullName || "",
            },
          };
          try {
            localStorage.setItem("userData", JSON.stringify(cachedUser));
            if (cachedUser.profile.profileId) {
              localStorage.setItem(
                "__active_profile_id__",
                String(cachedUser.profile.profileId)
              );
            }
          } catch {}
        }

        if (savedMsg)
          savedMsg.textContent = "Onboarding successful! Redirecting...";

        purgeLogDrafts();
        window.location.href = "/patient-homepage";
      } catch (err) {
        console.error("Onboarding fetch error:", err);
        if (savedMsg) savedMsg.textContent = "Error, please try again";
      }
    });
  });
})();
