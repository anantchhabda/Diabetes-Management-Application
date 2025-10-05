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
    return data.role; // Returns "Patient", "Doctor", or "Family Member"
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

async function navigateToHomepage() {
  const role = await getCurrentUserRole();
  
  switch (role) {
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
  
  switch (role) {
    case "Patient":
      window.location.href = "/patient-onboarding"; 
      break;
    case "Doctor":
      window.location.href = "/doctor-onboarding"; 
      break;
    case "Family Member":
      window.location.href = "/family-onboarding"; 
      break;
    default:
      window.location.href = "/login";
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