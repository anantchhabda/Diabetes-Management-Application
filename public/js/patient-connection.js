(function () {
  // helper functions
  const $ = (id) => document.getElementById(id);
  const bySel = (sel, root = document) => root.querySelector(sel);

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

  function removeEmptyMessage(id) {
    const el = $(id);
    if (el) el.remove();
  }

  // renders current connection etc.
  function renderCurrentConnection({ role, name }) {
    const container = $("currentConnectionsContainer");
    if (!container) return;

    // remove message
    removeEmptyMessage("noCurrentConnections");

    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto] border border-black transition-opacity duration-300";

    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        ${role}
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        Remove
      </button>
    `;

    const removeBtn = bySel("button", row);
    removeBtn.addEventListener("click", () => {
      fadeOutAndRemove(row, () => {
        ensureEmptyMessage(
          "currentConnectionsContainer",
          "noCurrentConnections",
          "No current connections yet."
        );
      });
    });

    container.appendChild(row);
  }

  function renderConnectionRequest({ role, name, id }) {
    const container = $("connectionRequestsContainer");
    if (!container) return;

    removeEmptyMessage("noConnectionRequests");

    const row = document.createElement("div");
    row.className =
      "grid grid-cols-[100px_1fr_auto_auto] border border-black transition-all duration-300";

    row.innerHTML = `
      <div class="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
        ${role}
      </div>
      <div class="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
        ${name}
      </div>
      <button class="accept-btn bg-green-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        Accept
      </button>
      <button class="decline-btn bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
        Decline
      </button>
    `;

    const acceptBtn = bySel(".accept-btn", row);
    const declineBtn = bySel(".decline-btn", row);

    acceptBtn.addEventListener("click", async () => {
      //back end logic needed here...
      fadeOutAndRemove(row, () => {
        ensureEmptyMessage(
          "connectionRequestsContainer",
          "noConnectionRequests",
          "No connection requests yet."
        );
        // adds to current connections if accepeted
        renderCurrentConnection({ role, name });
      });
    });

    declineBtn.addEventListener("click", async () => {
      //back end logic needed here
      fadeOutAndRemove(row, () => {
        ensureEmptyMessage(
          "connectionRequestsContainer",
          "noConnectionRequests",
          "No connection requests yet."
        );
      });
    });

    container.appendChild(row);
  }

  function fadeOutAndRemove(el, cb) {
    el.classList.add("opacity-0");
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (typeof cb === "function") cb();
    }, 300);
  }

  //public hook for backend event
  window.enqueueConnectionRequest = function enqueueConnectionRequest(req) {
    try {
      if (!req || !req.role || !req.name) return;
      renderConnectionRequest(req);
    } catch (e) {
      console.error("[patient-connection] enqueueConnectionRequest error:", e);
    }
  };

  // ---------- Init ----------
  function init() {
    //demo to test
    renderConnectionRequest({ role: "Doctor", name: "Azz", id: "seed-azz" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
