(function () {
  if (typeof document === "undefined") return;
  // --- Always register pushers (GLOBAL) ---
  (function registerLogDataPushers(){
    function ready(fn){
      if (window.__offline && window.__offline.register) return fn();
      const iv = setInterval(() => {
        if (window.__offline && window.__offline.register) {
          clearInterval(iv); fn();
        }
      }, 50);
      setTimeout(() => {clearInterval(iv), 5000});
    }

    ready(() => {
      if (window.__LOG_PUSHERS_READY__) return;
      window.__LOG_PUSHERS_READY__ = true;

      // Glucose rows
      window.__offline.register("glucose", async (mut, { authHeader }) => {
        const headers = { ...authHeader(), "X-Idempotency-Key": mut.idem };
        // PATCH then POST-if-404 (same behavior as online save)
        const r = await fetch(`/api/patient/me/glucoselog?date=${encodeURIComponent(mut.date)}`, {
          method: "PATCH", headers, body: JSON.stringify({ type: mut.type, glucoseLevel: mut.value })
        });
        if (r.status === 404 && mut.value !== "" && mut.value != null) {
          const r2 = await fetch(`/api/patient/me/glucoselog`, {
            method: "POST", headers, body: JSON.stringify({ date: mut.date, type: mut.type, glucoseLevel: mut.value })
          });
          if (!r2.ok) {
            const j = await r2.json().catch(()=>({}));
            const e = new Error(j.error || j.message || `HTTP ${r2.status}`); e.status = r2.status; throw e;
          }
          return;
        }
        if (!r.ok && r.status !== 404) {
          const j = await r.json().catch(()=>({}));
          const e = new Error(j.error || j.message || `HTTP ${r.status}`); e.status = r.status; throw e;
        }
      });

      // Insulin rows
      window.__offline.register("insulin", async (mut, { authHeader }) => {
        const headers = { ...authHeader(), "X-Idempotency-Key": mut.idem };
        const r = await fetch(`/api/patient/me/insulinlog?date=${encodeURIComponent(mut.date)}`, {
          method: "PATCH", headers, body: JSON.stringify({ type: mut.type, dose: mut.value })
        });
        if (r.status === 404 && mut.value !== "" && mut.value != null) {
          const r2 = await fetch(`/api/patient/me/insulinlog`, {
            method: "POST", headers, body: JSON.stringify({ date: mut.date, type: mut.type, dose: mut.value })
          });
          if (!r2.ok) {
            const j = await r2.json().catch(()=>({}));
            const e = new Error(j.error || j.message || `HTTP ${r2.status}`); e.status = r2.status; throw e;
          }
          return;
        }
        if (!r.ok && r.status !== 404) {
          const j = await r.json().catch(()=>({}));
          const e = new Error(j.error || j.message || `HTTP ${r.status}`); e.status = r.status; throw e;
        }
      });

      // Comment log
      window.__offline.register("comments", async (mut, { authHeader }) => {
        const headers = { ...authHeader(), "X-Idempotency-Key": mut.idem };
        const r = await fetch(`/api/patient/me/generallog?date=${encodeURIComponent(mut.date)}`, {
          method: "PATCH", headers, body: JSON.stringify({ comment: mut.comment ?? "" })
        });
        if (r.status === 404 && (mut.comment ?? "").trim() !== "") {
          const r2 = await fetch(`/api/patient/me/generallog`, {
            method: "POST", headers, body: JSON.stringify({ date: mut.date, comment: mut.comment ?? "" })
          });
          if (!r2.ok) {
            const j = await r2.json().catch(()=>({}));
            const e = new Error(j.error || j.message || `HTTP ${r2.status}`); e.status = r2.status; throw e;
          }
          return;
        }
        if (!r.ok && r.status !== 404) {
          const j = await r.json().catch(()=>({}));
          const e = new Error(j.error || j.message || `HTTP ${r.status}`); e.status = r.status; throw e;
        } 
      });
      setTimeout(() => { try { window.__offline?.flush?.(); } catch {} }, 0);
    });
  })();

  // 2) Attach GLOBAL flush triggers (❗outside route guard + not in init)
  (function attachGlobalFlushers(){
    if (window.__OFFLINE_FLUSHERS_ATTACHED__) return;
    window.__OFFLINE_FLUSHERS_ATTACHED__ = true;

    const tryFlush = () => window.__offline?.flush();

    // once after DOM is ready (or immediately if already ready)
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", tryFlush, { once: true });
    } else {
      setTimeout(tryFlush, 0);
    }

    // flush on connectivity / visibility / focus
    window.addEventListener("online", tryFlush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") tryFlush();
    });
    window.addEventListener("focus", tryFlush);
  })();

  // --- Only the UI stays behind the /log-data guard ---    
  if (!/\/log-data(?:\/|$)/.test(window.location.pathname)) return;
  if (window.__LOG_DATA_ACTIVE__) return;
  window.__LOG_DATA_ACTIVE__ = true;

  // i18n helpers
  function getDict() {
    return (window.__i18n && window.__i18n.dict) || {};
  }
  function t(key, fallback) {
    const dict = getDict();
    return (dict && dict[key]) != null ? String(dict[key]) : fallback;
  }
  function rowKeyFromLabel(label) {
    return `row_${String(label).toLowerCase().replace(/\s+/g, "_")}`;
  }
  function observeLangChanges(onChange) {
    try {
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === "attributes" && m.attributeName === "lang") onChange();
        }
      });
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });
    } catch (_) {}
  }
  function currentLang() {
    return document.documentElement.getAttribute("lang") || "en";
  }

  // nepalese digits for overlay
  const DIGIT_NE = {
    0: "०",
    1: "१",
    2: "२",
    3: "३",
    4: "४",
    5: "५",
    6: "६",
    7: "७",
    8: "८",
    9: "९",
  };
  function toNepaliDigits(str) {
    return String(str).replace(/[0-9]/g, (d) => DIGIT_NE[d]);
  }

  //Auth + shared helpers
  const authHeader = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("authToken") || ""}`,
  });  

  const getPatientIDFromURL = () => new URL(window.location.href).searchParams.get('patientID');

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
      const err = new Error(j.error || j.message ||'Unauthorized');
      err.status = res.status;
      throw err;
    }
    return res.json(); // { role, profile: {...} }
  }
  //Patient endpoints
  //Glucose log
  async function fetchPatientGlucoseLog(date) {
    const res = await fetch(`/api/patient/me/glucoselog?date=${encodeURIComponent(date)}`, {
      method: 'GET',
      headers: authHeader(),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Failed to load logs");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  async function createGlucoseLog(date, type, glucoseLevel) {
    const res = await fetch(`/api/patient/me/glucoselog`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ date, type, glucoseLevel }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Create failed");
      err.status = res.status;
      throw err;
    }
    return res.json(); 
  } 
  
  async function updateOrDeleteGlucoseLog(date, type, glucoseLevel) {
    const res = await fetch(`/api/patient/me/glucoselog?date=${encodeURIComponent(date)}`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ type, glucoseLevel }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Update failed");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }
  
  //Insulin log
  async function fetchPatientInsulinLog(date) {
    const res = await fetch(`/api/patient/me/insulinlog?date=${encodeURIComponent(date)}`, {
      method: 'GET',
      headers: authHeader(),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Failed to load logs");
      err.status = res.status;
      throw err;
    }    
    return res.json();
  }

  async function createInsulinLog(date, type, dose) {
    const res = await fetch(`/api/patient/me/insulinlog`, {
      method: "POST",
      headers: authHeader(),
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

  async function updateOrDeleteInsulinLog(date, type, dose) {
    const res = await fetch(`/api/patient/me/insulinlog?date=${encodeURIComponent(date)}`, {
      method: "PATCH",
      headers: authHeader(),
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

  //Comment log
  async function fetchPatientCommentLog(date) {
    const res = await fetch(`/api/patient/me/generallog?date=${encodeURIComponent(date)}`, { 
      method:"GET", 
      headers: authHeader() 
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Failed to load logs");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }  

  async function createCommentLog(date, comment) {
    const res = await fetch(`/api/patient/me/generallog`, { 
      method:"POST", 
      headers: authHeader(), 
      body: JSON.stringify({ date, comment }) 
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Create failed");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  async function updateOrDeleteCommentLog(date, comment) {
    const res = await fetch(`/api/patient/me/generallog?date=${encodeURIComponent(date)}`, { 
      method:"PATCH", 
      headers: authHeader(), 
      body: JSON.stringify({ comment }) 
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Update failed");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }  

  //Viewer endpoints (Doctor/Family)
  async function fetchViewerGlucoseLog(date, patientID) {
    if (!patientID) throw new Error("Missing patientID");
    const res = await fetch(`/api/auth/me/patient/${encodeURIComponent(patientID)}/viewlog/glucoselog?date=${encodeURIComponent(date)}`, 
      { method:"GET", headers: authHeader() });
    if (!res.ok) throw new Error("Failed to load logs");
    return res.json();
  }  

  async function fetchViewerInsulinLog(date, patientID) {
    if (!patientID) throw new Error("Missing patientID");
    const res = await fetch(`/api/auth/me/patient/${encodeURIComponent(patientID)}/viewlog/insulinlog?date=${encodeURIComponent(date)}`, 
      { method:"GET", headers: authHeader() });
    if (!res.ok) throw new Error("Failed to load logs");
    return res.json();
  }    

  async function fetchViewerCommentLog(date, patientID) {
    if (!patientID) throw new Error("Missing patientID");
    const res = await fetch(`/api/auth/me/patient/${encodeURIComponent(patientID)}/viewlog/generallog?date=${encodeURIComponent(date)}`, 
      { method:"GET", headers: authHeader() });
    if (!res.ok) throw new Error("Failed to load logs");
    return res.json();
  }  
    
  // overlay renders
  function updateDateOverlay(dateInput, overlayEl) {
    if (!dateInput || !overlayEl) return;
    dateInput.setAttribute("lang", currentLang()); //hint to browser for date picker

    if (currentLang() === "ne") {
      dateInput.style.color = "transparent";
      dateInput.style.caretColor = "transparent";
      overlayEl.textContent = toNepaliDigits(dateInput.value || "");
      overlayEl.style.visibility = overlayEl.textContent ? "visible" : "hidden";
    } else {
      dateInput.style.color = "";
      dateInput.style.caretColor = "";
      overlayEl.style.visibility = "hidden";
      overlayEl.textContent = "";
    }
  }

  // loading strategy — run at DOM ready (or immediately if already ready)
  (function boot() {
    const start = () => {
      // keep your idle scheduling, but don't depend on 'load'
      if ("requestIdleCallback" in window) {
        requestIdleCallback(init, { timeout: 600 });
      } else {
        // a short timeout avoids blocking hydration
        setTimeout(init, 0);
      }
    };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();


  function init() {
    const $ = (id) => document.getElementById(id);
    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) =>
      Array.from(root.querySelectorAll(sel));
    const cssEscape =
      window.CSS && CSS.escape
        ? CSS.escape
        : (s) => s.replace(/[^a-zA-Z0-9_-]/g, "\\$&");

    // nodes
    const tabGlucose = $("tabGlucose");
    const tabInsulin = $("tabInsulin");
    const tabComments = $("tabComments");
    const tableWrap = $("tableWrap");
    const dataTable = $("dataTable");
    const commentsWrap = $("commentsWrap");
    const commentsInput = $("commentsInput");
    const dateInput = $("dataDate");
    const dateOverlay = $("dateOverlay");
    const dateWarning = $("dateWarning");
    const saveBtn = $("saveBtn");
    const saveNotice = $("saveNotice");

    // modal
    const editorModal = $("editorModal");
    const editorTitle = $("editorTitle");
    const editorInput = $("editorInput");
    const editorWarning = $("editorWarning");
    const editorCancel = $("editorCancel");
    const editorOk = $("editorOk");

    if (
      !tabGlucose ||
      !tabInsulin ||
      !tabComments ||
      !tableWrap ||
      !dataTable ||
      !commentsWrap ||
      !editorModal ||
      !editorTitle ||
      !editorInput ||
      !editorWarning ||
      !editorCancel ||
      !editorOk ||
      !saveBtn
    ) {
      console.warn("[log-data] Required nodes missing; aborting init.");
      return;
    }

    // state
    let currentTab = "glucose";
    const GLUCOSE_ROWS = [
      "Before Breakfast",
      "After Breakfast",
      "Before Lunch",
      "After Lunch",
      "Before Dinner",
      "After Dinner",
    ];
    const INSULIN_ROWS = ["Breakfast", "Lunch", "Dinner"];
    const state = { glucose: {}, insulin: {}, comments: "" };
    let cellRefs = new Map();
    let currentRowKey = null;
    let pendingDraft = null;
    let canEdit = false;
    let viewerPatientID = null;

    // helpers
    function setButtonActive(btn, isActive) {
      btn.setAttribute("aria-pressed", String(isActive));
      if (isActive) {
        btn.classList.remove("bg-[#049EDB]");
        btn.classList.add("bg-green-600");
      } else {
        btn.classList.remove("bg-green-600");
        btn.classList.add("bg-[#049EDB]");
      }
    }
    function formatDisplayValue(v, tab) {
      if (!v) return "";
      if (tab === "insulin") return `${v} ${t("unit_units", "units")}`;
      return v ? `${v} ${t("unit_mgdl", "mg/dL")}` : "";
    }
    function storageKey() {
      return `logdata:v1:${dateInput?.value || "__no_date__"}`;
    }
    function saveToStorage() {
      const payload = {
        date: dateInput?.value || null,
        glucose: state.glucose,
        insulin: state.insulin,
        comments: state.comments || "",
      };
      try {
        localStorage.setItem(storageKey(), JSON.stringify(payload));
      } catch {}
    }
    function loadFromStorage() {
      state.glucose = {};
      state.insulin = {};
      state.comments = "";
      try {
        const raw = localStorage.getItem(storageKey());
        if (!raw) return;
        const parsed = JSON.parse(raw);
        state.glucose = parsed.glucose || {};
        state.insulin = parsed.insulin || {};
        state.comments = parsed.comments || "";
      } catch {}
    }
    function mergeStateWithDraft(draft) {
      const out = { glucose: {}, insulin: {}, comments: state.comments };
      const allG = new Set([
        ...Object.keys(draft.glucose || {}),
        ...Object.keys(state.glucose || {}),
      ]);
      allG.forEach((k) => {
        const saved = state.glucose?.[k];
        const dv = draft.glucose?.[k];
        out.glucose[k] = saved !== undefined && saved !== "" ? saved : dv ?? "";
      });
      const allI = new Set([
        ...Object.keys(draft.insulin || {}),
        ...Object.keys(state.insulin || {}),
      ]);
      allI.forEach((k) => {
        const saved = state.insulin?.[k];
        const dv = draft.insulin?.[k];
        out.insulin[k] = saved !== undefined && saved !== "" ? saved : dv ?? "";
      });
      if (!state.comments && draft.comments) out.comments = draft.comments;
      state.glucose = out.glucose;
      state.insulin = out.insulin;
      state.comments = out.comments;
    }
    function ensurePendingDraft() {
      return (pendingDraft ||= { glucose: {}, insulin: {}, comments: "" });
    }
    function adjustDateWidth() {
      if (!dateInput) return;
      const len = dateInput.value ? dateInput.value.length : 10;
      const ch = Math.max(16, len) + "ch";
      if (dateInput.style.width !== ch) dateInput.style.width = ch;
    }
    function setTodayIfEmpty() {
      if (!dateInput || dateInput.value) return;
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      dateInput.value = `${yyyy}-${mm}-${dd}`;
      adjustDateWidth();
    }

    // init date, storage, and overlay
    setTodayIfEmpty();
    loadFromStorage();
    adjustDateWidth();
    updateDateOverlay(dateInput, dateOverlay);

    //role / viewer
    (async () => {
      try {
        const me = await getMe(); //{ role, profile: {...} }
        canEdit = me.role === "Patient";
        if (!canEdit) viewerPatientID = getPatientIDFromURL();
      } catch (err) { 
        console.error(err);
      }

      //viewer: lock comments box
      if (!canEdit) {
        commentsInput?.setAttribute("readonly", "true");
        commentsInput?.classList.add("bg-gray-100", "cursor-not-allowed");
      }

      //hydrate from backend for the starting date
      if(dateInput?.value) {
        await reloadFromBackend(dateInput.value, GLUCOSE_ROWS, INSULIN_ROWS, state, dataTable, commentsInput, canEdit, viewerPatientID);
        //then draw the default tab
        renderRows(GLUCOSE_ROWS);
      }
    })();
  
    // render initial rows
    bindRowEditorsIn(dataTable, true);

    function bindRowEditorsIn(tbodyRoot, applyValues = false) {
      cellRefs.clear();
      Array.from(tbodyRoot.querySelectorAll("tr[data-row]")).forEach((tr) => {
        const label = tr.getAttribute("data-row");
        const keyForDict = rowKeyFromLabel(label);

        const rowHeaderCell = tr.querySelector("td:first-child");
        if (rowHeaderCell) {
          rowHeaderCell.setAttribute("data-i18n", keyForDict);
          rowHeaderCell.textContent = t(keyForDict, label);
        }

        const span = qs(`[data-cell-for="${cssEscape(label)}"]`, tr);
        const btn = qs(`[data-edit-for="${cssEscape(label)}"]`, tr);
        if (span) {
          span.classList.add("text-gray-900");
          if (applyValues)
            span.textContent = formatDisplayValue(state.glucose[label], "glucose");
          cellRefs.set(label, span);
        }
        if (btn) {
          btn.setAttribute("data-i18n", "edit");
          btn.textContent = t("edit", "Edit");
          btn.addEventListener("click", () => openEditor(label));
        }
      });
    }

    function renderRows(rows) {
      dataTable.textContent = "";
      rows.forEach((label) => {
        const tr = document.createElement("tr");
        tr.className = "border";
        tr.setAttribute("data-row", label);

        const tdRow = document.createElement("td");
        tdRow.className =
          "bg-sky-950 text-white font-bold w-[35%] px-2 sm:px-3 py-2 text-sm sm:text-base";
        const keyForDict = rowKeyFromLabel(label);
        tdRow.setAttribute("data-i18n", keyForDict);
        tdRow.textContent = t(keyForDict, label);

        const tdValue = document.createElement("td");
        tdValue.className =
          "px-2 sm:px-3 py-2 flex justify-between items-center text-sm sm:text-base";

        const span = document.createElement("span");
        span.className = "text-gray-900";
        span.setAttribute("data-cell-for", label);
        span.textContent = formatDisplayValue(
          currentTab === "glucose" ? state.glucose[label] : state.insulin[label],
          currentTab
        );

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "bg-green-600 text-white px-2 sm:px-3 py-1 rounded ml-2 text-xs sm:text-sm";
        btn.textContent = t("edit", "Edit");
        btn.setAttribute("data-edit-for", label);
        btn.addEventListener("click", () => openEditor(label));

        if (!canEdit) {btn.classList.add("hidden"); btn.disabled = true;}

        tdValue.appendChild(span);
        tdValue.appendChild(btn);
        tr.appendChild(tdRow);
        tr.appendChild(tdValue);
        dataTable.appendChild(tr);
      });
      bindRowEditorsIn(dataTable);
    }

    function setActiveTab(next) {
      if (currentTab === next) return;
      currentTab = next;
      setButtonActive(tabGlucose, next === "glucose");
      setButtonActive(tabInsulin, next === "insulin");
      setButtonActive(tabComments, next === "comments");

      if (next === "comments") {
        tableWrap.classList.add("hidden");
        commentsWrap.classList.remove("hidden");
        commentsInput.value = state.comments || "";
        commentsInput.focus();
        return;
      }
      commentsWrap.classList.add("hidden");
      tableWrap.classList.remove("hidden");
      renderRows(next === "glucose" ? GLUCOSE_ROWS : INSULIN_ROWS);
    }

    // modal
    function openEditor(label) {
      currentRowKey = label;
      editorWarning.classList.add("hidden");
      editorTitle.textContent = t(rowKeyFromLabel(label), label);
      const existing =
        currentTab === "glucose" ? state.glucose[label] : state.insulin[label];
      editorInput.value = existing || "";
      editorModal.classList.remove("hidden");
      editorInput.focus();
      editorInput.select();
    }
    function closeEditor() {
      editorModal.classList.add("hidden");
      currentRowKey = null;
    }
    function okEditor() {
      if (!currentRowKey) return;
      const raw = (editorInput.value || "").trim();
      const ok = raw === "" || /^\d+(\.\d+)?$/.test(raw);
      if (!ok) {
        editorWarning.textContent = t(
          "warn_numbers_only", 
          "⚠️ Please enter numbers only");
        editorWarning.classList.remove("hidden");
        return;
      }
      editorWarning.classList.add("hidden");
      if (currentTab === "glucose") state.glucose[currentRowKey] = raw;
      else state.insulin[currentRowKey] = raw;

      if (!dateInput.value) {
        const d = ensurePendingDraft();
        if (currentTab === "glucose") d.glucose[currentRowKey] = raw;
        else d.insulin[currentRowKey] = raw;
      }

      const span = cellRefs.get(currentRowKey);
      if (span) span.textContent = formatDisplayValue(raw, currentTab);
      closeEditor();
    }
    editorCancel.addEventListener("click", closeEditor);
    editorOk.addEventListener("click", okEditor);
    editorModal.addEventListener("click", (e) => {
      if (e.target === editorModal) closeEditor();
    });
    editorInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        okEditor();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeEditor();
      }
    });

    // tabs
    tabGlucose.addEventListener("click", () => setActiveTab("glucose"));
    tabInsulin.addEventListener("click", () => setActiveTab("insulin"));
    tabComments.addEventListener("click", () => setActiveTab("comments"));

    // comments
    commentsInput?.addEventListener("input", (e) => {
      state.comments = e.target.value;
      if (!dateInput.value)
        ensurePendingDraft().comments = state.comments || "";
    });

    // save
    saveBtn?.addEventListener("click", async () => {
      const hasDate = !!(dateInput && dateInput.value);
      if (!hasDate) {
        pendingDraft = {
          glucose: { ...state.glucose },
          insulin: { ...state.insulin },
          comments: state.comments || "",
        };
        dateInput?.classList.add("ring-2", "ring-red-500", "border-red-500");
        if (dateWarning) {
          dateWarning.textContent = t(
            "date_warning_select_date",
            "Please select a date before saving."
          );
        }
        dateWarning?.classList.remove("hidden");
        dateInput?.focus();
        return;
      }
      dateInput?.classList.remove("ring-2", "ring-red-500", "border-red-500");
      dateWarning?.classList.add("hidden");

      const theDate = dateInput.value;

      //If offline: enqueue and show banner
      if (!navigator.onLine) {
        await enqueueForCurrentTabOffline(theDate);
        saveToStorage();
        window.__offline?.showBanner(t(
          "saved_offline", "Saved offline. Will sync when you're online."
        ));
        return;
      }

      //Online: try save to backend; on failure, enqueue
      try {
        await saveAllToBackend(theDate, GLUCOSE_ROWS, INSULIN_ROWS, state, currentTab, commentsInput, canEdit);
        saveToStorage();
        if (saveNotice) {
          saveNotice.textContent = t("saved_successfully", "Saved successfully");
          saveNotice.classList.remove("hidden");
          setTimeout(() => saveNotice.classList.add("hidden"), 1500);
        }
        window.__offline?.flush();
      } catch (err) {
        console.warn("[save] online save failed, enqueuing", err);
        await enqueueForCurrentTabOffline(theDate);
        saveToStorage();
        window.__offline?.showBanner(t(
          "saved_offline", "Saved offline. Will sync when you're online."
        ));
      }
    });

    // date width + overlay
    dateInput?.addEventListener("input", () => {
      adjustDateWidth();
      updateDateOverlay(dateInput, dateOverlay);
      if (dateInput.value) {
        dateInput.classList.remove("ring-2", "ring-red-500", "border-red-500");
        dateWarning?.classList.add("hidden");
      }
    });

    dateInput?.addEventListener("change", async () => {
      adjustDateWidth();
      updateDateOverlay(dateInput, dateOverlay);

      await reloadFromBackend(dateInput.value, GLUCOSE_ROWS, INSULIN_ROWS, state, dataTable, commentsInput, canEdit, viewerPatientID);

      if (pendingDraft) {
        mergeStateWithDraft(pendingDraft);
        pendingDraft = null;
      }
      if (currentTab === "comments") {
        commentsInput.value = state.comments || "";
      } else {
        renderRows(currentTab === "glucose" ? GLUCOSE_ROWS : INSULIN_ROWS);
      }
    });

    // initial tab styling
    setButtonActive(tabGlucose, true);
    setButtonActive(tabInsulin, false);
    setButtonActive(tabComments, false);

    // on language change, refresh
    observeLangChanges(() => {
      tabGlucose.textContent = t("tab_glucose", "Glucose");
      tabInsulin.textContent = t("tab_insulin", "Insulin");
      tabComments.textContent = t("tab_comments", "Comments");

      if (currentTab !== "comments") {
        renderRows(currentTab === "glucose" ? GLUCOSE_ROWS : INSULIN_ROWS);
      }
      if (saveNotice && !saveNotice.classList.contains("hidden")) {
        saveNotice.textContent = t("saved_successfully", "Saved successfully");
      }
      if (dateWarning && !dateWarning.classList.contains("hidden")) {
        dateWarning.textContent = t(
          "date_warning_select_date",
          "Please select a date before saving."
        );
      }

      updateDateOverlay(dateInput, dateOverlay);
      adjustDateWidth();
    });

    //Backend orchestration
    async function reloadFromBackend(date, GLUCOSE_ROWS, INSULIN_ROWS, state, dataTable, commentsInput, canEdit, viewerPatientID) {
      dataTable.innerHTML = `
        <tr class="border">
          <td class="px-3 py-2 text-sm sm:text-base" colspan="2">Loading...</td>
        </tr>`;
      state.glucose = {};
      state.insulin = {};
      state.comments = "";

      try {
        if (canEdit) {
          //Patient mode: fetch all 3 in parallel
          const [g, i, c] = await Promise.allSettled([
            fetchPatientGlucoseLog(date),
            fetchPatientInsulinLog(date), 
            fetchPatientCommentLog(date)
          ]);
          //glucose
          if (g.status === "fulfilled") {
            const logs = Array.isArray(g.value?.logs) ? g.value.logs : [];
            logs.forEach((l) => {
              if (GLUCOSE_ROWS.includes(l?.type)) {
                state.glucose[l.type] = (l.glucoseLevel ?? "").toString();
              }
            });
          }
          //insulin
          if (i.status === "fulfilled") {
            const logs = Array.isArray(i.value?.logs) ? i.value.logs : [];
            logs.forEach((l) => {
              if (INSULIN_ROWS.includes(l?.type)) {
                state.insulin[l.type] = (l.dose ?? "").toString();
              }
            });
          } 
          //comment
          if (c.status === "fulfilled") {
            const p = c.value;
            state.comments =
              (p?.comment ?? p?.log?.comment ?? 
                (Array.isArray(p?.logs) ? p.logs[0]?.comment : "") ) || "";
          }
        } else {
          //Viewer mode: fetch combined
          const [g, i, c] = await Promise.allSettled([
            fetchViewerGlucoseLog(date, viewerPatientID),
            fetchViewerInsulinLog(date, viewerPatientID), 
            fetchViewerCommentLog(date, viewerPatientID)
          ]);

          //glucose
          if (g.status === "fulfilled") {
            const logs = Array.isArray(g.value?.logs) ? g.value.logs : [];
            logs.forEach((l) => {
              if (GLUCOSE_ROWS.includes(l?.type)) {
                state.glucose[l.type] = (l.glucoseLevel ?? "").toString();
              }
            });
          }
          //insulin
          if (i.status === "fulfilled") {
            const logs = Array.isArray(i.value?.logs) ? i.value.logs : [];
            logs.forEach((l) => {
              if (INSULIN_ROWS.includes(l?.type)) {
                state.insulin[l.type] = (l.dose ?? "").toString();
              }
            });
          } 
          //comment
          if (c.status === "fulfilled") {
            const p = c.value;
            state.comments =
              (p?.comment ?? p?.log?.comment ?? 
                (Array.isArray(p?.logs) ? p.logs[0]?.comment : "") ) || "";
          }
        }
      } catch (err) {
        console.error(err);
        dataTable.innerHTML = `
          <tr class="border">
            <td class="px-3 py-2 text-sm sm:text-base text-red-700" colspan="2">
            ${err.message || "Failed to load logs."}
          </td>
          </tr>`;
        return;
      }
    }

    async function saveAllToBackend(date, GLUCOSE_ROWS, INSULIN_ROWS, state, currentTab, commentsInput, canEdit) {
      if (!canEdit) {alert("You do not have permission to edit."); return;}

      if (currentTab === "glucose") {
        //Only save glucose rows
        for (const label of GLUCOSE_ROWS) {
          const raw = (state.glucose[label] ?? "").toString().trim();
          try {
            await updateOrDeleteGlucoseLog(date, label, raw === "" ? "" : Number(raw));
          } catch (err) {
            if (err.status === 404 && raw !== "") {
              await createGlucoseLog(date, label, Number(raw));
            } else { 
              throw err; 
            }
          }
        }  
        return;      
      }

      if (currentTab === "insulin") {
        //Only save insulin rows
        //Insulin: PATCH then POST if 404 and value not empty
        for (const label of INSULIN_ROWS) {
          const raw = (state.insulin[label] ?? "").toString().trim();
          try {
            await updateOrDeleteInsulinLog(date, label, raw === "" ? "" : Number(raw));
          } catch (err) {
            if (err.status === 404 && raw !== "") {
              await createInsulinLog(date, label, Number(raw));
            } else { 
              throw err; 
            }
          }
        }
        return;
      }

      if (currentTab === "comments") {
        //Comments: PATCH then POST if 404 and value not empty
        const rawComment = (state.comments ?? "").trim();
        try {
          await updateOrDeleteCommentLog(date, rawComment);
        } catch (err) {
          if (err.status === 404 && rawComment !== "") {
            await createCommentLog(date, rawComment);
          } else { 
            throw err; 
          }
        }
        return;
      }
    }

    async function enqueueForCurrentTabOffline(theDate) {
      if (!canEdit) return;

      if (currentTab === 'glucose') {
        for (const label of GLUCOSE_ROWS) {
          const raw = (state.glucose[label] ?? '').toString().trim();
          await window.__offline?.enqueue('glucose', {
            date: theDate,
            type: label,
            value: raw === '' ? '' : Number(raw)
          });
        }
        return;
      }

      if (currentTab === 'insulin') {
        for (const label of INSULIN_ROWS) {
          const raw = (state.insulin[label] ?? '').toString().trim();
          await window.__offline?.enqueue('insulin', {
            date: theDate,
            type: label,
            value: raw === '' ? '' : Number(raw)
          });
        }
        return;
      }

      if (currentTab === 'comments') {
        const rawComment = (state.comments ?? '').trim();
        await window.__offline?.enqueue('comments', {
          date: theDate,
          comment: rawComment
        });
        return;
      }
    }
  }
})();
