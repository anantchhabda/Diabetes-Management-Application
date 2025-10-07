// (function () {
//     if (typeof document === "undefined") return;

//     let idCounter = 1;
//     const currentConnections = [
//         { id: idCounter++, role: "Patient", name: "John Smith" },
//         { id: idCounter++, role: "Patient", name: "Jane Doe" },
//     ];
//     const outgoingRequests = [
//         { id: idCounter++, role: "Patient", name: "Michael Brown" },
//         { id: idCounter++, role: "Patient", name: "Sarah Johnson" },
//     ];

//     const currentList = document.getElementById("currentConnections");
//     const outgoingList = document.getElementById("outgoingRequests");

//     const viewModal = document.getElementById("viewModal");
//     const viewModalTitle = document.getElementById("viewModalTitle");
//     const viewModalRole = document.getElementById("viewModalRole");
//     const viewModalName = document.getElementById("viewModalName");
//     const closeViewModalBtn = document.getElementById("closeViewModalBtn");

//     // ===== Modal controls =====
//     function openModal(connection) {
//         viewModalTitle.textContent = "Patient Details";
//         viewModalRole.textContent = connection.role;
//         viewModalName.textContent = connection.name;
//         viewModal.classList.remove("hidden");
//         viewModal.classList.add("flex");
//         viewModal.setAttribute("aria-hidden", "false");
//     }
//     function closeModal() {
//         viewModal.classList.add("hidden");
//         viewModal.classList.remove("flex");
//         viewModal.setAttribute("aria-hidden", "true");
//     }
//     closeViewModalBtn?.addEventListener("click", closeModal);
//     viewModal?.addEventListener("click", (e) => {
//         if (e.target === viewModal) closeModal();
//     });

//     // ===== Helpers =====
//     function clearChildren(node) {
//         while (node.firstChild) node.removeChild(node.firstChild);
//     }
//     function removeById(arr, id) {
//         const index = arr.findIndex((x) => x.id === id);
//         if (index !== -1) arr.splice(index, 1);
//     }

//     // ===== Renderers =====
//     function renderCurrentConnections() {
//         clearChildren(currentList);

//         if (!currentConnections.length) {
//             const li = document.createElement("li");
//             li.className = "text-gray-500";
//             li.textContent = "No current patients connected";
//             currentList.appendChild(li);
//             return;
//         }

//         console.log({ connections })

//         currentConnections.forEach((c) => {
//             const li = document.createElement("li");
//             li.className =
//                 "grid grid-cols-[100px_1fr_auto_auto] border border-black rounded-md overflow-hidden";

//             li.innerHTML = `
//         <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">${c.role}</div>
//         <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">${c.name}</div>
//         <button class="bg-green-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">View</button>
//         <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">Remove</button>
//       `;

//             const [viewBtn, removeBtn] = li.querySelectorAll("button");
//             viewBtn.addEventListener("click", () => openModal(c));
//             removeBtn.addEventListener("click", () => {
//                 removeById(currentConnections, c.id);
//                 renderAll();
//             });

//             currentList.appendChild(li);
//         });
//     }

//     function renderOutgoingRequests() {
//         clearChildren(outgoingList);

//         if (!outgoingRequests.length) {
//             const li = document.createElement("li");
//             li.className = "text-gray-500";
//             li.textContent = "No outgoing requests";
//             outgoingList.appendChild(li);
//             return;
//         }

//         outgoingRequests.forEach((r) => {
//             const li = document.createElement("li");
//             li.className =
//                 "grid grid-cols-[100px_1fr_auto] border border-black rounded-md overflow-hidden";

//             li.innerHTML = `
//         <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">${r.role}</div>
//         <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">${r.name}</div>
//         <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">Remove</button>
//       `;

//             const removeBtn = li.querySelector("button");
//             removeBtn.addEventListener("click", () => {
//                 removeById(outgoingRequests, r.id);
//                 renderAll();
//             });

//             outgoingList.appendChild(li);
//         });
//     }

//     function renderAll() {
//         renderCurrentConnections();
//         renderOutgoingRequests();
//     }

//     if (document.readyState === "loading") {
//         document.addEventListener("DOMContentLoaded", renderAll, { once: true });
//     } else {
//         renderAll();
//     }
// })();


// (function () {
//   if (typeof document === "undefined") return;

//   const currentConnections = [
//     { role: "Doctor", name: "John Smith" },
//     { role: "Doctor", name: "Jane Smith" },
//     { role: "Family Member", name: "Jane Doe" },
//   ];

//   const connectionRequests = [
//     { role: "Doctor", name: "Doctor Eggman" },
//     { role: "Family Member", name: "Julia Doe" },
//   ];

//   const currentContainer = document.getElementById("currentConnections");
//   const outgoingContainer = document.getElementById("outgoingRequests");
//   const searchInput = document.getElementById("searchInput");

//   const modal = document.getElementById("viewModal");
//   const closeModalBtn = document.getElementById("closeViewModalBtn");
//   const modalRole = document.getElementById("viewModalRole");
//   const modalName = document.getElementById("viewModalName");

//   function renderConnections(filter = "") {
//     // --- Current Connections ---
//     currentContainer.innerHTML = "";
//     const filtered = currentConnections.filter(c =>
//       c.name.toLowerCase().includes(filter.toLowerCase())
//     );

//     if (filtered.length === 0) {
//       currentContainer.innerHTML =
//         '<p class="text-gray-500">No matching connections</p>';
//     } else {
//       filtered.forEach((c, idx) => {
//         const li = document.createElement("li");
//         li.className =
//           "grid grid-cols-[100px_1fr_auto] border border-black rounded-md overflow-hidden";

//         li.innerHTML = `
//           <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">${c.role}</div>
//           <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">${c.name}</div>
//           <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">Remove</button>
//         `;

//         const removeBtn = li.querySelector("button");
//         removeBtn.addEventListener("click", () => {
//           currentConnections.splice(idx, 1);
//           renderConnections(searchInput.value);
//         });

//         currentContainer.appendChild(li);
//       });
//     }

//     // --- Outgoing Requests ---
//     outgoingContainer.innerHTML = "";
//     connectionRequests.forEach((r, idx) => {
//       const li = document.createElement("li");
//       li.className =
//         "grid grid-cols-[100px_1fr_auto_auto] border border-black rounded-md overflow-hidden";

//       li.innerHTML = `
//         <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">${r.role}</div>
//         <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">${r.name}</div>
//         <button class="bg-[var(--color-tertiary)] text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">Add</button>
//         <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">Remove</button>
//       `;

//       const removeBtn = li.querySelectorAll("button")[1];
//       removeBtn.addEventListener("click", () => {
//         connectionRequests.splice(idx, 1);
//         renderConnections(searchInput.value);
//       });

//       outgoingContainer.appendChild(li);
//     });
//   }

//   // --- Search filtering ---
//   searchInput.addEventListener("input", e => {
//     renderConnections(e.target.value);
//   });

//   // --- Modal handling ---
//   closeModalBtn.addEventListener("click", () => {
//     modal.classList.add("hidden");
//     modal.classList.remove("flex");
//   });

//   // initial render
//   renderConnections();
// })();



// (function () {
//   if (typeof document === "undefined") return;

//   const currentConnections = [
//     { role: "Doctor", name: "John Smith" },
//     { role: "Doctor", name: "Jane Smith" },
//     { role: "Family Member", name: "Jane Doe" },
//   ];

//   const connectionRequests = [
//     { role: "Doctor", name: "Doctor Eggman" },
//     { role: "Family Member", name: "Julia Doe" },
//   ];

//   const currentContainer = document.getElementById("currentConnections");
//   const outgoingContainer = document.getElementById("outgoingRequests");

//   const searchPopup = document.getElementById("searchPopup");
//   const openSearchBtn = document.getElementById("openSearchBtn");
//   const cancelSearchBtn = document.getElementById("cancelSearchBtn");
//   const confirmSearchBtn = document.getElementById("confirmSearchBtn");
//   const searchInput = document.getElementById("searchInput");

//   const modal = document.getElementById("viewModal");
//   const closeModalBtn = document.getElementById("closeViewModalBtn");

//   function renderConnections(filter = "") {
//     // --- Current Connections ---
//     currentContainer.innerHTML = "";
//     const filtered = currentConnections.filter(c =>
//       c.name.toLowerCase().includes(filter.toLowerCase())
//     );

//     if (filtered.length === 0) {
//       currentContainer.innerHTML =
//         '<p class="text-gray-500">No matching connections</p>';
//     } else {
//       filtered.forEach((c, idx) => {
//         const li = document.createElement("li");
//         li.className =
//           "grid grid-cols-[100px_1fr_auto] border border-black rounded-md overflow-hidden";

//         li.innerHTML = `
//           <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">${c.role}</div>
//           <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">${c.name}</div>
//           <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">Remove</button>
//         `;

//         const removeBtn = li.querySelector("button");
//         removeBtn.addEventListener("click", () => {
//           currentConnections.splice(idx, 1);
//           renderConnections(filter);
//         });

//         currentContainer.appendChild(li);
//       });
//     }

//     // --- Outgoing Requests ---
//     outgoingContainer.innerHTML = "";
//     connectionRequests.forEach((r, idx) => {
//       const li = document.createElement("li");
//       li.className =
//         "grid grid-cols-[100px_1fr_auto_auto] border border-black rounded-md overflow-hidden";

//       li.innerHTML = `
//         <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">${r.role}</div>
//         <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">${r.name}</div>
//         <button class="bg-[var(--color-tertiary)] text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">Add</button>
//         <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">Remove</button>
//       `;

//       const removeBtn = li.querySelectorAll("button")[1];
//       removeBtn.addEventListener("click", () => {
//         connectionRequests.splice(idx, 1);
//         renderConnections(filter);
//       });

//       outgoingContainer.appendChild(li);
//     });
//   }

//   // --- Popup Controls ---
//   openSearchBtn.addEventListener("click", () => {
//     searchPopup.classList.remove("hidden");
//   });

//   cancelSearchBtn.addEventListener("click", () => {
//     searchPopup.classList.add("hidden");
//     searchInput.value = "";
//   });

//   confirmSearchBtn.addEventListener("click", () => {
//     const query = searchInput.value.trim();
//     renderConnections(query);
//     searchPopup.classList.add("hidden");
//   });

//   // --- Close modal ---
//   closeModalBtn.addEventListener("click", () => {
//     modal.classList.add("hidden");
//     modal.classList.remove("flex");
//   });

//   // --- Initial Render ---
//   renderConnections();
// })();




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
