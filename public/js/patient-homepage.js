// /public/js/patient-homepage.js
(function () {
  if (typeof document === "undefined") return;

  // Init once DOM is ready (Next's afterInteractive already runs post-hydration)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    setGreeting();
    wireNav();
  }

  async function setGreeting() {
    try {
      const userBtn = document.getElementById("userBtn");
      if (!userBtn) return;

      const token = localStorage.getItem("authToken");
      if (!token) {
        userBtn.textContent = "Hello Guest";
        return;
      }

      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        userBtn.textContent = "Hello Guest";
        return;
      }

      const data = await res.json();
      const name = (data && data.profile && data.profile.name) || "Guest";
      userBtn.textContent = `Hello ${name}`;
    } catch {
      const userBtn = document.getElementById("userBtn");
      if (userBtn) userBtn.textContent = "Hello Guest";
    }
  }

  function wireNav() {
    // helper to avoid double-binding during dev HMR
    function bindClickOnce(id, to) {
      const el = document.getElementById(id);
      if (!el) return;
      const handler = () => {
        window.location.href = to;
      };
      el.removeEventListener("click", handler);
      el.addEventListener("click", handler);
    }

    bindClickOnce("logDataBtn", "/log-data");
    bindClickOnce("setRemindersBtn", "/reminders");
    bindClickOnce("viewConnectionsBtn", "/patient-connection");
  }
})();
