(function () {
  let currentPatient = null;

  const $ = (id) => document.getElementById(id);
  const show = (el) => el.classList.remove("hidden");
  const hide = (el) => el.classList.add("hidden");

  function renderOutgoingRequestRow(patient) {
    const container = $("outgoingRequestsContainer");
    const empty = $("noOutgoingRequests");
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

  // Fake patient lookup
  function tryLocalFakePatient(patientId) {
    if (patientId.toUpperCase() === "123456A") {
      return { id: "123456A", name: "Azz" };
    }
    return null;
  }

  async function lookupPatientById(patientId) {
    const local = tryLocalFakePatient(patientId);
    if (local) return local;

    const token = localStorage.getItem("authToken") || "";
    const res = await fetch("/api/connections/lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ patientId }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Lookup failed (${res.status})`);

    const data = await res.json();
    if (!data || !data.id || !data.name)
      throw new Error("Invalid response shape");
    return data;
  }

  async function sendConnectionRequest(patient) {
    const token = localStorage.getItem("authToken") || "";
    try {
      await fetch("/api/connections/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ patientId: patient.id }),
      });
    } catch (_) {}
  }

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

    backToSearchBtn.addEventListener("click", () => {
      currentPatient = null;
      patientIdInput.value = "";
      hide(confirmView);
      show(searchView);
      patientIdInput.focus();
    });

    sendRequestBtn.addEventListener("click", async () => {
      if (!currentPatient) return;
      renderOutgoingRequestRow(currentPatient);
      await sendConnectionRequest(currentPatient);
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
