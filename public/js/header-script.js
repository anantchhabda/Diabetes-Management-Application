const homeButton = document.getElementById("homeBtn");
const settingsButton = document.getElementById("settingsBtn");

// Function to get current user role
async function getCurrentUserRole() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No auth token found");
      return null;
    }

    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch user role:", response.status);
      return null;
    }

    const data = await response.json();
    console.log("User data from API:", data); // Debug log
    console.log("User role:", data.role, "Type:", typeof data.role); // Debug log
    return data.role; // Returns "Patient", "Doctor", or "Family Member"
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

async function navigateToHomepage() {
  const role = await getCurrentUserRole();
  console.log("Navigating to homepage with role:", role); // Debug log
  
  // Normalize role string (trim whitespace and handle case)
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
      console.log("Unknown role or no role, redirecting to home:", normalizedRole);
      window.location.href = "/";
  }
}

async function navigateToSettings() {
  const role = await getCurrentUserRole();
  console.log("Navigating to settings with role:", role); // Debug log
  
  // Normalize role string (trim whitespace and handle case)
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
      console.log("Unknown role or no role, redirecting to home:", normalizedRole);
      window.location.href = "/";
  }
}

// Event listeners
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