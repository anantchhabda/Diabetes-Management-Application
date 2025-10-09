(function () {
  const CONNECTIONS_ROUTE = "/doctor-connection";

  function buildAuthHeaders() {
    const token = localStorage.getItem("authToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  async function getUserName() {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: buildAuthHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        console.warn("[doctor-homepage] /api/auth/me failed:", res.status);
        return "Guest";
      }
      const data = await res.json();
      return data && data.profile && data.profile.name
        ? data.profile.name
        : "Guest";
    } catch (err) {
      console.error("[doctor-homepage] getUserName error:", err);
      return "Guest";
    }
  }

  async function setGreeting() {
    const btn = document.getElementById("userBtn");
    if (!btn) return;
    btn.textContent = "Hello, Dr. …";
    const name = await getUserName();
    btn.textContent = `Hello, Dr. ${name}`;
  }

  function wireUpNavigation() {
    const viewBtn = document.getElementById("viewPatientsBtn");
    if (!viewBtn) return;
    viewBtn.addEventListener("click", () => {
      window.location.assign(CONNECTIONS_ROUTE);
    });
  }

  function init() {
    wireUpNavigation();
    setGreeting();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
