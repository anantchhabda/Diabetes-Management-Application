(function () {
  //i18n helpers
  function dict() {
    const d = window.__i18n && window.__i18n.dict;
    return (typeof d === "function" ? d() : d) || {};
  }
  function t(key, fallback) {
    const d = dict();
    return (d && d[key]) != null ? String(d[key]) : fallback ?? key;
  }
  function currentLang() {
    return (document.documentElement && document.documentElement.lang) || "en";
  }
  function whenI18nReady(fn, maxTries = 20) {
    const want = currentLang();
    let tries = 0;
    const tick = () => {
      const ready =
        window.__i18n &&
        window.__i18n.lang === want &&
        window.__i18n.dict &&
        Object.keys(window.__i18n.dict).length > 0;
      if (ready) return fn();
      if (++tries >= maxTries) return fn();
      setTimeout(tick, 25);
    };
    tick();
  }
  function observeLangChanges(onReady) {
    try {
      const mo = new MutationObserver(() => whenI18nReady(onReady));
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });
    } catch (_) {}
  }

  // dom utils
  const $ = (id) => document.getElementById(id);
  const bySel = (sel, root = document) => root.querySelector(sel);
  function ensureEmptyMessage(containerId, emptyId, msgKey, fallback) {
    const container = $(containerId);
    if (!container) return;
    if (!container.children.length) {
      const empty = document.createElement("div");
      empty.id = emptyId;
      empty.className = "text-sm text-gray-600 italic";
      empty.setAttribute("data-i18n", msgKey);
      empty.textContent = t(msgKey, fallback);
      container.appendChild(empty);
    }
  }
  function removeEmptyMessage(id) {
    const el = $(id);
    if (el) el.remove();
  }

  // role labels
  function roleLabelKey(role) {
    switch (role) {
      case "Patient":
        return "role_patient";
      case "Doctor":
        return "role_doctor";
      case "Family":
      case "Family Member":
        return "role_family";
      default:
        return null;
    }
  }

  //rows to include i18n
  function outgoingRequestRow({ name }) {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto] border border-black transition-opacity duration-300";
    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2"
           data-i18n="role_patient">
        ${t("role_patient", "Patient")}
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="remove-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90"
              data-i18n="remove">
        ${t("remove", "Remove")}
      </button>
    `;
    return row;
  }

  function currentConnectionRow({ name, id }) {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto_auto] border border-black transition-opacity duration-300";
    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2"
           data-i18n="role_patient">
        ${t("role_patient", "Patient")}
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="view-btn bg-green-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90"
              data-i18n="view">
        ${t("view", "View")}
      </button>
      <button class="remove-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90"
              data-i18n="remove">
        ${t("remove", "Remove")}
      </button>
    `;

    bySel(".view-btn", row).addEventListener("click", () => {
      const target = `/patient-overview?id=${encodeURIComponent(id || "")}`;
      window.location.assign(target);
    });
    bySel(".remove-btn", row).addEventListener("click", () => {
      const container = $("currentConnectionsContainer");
      if (container && row.parentNode === container) container.removeChild(row);
      ensureEmptyMessage(
        "currentConnectionsContainer",
        "noCurrentConnections",
        "no_current_connections",
        "No current connections yet."
      );
    });
    return row;
  }

  // render sections
  function renderOutgoingRequests() {
    const container = $("outgoingRequestsContainer");
    if (!container) return;
    if (!container.children.length) {
      ensureEmptyMessage(
        "outgoingRequestsContainer",
        "noOutgoingRequests",
        "no_outgoing_requests",
        "No outgoing requests yet."
      );
    }
  }

  function renderCurrentConnections() {
    const container = $("currentConnectionsContainer");
    if (!container) return;
    if (!container.children.length) {
      ensureEmptyMessage(
        "currentConnectionsContainer",
        "noCurrentConnections",
        "no_current_connections",
        "No current connections yet."
      );
    }
  }

  function renderAllStaticText() {
    const hSearch = bySel("[data-i18n='search_connections']");
    if (hSearch)
      hSearch.textContent = t("search_connections", "Search for Connections");

    const btnSearch = $("openSearchBtn");
    if (btnSearch)
      btnSearch.textContent = `🔍 ${t("search_by_id", "Search by ID")}`;

    const hCurr = bySel("[data-i18n='current_connections']");
    if (hCurr)
      hCurr.textContent = t("current_connections", "Current Connections");

    const hOut = bySel("[data-i18n='outgoing_requests']");
    if (hOut) hOut.textContent = t("outgoing_requests", "Outgoing Requests");

    // popup copy
    const popTitleSearch = bySel("[data-i18n='search_patient_by_id']");
    if (popTitleSearch)
      popTitleSearch.textContent = t(
        "search_patient_by_id",
        "Search Patient by ID"
      );

    const lblPid = bySel("[data-i18n='patient_id_label']");
    if (lblPid) lblPid.textContent = t("patient_id_label", "Patient ID:");

    const input = $("patientIdInput");
    if (input)
      input.placeholder = t("enter_patient_id_placeholder", "Enter patient ID");

    const cancelSearchBtn = $("cancelSearchBtn");
    if (cancelSearchBtn) cancelSearchBtn.textContent = t("cancel", "Cancel");

    const nextBtn = $("confirmSearchBtn");
    if (nextBtn) nextBtn.textContent = t("next", "Next");

    const popTitleConfirm = bySel("[data-i18n='confirm_connection_request']");
    if (popTitleConfirm)
      popTitleConfirm.textContent = t(
        "confirm_connection_request",
        "Confirm Connection Request"
      );

    const lblName = bySel("[data-i18n='patient_name_label']");
    if (lblName) lblName.textContent = t("patient_name_label", "Patient Name:");

    const lblPid2 = bySel("[data-i18n='patient_id_label_confirm']");
    if (lblPid2)
      lblPid2.textContent = t("patient_id_label_confirm", "Patient ID:");

    const confirmReq = bySel("[data-i18n='confirm_request']");
    if (confirmReq)
      confirmReq.textContent = t("confirm_request", "Confirm Request");

    const backBtn = $("backToSearchBtn");
    if (backBtn) backBtn.textContent = t("cancel", "Cancel");

    const sendBtn = $("sendRequestBtn");
    if (sendBtn) sendBtn.textContent = t("send", "Send");

    // empty states already in DOM
    const noCurr = $("noCurrentConnections");
    if (noCurr)
      noCurr.textContent = t(
        "no_current_connections",
        "No current connections yet."
      );
    const noOut = $("noOutgoingRequests");
    if (noOut)
      noOut.textContent = t(
        "no_outgoing_requests",
        "No outgoing requests yet."
      );
  }

  // backend logic
  function tryLocalFakePatient(patientId) {
    if ((patientId || "").toUpperCase() === "123456A") {
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

  // public hook
  window.addCurrentConnection = function addCurrentConnection(conn) {
    try {
      if (!conn || !conn.name) return;
      const container = $("currentConnectionsContainer");
      if (!container) return;

      removeEmptyMessage("noCurrentConnections");
      const row = currentConnectionRow({ name: conn.name, id: conn.id });
      container.appendChild(row);
    } catch (e) {
      console.error("[family-connection] addCurrentConnection error:", e);
    }
  };

  // init
  function init() {
    renderAllStaticText();
    renderCurrentConnections();
    renderOutgoingRequests();

    //language change, re render 
    observeLangChanges(() =>
      whenI18nReady(() => {
        renderAllStaticText();
        renderCurrentConnections();
        renderOutgoingRequests();
      })
    );

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

    const show = (el) => el && el.classList.remove("hidden");
    const hide = (el) => el && el.classList.add("hidden");

    openSearchBtn.addEventListener("click", () => {
      if (patientIdInput) patientIdInput.value = "";
      if (searchError) searchError.textContent = "";
      show(searchView);
      hide(confirmView);
      show(searchPopup);
      setTimeout(() => patientIdInput && patientIdInput.focus(), 0);
    });

    cancelSearchBtn.addEventListener("click", () => {
      hide(searchPopup);
    });

    confirmSearchBtn.addEventListener("click", async () => {
      const id = (patientIdInput && patientIdInput.value.trim()) || "";
      if (!id) {
        if (searchError)
          searchError.textContent = t(
            "please_enter_patient_id",
            "Please enter a Patient ID."
          );
        patientIdInput && patientIdInput.focus();
        return;
      }

      confirmSearchBtn.disabled = true;
      const oldText = confirmSearchBtn.textContent;
      confirmSearchBtn.textContent = t("looking_up", "Looking up...");

      try {
        const patient = await lookupPatientById(id);
        if (confirmPatientName) confirmPatientName.textContent = patient.name;
        if (confirmPatientId) confirmPatientId.textContent = patient.id;
        hide(searchView);
        show(confirmView);
        confirmView.dataset.pid = patient.id;
        confirmView.dataset.pname = patient.name;
      } catch (e) {
        if (searchError)
          searchError.textContent = t(
            "invalid_id_patient_not_found",
            "Invalid ID. Patient not found."
          );
      } finally {
        confirmSearchBtn.disabled = false;
        confirmSearchBtn.textContent = oldText;
      }
    });

    backToSearchBtn.addEventListener("click", () => {
      hide(confirmView);
      show(searchView);
      if (patientIdInput) {
        patientIdInput.value = "";
        patientIdInput.focus();
      }
    });

    sendRequestBtn.addEventListener("click", async () => {
      const pname = confirmView.dataset.pname;
      const pid = confirmView.dataset.pid;
      if (!pid || !pname) return;

      const outContainer = $("outgoingRequestsContainer");
      if (outContainer) {
        removeEmptyMessage("noOutgoingRequests");
        const row = outgoingRequestRow({ name: pname });
        bySel(".remove-btn", row).addEventListener("click", () => {
          outContainer.removeChild(row);
          ensureEmptyMessage(
            "outgoingRequestsContainer",
            "noOutgoingRequests",
            "no_outgoing_requests",
            "No outgoing requests yet."
          );
        });
        outContainer.appendChild(row);
      }

      await sendConnectionRequest({ id: pid, name: pname });

      hide(searchPopup);
      hide(confirmView);
      show(searchView);
      if (patientIdInput) patientIdInput.value = "";
    });
  }

  if (typeof document === "undefined") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
