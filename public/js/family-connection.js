(function () {
  let currentPatient = null;

  const $ = (id) => document.getElementById(id);
  const show = (el) => el && el.classList.remove("hidden");
  const hide = (el) => el && el.classList.add("hidden");

  function ensureEmptyMessage(containerId, emptyId, msg) {
    const container = $(containerId);
    if (!container) return;
    if (!container.children.length) {
      const empty = document.createElement("div");
      empty.id = emptyId;
      empty.className = "text-sm text-gray-600 italic";
      empty.textContent = msg;
      container.appendChild(empty);
    }
  }
  function removeEmptyMessage(id) {
    const el = $(id);
    if (el) el.remove();
  }

  function renderOutgoingRequestRow(patient) {
    const container = $("outgoingRequestsContainer");
    const empty = $("noOutgoingRequests");
    if (!container) return;
    if (empty) empty.remove();

    const row = document.createElement("div");
    row.className = "grid grid-cols-[100px_1fr_auto] border border-black";

    row.innerHTML = `
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

    const removeBtn = row.querySelector("button");
    removeBtn.addEventListener("click", () => {
      container.removeChild(row);
      if (!container.children.length) {
        const emptyMsg = document.createElement("div");
        emptyMsg.id = "noOutgoingRequests";
        emptyMsg.className = "text-sm text-gray-600 italic";
        emptyMsg.textContent = "No outgoing requests yet.";
        container.appendChild(emptyMsg);
      }
    });

    container.appendChild(row);
  }

  // render a new connection
  function renderCurrentConnection({ name, id }) {
    const container = $("currentConnectionsContainer");
    if (!container) return;

    removeEmptyMessage("noCurrentConnections");

    const row = document.createElement("div");
    row.className = "grid grid-cols-[100px_1fr_auto_auto] border border-black";

    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        Patient
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="view-btn bg-green-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        View
      </button>
      <button class="remove-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        Remove
      </button>
    `;

    const viewBtn = row.querySelector(".view-btn");
    const removeBtn = row.querySelector(".remove-btn");

    viewBtn.addEventListener("click", () => {
      // adam to route this
      const target = `/patient-overview?id=${encodeURIComponent(id || "")}`;
      window.location.assign(target);
    });

    removeBtn.addEventListener("click", () => {
      container.removeChild(row);
      if (!container.children.length) {
        ensureEmptyMessage(
          "currentConnectionsContainer",
          "noCurrentConnections",
          "No current connections yet."
        );
      }
    });

    container.appendChild(row);
  }

  async function lookupPatientById(patientId) {
    const token = localStorage.getItem("authToken") || "";
    const res = await fetch(`/api/auth/me/patient/${patientId}/link`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Lookup failed (${res.status})`);

    const {patient} = await res.json();
    if (!patient || !patient.profileId || !patient.name)
      throw new Error("Invalid response shape");
    return { id: patient.profileId, name: patient.name };
  }

  async function sendConnectionRequest(patientId) {
    const token = localStorage.getItem("authToken") || "";
    try {
      await fetch(`/api/auth/me/patient/${patientId}/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
    } catch (err) {
      console.error('Failed to send connection request:', err);
    }
  }

  //public hook should be called when patient accepts request
  window.addCurrentConnection = function addCurrentConnection(conn) {
    try {
      if (!conn || !conn.name) return;
      renderCurrentConnection({ name: conn.name, id: conn.id });
    } catch (e) {
      console.error("[family-connection] addCurrentConnection error:", e);
    }
  };

  function init() {
    const openSearchBtn = $("openSearchBtn");
    const searchPopup = $("searchPopup");
    const searchView = $("searchView");
    const confirmView = $("confirmView");

    const patientIdInput = $("patientIdInput");
    const confirmPatientName = $("confirmPatientName");
    const confirmPatientId = $("confirmPatientId");
    const searchError = $("searchError");

    const cancelSearchBtn = $("cancelSearchBtn");
    const confirmSearchBtn = $("confirmSearchBtn");
    const backToSearchBtn = $("backToSearchBtn");
    const sendRequestBtn = $("sendRequestBtn");

    if (!openSearchBtn || !searchPopup) return;

    // open modal
    openSearchBtn.addEventListener("click", () => {
      patientIdInput.value = "";
      searchError.textContent = "";
      show(searchView);
      hide(confirmView);
      show(searchPopup);
      setTimeout(() => patientIdInput.focus(), 0);
    });

    // cancel
    cancelSearchBtn.addEventListener("click", () => {
      hide(searchPopup);
    });

    // lookup
    confirmSearchBtn.addEventListener("click", async () => {
      const id = patientIdInput.value.trim();
      if (!id) {
        searchError.textContent = "Please enter a Patient ID.";
        patientIdInput.focus();
        return;
      }

      confirmSearchBtn.disabled = true;
      const oldText = confirmSearchBtn.textContent;
      confirmSearchBtn.textContent = "Looking up…";

      try {
        const patient = await lookupPatientById(id);
        currentPatient = patient;
        confirmPatientName.textContent = patient.name;
        confirmPatientId.textContent = patient.id;
        hide(searchView);
        show(confirmView);
      } catch (e) {
        searchError.textContent = "Invalid ID. Patient not found.";
        currentPatient = null;
      } finally {
        confirmSearchBtn.disabled = false;
        confirmSearchBtn.textContent = oldText;
      }
    });

    // back
    backToSearchBtn.addEventListener("click", () => {
      currentPatient = null;
      patientIdInput.value = "";
      hide(confirmView);
      show(searchView);
      patientIdInput.focus();
    });

    // send renders in outgoing request
    sendRequestBtn.addEventListener("click", async () => {
      if (!currentPatient) return;
      renderOutgoingRequestRow(currentPatient);
      await sendConnectionRequest(currentPatient.id);
      hide(searchPopup);
      currentPatient = null;
      patientIdInput.value = "";
      hide(confirmView);
      show(searchView);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
