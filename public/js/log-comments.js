(function () {
    if (typeof document === "undefined") return;
    
    const $ = (id) => document.getElementById(id);
    const dateInput = $("commentsDate");
    const display = $("commentDisplay");
    const editBtn = $("editCommentBoxBtn");
    const backBtn = $("backCommentBtn");
    const modal = $("commentsModal");
    const modalInput = $("commentsModalInput");
    const cancelBtn = $("cancelCommentsBtn");
    const saveBtn = $("saveCommentsBtn");

    const todayStr = () => {
        const today = new Date();
        return String(today.getFullYear()).padStart(4, '0') + '-' +
               String(today.getMonth() + 1).padStart(2, '0') + '-' +   
               String(today.getDate()).padStart(2, '0');
    };
    const openModal = () => {modal.classList.remove("hidden"); modalInput.focus();};
    const closeModal = () => modal.classList.add("hidden");
    
    async function fetchLog(date) {
        const res = await fetch(`/api/patient/me/generallog?date=${date}`, {
            method: 'GET',
            credentials: 'include', //send auth cookie
        });
        if (!res.ok) {
            setError(data.error || data.message || 'Something went wrong');
            return "";
        }
        const json = await res.json();
        const txt =json.logs?.[0]?.comment || "";
        return txt;
    }

    async function createLog(date, comment) {
        const res = await fetch(`/api/patient/me/generallog`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', 
            body: JSON.stringify({date, comment})
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error || data.message || 'Something went wrong');
            return false;
        }
        return res.json();
    }

    async function updateOrDelelteLog(date, comment) {
        const res = await fetch(`/api/patient/me/generallog?date=${date}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', 
            body: JSON.stringify({comment})
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error || data.message || 'Something went wrong');
            return false;
        }
        return res.json();
    }

    async function loadComment(date) {
        display.textContent = "Loading...";
        try {
            const txt = await fetchLog(date);
            display.textContent = txt || "No comments yet.";
            modalInput.value = txt || "";
        } catch (err) {
            display.textContent = "Failed to load comments.";
            console.error(err);
        }
    }

    async function saveComment() {
        const date = dateInput.value;
        const comment = modalInput.value.trim();
        try {
            if (display.textContent === "No comments yet." && comment) {
                await createLog(date, comment);
            } else {
                await updateOrDelelteLog(date, comment);    
            }
            display.textContent = comment || "No comments yet.";
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Saving failed. Please try again.");
        }
    }

    if (!dateInput.value) dateInput.value = todayStr();
    loadComment(dateInput.value);

    dateInput.addEventListener("change", (e) => loadComment(e.target.value));
    editBtn.addEventListener("click", () => openModal());
    backBtn.addEventListener("click", () => window.history.back());
    cancelBtn.addEventListener("click", () => closeModal());
    saveBtn.addEventListener("click", saveComment);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    console.log("[comments] ready");
})();
