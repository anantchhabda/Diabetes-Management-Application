(function () {
  if (typeof document === "undefined") return;
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

  // loading strategy
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
    function formatDisplayValue(v) {
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
            span.textContent = formatDisplayValue(state.glucose[label]);
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
          currentTab === "glucose" ? state.glucose[label] : state.insulin[label]
        );

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "bg-green-600 text-white px-2 sm:px-3 py-1 rounded ml-2 text-xs sm:text-sm";
        btn.textContent = t("edit", "Edit");
        btn.setAttribute("data-edit-for", label);
        btn.addEventListener("click", () => openEditor(label));

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
      const ok =
        currentTab === "insulin"
          ? /^\d*$/.test(raw)
          : raw === "" || /^\d+(\.\d+)?$/.test(raw);
      if (!ok) {
        editorWarning.textContent =
          currentTab === "insulin"
            ? t("warn_numbers_only", "⚠️ Please enter numbers only")
            : t(
                "warn_valid_numeric",
                "Please enter a valid numeric value (decimals allowed)."
              );
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
      if (span) span.textContent = formatDisplayValue(raw);
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
    saveBtn?.addEventListener("click", () => {
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
      saveToStorage();
      if (saveNotice) {
        saveNotice.textContent = t("saved_successfully", "Saved successfully");
        saveNotice.classList.remove("hidden");
        setTimeout(() => saveNotice.classList.add("hidden"), 1500);
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

    dateInput?.addEventListener("change", () => {
      adjustDateWidth();
      updateDateOverlay(dateInput, dateOverlay);

      loadFromStorage();
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
  }
})();
