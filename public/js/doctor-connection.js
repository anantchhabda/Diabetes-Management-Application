(function () {

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

  function bySel(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function removeEmptyMessage(id) {
    const el = $(id);
    if (el) el.remove();
  }

  function fadeOutAndRemove(el, cb) {
    el.classList.add("opacity-0");
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (typeof cb === "function") cb();
    }, 300);
  }

  function currentConnectionRow({ name, patientID }) {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto_auto] border border-black transition-opacity duration-300";
    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        Patient
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="view-btn bg-green-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">View</button>
      <button class="remove-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        Remove
      </button>
    `;
    row.dataset.patientId = patientID;
    return row;
  }

  function outgoingRequestRow({ requestId, patientName }) {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto_auto] border border-black transition-all duration-300";
    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        Patient
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${patientName}
      </div>
      <button class="cancel-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">\
        Cancel
      </button>
    `;
    row.dataset.requestId = requestId;
    return row;
  }

  //render outgoing requests
  let isRenderingRequest = false;
  async function renderOutgoingRequest() {
    if (isRenderingRequest) return; //prevent duplicate render
    isRenderingRequest = true;

    const container = $("outgoingRequestsContainer");
    if (!container) return;
    clearChildren(container);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.warn("Session expired, please login again");

      const res = await fetch("/api/doctor/me/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) throw new Error(`Load requests failed (${res.status})`);
      const data = await res.json();
      const requests = data.requests || [];

      if (!requests.length) {
        ensureEmptyMessage(
          "outgoingRequestsContainer",
          "noOutgoingRequests",
          "no_outgoing_requests",
          "No pending requests."
        );
        return;
      }

      requests.forEach((req) => {
        const row = outgoingRequestRow({
          patientName: req.patientName,
          requestId: req._id,
        });

        const cancelBtn = bySel(".cancel-btn", row);
        cancelBtn.addEventListener('click', async () => {
          try {
            const delRes = await fetch(`/api/doctor/me/requests/${req._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!delRes.ok) throw new Error("Failed to cancel request");
            fadeOutAndRemove(row, () => {
              if (!container.children.length)
                ensureEmptyMessage(
                  "outgoingRequestsContainer",
                  "noOutgoingRequests",
                  "no_outgoing_requests",
                  "No pending requests."
                );
            });
          } catch (err) {
            console.error("Error cancelling request:", err);
          }
        });

        container.appendChild(row);
      });
    } catch (err) {
      console.error("Error loading outgoing requests", err);
    } finally {
      isRenderingRequest = false;
    }
  }

  // render a current connection
  let isRenderingConnection = false;
  async function renderCurrentConnection() {
    if (isRenderingConnection) return; //prevent duplicate render
    isRenderingConnection = true;

    const container = $("currentConnectionsContainer");
    if (!container) return;
    clearChildren(container);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.warn("Session expired, please login again");
      const res = await fetch("/api/doctor/me/connection", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      if (!res.ok) throw new Error(`Load current connections failed (${res.status})`);
      const data = await res.json();
      const connections = data.connections || [];

      if (!connections.length) {
        ensureEmptyMessage(
          "currentConnectionsContainer",
          "noCurrentConnections",
          "no_current_connections",
          "No current connections yet."
        );
        return;
      }

      connections.forEach((conn) => {
        const row = currentConnectionRow({
          name: conn.patientName,
          patientID: conn.patient,
        });
        const removeBtn = bySel(".remove-btn", row);
        removeBtn.addEventListener("click", async() => {
          try {
            const delRes = await fetch(`/api/auth/me/patient/${conn.patient}/link`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (!delRes.ok) throw new Error("Failed to remove connection");
            fadeOutAndRemove(row, () => {
              if (!container.children.length)
                ensureEmptyMessage(
                  "currentConnectionsContainer",
                  "noCurrentConnections",
                  "no_current_connections",
                  "No current connections yet."
                );
            });
          } catch (err) {
            console.error("Error removing connection:", err);
          }
        });
        container.appendChild(row)
      });
    } catch (err) {
      console.error("Error loading connections", err);
    } finally {
      isRenderingConnection = false;
    }
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

  //public hook - this should be called when patient accepts a request
  window.addCurrentConnection = async function addCurrentConnection(conn) {
    try {
      if (!conn || !conn.name || !conn.id) {
        console.warn("[doctor-connection] Invalid connection data:", conn);
        return;
      }

      console.log("[doctor-connection] Adding new connection:", conn);
      await renderCurrentConnection(); //refresh list
      await renderOutgoingRequest(); //remove accepted request
    } catch (e) {
      console.error("[doctor-connection] addCurrentConnection error:", e);
    }
  };

  window.removeOutgoingRequest = async function removeOutgoingRequest(requestId) {
    try {
      console.log("[doctor-connection] Removing outgoing request:", requestId);
      await renderOutgoingRequest();
    } catch (e) {
      console.error("[doctor-connection] removeOutgoingRequest error:", e);
    }
  };

  window.removeCurrentConnection = async function removeCurrentConnection(patientId) {
    try {
      console.log("[doctor-connection] Removing current connection:", patientId);
      await renderCurrentConnection();
    } catch (e) {
      console.error("[doctor-connection] removeCurrentConnection error:", e);
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

    let selectedPatient = null;

    openSearchBtn.addEventListener("click", () => {
      patientIdInput.value = "";
      searchError.textContent = "";
      show(searchView);
      hide(confirmView);
      show(searchPopup);
      setTimeout(() => patientIdInput.focus(), 0);
    });

    cancelSearchBtn.addEventListener("click", () => {
      hide(searchPopup);
    });

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
        selectedPatient = patient;
        confirmPatientName.textContent = patient.name;
        confirmPatientId.textContent = patient.id;
        hide(searchView);
        show(confirmView);
      } catch (e) {
        searchError.textContent = "Invalid ID. Patient not found.";
        selectedPatient = null;
      } finally {
        confirmSearchBtn.disabled = false;
        confirmSearchBtn.textContent = oldText;
      }
    });

    backToSearchBtn.addEventListener("click", () => {
      selectedPatient = null;
      patientIdInput.value = "";
      hide(confirmView);
      show(searchView);
      patientIdInput.focus();
    });

    sendRequestBtn.addEventListener("click", async () => {
      if (!selectedPatient) return;
      
      await sendConnectionRequest(selectedPatient.id);
      hide(searchPopup);
      selectedPatient = null;
      patientIdInput.value = "";
      hide(confirmView);
      show(searchView);

      await renderOutgoingRequest();
    });

    renderCurrentConnection();
    renderOutgoingRequest();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
