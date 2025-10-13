// /public/js/offline.js
(function () {
    if (typeof window === "undefined") return;
    const Q_DB = "dm_queue_v1";
    const Q_STORE = "mutations";
    let qdb;
    const handlers = new Map(); // resource -> push(mut)

    function authHeader() {
        return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        };
    }
    function isOnline() { return navigator.onLine; }

    // --- IDB helpers
    function qOpen() {
        return new Promise((resolve, reject) => {
        if (qdb) return resolve(qdb);
        const req = indexedDB.open(Q_DB, 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(Q_STORE)) {
                const os = db.createObjectStore(Q_STORE, { keyPath: "id" });
                os.createIndex("by_status", "status", { unique: false });
                os.createIndex("by_created", "createdAt", { unique: false });
            }
        };
        req.onsuccess = () => { qdb = req.result; resolve(qdb); };
        req.onerror = () => reject(req.error);
        });
    }

    async function qTx(mode = "readonly") {
        return (await qOpen()).transaction(Q_STORE, mode);
    }

    async function qPut(rec) {
        const tx = await qTx("readwrite");
        await new Promise((res, rej) => {
            const r = tx.objectStore(Q_STORE).put(rec);
            r.onsuccess = () => res();
            r.onerror = () => rej(r.error);
        });
    }
    
    async function qGet(id) {
        const tx = await qTx("readwrite");
        const store = tx.objectStore(Q_STORE);
        return await new Promise((res, rej) => {
            const r = store.get(id);
            r.onsuccess = () => res(r.result);
            r.onerror = () => rej(r.error);
    });
  }
    async function qReadPending(limit = 50) {
        const tx = await qTx("readonly");
        const idx = tx.objectStore(Q_STORE).index("by_status");
        const out = [];
        return await new Promise((res, rej) => {
            const cur = idx.openCursor("pending");
            cur.onsuccess = (e) => {
                const c = e.target.result;
                if (!c || out.length >= limit) return res(out);
                out.push(c.value); 
                c.continue();
            };
            cur.onerror = () => rej(cur.error);
        });
    }
    /** Mark as done */
    async function qMarkDone(id) {
        const rec = await qGet(id);
        if (!rec) return;
        rec.status = "synced"; rec.syncedAt = Date.now();
        await qPut(rec);
    }

    /** Bump attempts (backoff-friendly) */
    async function qBumpAttempts(id) {
        const rec = await qGet(id);
        if (!rec) return;
        rec.attempts = (rec.attempts || 0) + 1;
        await qPut(rec);
    }

    // --- Public API
    async function enqueue(resource, payload) {
        const rec = {
            id: crypto.randomUUID(),
            idem: crypto.randomUUID(),  // pass to server as X-Idempotency-Key
            resource,
            status: "pending",
            createdAt: Date.now(),
            attempts: 0,
            ...payload,
        };
        await qPut(rec);
        return rec;
    }

    /** Flush queue: stop on 401 (needs re-login), or when offline */
    let __flushing = false;
    async function flush() {
        if (__flushing || !isOnline()) return;
        __flushing = true;
        try {
            const batch = await qReadPending(50);
            for (const m of batch) {
                const push = handlers.get(m.resource);
                if (!push) { await qMarkDone(m.id); continue; } // nothing to do
                try {
                  await push(m, { authHeader });
                  await qMarkDone(m.id);
                } catch (err) {
                    if (err && (err.status === 401 || err.status === 403)) {
                        console.warn('[offline] auth error—stop flush');
                        showBanner('Session expired. Your offline changes are saved and will sync after you sign in.');
                        break;
                    }
                    await qBumpAttempts(m.id);
                  console.warn("[offline] push failed; retry later", err);
                  break;
                }
            }
        } finally {
            __flushing = false;
        }
    }

    function onOnline() { flush(); }
    function onVisible() { if (document.visibilityState === "visible") flush(); }
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisible);

    function register(resource, pushFn) { handlers.set(resource, pushFn); }
    function showBanner(msg) {
        const el = document.getElementById("saveNotice");
        if (el) {
            el.textContent = msg;
            el.classList.remove("hidden");
            setTimeout(() => el.classList.add("hidden"), 2000);
        } else {
            console.log("[banner]", msg);
        }
    }

    // expose
    window.__offline = { enqueue, flush, register, authHeader, showBanner, isOnline };
})();
