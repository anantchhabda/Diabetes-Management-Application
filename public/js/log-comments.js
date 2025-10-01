(function () {
  if (typeof document === "undefined") return;

  const $ = (id) => document.getElementById(id);
  const dateInput = $("commentsDate");
  const display   = $("commentDisplay");      // <-- DIV
  const editBtn   = $("editCommentBoxBtn");
  const backBtn   = $("backCommentBtn");
  const modal     = $("commentsModal");
  const modalInput= $("commentsModalInput");  // textarea
  const cancelBtn = $("cancelCommentsBtn");
  const saveBtn   = $("saveCommentsBtn");

  let canEdit = false;
  let viewerPatientID = null;

  const todayStr = () => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
  };
  const getPatientIDFromURL = () => new URL(window.location.href).searchParams.get("patientID");
  const authHeader = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("authToken") || ""}`,
  });

  function openModal() { if (canEdit) { modal.classList.remove("hidden"); modalInput.focus(); } }
  function closeModal() { modal.classList.add("hidden"); }

  async function getMe() {
    const r = await fetch("/api/auth/me", { method: "GET", headers: authHeader() });
    if (!r.ok) throw new Error("Unauthorized");
    return r.json();
  }
  async function fetchPatientLog(date) {
    const r = await fetch(`/api/patient/me/generallog?date=${encodeURIComponent(date)}`, { method:"GET", headers: authHeader() });
    if (!r.ok) throw new Error("Failed to load");
    return r.json();
  }
  async function fetchViewerLog(date, patientID) {
    if (!patientID) throw new Error("Missing patientID");
    const r = await fetch(`/api/auth/me/patient/${encodeURIComponent(patientID)}/viewlog?date=${encodeURIComponent(date)}`, { method:"GET", headers: authHeader() });
    if (!r.ok) throw new Error("Failed to load");
    return r.json();
  }
  async function fetchLog(date) { return canEdit ? fetchPatientLog(date) : fetchViewerLog(date, viewerPatientID); }

  async function createLog(date, comment) {
    const r = await fetch(`/api/patient/me/generallog`, { method:"POST", headers: authHeader(), body: JSON.stringify({ date, comment }) });
    if (!r.ok) throw new Error("Create failed");
    return r.json();
  }
  async function updateOrDeleteLog(date, comment) {
    const r = await fetch(`/api/patient/me/generallog?date=${encodeURIComponent(date)}`, { method:"PATCH", headers: authHeader(), body: JSON.stringify({ comment }) });
    if (!r.ok) throw new Error(String(r.status)); // bubble status for 404 fallback
    return r.json();
  }

  async function loadComment(date) {
    display.textContent = "Loading...";
    display.classList.add("whitespace-pre-wrap"); // show multi-line nicely
    try {
      const payload = await fetchLog(date);
      const txt =
        (payload && typeof payload === "object" && (
          payload.comment ??
          payload?.log?.comment ??
          (Array.isArray(payload.logs) ? payload.logs[0]?.comment : undefined)
        )) ?? (typeof payload === "string" ? payload : "");

      display.textContent = txt || "No comments yet.";
      modalInput.value = txt || "";
    } catch (e) {
      console.error(e);
      display.textContent = "Failed to load comments.";
    }
  }

  async function saveComment() {
    if (!canEdit) return alert("You do not have permission to edit.");
    const date = dateInput.value;
    const comment = (modalInput.value || "").trim();

    try {
      try {
        await updateOrDeleteLog(date, comment);
      } catch (e) {
        if (e.message === "404") await createLog(date, comment);
        else throw e;
      }
      // Refresh from server to be 100% consistent
      await loadComment(date);
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Saving failed. Please try again.");
    }
  }

  (async function init() {
    if (!dateInput.value) dateInput.value = todayStr();

    try {
      const me = await getMe();
      canEdit = me?.role === "Patient";
      if (!canEdit) viewerPatientID = getPatientIDFromURL();
    } catch (e) {
      console.error(e);
    }

    if (!canEdit) { editBtn.classList.add("hidden"); editBtn.disabled = true; }

    await loadComment(dateInput.value);

    dateInput.addEventListener("change", (e) => loadComment(e.target.value));
    editBtn.addEventListener("click", openModal);
    saveBtn.addEventListener("click", saveComment);
    cancelBtn.addEventListener("click", closeModal);
    backBtn.addEventListener("click", () => window.history.back());
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    console.log("[comments] ready");
  })();
})();
