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

  function requestRow({ id, role, name }) {
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
  let isRenderingCurrent = false; //global flag for both renders
  async function renderCurrentConnections() {
    if (isRenderingCurrent) return; //prevent duplicate render
    isRenderingCurrent = true;

    const container = $("currentConnectionsContainer");
    if (!container) return;
    clearChildren(container);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('Session expired, please login again');
        return;
      }
      // fetch current connections from backend
      const res = await fetch('/api/patient/me/connection', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      
      if (!res.ok) throw new Error(`Load connections failed (${res.status})`);
      const data = await res.json();

      const connections = (data.connections || []).map(conn => ({
        role: conn.role,
        name: conn.name,
        requesterID: conn.requesterID,
      }));
      
      if (!connections.length) {
        ensureEmptyMessage(
          "currentConnectionsContainer",
          "noCurrentConnections",
          "no_current_connections",
          "No current connections yet."
        );
        return;
      }
      //render each connection row
      const seenIDs = new Set();
      connections.forEach(conn => {
        if (conn.requesterID && seenIDs.has(conn.requesterID)) return;
        if (conn.requesterID) seenIDs.add(conn.requesterID);
        const row = currentConnectionRow(conn);
        const removeBtn = bySel(".remove-btn", row);
        //remove button functionality
        removeBtn.addEventListener('click', async () => {
          if (!conn.requesterID) return;
          try {
            const delRes = await fetch (`/api/patient/me/connection/${conn.requesterID}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
              },
            });
            if (!delRes.ok) {
              const errData = await delRes.json().catch(() => ({}));
              console.error('Failed to remove connection:', errData.message || delRes.statusText);
              return;
            }
            //fade out row
            fadeOutAndRemove(row, () => {
              if (container.children.length === 0) {
                ensureEmptyMessage(
                  "currentConnectionsContainer",
                  "noCurrentConnections",
                  "no_current_connections",
                  "No current connections yet."
                );
              }
            });
            if (window.removeCurrentConnection) {
              window.removeCurrentConnection(conn.requesterID);
            }
          } catch (err) {
            console.error('Error removing connection', err);
          }
        });
        container.appendChild(row);
      });
    } catch (err) {
      console.error('Error loading current connections', err);
    } finally {
      isRenderingCurrent = false
    }
  }

  let isRenderingRequest = false;
  async function renderConnectionRequests() {
    if (isRenderingRequest) return; //prevent duplicate render
    isRenderingRequest = true;
    const container = $("connectionRequestsContainer");
    if (!container) return;
    clearChildren(container);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('Session expired, please login again');
        return;
      }
      const res = await fetch('/api/patient/me/request', {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      if (!res.ok) throw new Error(`Load requests failed (${res.status})`);
      const data = await res.json();
      const requests = (data.requests || []).map((r) => ({
        id: r._id,
        role: r.requesterRole,
        requesterID: r.requesterUser,
        name: r.requesterName
      }));
      if (!requests.length) {
        ensureEmptyMessage(
          "connectionRequestsContainer",
          "noConnectionRequests",
          "no_connection_requests",
          "No connection requests yet."
        );
        return;
      }
      const seenIDs = new Set();
      requests.forEach((req) => {
        if (req.id && seenIDs.has(req.id)) return;
        if (req.id) seenIDs.add(req.id);
        const row = requestRow(req);
        const acceptBtn = bySel(".accept-btn", row);
        const declineBtn = bySel(".decline-btn", row);

        acceptBtn.addEventListener("click", async () => {
          try {
            const res = await fetch(`/api/patient/me/request/${req.id}/accept`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "Cache-Control": "no-cache",
              },
            });
            if (!res.ok) throw new Error('Failed to accept request');
            fadeOutAndRemove(row);
            await renderCurrentConnections();

            //call hook
            if (window.addCurrentConnection) {
              window.addCurrentConnection({ 
                name: req.name, 
                role: req.role, 
                id: req.requesterID 
              });
            }

          } catch (err) {
            console.error('Error accepting request:', err);
          }
        });

        declineBtn.addEventListener("click", async () => {
          try {
            const res = await fetch(`/api/patient/me/request/${req.id}/reject`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "Cache-Control": "no-cache",
              },
            });
            if (!res.ok) throw new Error('Failed to reject request');
            fadeOutAndRemove(row);

            if (window.removeConnectionRequest) {
              window.removeConnectionRequest(req.id);
            }
          } catch (err) {
            console.error('Error rejecting request:', err);
          }
        });

        container.appendChild(row);
      });
    } catch (err) {
      console.error('Error loading connection requests', err)
    } finally {
      isRenderingRequest = false;
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

  //init
  async function init() {
    await whenI18nReady(renderAll); // only render after i18n is ready

    observeLangChanges(() => {
      whenI18nReady(renderAll);
    });
  }

  if (typeof document === "undefined") return;
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
