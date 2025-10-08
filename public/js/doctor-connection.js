// document.addEventListener("DOMContentLoaded", () => {
//     const openSearchBtn = document.getElementById("openSearchBtn");
//     const searchPopup = document.getElementById("searchPopup");
//     const cancelBtn = document.getElementById("cancelSearchBtn");
//     const confirmBtn = document.getElementById("confirmSearchBtn");

//     if (openSearchBtn && searchPopup) {
//         openSearchBtn.addEventListener("click", () => {
//             searchPopup.classList.remove("hidden");
//         });
//     }

//     if (cancelBtn) {
//         cancelBtn.addEventListener("click", () => {
//             searchPopup.classList.add("hidden");
//         });
//     }

//     if (confirmBtn) {
//         confirmBtn.addEventListener("click", () => {
//             const name = document.getElementById("patientNameInput")?.value.trim();
//             const id = document.getElementById("patientIdInput")?.value.trim();

//             if (!name || !id) {
//                 alert("Please fill in both name and ID.");
//                 return;
//             }

//             alert(`Request sent for ${name} (ID: ${id})`);
//             searchPopup.classList.add("hidden");
//         });
//     }
// });



document.addEventListener("DOMContentLoaded", () => {
    // --- DOM elements ---
    const openSearchBtn = document.getElementById("openSearchBtn");
    const searchPopup = document.getElementById("searchPopup");
    const cancelBtn = document.getElementById("cancelSearchBtn");
    const confirmBtn = document.getElementById("confirmSearchBtn");
    const patientNameInput = document.getElementById("patientNameInput");
    const patientIdInput = document.getElementById("patientIdInput");

    const outgoingRequestsContainer = document.querySelector(
        "#outgoingRequestsContainer"
    );

    // --- Fake database ---
    const fakePatientDatabase = [
        { id: "12345", name: "Alice Johnson" },
        { id: "67890", name: "Bob Smith" },
    ];

    let currentPatient = null;

    // --- Open search modal ---
    openSearchBtn.addEventListener("click", () => {
        patientIdInput.value = "";
        patientNameInput.value = "";
        searchPopup.classList.remove("hidden");
    });

    // --- Cancel button ---
    cancelBtn.addEventListener("click", () => {
        searchPopup.classList.add("hidden");
    });

    // --- Confirm button ---
    confirmBtn.addEventListener("click", () => {
        const patientID = patientIdInput.value.trim();

        if (!patientID) {
            alert("Please enter a Patient ID.");
            return;
        }

        // Lookup patient in fake database
        const patient = fakePatientDatabase.find((p) => p.id === patientID);
        if (!patient) {
            alert("Invalid ID. Patient not found.");
            return;
        }

        currentPatient = patient;

        // Fill confirmation inputs
        patientNameInput.value = patient.name;
        patientIdInput.value = patient.id;

        alert(
            `Confirm connection request for ${patient.name} (ID: ${patient.id})`
        );

        // Add to outgoing requests dynamically
        const newRequest = document.createElement("div");
        newRequest.className = "grid grid-cols-[100px_1fr_auto] border border-black";
        newRequest.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        Patient
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${patient.name}
      </div>
      <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        Remove
      </button>
    `;
        outgoingRequestsContainer.appendChild(newRequest);

        // Remove button functionality
        newRequest.querySelector("button").addEventListener("click", () => {
            outgoingRequestsContainer.removeChild(newRequest);
        });

        // Close modal
        searchPopup.classList.add("hidden");
    });
});
