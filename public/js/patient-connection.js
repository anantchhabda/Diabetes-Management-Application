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
  // wait for i18n to load
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

  const $ = (id) => document.getElementById(id);
  const bySel = (sel, root = document) => root.querySelector(sel);

  function clearChildren(el) {
    while (el && el.firstChild) el.removeChild(el.firstChild);
  }

  // map roles
  function roleLabel(role) {
    switch (role) {
      case "Doctor":
        return t("role_doctor", "Doctor");
      case "Patient":
        return t("role_patient", "Patient");
      case "Family Member":
      case "Family":
        return t("role_family", "Family");
      default:
        return role || "";
    }
  }

  // simple in memory list
  const state = {
    current: [], 
    requests: [], 
  };

  // empty messages
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

  // build rows
  function currentConnectionRow({ role, name }) {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto] border border-black transition-opacity duration-300";

    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        ${roleLabel(role)}
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

  function requestRow({ role, name, id }) {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto_auto] border border-black transition-all duration-300";

    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        ${roleLabel(role)}
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="accept-btn bg-green-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        ${t("accept", "Accept")}
      </button>
      <button class="decline-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        ${t("decline", "Decline")}
      </button>
    `;
    row.dataset.id = id || "";
    return row;
  }

  // render functions
  function renderCurrentConnections() {
    const container = $("currentConnectionsContainer");
    if (!container) return;
    clearChildren(container);

    state.current.forEach((conn) => {
      const row = currentConnectionRow(conn);
      const removeBtn = bySel(".remove-btn", row);
      removeBtn.addEventListener("click", () => {
        // remove button functionality 
        const idx = state.current.findIndex(
          (c) => c.role === conn.role && c.name === conn.name
        );
        if (idx >= 0) state.current.splice(idx, 1);

        fadeOutAndRemove(row, () => {
          if (!state.current.length) {
            ensureEmptyMessage(
              "currentConnectionsContainer",
              "noCurrentConnections",
              "no_current_connections",
              "No current connections yet."
            );
          }
        });
      });

      container.appendChild(row);
    });

    if (!state.current.length) {
      ensureEmptyMessage(
        "currentConnectionsContainer",
        "noCurrentConnections",
        "no_current_connections",
        "No current connections yet."
      );
    }
  }

  function renderConnectionRequests() {
    const container = $("connectionRequestsContainer");
    if (!container) return;
    clearChildren(container);

    state.requests.forEach((req) => {
      const row = requestRow(req);
      const acceptBtn = bySel(".accept-btn", row);
      const declineBtn = bySel(".decline-btn", row);

      acceptBtn.addEventListener("click", async () => {
        // backend accepts would go here
        const idx = state.requests.findIndex((r) => r.id === req.id);
        if (idx >= 0) state.requests.splice(idx, 1);
        state.current.push({ role: req.role, name: req.name });

        fadeOutAndRemove(row, () => {
          if (!state.requests.length) {
            ensureEmptyMessage(
              "connectionRequestsContainer",
              "noConnectionRequests",
              "no_connection_requests",
              "No connection requests yet."
            );
          }
          renderCurrentConnections();
        });
      });

      declineBtn.addEventListener("click", async () => {
        // backend declines would go here
        const idx = state.requests.findIndex((r) => r.id === req.id);
        if (idx >= 0) state.requests.splice(idx, 1);

        fadeOutAndRemove(row, () => {
          if (!state.requests.length) {
            ensureEmptyMessage(
              "connectionRequestsContainer",
              "noConnectionRequests",
              "no_connection_requests",
              "No connection requests yet."
            );
          }
        });
      });

      container.appendChild(row);
    });

    if (!state.requests.length) {
      ensureEmptyMessage(
        "connectionRequestsContainer",
        "noConnectionRequests",
        "no_connection_requests",
        "No connection requests yet."
      );
    }
  }

  function renderAll() {
    // render using i18n
    const h1Curr = document.querySelector("[data-i18n='current_connections']");
    if (h1Curr)
      h1Curr.textContent = t("current_connections", "Current Connections");
    const h1Req = document.querySelector("[data-i18n='connection_requests']");
    if (h1Req)
      h1Req.textContent = t("connection_requests", "Connection Requests");

    renderCurrentConnections();
    renderConnectionRequests();
  }

  // fadeoutanimation
  function fadeOutAndRemove(el, cb) {
    el.classList.add("opacity-0");
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (typeof cb === "function") cb();
    }, 300);
  }

  // public hook for backend
  window.enqueueConnectionRequest = function enqueueConnectionRequest(req) {
    try {
      if (!req || !req.role || !req.name) return;
      if (!req.id)
        req.id = String(Date.now()) + Math.random().toString(36).slice(2);

      // add to state then render
      state.requests.push({ id: req.id, role: req.role, name: req.name });
      renderConnectionRequests();
    } catch (e) {
      console.error("[patient-connection] enqueueConnectionRequest error:", e);
    }
  };

  //init
  function init() {
    // demo row for testing
    state.requests.push({ role: "Doctor", name: "Azz", id: "seed-azz" });

    // initial renderi
    renderAll();

    // re-render after language switches
    observeLangChanges(() => {
      whenI18nReady(renderAll);
    });
  }

  if (typeof document === "undefined") return;
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
