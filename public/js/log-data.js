(function () {
  if (typeof document === "undefined") return;
  if (!/\/log-data(?:\/|$)/.test(window.location.pathname)) return;
  if (window.__LOG_DATA_ACTIVE__) return;
  window.__LOG_DATA_ACTIVE__ = true;

  // loading strategy so no hydration issues come up
  window.addEventListener(
    "load",
    () => {
      const kickoff = () =>
        setTimeout(() => {
          if ("requestIdleCallback" in window) {
            requestIdleCallback(init, { timeout: 600 });
          } else {
            setTimeout(init, 120);
          }
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

    // nodes for fields
    const tabGlucose = $("tabGlucose");
    const tabInsulin = $("tabInsulin");
    const tabComments = $("tabComments");
    const tableWrap = $("tableWrap");
    const dataTable = $("dataTable");
    const commentsWrap = $("commentsWrap");
    const commentsInput = $("commentsInput");
    const dateInput = $("dataDate");
    const dateWarning = $("dateWarning");
    const saveBtn = $("saveBtn");
    const saveNotice = $("saveNotice");

    // modal nodes
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

    // draft exists when no date selected and user types values
    let pendingDraft = null;

    // helper function for tab buttons
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
      if (!v) return "";
      return `${v} mg/dL`;
    }

    function storageKey() {
      const d = dateInput?.value || "__no_date__";
      return `logdata:v1:${d}`;
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
      // resets to empty if date has no data
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

    // merges saved values, saved value has priority over what user might have entered (but not saved)
    function mergeStateWithDraft(draft) {
      const out = {
        glucose: {},
        insulin: {},
        comments: state.comments,
      };

      // glucose
      const allG = new Set([
        ...Object.keys(draft.glucose || {}),
        ...Object.keys(state.glucose || {}),
      ]);
      allG.forEach((k) => {
        const saved = state.glucose?.[k];
        const draftVal = draft.glucose?.[k];
        out.glucose[k] =
          saved !== undefined && saved !== "" ? saved : draftVal ?? "";
      });

      // insulin
      const allI = new Set([
        ...Object.keys(draft.insulin || {}),
        ...Object.keys(state.insulin || {}),
      ]);
      allI.forEach((k) => {
        const saved = state.insulin?.[k];
        const draftVal = draft.insulin?.[k];
        out.insulin[k] =
          saved !== undefined && saved !== "" ? saved : draftVal ?? "";
      });

      // saved comments has priority same as glucose/insulin
      if (!state.comments && draft.comments) {
        out.comments = draft.comments;
      }

      state.glucose = out.glucose;
      state.insulin = out.insulin;
      state.comments = out.comments;
    }

    function ensurePendingDraft() {
      if (!pendingDraft) {
        pendingDraft = { glucose: {}, insulin: {}, comments: "" };
      }
      return pendingDraft;
    }

    function adjustDateWidth() {
      if (!dateInput) return;
      const len = dateInput.value ? dateInput.value.length : 10; // width shows the whole date
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

    // initial load strategy
    setTodayIfEmpty(); // defaults to todays date when empty
    loadFromStorage(); // load from storage for todays date

    // apply any saved values
    bindRowEditorsIn(dataTable, /*applyValues=*/ true);

    function bindRowEditorsIn(tbodyRoot, applyValues = false) {
      cellRefs.clear();
      qsa("tr[data-row]", tbodyRoot).forEach((tr) => {
        const rowKey = tr.getAttribute("data-row");
        const span = qs(`[data-cell-for="${cssEscape(rowKey)}"]`, tr);
        const btn = qs(`[data-edit-for="${cssEscape(rowKey)}"]`, tr);
        if (span) {
          span.classList.add("text-gray-900");
          if (applyValues) {
            const val = state.glucose[rowKey]; // glucose active tab on load
            span.textContent = formatDisplayValue(val);
          }
          cellRefs.set(rowKey, span);
        }
        if (btn) btn.addEventListener("click", () => openEditor(rowKey));
      });
    }

    function renderRows(rows) {
      dataTable.textContent = "";
      rows.forEach((rowKey) => {
        const tr = document.createElement("tr");
        tr.className = "border";
        tr.setAttribute("data-row", rowKey);

        const tdRow = document.createElement("td");
        tdRow.className =
          "bg-sky-950 text-white font-bold w-[35%] px-2 sm:px-3 py-2 text-sm sm:text-base";
        tdRow.textContent = rowKey;

        const tdValue = document.createElement("td");
        tdValue.className =
          "px-2 sm:px-3 py-2 flex justify-between items-center text-sm sm:text-base";

        const span = document.createElement("span");
        span.className = "text-gray-900";
        span.setAttribute("data-cell-for", rowKey);
        span.textContent = formatDisplayValue(
          currentTab === "glucose"
            ? state.glucose[rowKey]
            : state.insulin[rowKey]
        );

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "bg-green-600 text-white px-2 sm:px-3 py-1 rounded ml-2 text-xs sm:text-sm";
        btn.textContent = "Edit";
        btn.setAttribute("data-edit-for", rowKey);
        btn.addEventListener("click", () => openEditor(rowKey));

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

    // Modal
    function openEditor(rowKey) {
      currentRowKey = rowKey;
      editorWarning.classList.add("hidden");
      editorTitle.textContent = rowKey;

      const existing =
        currentTab === "glucose"
          ? state.glucose[rowKey]
          : state.insulin[rowKey];
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
          ? /^\d*$/.test(raw) // insulin: allow empty or digits only
          : raw === "" || /^\d+(\.\d+)?$/.test(raw); // glucose: allow empty or number/decimal

      if (!ok) {
        editorWarning.textContent =
          currentTab === "insulin"
            ? "⚠️ Please enter numbers only"
            : "Please enter a valid numeric value (decimals allowed).";
        editorWarning.classList.remove("hidden");
        return;
      }
      editorWarning.classList.add("hidden");

      // users draft
      if (currentTab === "glucose") state.glucose[currentRowKey] = raw;
      else state.insulin[currentRowKey] = raw;

      // captures if no date selected, merges with whatever date when the user finally selects
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

    // our tabs
    tabGlucose.addEventListener("click", () => setActiveTab("glucose"));
    tabInsulin.addEventListener("click", () => setActiveTab("insulin"));
    tabComments.addEventListener("click", () => setActiveTab("comments"));

    // same logic as for glucose/insulin, keep the draft and merge
    commentsInput?.addEventListener("input", (e) => {
      state.comments = e.target.value;
      if (!dateInput.value) {
        const d = ensurePendingDraft();
        d.comments = state.comments || "";
      }
    });

    // save button
    saveBtn?.addEventListener("click", () => {
      const hasDate = !!(dateInput && dateInput.value);
      if (!hasDate) {
        // merge after date chosen
        pendingDraft = {
          glucose: { ...state.glucose },
          insulin: { ...state.insulin },
          comments: state.comments || "",
        };

        dateInput?.classList.add("ring-2", "ring-red-500", "border-red-500");
        dateWarning?.classList.remove("hidden");
        dateInput?.focus();
        return;
      }

      dateInput?.classList.remove("ring-2", "ring-red-500", "border-red-500");
      dateWarning?.classList.add("hidden");

      saveToStorage();

      if (saveNotice) {
        saveNotice.textContent = "Saved successfully";
        saveNotice.classList.remove("hidden");
        setTimeout(() => saveNotice.classList.add("hidden"), 1500);
      }
    });

    // date width
    adjustDateWidth();
    dateInput?.addEventListener("input", () => {
      adjustDateWidth();
      if (dateInput.value) {
        dateInput.classList.remove("ring-2", "ring-red-500", "border-red-500");
        dateWarning?.classList.add("hidden");
      }
    });

    // change date -> load saved state; if a pending draft exists, merge (saved has priority over user draft)
    dateInput?.addEventListener("change", () => {
      adjustDateWidth();

      loadFromStorage(); // bring in saved data for chosen date (or empty)

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

    // initial tab styles
    setButtonActive(tabGlucose, true);
    setButtonActive(tabInsulin, false);
    setButtonActive(tabComments, false);
  }
})();
