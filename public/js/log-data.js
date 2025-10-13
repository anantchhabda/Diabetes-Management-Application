// public/js/log-data.js
(function () {
  if (typeof document === "undefined") return;
  if (!/\/log-data(?:\/|$)/.test(window.location.pathname)) return;
  if (window.__LOG_DATA_ACTIVE__) return;
  window.__LOG_DATA_ACTIVE__ = true;

  // ---------------------------
  // Read-only / viewer context
  // ---------------------------
  function getParam(name) {
    try {
      const u = new URL(location.href);
      return u.searchParams.get(name);
    } catch {
      return null;
    }
  }
  // IMPORTANT: viewer URLs use ?patientID=GamMql&readonly=1
  const VIEW_PATIENT = getParam("patientID"); // Patient.profileId of the patient being viewed
  const IS_READONLY = getParam("readonly") === "1";

  // Expose for other scripts (keeps params on links)
  window.READONLY_CTX = {
    active: IS_READONLY,
    patient: VIEW_PATIENT,
    withParams(href) {
      if (!IS_READONLY || !VIEW_PATIENT) return href;
      const url = new URL(href, location.origin);
      if (!url.searchParams.get("patientID"))
        url.searchParams.set("patientID", VIEW_PATIENT);
      if (!url.searchParams.get("readonly"))
        url.searchParams.set("readonly", "1");
      return url.pathname + url.search + url.hash;
    },
  };

  // Keep params on internal <a> while in read-only viewer mode
  document.addEventListener("click", (e) => {
    if (!IS_READONLY || !VIEW_PATIENT) return;
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;
    a.setAttribute("href", window.READONLY_CTX.withParams(href));
  });

  // When readonly, tag all fetches so API can 403 writes properly
  (function patchFetchForReadonly() {
    if (!IS_READONLY) return;
    const _fetch = window.fetch.bind(window);
    window.fetch = function (input, init = {}) {
      const headers = new Headers(init.headers || {});
      headers.set("X-Read-Only", "1");
      if (VIEW_PATIENT) headers.set("X-View-Patient", VIEW_PATIENT);
      return _fetch(input, { ...init, headers });
    };
  })();

  // ---------------------------
  // i18n helpers
  // ---------------------------
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
      const D = window.__i18n && window.__i18n.dict;
      const ready =
        window.__i18n &&
        window.__i18n.lang === want &&
        D &&
        Object.keys(typeof D === "function" ? D() : D).length > 0;
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

  function showReadonlyBanner() {
    if (!IS_READONLY) return;
    let el = document.getElementById("roBanner");
    if (!el) {
      el = document.createElement("div");
      el.id = "roBanner";
      el.className =
        "mb-3 text-xs inline-block px-2 py-1 rounded bg-black/70 text-white";
      (document.querySelector("main") || document.body).prepend(el);
    }
    el.textContent = t(
      "readonly_edits_disabled",
      "Read-only view: edits are disabled."
    );
  }

  // ---------------------------
  // Nepali digit overlay
  // ---------------------------
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

  // ---------------------------
  // Auth + helpers
  // ---------------------------
  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
  });

  const getPatientIDFromURL = () => {
    const id = new URL(window.location.href).searchParams.get("patientID");
    if (id) return id;
    try {
      return sessionStorage.getItem("viewerPatientID") || null;
    } catch {
      return null;
    }
  };

  async function getMe() {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const err = new Error(j.error || j.message || "Unauthorized");
      err.status = res.status;
      throw err;
    }
    return res.json(); // { userId, role, profile: { profileId, ... } }
  }

  // profile id resolver (stable per patient)
  function resolveProfileIdFromMe(me) {
    return (
      me?.profile?.profileId ||
      me?.profile?.profileID ||
      me?.profileId ||
      me?.id ||
      null
    );
  }

  // one-time purge of legacy v1 localStorage keys
  (function clearLegacyCacheOnce() {
    try {
      if (localStorage.getItem("__logdata_v2_cleared__")) return;
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith("logdata:v1:")) localStorage.removeItem(k);
      }
      localStorage.setItem("__logdata_v2_cleared__", "1");
    } catch {}
  })();

  // ---------------------------
  // Patient endpoints
  // ---------------------------
  async function fetchPatientGlucoseLog(date) {
    const res = await fetch(
      `/api/patient/me/glucoselog?date=${encodeURIComponent(date)}`,
      { method: "GET", headers: authHeader() }
    );
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Failed to load logs"
      );
    return res.json();
  }
  async function createGlucoseLog(date, type, glucoseLevel) {
    const res = await fetch(`/api/patient/me/glucoselog`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ date, type, glucoseLevel }),
    });
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Create failed"
      );
    return res.json();
  }
  async function updateOrDeleteGlucoseLog(date, type, glucoseLevel) {
    const res = await fetch(
      `/api/patient/me/glucoselog?date=${encodeURIComponent(date)}`,
      {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ type, glucoseLevel }),
      }
    );
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Update failed"
      );
    return res.json();
  }

  async function fetchPatientInsulinLog(date) {
    const res = await fetch(
      `/api/patient/me/insulinlog?date=${encodeURIComponent(date)}`,
      { method: "GET", headers: authHeader() }
    );
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Failed to load logs"
      );
    return res.json();
  }
  async function createInsulinLog(date, type, dose) {
    const res = await fetch(`/api/patient/me/insulinlog`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ date, type, dose }),
    });
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Create failed"
      );
    return res.json();
  }
  async function updateOrDeleteInsulinLog(date, type, dose) {
    const res = await fetch(
      `/api/patient/me/insulinlog?date=${encodeURIComponent(date)}`,
      {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ type, dose }),
      }
    );
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Update failed"
      );
    return res.json();
  }

  async function fetchPatientCommentLog(date) {
    const res = await fetch(
      `/api/patient/me/generallog?date=${encodeURIComponent(date)}`,
      { method: "GET", headers: authHeader() }
    );
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Failed to load logs"
      );
    return res.json();
  }
  async function createCommentLog(date, comment) {
    const res = await fetch(`/api/patient/me/generallog`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ date, comment }),
    });
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Create failed"
      );
    return res.json();
  }
  async function updateOrDeleteCommentLog(date, comment) {
    const res = await fetch(
      `/api/patient/me/generallog?date=${encodeURIComponent(date)}`,
      {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ comment }),
      }
    );
    if (!res.ok)
      throw new Error(
        (await res.json().catch(() => ({}))).message || "Update failed"
      );
    return res.json();
  }

  // ---------------------------
  // Viewer endpoints (Doctor/Family)
  // ---------------------------
  async function fetchViewerGlucoseLog(date, patientID) {
    if (!patientID) throw new Error("Missing patientID");
    const res = await fetch(
      `/api/auth/me/patient/${encodeURIComponent(
        patientID
      )}/viewlog/glucoselog?date=${encodeURIComponent(date)}`,
      { method: "GET", headers: authHeader() }
    );
    if (!res.ok) throw new Error("Failed to load logs");
    return res.json();
  }
  async function fetchViewerInsulinLog(date, patientID) {
    if (!patientID) throw new Error("Missing patientID");
    const res = await fetch(
      `/api/auth/me/patient/${encodeURIComponent(
        patientID
      )}/viewlog/insulinlog?date=${encodeURIComponent(date)}`,
      { method: "GET", headers: authHeader() }
    );
    if (!res.ok) throw new Error("Failed to load logs");
    return res.json();
  }
  async function fetchViewerCommentLog(date, patientID) {
    if (!patientID) throw new Error("Missing patientID");
    const res = await fetch(
      `/api/auth/me/patient/${encodeURIComponent(
        patientID
      )}/viewlog/generallog?date=${encodeURIComponent(date)}`,
      { method: "GET", headers: authHeader() }
    );
    if (!res.ok) throw new Error("Failed to load logs");
    return res.json();
  }

  // ---------------------------
  // UI helpers
  // ---------------------------
  function updateDateOverlay(dateInput, overlayEl) {
    if (!dateInput || !overlayEl) return;
    dateInput.setAttribute("lang", currentLang());
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

  // Slight deferral for first paint
  window.addEventListener(
    "load",
    () => {
      const kickoff = () =>
        setTimeout(() => {
          if ("requestIdleCallback" in window)
            requestIdleCallback(init, { timeout: 600 });
          else setTimeout(init, 120);
        }, 0);
      requestAnimationFrame(() => requestAnimationFrame(kickoff));
    },
    { once: true }
  );

  function init() {
    const $ = (id) => document.getElementById(id);
    const qs = (sel, root = document) => root.querySelector(sel);
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

    // localStorage namespace (only for Patient in non-readonly mode)
    let STORAGE_NS = null;
    function storageKey() {
      if (!STORAGE_NS) return null;
      const d = dateInput?.value || "__no_date__";
      return `logdata:v2:${STORAGE_NS}:${d}`;
    }
    function saveToStorage() {
      if (!STORAGE_NS) return;
      const key = storageKey();
      if (!key) return;
      const payload = {
        date: dateInput?.value || null,
        glucose: state.glucose,
        insulin: state.insulin,
        comments: state.comments || "",
      };
      try {
        localStorage.setItem(key, JSON.stringify(payload));
      } catch {}
    }
    function loadFromStorage() {
      if (!STORAGE_NS) return;
      state.glucose = {};
      state.insulin = {};
      state.comments = "";
      try {
        const key = storageKey();
        if (!key) return;
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        state.glucose = parsed.glucose || {};
        state.insulin = parsed.insulin || {};
        state.comments = parsed.comments || "";
      } catch {}
    }

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
    function rowKeyFromLabel(label) {
      return `row_${String(label).toLowerCase().replace(/\s+/g, "_")}`;
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

    // initial date & overlay (no local drafts yet!)
    setTodayIfEmpty();
    adjustDateWidth();
    updateDateOverlay(dateInput, dateOverlay);

    // role / viewer: decide editability and storage after we know who "me" is
    (async () => {
      try {
        const me = await getMe(); // { role, profile: { profileId } }
        if (IS_READONLY) {
          // strict viewer mode
          commentsInput?.setAttribute("readonly", "true");
          commentsInput?.classList.add("bg-gray-100", "cursor-not-allowed");
          if (saveBtn) {
            saveBtn.style.display = "none";
            saveBtn.disabled = true;
          }
          whenI18nReady(showReadonlyBanner);
          STORAGE_NS = null; // never use local drafts in viewer mode
        } else {
          if (me.role === "Patient") {
            const pid = resolveProfileIdFromMe(me);
            if (pid && typeof pid === "string") {
              STORAGE_NS = `Patient:${pid}`;
              // patient-only: load any saved draft for this date
              loadFromStorage();
            } else {
              STORAGE_NS = null;
            }
          } else {
            // doctor/family somehow on /log-data without readonly: treat as read-only
            commentsInput?.setAttribute("readonly", "true");
            commentsInput?.classList.add("bg-gray-100", "cursor-not-allowed");
            if (saveBtn) {
              saveBtn.style.display = "none";
              saveBtn.disabled = true;
            }
            whenI18nReady(showReadonlyBanner);
            STORAGE_NS = null;
          }
        }
      } catch (err) {
        console.error(err);
        // auth failure => read-only
        STORAGE_NS = null;
        commentsInput?.setAttribute("readonly", "true");
        commentsInput?.classList.add("bg-gray-100", "cursor-not-allowed");
        if (saveBtn) {
          saveBtn.style.display = "none";
          saveBtn.disabled = true;
        }
        whenI18nReady(showReadonlyBanner);
      }

      // fetch server truth for the starting date and render
      if (dateInput?.value) {
        await reloadFromBackend(
          dateInput.value,
          GLUCOSE_ROWS,
          INSULIN_ROWS,
          state,
          dataTable,
          commentsInput,
          !IS_READONLY, // canEdit flag for semantics (not used for gating)
          IS_READONLY ? VIEW_PATIENT || getPatientIDFromURL() : null
        );

        // draw glucose tab initially (using server values; drafts were loaded earlier if Patient)
        renderRows(GLUCOSE_ROWS);

        // after successful server hydration, persist the merged view (patient mode only)
        if (!IS_READONLY && STORAGE_NS) {
          try {
            saveToStorage();
          } catch {}
        }
      }
    })();

    // ---- render & editing ----
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
          if (applyValues) {
            span.textContent = formatDisplayValue(
              state.glucose[label],
              "glucose"
            );
          }
          cellRefs.set(label, span);
        }

        if (btn) {
          btn.setAttribute("data-i18n", "edit");
          btn.textContent = t("edit", "Edit");
          if (!STORAGE_NS || IS_READONLY) {
            btn.classList.add("hidden");
            btn.disabled = true;
          } else {
            btn.addEventListener("click", () => openEditor(label));
          }
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
          currentTab === "glucose"
            ? state.glucose[label]
            : state.insulin[label],
          currentTab
        );

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "bg-green-600 text-white px-2 sm:px-3 py-1 rounded ml-2 text-xs sm:text-sm";
        btn.textContent = t("edit", "Edit");
        btn.setAttribute("data-edit-for", label);

        if (!STORAGE_NS || IS_READONLY) {
          btn.classList.add("hidden");
          btn.disabled = true;
        } else {
          btn.addEventListener("click", () => openEditor(label));
        }

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

    // editor modal
    function openEditor(label) {
      if (IS_READONLY || !STORAGE_NS) return;
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
      if (IS_READONLY || !STORAGE_NS || !currentRowKey) return;
      const raw = (editorInput.value || "").trim();
      const ok = raw === "" || /^\d+(\.\d+)?$/.test(raw);
      if (!ok) {
        editorWarning.textContent = t(
          "warn_numbers_only",
          "⚠️ Please enter numbers only"
        );
        editorWarning.classList.remove("hidden");
        return;
      }
      editorWarning.classList.add("hidden");
      if (currentTab === "glucose") state.glucose[currentRowKey] = raw;
      else state.insulin[currentRowKey] = raw;

      if (!dateInput.value) {
        pendingDraft ||= { glucose: {}, insulin: {}, comments: "" };
        if (currentTab === "glucose") pendingDraft.glucose[currentRowKey] = raw;
        else pendingDraft.insulin[currentRowKey] = raw;
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

    // comments live edit
    commentsInput?.addEventListener("input", (e) => {
      if (IS_READONLY || !STORAGE_NS) return;
      state.comments = e.target.value;
      if (!dateInput.value) {
        pendingDraft ||= { glucose: {}, insulin: {}, comments: "" };
        pendingDraft.comments = state.comments || "";
      }
    });

    // save button
    saveBtn?.addEventListener("click", async () => {
      if (IS_READONLY || !STORAGE_NS) {
        alert("You do not have permission to edit.");
        return;
      }
      if (!dateInput || !dateInput.value) {
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
      dateInput.classList.remove("ring-2", "ring-red-500", "border-red-500");
      dateWarning?.classList.add("hidden");

      try {
        await saveAllToBackend(
          dateInput.value,
          GLUCOSE_ROWS,
          INSULIN_ROWS,
          state,
          currentTab
        );
        saveToStorage();
        if (saveNotice) {
          saveNotice.textContent = t(
            "saved_successfully",
            "Saved successfully"
          );
          saveNotice.classList.remove("hidden");
          setTimeout(() => saveNotice.classList.add("hidden"), 1500);
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Save failed. Please try again.");
      }
    });

    // date input behavior
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

      await reloadFromBackend(
        dateInput.value,
        GLUCOSE_ROWS,
        INSULIN_ROWS,
        state,
        dataTable,
        commentsInput,
        !IS_READONLY,
        IS_READONLY ? VIEW_PATIENT || getPatientIDFromURL() : null
      );

      // if we typed before adding a date, merge those drafts once
      if (pendingDraft && !IS_READONLY && STORAGE_NS) {
        const out = { glucose: {}, insulin: {}, comments: state.comments };
        const allG = new Set([
          ...Object.keys(pendingDraft.glucose || {}),
          ...Object.keys(state.glucose || {}),
        ]);
        allG.forEach((k) => {
          const saved = state.glucose?.[k];
          const dv = pendingDraft.glucose?.[k];
          out.glucose[k] =
            saved !== undefined && saved !== "" ? saved : dv ?? "";
        });
        const allI = new Set([
          ...Object.keys(pendingDraft.insulin || {}),
          ...Object.keys(state.insulin || {}),
        ]);
        allI.forEach((k) => {
          const saved = state.insulin?.[k];
          const dv = pendingDraft.insulin?.[k];
          out.insulin[k] =
            saved !== undefined && saved !== "" ? saved : dv ?? "";
        });
        if (!state.comments && pendingDraft.comments)
          out.comments = pendingDraft.comments;
        state.glucose = out.glucose;
        state.insulin = out.insulin;
        state.comments = out.comments;
        pendingDraft = null;
      }

      if (currentTab === "comments") {
        commentsInput.value = state.comments || "";
      } else {
        renderRows(currentTab === "glucose" ? GLUCOSE_ROWS : INSULIN_ROWS);
      }

      if (!IS_READONLY && STORAGE_NS) {
        try {
          saveToStorage();
        } catch {}
      }
    });

    // initial tab styling
    setButtonActive(tabGlucose, true);
    setButtonActive(tabInsulin, false);
    setButtonActive(tabComments, false);

    // i18n re-render
    observeLangChanges(() => {
      whenI18nReady(() => {
        tabGlucose.textContent = t("tab_glucose", "Glucose");
        tabInsulin.textContent = t("tab_insulin", "Insulin");
        tabComments.textContent = t("tab_comments", "Comments");

        if (currentTab !== "comments") {
          renderRows(currentTab === "glucose" ? GLUCOSE_ROWS : INSULIN_ROWS);
        } else {
          commentsInput.value = state.comments || "";
        }

        const roBanner = document.getElementById("roBanner");
        if (roBanner)
          roBanner.textContent = t(
            "readonly_edits_disabled",
            "Read-only view: edits are disabled."
          );

        if (saveNotice && !saveNotice.classList.contains("hidden")) {
          saveNotice.textContent = t(
            "saved_successfully",
            "Saved successfully"
          );
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
    });

    // ---------------------------
    // Backend orchestration
    // ---------------------------
    async function reloadFromBackend(
      date,
      GLUCOSE_ROWS,
      INSULIN_ROWS,
      state,
      dataTable,
      commentsInput,
      _canEdit,
      viewerPatientID
    ) {
      dataTable.innerHTML = `
        <tr class="border">
          <td class="px-3 py-2 text-sm sm:text-base" colspan="2">Loading...</td>
        </tr>`;
      state.glucose = {};
      state.insulin = {};
      state.comments = "";

      try {
        if (IS_READONLY) {
          const pid = viewerPatientID || VIEW_PATIENT || getPatientIDFromURL();
          const [g, i, c] = await Promise.allSettled([
            fetchViewerGlucoseLog(date, pid),
            fetchViewerInsulinLog(date, pid),
            fetchViewerCommentLog(date, pid),
          ]);
          if (g.status === "fulfilled") {
            (Array.isArray(g.value?.logs) ? g.value.logs : []).forEach((l) => {
              if (GLUCOSE_ROWS.includes(l?.type))
                state.glucose[l.type] = (l.glucoseLevel ?? "").toString();
            });
          }
          if (i.status === "fulfilled") {
            (Array.isArray(i.value?.logs) ? i.value.logs : []).forEach((l) => {
              if (INSULIN_ROWS.includes(l?.type))
                state.insulin[l.type] = (l.dose ?? "").toString();
            });
          }
          if (c.status === "fulfilled") {
            const p = c.value;
            state.comments =
              (p?.comment ??
                p?.log?.comment ??
                (Array.isArray(p?.logs) ? p.logs[0]?.comment : "")) ||
              "";
          }
        } else {
          const [g, i, c] = await Promise.allSettled([
            fetchPatientGlucoseLog(date),
            fetchPatientInsulinLog(date),
            fetchPatientCommentLog(date),
          ]);
          if (g.status === "fulfilled") {
            (Array.isArray(g.value?.logs) ? g.value.logs : []).forEach((l) => {
              if (GLUCOSE_ROWS.includes(l?.type))
                state.glucose[l.type] = (l.glucoseLevel ?? "").toString();
            });
          }
          if (i.status === "fulfilled") {
            (Array.isArray(i.value?.logs) ? i.value.logs : []).forEach((l) => {
              if (INSULIN_ROWS.includes(l?.type))
                state.insulin[l.type] = (l.dose ?? "").toString();
            });
          }
          if (c.status === "fulfilled") {
            const p = c.value;
            state.comments =
              (p?.comment ??
                p?.log?.comment ??
                (Array.isArray(p?.logs) ? p.logs[0]?.comment : "")) ||
              "";
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

    async function saveAllToBackend(
      date,
      GLUCOSE_ROWS,
      INSULIN_ROWS,
      state,
      currentTab
    ) {
      if (IS_READONLY || !STORAGE_NS) {
        alert("You do not have permission to edit.");
        return;
      }
      if (currentTab === "glucose") {
        for (const label of GLUCOSE_ROWS) {
          const raw = (state.glucose[label] ?? "").toString().trim();
          try {
            await updateOrDeleteGlucoseLog(
              date,
              label,
              raw === "" ? "" : Number(raw)
            );
          } catch (err) {
            if (err.status === 404 && raw !== "")
              await createGlucoseLog(date, label, Number(raw));
            else throw err;
          }
        }
        return;
      }
      if (currentTab === "insulin") {
        for (const label of INSULIN_ROWS) {
          const raw = (state.insulin[label] ?? "").toString().trim();
          try {
            await updateOrDeleteInsulinLog(
              date,
              label,
              raw === "" ? "" : Number(raw)
            );
          } catch (err) {
            if (err.status === 404 && raw !== "")
              await createInsulinLog(date, label, Number(raw));
            else throw err;
          }
        }
        return;
      }
      if (currentTab === "comments") {
        const rawComment = (state.comments ?? "").trim();
        try {
          await updateOrDeleteCommentLog(date, rawComment);
        } catch (err) {
          if (err.status === 404 && rawComment !== "")
            await createCommentLog(date, rawComment);
          else throw err;
        }
        return;
      }
    }
  }
})();
