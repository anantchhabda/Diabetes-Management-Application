(function () {
  if (typeof document === "undefined") return;
  const $ = (id) => document.getElementById(id);
  const dateInput   = $("insulinDate");
  const tableBody   = $("insulinTable");
  const modal       = $("insulinModal");
  const modalTitle  = $("insulinModalTitle");
  const modalInput  = $("insulinModalInput");
  const warning     = $("insulinWarning");
  const cancelBtn   = $("cancelInsulinBtn");
  const confirmBtn  = $("confirmInsulinBtn");
  const backBtn     = $("backInsulinBtn");
  const rows = [
    "Breakfast",
    "Lunch",
    "Dinner",
  ];

  const data = {};
  let currentRow = null;
  let role = null;           // "Patient" | "Doctor" | "Family Member"
  let canEdit = false;       // role === "Patient"
  let viewerPatientID = null; // patient profileId when viewing as doctor/family

  function getPatientIDFromURL() {
    const url = new URL(window.location.href);
    return url.searchParams.get('patientID'); // null for real patient
  }

  const todayStr = () => {
    const today = new Date();
    return String(today.getFullYear()).padStart(4, '0') + '-' +
           String(today.getMonth() + 1).padStart(2, '0') + '-' +   
           String(today.getDate()).padStart(2, '0');
  };

  const openModal = (rowLabel) => {
    currentRow = rowLabel;
    modalTitle.textContent = rowLabel;
    modalInput.value = data[rowLabel] || "";
    warning.classList.add("hidden");
    modal.classList.remove("hidden");
    modalInput.focus();
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    currentRow = null;
    warning.classList.add("hidden");
    warning.textContent = "";
  };

  function renderTable() {
    tableBody.innerHTML = "";
    rows.forEach((rowLabel) => {
      const tr = document.createElement("tr");
      tr.className = "border";

      const tdRow = document.createElement("td");
      tdRow.className = "bg-sky-950 text-white font-bold w-[35%] px-2 sm:px-3 py-2 text-sm sm:text-base";
      tdRow.textContent = rowLabel;

      const tdValue = document.createElement("td");
      tdValue.className = "px-2 sm:px-3 py-2 flex justify-between items-center text-sm sm:text-base";

      const spanValue = document.createElement("span");
      spanValue.id = `${rowLabel}-value`;
      spanValue.textContent = data[rowLabel] ?? "";

      tdValue.appendChild(spanValue);

      if (canEdit) {
        const btn = document.createElement("button");
        btn.className = "bg-green-600 text-white px-2 sm:px-3 py-1 rounded ml-2 text-xs sm:text-sm";
        btn.textContent = "Edit";
        btn.addEventListener("click", () => openModal(rowLabel));
        tdValue.appendChild(btn);
      }

      tr.appendChild(tdRow);
      tr.appendChild(tdValue);
      tableBody.appendChild(tr);
    });
  }

  async function getMe() {
    const res = await fetch('/api/auth/me', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      },
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message ||'Failed to get user info');
      err.status = res.status;
      throw err;
    }
    return res.json(); // { role, profile: {...} }
  }

  async function fetchPatientLog(date) {
    const res = await fetch(`/api/patient/me/insulinlog?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      },
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Failed to load logs");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  async function fetchViewerLog(date, patientID) {
    if (!patientID) {
      const err = new Error("Missing patientID");
      err.status = 400;
      throw err;
    }
    const res = await fetch(
      `/api/auth/me/patient/${encodeURIComponent(patientID)}/viewlog?date=${date}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
      });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Failed to load logs");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  async function fetchLog(date) {
    if (canEdit) return fetchPatientLog(date);
    return fetchViewerLog(date, viewerPatientID);
  }

  async function createLog(date, type, dose) {
    const res = await fetch(`/api/patient/me/insulinlog`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      },
      body: JSON.stringify({ date, type, dose }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Create failed");
      err.status = res.status;
      throw err;
    }
    return res.json(); 
  }

  async function updateOrDeleteLog(date, type, dose) {
    const res = await fetch(`/api/patient/me/insulinlog?date=${date}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      },
      body: JSON.stringify({ type, dose }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Update failed");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  // --- Load & hydrate ---
  async function loadInsulin(date) {
    // show spinner-ish text while loading
    tableBody.innerHTML = `
      <tr class="border">
        <td class="px-3 py-2 text-sm sm:text-base" colspan="2">Loading...</td>
      </tr>
    `;
    try {
      const { logs = [] } = await fetchLog(date);
      // Reset & map to state
      rows.forEach((r) => (data[r] = ""));  //reset
      logs.forEach((log) => {
        if (rows.includes(log.type)) {
          // keep as a string for display; backend stores Number
          data[log.type] = (log.dose ?? "").toString();
        }
      });
      renderTable();
    } catch (e) {
      console.error(e);
      tableBody.innerHTML = `
        <tr class="border">
          <td class="px-3 py-2 text-sm sm:text-base text-red-700" colspan="2">
            ${e.message || "Failed to load logs."}
          </td>
        </tr>
      `;
    }
  }

  // --- Save ---
  async function saveInsulin() {
    if (!currentRow) return;

    if (!canEdit) {
      alert("You do not have permission to edit.");
      return;
    }

    const date = dateInput.value;
    const raw = modalInput.value.trim();

    // Clear (delete) when empty input
    if (raw === "") {
      try {
        await updateOrDeleteLog(date, currentRow, "");
        data[currentRow] = "";
        const span = document.getElementById(`${currentRow}-value`);
        if (span) span.textContent = "";
        closeModal();
      } catch (e) {
        console.error(e);
        alert(e.message || "Failed to clear log.");
      }
      return;
    }

    // Validate numeric
    const val = parseFloat(raw);
    if (Number.isNaN(val)) {
      warning.textContent = "Please enter a valid number (e.g., 6.5).";
      warning.classList.remove("hidden");
      modalInput.focus();
      return;
    }
    if (val < 0) {
      warning.textContent = "Insulin dose cannot be negative.";
      warning.classList.remove("hidden");
      modalInput.focus();
      return;
    }

    // Try PATCH first; if 404 (not found) then POST
    let maybeAlert = null;
    try {
      const resp = await updateOrDeleteLog(date, currentRow, val);
      maybeAlert = resp?.alert || null;
    } catch (e) {
      if (e.status === 404) {
        const resp = await createLog(date, currentRow, val);
        maybeAlert = resp?.alert || null;
      } else {
        console.error(e);
        alert(e.message || "Failed to save log.");
        return;
      }
    }
    //Update UI
    data[currentRow] = String(val);
    const span = document.getElementById(`${currentRow}-value`);
    if (span) span.textContent = data[currentRow];
    closeModal();

    //Show alert only if POST/PATCH returned one
    if (maybeAlert) alert(maybeAlert);
  }

  (async function init() {
    if (!dateInput.value) dateInput.value = todayStr();

    try {
      const me = await getMe();
      role = me?.role || null;
      canEdit = role === 'Patient';

      // For Doctor / Family Member, we need a patientID to view
      if (!canEdit) {
      viewerPatientID = getPatientIDFromURL();
      }
    } catch (e) {
      console.error(e);
      // if whoami fails, table will show the error anyway on load
    }

    // Load table
    await loadInsulin(dateInput.value);

    dateInput.addEventListener("change", (e) => loadInsulin(e.target.value));
    cancelBtn.addEventListener("click", closeModal);
    confirmBtn.addEventListener("click", saveInsulin);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    backBtn.addEventListener("click", () => window.history.back());

    console.log("[insulin] ready, role =)", role, "canEdit =", canEdit, "viewerPatientID =", viewerPatientID);
  })();
})();
