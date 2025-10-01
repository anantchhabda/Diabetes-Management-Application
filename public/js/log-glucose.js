// /public/js/log-glucose.js
(function () {
  if (typeof document === "undefined") return;

  // --- DOM helpers ---
  const $ = (id) => document.getElementById(id);

  // --- Elements ---
  const dateInput   = $("glucoseDate");
  const tableBody   = $("glucoseTable");
  const modal       = $("glucoseModal");
  const modalTitle  = $("glucoseModalTitle");
  const modalInput  = $("glucoseModalInput");
  const warn        = $("glucoseWarning");
  const cancelBtn   = $("cancelGlucoseBtn");
  const confirmBtn  = $("confirmGlucoseBtn");
  const backBtn     = $("backGlucoseBtn");

  // --- Constants & state ---
  const ROWS = [
    "Before Breakfast",
    "After Breakfast",
    "Before Lunch",
    "After Lunch",
    "Before Dinner",
    "After Dinner",
  ];

  // data[type] = numeric string (e.g., "7.2") or ""
  const data = {};
  let currentRow = null;

  // --- Utils ---
  const todayStr = () => {
    const t = new Date();
    const yyyy = String(t.getFullYear()).padStart(4, "0");
    const mm   = String(t.getMonth() + 1).padStart(2, "0");
    const dd   = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const openModal = (rowLabel) => {
    currentRow = rowLabel;
    modalTitle.textContent = rowLabel;
    modalInput.value = data[rowLabel] || "";
    warn.classList.add("hidden");
    modal.classList.remove("hidden");
    modalInput.focus();
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    currentRow = null;
    warn.classList.add("hidden");
    warn.textContent = "";
  };

  function renderTable() {
    tableBody.innerHTML = "";
    ROWS.forEach((rowLabel) => {
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

      const btn = document.createElement("button");
      btn.className = "bg-green-600 text-white px-2 sm:px-3 py-1 rounded ml-2 text-xs sm:text-sm";
      btn.textContent = "Edit";
      btn.addEventListener("click", () => openModal(rowLabel));

      tdValue.appendChild(spanValue);
      tdValue.appendChild(btn);

      tr.appendChild(tdRow);
      tr.appendChild(tdValue);
      tableBody.appendChild(tr);
    });
  }

  // --- API calls ---
  async function apiGetLogs(date) {
    const res = await fetch(`/api/patient/me/glucoselog?date=${encodeURIComponent(date)}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      let msg = "Failed to load logs.";
      try {
        const j = await res.json();
        msg = j.error || j.message || msg;
      } catch {}
      throw new Error(msg);
    }
    return res.json(); // { logs: [...] }
  }

  async function apiCreateLog(date, type, glucoseLevel) {
    const res = await fetch(`/api/patient/me/glucoselog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ date, type, glucoseLevel }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || j.message || "Create failed");
    }
    return res.json(); // may include {alert: "..."} when flag=true
  }

  async function apiPatchLog(date, type, glucoseLevel) {
    const res = await fetch(`/api/patient/me/glucoselog?date=${encodeURIComponent(date)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type, glucoseLevel }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      // bubble up status for fallback-on-404 logic
      const err = new Error(j.error || j.message || "Update failed");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  // --- Load & hydrate ---
  async function loadDay(date) {
    // show spinner-ish text while loading
    tableBody.innerHTML = `
      <tr class="border">
        <td class="px-3 py-2 text-sm sm:text-base" colspan="2">Loading...</td>
      </tr>
    `;
    try {
      const { logs = [] } = await apiGetLogs(date);
      // Reset & map to state
      ROWS.forEach((r) => (data[r] = ""));
      logs.forEach((log) => {
        if (ROWS.includes(log.type)) {
          // keep as a string for display; backend stores Number
          data[log.type] = (log.glucoseLevel ?? "").toString();
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

  // --- Save flow from modal ---
  async function saveFromModal() {
    if (!currentRow) return;

    const date = dateInput.value;
    let raw = modalInput.value.trim();

    // Clear (delete) when empty input
    if (raw === "") {
      try {
        await apiPatchLog(date, currentRow, ""); // backend: empty string => deleteOne
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
      warn.textContent = "Please enter a valid number (e.g., 6.5).";
      warn.classList.remove("hidden");
      modalInput.focus();
      return;
    }
    if (val < 0) {
      warn.textContent = "Glucose level cannot be negative.";
      warn.classList.remove("hidden");
      modalInput.focus();
      return;
    }

    // Prefer PATCH; if 404 (not found) then POST
    try {
      await apiPatchLog(date, currentRow, val);
      // success -> update UI
      data[currentRow] = String(val);
      const span = document.getElementById(`${currentRow}-value`);
      if (span) span.textContent = data[currentRow];
      closeModal();
    } catch (e) {
      if (e.status === 404) {
        // No existing log for this (date,type) -> create
        try {
          const resp = await apiCreateLog(date, currentRow, val);
          data[currentRow] = String(val);
          const span = document.getElementById(`${currentRow}-value`);
          if (span) span.textContent = data[currentRow];
          if (resp?.alert) {
            // backend sets flag via pre-save; POST returns {alert: "..."} when high
            alert(resp.alert);
          }
          closeModal();
        } catch (e2) {
          console.error(e2);
          alert(e2.message || "Failed to create log.");
        }
      } else {
        console.error(e);
        alert(e.message || "Failed to update log.");
      }
    }
  }

  // --- Wire up ---
  if (!dateInput.value) dateInput.value = todayStr();
  loadDay(dateInput.value);

  dateInput.addEventListener("change", (e) => loadDay(e.target.value));
  cancelBtn.addEventListener("click", closeModal);
  confirmBtn.addEventListener("click", saveFromModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  backBtn.addEventListener("click", () => window.history.back());

  console.log("[glucose] ready");
})();
