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

  // 🔐 wait for auth token on soft navigations
  async function waitForToken(maxMs = 1500) {
    const start = Date.now();
    while (!localStorage.getItem("authToken") && Date.now() - start < maxMs) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  //  DOM utils
  const $ = (id) => document.getElementById(id);
  const bySel = (sel, root = document) => (root || document).querySelector(sel);

  function show(el) {
    if (el) el.classList.remove("hidden");
  }
  function hide(el) {
    if (el) el.classList.add("hidden");
  }

  function clearChildren(el) {
    while (el && el.firstChild) el.removeChild(el.firstChild);
  }
  function removeEmptyMessage(id) {
    const el = $(id);
    if (el) el.remove();
  }
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
  function fadeOutAndRemove(el, cb) {
    if (!el) return;
    el.classList.add("opacity-0");
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (typeof cb === "function") cb();
    }, 300);
  }

  // row builders
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
    row.dataset.patientId = id || "";
    return row;
  }

  function outgoingRequestRow({ requestId, patientName }) {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto] border border-black transition-opacity duration-300";
    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2"
           data-i18n="role_patient">
        ${t("role_patient", "Patient")}
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${patientName}
      </div>
      <button class="cancel-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90"
              data-i18n="cancel">
        ${t("cancel", "Cancel")}
      </button>
    `;
    row.dataset.requestId = requestId || "";
    return row;
  }

  // i18n static text
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

  // backend lookups
  async function lookupPatientById(patientId) {
    const token = localStorage.getItem("authToken") || "";
    const res = await fetch(
      `/api/auth/me/patient/${encodeURIComponent(patientId)}/link`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
    const data = await res.json();
    const id =
      (data && data.patient && data.patient.profileId) || (data && data.id);
    const name =
      (data && data.patient && data.patient.name) || (data && data.name);
    if (!id || !name) throw new Error("Invalid response shape");
    return { id, name };
  }

  async function sendConnectionRequest(patientId) {
    const token = localStorage.getItem("authToken") || "";
    try {
      await fetch(
        `/api/auth/me/patient/${encodeURIComponent(patientId)}/link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
    } catch (err) {
      console.error("Failed to send connection request:", err);
    }
  }

  // render: Outgoing Requests
  let isRenderingRequest = false;
  async function renderOutgoingRequest() {
    if (isRenderingRequest) return;
    isRenderingRequest = true;

    const container = $("outgoingRequestsContainer");
    if (!container) return;
    clearChildren(container);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("Session expired, please login again");
        return;
      }

      const res = await fetch("/api/family/me/requests", {
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
        cancelBtn.addEventListener("click", async () => {
          try {
            const delRes = await fetch(
              `/api/family/me/requests/${encodeURIComponent(req._id)}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
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

  // render: Current Connections
  let isRenderingConnection = false;
  async function renderCurrentConnection() {
    if (isRenderingConnection) return;
    isRenderingConnection = true;

    const container = $("currentConnectionsContainer");
    if (!container) return;
    clearChildren(container);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("Session expired, please login again");
        return;
      }

      const res = await fetch("/api/family/me/connection", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok)
        throw new Error(`Load current connections failed (${res.status})`);
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
          id: conn.patient,
        });

        // view: navigate → to patient-homepage in read-only mode
        const viewBtn = bySel(".view-btn", row);
        if (viewBtn) {
          viewBtn.addEventListener("click", () => {
            const pid = conn.patient || row.dataset.patientId || "";
            if (!pid) return;
            // ✅ use patientID (not patient)
            const target = `/patient-homepage?patientID=${encodeURIComponent(
              pid
            )}&readonly=1`;
            window.location.assign(target);
          });
        }

        // remove → backend unlink
        const removeBtn = bySel(".remove-btn", row);
        removeBtn.addEventListener("click", async () => {
          try {
            const delRes = await fetch(
              `/api/auth/me/patient/${encodeURIComponent(conn.patient)}/link`,
              {
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

        container.appendChild(row);
      });
    } catch (err) {
      console.error("Error loading connections", err);
    } finally {
      isRenderingConnection = false;
    }
  }

  // public hooks
  window.addCurrentConnection = async function addCurrentConnection(conn) {
    try {
      if (!conn || !conn.name || !conn.id) {
        console.warn("[family-connection] Invalid connection data:", conn);
        return;
      }
      await renderCurrentConnection(); // refresh connections
      await renderOutgoingRequest(); // remove accepted request from outgoing
    } catch (e) {
      console.error("[family-connection] addCurrentConnection error:", e);
    }
  };

  window.removeOutgoingRequest = async function removeOutgoingRequest(
    requestId
  ) {
    try {
      console.log("[family-connection] Removing outgoing request:", requestId);
      await renderOutgoingRequest();
    } catch (e) {
      console.error("[family-connection] removeOutgoingRequest error:", e);
    }
  };

  window.removeCurrentConnection = async function removeCurrentConnection(
    patientId
  ) {
    try {
      console.log(
        "[family-connection] Removing current connection:",
        patientId
      );
      await renderCurrentConnection();
    } catch (e) {
      console.error("[family-connection] removeCurrentConnection error:", e);
    }
  };

  // init
  async function init() {
    renderAllStaticText();

    // ✅ wait for auth token before first fetches
    await waitForToken();
    await renderCurrentConnection();
    await renderOutgoingRequest();

    // on language change, re-label + re-render lists
    observeLangChanges(() =>
      whenI18nReady(() => {
        renderAllStaticText();
        renderCurrentConnection();
        renderOutgoingRequest();
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
      const pid = (confirmView && confirmView.dataset.pid) || "";
      if (!pid) return;

      await sendConnectionRequest(pid);

      // reset popup
      hide(searchPopup);
      hide(confirmView);
      show(searchView);
      if (patientIdInput) patientIdInput.value = "";

      // refresh pending requests
      await renderOutgoingRequest();
    });
  }

  if (typeof document === "undefined") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
