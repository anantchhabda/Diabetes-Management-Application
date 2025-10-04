(function () {
  if (typeof document === "undefined") return;

  // Grab existing elements from the page
  const commentDisplay = document.getElementById("commentDisplay");
  const modal = document.getElementById("commentsModal");
  const modalInput = document.getElementById("commentsModalInput");
  const editBtn = document.getElementById("editCommentBoxBtn");
  const cancelBtn = document.getElementById("cancelCommentsBtn");
  const saveBtn = document.getElementById("saveCommentsBtn");
  const backBtn = document.getElementById("backCommentBtn");

  let comment = "";

  function openModal() {
    modal.classList.remove("hidden");
    modalInput.value = comment;
    modalInput.focus();
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  function saveModal() {
    comment = modalInput.value.trim();
    commentDisplay.textContent = comment || "No comments yet.";
    closeModal();
  }

  // Event listeners
  if (editBtn) editBtn.addEventListener("click", openModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  if (saveBtn) saveBtn.addEventListener("click", saveModal);
  if (backBtn) backBtn.addEventListener("click", () => window.history.back());

  // Optional: close modal when clicking outside the modal content
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
})();
