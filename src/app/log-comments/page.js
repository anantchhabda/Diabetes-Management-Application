// "use client";
// import { useState } from "react";
// import Link from "next/link";

// export default function CommentsPage() {
//   const [date, setDate] = useState("Monday 18th August");
//   const [comment, setComment] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [tempComment, setTempComment] = useState("");

//   const openModal = () => {
//     setTempComment(comment); // prefill current comment
//     setModalOpen(true);
//   };

//   const saveComment = () => {
//     setComment(tempComment);
//     setModalOpen(false);
//     alert("Comment saved:\n" + tempComment);
//   };

//   const changeDay = (direction) => {
//     setDate(direction === -1 ? "Sunday 17th August" : "Tuesday 19th September");
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl">💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date navigation */}
//         {/* <div className="flex justify-center items-center my-5 text-lg font-bold">
//           <button onClick={() => changeDay(-1)}>⬅</button>
//           <span className="mx-3">{date}</span>
//           <button onClick={() => changeDay(1)}>➡</button> */}

//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>

//           <input
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <Link href={"/log-glucose"}>
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//             Glucose
//           </div>
//           </Link>
//           <Link href={"/log-insulin"}>
//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-700">
//             Insulin
//           </div>
//           </Link>
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-400">
//             Comments
//           </div>
//         </div>

//         {/* Current comment display */}
//         <div className="border p-3 rounded h-40 overflow-y-auto text-lg">
//           {comment || "No comments yet."}
//         </div>

//         {/* Edit button */}
//         <button
//           onClick={openModal}
//           className="bg-green-600 text-white px-6 py-2 mt-4 rounded text-lg"
//         >
//           Edit
//         </button>
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
//             <textarea
//               className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               value={tempComment}
//               onChange={(e) => setTempComment(e.target.value)}
//               placeholder="Type your comment here..."
//             />
//             <div className="flex justify-end mt-4 gap-2">
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="px-4 py-2 rounded bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveComment}
//                 className="px-4 py-2 rounded bg-green-600 text-white"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// //Without React First Attempt
// "use client";

// export default function CommentsPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl">💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="commentDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <a href="/log-glucose">
//             <div className="px-3 py-1 rounded font-bold text-white bg-sky-500 cursor-pointer">
//               Glucose
//             </div>
//           </a>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-emerald-700 cursor-pointer">
//               Insulin
//             </div>
//           </a>
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-400">
//             Comments
//           </div>
//         </div>

//         {/* Current comment display */}
//         <div
//           id="commentDisplay"
//           className="border p-3 rounded h-40 overflow-y-auto text-lg"
//         >
//           No comments yet.
//         </div>

//         {/* Edit button */}
//         <button
//           id="editCommentBtn"
//           className="bg-green-600 text-white px-6 py-2 mt-4 rounded text-lg"
//         >
//           Edit
//         </button>
//       </div>

//       {/* Modal */}
//       <div
//         id="commentModal"
//         className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
//           <textarea
//             id="commentInput"
//             className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Type your comment here..."
//           ></textarea>
//           <div className="flex justify-end mt-4 gap-2">
//             <button
//               id="cancelCommentBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="saveCommentBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Client-side JS */}
//       <script src="/js/comments.js" defer></script>
//     </div>
//   );
// }



// "use client";

// import Script from "next/script";

// export default function CommentsPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="commentsDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <a href="/log-glucose">
//             <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//               Glucose
//             </div>
//           </a>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-emerald-700">
//               Insulin
//             </div>
//           </a>
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-400">
//             Comments
//           </div>
//         </div>

//         {/* Comment display */}
//         <div
//           id="commentDisplay"
//           className="border p-3 rounded h-40 overflow-y-auto text-lg"
//         >
//           No comments yet.
//         </div>

//         {/* Edit button */}
//         <button
//           id="editCommentBtn"
//           className="bg-green-600 text-white px-6 py-2 mt-4 rounded text-lg"
//         >
//           Edit
//         </button>
//       </div>

//       {/* Modal */}
//       <div
//         id="commentsModal"
//         className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
//           <textarea
//             id="commentsModalInput"
//             className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Type your comment here..."
//           ></textarea>
//           <div className="flex justify-end mt-4 gap-2">
//             <button
//               id="cancelCommentsBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="saveCommentsBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Load comments.js via next/script */}
//       <Script src="/js/comments.js" strategy="lazyOnload" />
//     </div>
//   );
// }


// "use client";

// import Script from "next/script";

// export default function CommentsPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="commentsDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <a href="/log-glucose">
//             <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//               Glucose
//             </div>
//           </a>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//               Insulin
//             </div>
//           </a>
//           <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//             Comments
//           </div>
//         </div>

//         {/* Comment display */}
//         <div
//           id="commentDisplay"
//           className="border p-3 rounded h-40 overflow-y-auto text-lg"
//         >
//           No comments yet.
//         </div>

//         {/* Edit button */}
//         <button
//           id="editCommentBtn"
//           className="bg-green-600 text-white px-6 py-2 mt-4 rounded text-lg"
//         >
//           Edit
//         </button>
//       </div>

//       {/* Modal */}
//       <div
//         id="commentsModal"
//         className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
//           <textarea
//             id="commentsModalInput"
//             className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Type your comment here..."
//           ></textarea>
//           <div className="flex justify-end mt-4 gap-2">
//             <button
//               id="cancelCommentsBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="saveCommentsBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Load comments.js via next/script */}
//       <Script src="/js/comments.js" strategy="lazyOnload" />
//     </div>
//   );
// }


// "use client";

// import Script from "next/script";

// export default function CommentsPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="commentsDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow w-full"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <a href="/log-glucose">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB]">
//               Glucose
//             </div>
//           </a>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB]">
//               Insulin
//             </div>
//           </a>
//           <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//             Comments
//           </div>
//         </div>

//         {/* Comment display */}
//         <div
//           id="commentDisplay"
//           className="border p-3 rounded h-40 overflow-y-auto text-lg"
//         >
//           No comments yet.
//         </div>

//         {/* Back button */}
//         <button
//           id="backCommentBtn"
//           onClick={() => window.history.back()}
//           className="bg-gray-600 text-white px-6 py-2 mt-4 rounded text-lg w-full"
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal */}
//       <div
//         id="commentsModal"
//         className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
//           <textarea
//             id="commentsModalInput"
//             className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Type your comment here..."
//           ></textarea>
//           <div className="flex justify-end mt-4 gap-2">
//             <button
//               id="cancelCommentsBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="saveCommentsBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       <Script src="/js/comments.js" strategy="lazyOnload" />
//     </div>
//   );
// }



// "use client";

// import Script from "next/script";
// import { useState } from "react";

// export default function CommentsPage() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [comment, setComment] = useState("");

//   const handleOpenModal = () => setModalOpen(true);
//   const handleCloseModal = () => setModalOpen(false);
//   const handleSaveModal = () => {
//     const display = document.getElementById("commentDisplay");
//     if (display) display.textContent = comment || "No comments yet.";
//     setModalOpen(false);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="commentsDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow w-full"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <a href="/log-glucose">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB]">
//               Glucose
//             </div>
//           </a>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB]">
//               Insulin
//             </div>
//           </a>
//           <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//             Comments
//           </div>
//         </div>

//         {/* Comment display with Edit button */}
//         <div className="relative border rounded h-40 overflow-y-auto text-lg p-3">
//           <div id="commentDisplay" className="w-full h-full">
//             {comment || "No comments yet."}
//           </div>
//           {/* Edit button inside comment box */}
//           <button
//             id="editCommentBoxBtn"
//             onClick={handleOpenModal}
//             className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
//           >
//             Edit
//           </button>
//         </div>

//         {/* Back button */}
//         <button
//           id="backCommentBtn"
//           onClick={() => window.history.back()}
//           className="bg-gray-600 text-white px-6 py-2 mt-4 rounded text-lg w-full"
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-transparent z-50">
//           <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
//             <textarea
//               id="commentsModalInput"
//               className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Type your comment here..."
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//             ></textarea>
//             <div className="flex justify-end mt-4 gap-2">
//               <button
//                 onClick={handleCloseModal}
//                 className="px-4 py-2 rounded bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveModal}
//                 className="px-4 py-2 rounded bg-green-600 text-white"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Script src="/js/comments.js" strategy="lazyOnload" />
//     </div>
//   );
// }




// "use client";

// import Script from "next/script";

// export default function CommentsPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="commentsDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>


//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <a href="/log-glucose">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB]">
//               Glucose
//             </div>
//           </a>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB]">
//               Insulin
//             </div>
//           </a>
//           <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//             Comments
//           </div>
//         </div>

//         {/* Comment display with Edit button */}
//         <div className="relative border rounded h-40 overflow-y-auto text-lg p-3">
//           <div id="commentDisplay" className="w-full h-full">
//             No comments yet.
//           </div>
//           {/* Edit button inside comment box */}
//           <button
//             id="editCommentBoxBtn"
//             className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
//           >
//             Edit
//           </button>
//         </div>

//         {/* Back button */}
//         <button
//           id="backCommentBtn"
//           onClick={() => window.history.back()}
//           className="bg-gray-600 text-white px-6 py-2 mt-4 rounded text-lg w-full"
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with backdrop blur */}
//       <div
//         id="commentsModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50"
//       >
//         <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
//           <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
//           <textarea
//             id="commentsModalInput"
//             className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Type your comment here..."
//           ></textarea>
//           <div className="flex justify-end mt-4 gap-2">
//             <button
//               id="cancelCommentsBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="saveCommentsBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       <Script src="/js/comments.js" strategy="lazyOnload" />
//     </div>
//   );
// }



"use client";

import Script from "next/script";

export default function CommentsPage() {
  return (
    <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-[#049EDB]">
      <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-4 sm:p-8 rounded-xl shadow-lg mx-2 sm:mx-4">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200"></div>
          <div className="text-xl sm:text-2xl cursor-pointer">Place-Holder Logo💧+</div>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300"></div>
        </div>

{/* Date picker */}
<div className="flex flex-col items-center gap-2 sm:gap-4 p-4 sm:p-6">
  <h2 className="text-md sm:text-lg font-bold text-center">Select a Date 📅</h2>
  <input
    id="commentsDate"
    type="date"
    className="border px-2 sm:px-3 py-2 rounded shadow w-auto text-center font-bold text-sm sm:text-base"
    style={{ minWidth: "9ch" }} // ensures minimum width
  />
</div>


        {/* Labels */}
        <div className="flex flex-wrap justify-around mb-3 gap-2 sm:gap-4">
          <a href="/log-glucose" className="flex-1">
            <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] text-sm sm:text-base text-center">
              Glucose
            </div>
          </a>
          <a href="/log-insulin" className="flex-1">
            <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] text-sm sm:text-base text-center">
              Insulin
            </div>
          </a>
          <div className="flex-1">
            <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-green-600 text-sm sm:text-base text-center">
              Comments
            </div>
          </div>
        </div>

        {/* Comment display with Edit button */}
        <div className="relative border rounded h-36 sm:h-40 overflow-y-auto text-base sm:text-lg p-2 sm:p-3">
          <div id="commentDisplay" className="w-full h-full">
            No comments yet.
          </div>
          <button
            id="editCommentBoxBtn"
            className="absolute bottom-2 right-2 bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
          >
            Edit
          </button>
        </div>

        {/* Back button */}
        <button
          id="backCommentBtn"
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 mt-3 sm:mt-4 rounded text-sm sm:text-lg w-full"
        >
          Back
        </button>
      </div>

      {/* Modal with blur background */}
      <div
        id="commentsModal"
        className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50 p-2 sm:p-4"
      >
        <div className="bg-white w-full max-w-sm sm:max-w-lg p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-center">Edit Comment</h2>
          <textarea
            id="commentsModalInput"
            className="w-full h-48 sm:h-64 p-2 sm:p-3 border-2 border-gray-300 rounded resize-none text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 box-border"
            placeholder="Type your comment here..."
          ></textarea>
          <div className="flex justify-end mt-3 sm:mt-4 gap-2">
            <button
              id="cancelCommentsBtn"
              className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-gray-300 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              id="saveCommentsBtn"
              className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-green-600 text-white text-sm sm:text-base"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <Script src="/js/comments.js" strategy="lazyOnload" />
    </div>
  );
}
