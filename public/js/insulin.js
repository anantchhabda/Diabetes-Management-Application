// (function () {
//   if (typeof document === "undefined") return; // skip server

//   const modal = document.getElementById("modal");
//   const modalTitle = document.getElementById("modalTitle");
//   const modalInput = document.getElementById("modalInput");
//   const warning = document.getElementById("warning");
//   const cancelBtn = document.getElementById("cancelBtn");
//   const confirmBtn = document.getElementById("confirmBtn");
//   const saveBtn = document.getElementById("saveBtn");
//   const dateInput = document.getElementById("dateInput");

//   let currentRow = null;
//   const data = {};

//   function openModal(row) {
//     currentRow = row;
//     modalTitle.textContent = `Edit ${row}`;
//     modalInput.value = data[row] || "";
//     warning.classList.add("hidden");
//     modal.classList.remove("hidden");
//   }

//   function closeModal() {
//     modal.classList.add("hidden");
//     currentRow = null;
//   }

//   function saveRow() {
//     const val = modalInput.value.trim();
//     if (!/^\d*$/.test(val)) {
//       warning.textContent = "⚠️ Please enter numbers only";
//       warning.classList.remove("hidden");
//       return;
//     }
//     data[currentRow] = val;
//     document.getElementById(`${currentRow}Value`).textContent = val ? `${val} mg/dl` : "";
//     closeModal();
//   }

//   // Edit buttons
//   document.querySelectorAll(".editBtn").forEach((btn) => {
//     btn.addEventListener("click", () => openModal(btn.dataset.row));
//   });

//   cancelBtn.addEventListener("click", closeModal);
//   confirmBtn.addEventListener("click", saveRow);

//   saveBtn.addEventListener("click", () => {
//     alert("Data saved:\n" + JSON.stringify(data, null, 2));
//   });

//   dateInput.addEventListener("change", (e) => {
//     console.log("Selected date:", e.target.value);
//   });
// })();



(function () {
  if (typeof document === "undefined") return;

  window.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalInput = document.getElementById("modalInput");
    const warning = document.getElementById("warning");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const saveBtn = document.getElementById("saveBtn");
    const dateInput = document.getElementById("dateInput");

    if (!modal) {
      console.warn("⚠️ Modal elements not found in DOM.");
      return;
    }

    let currentRow = null;
    const data = {};

    function openModal(row) {
      currentRow = row;
      modalTitle.textContent = `Edit ${row}`;
      modalInput.value = data[row] || "";
      warning.classList.add("hidden");
      modal.classList.remove("hidden");
    }

    function closeModal() {
      modal.classList.add("hidden");
      currentRow = null;
    }

    function saveRow() {
      const val = modalInput.value.trim();
      if (!/^\d*$/.test(val)) {
        warning.textContent = "⚠️ Please enter numbers only";
        warning.classList.remove("hidden");
        return;
      }
      data[currentRow] = val;
      const valueEl = document.getElementById(`${currentRow}Value`);
      if (valueEl) valueEl.textContent = val ? `${val} mg/dl` : "";
      closeModal();
    }

    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.row));
    });

    cancelBtn?.addEventListener("click", closeModal);
    confirmBtn?.addEventListener("click", saveRow);

    saveBtn?.addEventListener("click", () => {
      alert("Data saved:\n" + JSON.stringify(data, null, 2));
    });

    dateInput?.addEventListener("change", (e) => {
      console.log("Selected date:", e.target.value);
    });
  });
})();
