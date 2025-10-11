const homeButton = document.getElementById("homeBtn");
const settingsButton = document.getElementById("settingsBtn");

// Function to get current user role
async function getCurrentUserRole() {
  try {
    // Always get the latest token from localStorage
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No auth token found");
      return null;
    }

    // Add a cache-busting query param to avoid caching issues
    const response = await fetch(`/api/auth/me?_=${Date.now()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      console.error("Failed to fetch user role:", response.status);
      // If unauthorized, clear token and reload
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        window.location.href = "/login";
      }
      return null;
    }

    const data = await response.json();
    return data.role; // Returns "Patient", "Doctor", or "Family Member"
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

async function navigateToHomepage() {
  const role = await getCurrentUserRole();
  const normalizedRole = role ? role.trim() : null;
  switch (normalizedRole) {
    case "Patient":
      window.location.href = "/patient-homepage";
      break;
    case "Doctor":
      window.location.href = "/doctor-homepage";
      break;
    case "Family Member":
      window.location.href = "/family-homepage";
      break;
    default:
      window.location.href = "/";
  }
}

async function navigateToSettings() {
  const role = await getCurrentUserRole();
  const normalizedRole = role ? role.trim() : null;
  switch (normalizedRole) {
    case "Patient":
      window.location.href = "/patient-settings"; 
      break;
    case "Doctor":
      window.location.href = "/doctor-settings"; 
      break;
    case "Family Member":
      window.location.href = "/family-settings"; 
      break;
    default:
      window.location.href = "/";
  }
}

if (homeButton) {
  homeButton.addEventListener("click", function () {
    navigateToHomepage();
  });
}

if (settingsButton) {
  settingsButton.addEventListener("click", function () {
    navigateToSettings();
  });
}