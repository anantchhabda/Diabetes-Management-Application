// (function () {
//     if (typeof document === "undefined") return;

//     const display = document.getElementById("commentDisplay");
//     const editBtn = document.getElementById("editCommentBtn");
//     const modal = document.getElementById("commentModal");
//     const input = document.getElementById("commentInput");
//     const cancelBtn = document.getElementById("cancelCommentBtn");
//     const saveBtn = document.getElementById("saveCommentBtn");
//     const dateInput = document.getElementById("commentDate");

//     let comment = "";

//     function openModal() {
//         input.value = comment;
//         modal.classList.remove("hidden");
//     }

//     function closeModal() {
//         modal.classList.add("hidden");
//     }

//     function saveComment() {
//         comment = input.value.trim();
//         display.textContent = comment || "No comments yet.";
//         closeModal();
//         alert("Comment saved:\n" + comment);
//     }

//     editBtn.addEventListener("click", openModal);
//     cancelBtn.addEventListener("click", closeModal);
//     saveBtn.addEventListener("click", saveComment);

//     dateInput.addEventListener("change", (e) => {
//         console.log("Selected date:", e.target.value);
//     });
// })();



// (function () {
//     if (typeof document === "undefined") return;

//     const editBtn = document.getElementById("editCommentBtn");
//     const modal = document.getElementById("commentsModal");
//     const modalInput = document.getElementById("commentsModalInput");
//     const cancelBtn = document.getElementById("cancelCommentsBtn");
//     const saveBtn = document.getElementById("saveCommentsBtn");
//     const display = document.getElementById("commentDisplay");
//     const dateInput = document.getElementById("commentsDate");

//     let comment = "";

//     function openModal() {
//         modalInput.value = comment;
//         modal.classList.remove("hidden");
//     }

//     function closeModal() {
//         modal.classList.add("hidden");
//     }

//     function saveComment() {
//         comment = modalInput.value.trim();
//         display.textContent = comment || "No comments yet.";
//         closeModal();
//         alert("Comment saved:\n" + comment);
//     }

//     editBtn.addEventListener("click", openModal);
//     cancelBtn.addEventListener("click", closeModal);
//     saveBtn.addEventListener("click", saveComment);

//     dateInput.addEventListener("change", (e) => {
//         console.log("Selected date:", e.target.value);
//     });
// })();


// /public/js/comments.js

// (function() {
//   if (typeof document === "undefined") return;

//   const commentDisplay = document.getElementById("commentDisplay");
//   const modal = document.getElementById("commentsModal");
//   const modalInput = document.getElementById("commentsModalInput");
//   const cancelBtn = document.getElementById("cancelCommentsBtn");
//   const saveBtn = document.getElementById("saveCommentsBtn");
//   const backBtn = document.getElementById("backCommentBtn"); // New Back button

//   const data = {
//     comment: "",
//   };

//   // Back button navigates to previous page
//   if (backBtn) {
//     backBtn.addEventListener("click", () => {
//       window.history.back();
//     });
//   }

//   // Optional: Modal functionality (if you want to keep edit modal for future)
//   function openModal() {
//     modal.classList.remove("hidden");
//     modalInput.value = data.comment || "";
//   }

//   function closeModal() {
//     modal.classList.add("hidden");
//   }

//   function saveModal() {
//     data.comment = modalInput.value.trim();
//     commentDisplay.textContent = data.comment || "No comments yet.";
//     closeModal();
//   }

//   // Cancel & Save buttons
//   if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
//   if (saveBtn) saveBtn.addEventListener("click", saveModal);

// })();




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
