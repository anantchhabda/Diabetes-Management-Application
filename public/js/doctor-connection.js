(function () {
  // i18n helpers
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
  const bySel = (sel, root = document) => (root || document).querySelector(sel);
  function clearChildren(el) {
    while (el && el.firstChild) el.removeChild(el.firstChild);
  }
  function fadeOutAndRemove(el, cb) {
    el.classList.add("opacity-0");
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (typeof cb === "function") cb();
    }, 300);
  }

  // role labels
  function roleLabel(role) {
    switch (role) {
      case "Patient":
        return t("role_patient", "Patient");
      case "Doctor":
        return t("role_doctor", "Doctor");
      case "Family":
      case "Family Member":
        return t("role_family", "Family");
      default:
        return role || "";
    }
  }

  // empty state helper
  function ensureEmptyMessage(containerId, emptyId, msgKey, fallback) {
    const container = $(containerId);
    if (!container) return;
    if (!container.children.length) {
      const empty = document.createElement("div");
      empty.id = emptyId;
      empty.className = "text-sm text-gray-600 italic";
      empty.textContent = t(msgKey, fallback);
      container.appendChild(empty);
    }
  }
  function removeEmptyMessage(id) {
    const el = $(id);
    if (el) el.remove();
  }

  // rows
  function outgoingRequestRow({ name }) {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto] border border-black transition-opacity duration-300";
    row.innerHTML = `
      <div class="role-cell bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        ${roleLabel("Patient")}
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="remove-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
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
      <div class="role-cell bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        ${roleLabel("Patient")}
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="view-btn bg-green-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        ${t("view", "View")}
      </button>
      <button class="remove-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        ${t("remove", "Remove")}
      </button>
    `;
    // wire actions
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

  // render rows after language switch
  function retranslateDynamicRows() {
    const curr = $("currentConnectionsContainer");
    if (curr) {
      curr.querySelectorAll(".role-cell").forEach((cell) => {
        cell.textContent = roleLabel("Patient");
      });
      curr.querySelectorAll(".view-btn").forEach((btn) => {
        btn.textContent = t("view", "View");
      });
      curr.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.textContent = t("remove", "Remove");
      });
      const empty = $("noCurrentConnections");
      if (empty) {
        empty.textContent = t(
          "no_current_connections",
          "No current connections yet."
        );
      }
    }
    // outgoing requests
    const out = $("outgoingRequestsContainer");
    if (out) {
      out.querySelectorAll(".role-cell").forEach((cell) => {
        cell.textContent = roleLabel("Patient");
      });
      out.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.textContent = t("remove", "Remove");
      });
      const empty = $("noOutgoingRequests");
      if (empty) {
        empty.textContent = t(
          "no_outgoing_requests",
          "No outgoing requests yet."
        );
      }
    }
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

    // popup texts
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

    // empty-state defaults
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

  // public hook when patient accepts
  window.addCurrentConnection = function addCurrentConnection(conn) {
    try {
      if (!conn || !conn.name) return;
      const container = $("currentConnectionsContainer");
      if (!container) return;

      removeEmptyMessage("noCurrentConnections");
      const row = currentConnectionRow({ name: conn.name, id: conn.id });
      container.appendChild(row);
    } catch (e) {
      console.error("[doctor-connection] addCurrentConnection error:", e);
    }
  };

  // init/popup wiring
  function init() {
    // initial i18n text
    renderAllStaticText();
    renderCurrentConnections();
    renderOutgoingRequests();

    // observe lang changes → retranslate
    observeLangChanges(() =>
      whenI18nReady(() => {
        renderAllStaticText();
        renderCurrentConnections();
        renderOutgoingRequests();
        retranslateDynamicRows(); //
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
        // fill confirmation view
        if (confirmPatientName) confirmPatientName.textContent = patient.name;
        if (confirmPatientId) confirmPatientId.textContent = patient.id;
        hide(searchView);
        show(confirmView);
        // stash in element dataset for send stage
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

      // render locally
      const outContainer = $("outgoingRequestsContainer");
      if (outContainer) {
        removeEmptyMessage("noOutgoingRequests");
        const row = outgoingRequestRow({ name: pname });
        // wire remove
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

      // reset popup
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
