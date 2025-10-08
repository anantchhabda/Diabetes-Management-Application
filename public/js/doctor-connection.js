document.addEventListener("DOMContentLoaded", () => {
    const openSearchBtn = document.getElementById("openSearchBtn");
    const searchPopup = document.getElementById("searchPopup");
    const cancelBtn = document.getElementById("cancelSearchBtn");
    const confirmBtn = document.getElementById("confirmSearchBtn");

    if (openSearchBtn && searchPopup) {
        openSearchBtn.addEventListener("click", () => {
            searchPopup.classList.remove("hidden");
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            searchPopup.classList.add("hidden");
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            const name = document.getElementById("patientNameInput")?.value.trim();
            const id = document.getElementById("patientIdInput")?.value.trim();

            if (!name || !id) {
                alert("Please fill in both name and ID.");
                return;
            }

            alert(`Request sent for ${name} (ID: ${id})`);
            searchPopup.classList.add("hidden");
        });
    }
});
