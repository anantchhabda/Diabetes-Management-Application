//With React Cancelled
// "use client";
// import { useState } from "react";
// import Link from "next/link"; // Import Link

// export default function TrackerPage() {
//   const meals = [
//     "Before Breakfast",
//     "After Breakfast",
//     "Before Lunch",
//     "After Lunch",
//     "Before Dinner",
//     "After Dinner",
//   ];

//   const [data, setData] = useState({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentMeal, setCurrentMeal] = useState("");
//   const [tempValue, setTempValue] = useState("");
//   const [date, setDate] = useState("2025-09-25");

//   const handleEdit = (meal) => {
//     setCurrentMeal(meal);
//     setTempValue(data[meal] || "");
//     setModalOpen(true);
//   };

//   const handleSaveModal = () => {
//     setData({ ...data, [currentMeal]: tempValue });
//     setModalOpen(false);
//   };

//   const saveData = () => {
//     alert("Data saved!\n" + JSON.stringify(data, null, 2));
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
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
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//             Glucose
//           </div>
//           <Link href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-emerald-700 cursor-pointer">
//               Insulin
//             </div>
//           </Link>
//           <Link href="/log-comments">
//           <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//             Comments
//           </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-11/12 mx-auto border-collapse bg-white">
//           <tbody>
//             {meals.map((meal) => (
//               <tr key={meal} className="border">
//                 <td className="bg-sky-950 text-white font-bold p-2 w-1/3">
//                   {meal}
//                 </td>
//                 <td className="p-2">{data[meal] || ""}</td>
//                 <td className="p-2">
//                   <button
//                     onClick={() => handleEdit(meal)}
//                     className="bg-green-600 text-white px-3 py-1 rounded"
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Save Button */}
//         <button
//           onClick={saveData}
//           className="bg-green-600 text-white text-lg font-bold px-5 py-2 rounded mt-5"
//         >
//           Save
//         </button>
//       </div>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm shadow-lg">
//             <h3 className="text-lg font-bold mb-4">{currentMeal}</h3>
//             <textarea
//               className="border w-full p-2 rounded mb-4"
//               rows={4}
//               value={tempValue}
//               onChange={(e) => setTempValue(e.target.value)}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setModalOpen(false)}
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
//     </div>
//   );
// }

//Without React First Attempt
// "use client";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//             Glucose
//           </div>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-emerald-700 cursor-pointer">
//               Insulin
//             </div>
//           </a>
//           <a href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//               Comments
//             </div>
//           </a>
//         </div>

//         {/* Table */}
//         <table className="w-11/12 mx-auto border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Save Button */}
//         <button
//           id="saveGlucoseBtn"
//           className="bg-green-600 text-white text-lg font-bold px-5 py-2 rounded mt-5"
//         >
//           Save
//         </button>
//       </div>

//       {/* Modal */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-4"></h3>
//           <textarea
//             id="glucoseModalInput"
//             className="border w-full p-2 rounded mb-4"
//             rows={4}
//           ></textarea>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Client-side JS */}
//       <script src="/js/glucose.js" defer></script>
//     </div>
//   );
// }

// // //Attempt 2 without react
// "use client";

// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//             Glucose
//           </div>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-emerald-700 cursor-pointer">
//               Insulin
//             </div>
//           </a>
//           <a href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//               Comments
//             </div>
//           </a>
//         </div>

//         {/* Table */}
//         <table className="w-11/12 mx-auto border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Save Button */}
//         <button
//           id="saveGlucoseBtn"
//           className="bg-green-600 text-white text-lg font-bold px-5 py-2 rounded mt-5"
//         >
//           Save
//         </button>
//       </div>

//       {/* Modal */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-4"></h3>
//           <textarea
//             id="glucoseModalInput"
//             className="border w-full p-2 rounded mb-4"
//             rows={4}
//           ></textarea>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Load script via next/script */}
//       <Script src="/js/glucose.js" strategy="lazyOnload" />
//     </div>
//   );
// }


// // slight better version
// "use client";

// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//             Glucose
//           </div>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Insulin
//             </div>
//           </a>
//           <a href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </a>
//         </div>

//         {/* Table */}
//         <table className="w-11/12 mx-auto border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Save Button */}
//         <button
//           id="saveGlucoseBtn"
//           className="bg-green-600 text-white text-lg font-bold px-5 py-2 rounded mt-5"
//         >
//           Save
//         </button>
//       </div>

//       {/* Modal */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-4"></h3>
//           <textarea
//             id="glucoseModalInput"
//             className="border w-full p-2 rounded mb-4"
//             rows={4}
//           ></textarea>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Script with fixed table */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Breakfast", "Lunch", "Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = ""; // Clear table
//               rows.forEach((row) => {
//                 const tr = document.createElement("tr");

//                 // Row name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[30%] px-3 py-2";
//                 tdRow.textContent = row;

//                 // Edit cell (merged value + button)
//                 const tdEdit = document.createElement("td");
//                 tdEdit.className = "px-3 py-2 flex items-center gap-2"; // ✅ flex removes gap
//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded";
//                 btn.textContent = data[row] || "Edit"; // show value if exists
//                 btn.addEventListener("click", () => openModal(row));
//                 tdEdit.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdEdit); // ✅ only one td next to row name
//                 table.appendChild(tr);
//               });
//             }

//             function openModal(row) {
//               currentRow = row;
//               modalTitle.textContent = row;
//               modalInput.value = data[row] || "";
//               modal.classList.remove("hidden");
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               data[currentRow] = val;
//               renderTable();
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }



// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow w-full"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//             Glucose
//           </div>
//           <a href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Insulin
//             </div>
//           </a>
//           <a href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </a>
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Save Button */}
//         <button
//           id="saveGlucoseBtn"
//           className="bg-green-600 text-white text-lg font-bold px-5 py-2 rounded mt-5 w-full"
//         >
//           Save
//         </button>
//       </div>

//       {/* Modal */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-2"></h3>
//           <input
//             id="glucoseModalInput"
//             type="text"
//             className="border w-full px-3 py-2 rounded mb-2 box-border"
//             placeholder="Enter Levels..."
//           />
//           <p id="glucoseWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Script */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Breakfast", "Lunch", "Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const warningEl = document.getElementById("glucoseWarning");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";

//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Row name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[30%] px-3 py-2";
//                 tdRow.textContent = row;

//                 // Value + Edit button
//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded ml-2";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => openModal(row));

//                 tdValue.appendChild(spanValue);
//                 tdValue.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 table.appendChild(tr);
//               });
//             }

//             function openModal(row) {
//               currentRow = row;
//               modalTitle.textContent = row;
//               modalInput.value = data[row] || "";
//               warningEl.classList.add("hidden");
//               modal.classList.remove("hidden");
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               if (!/^\\d*$/.test(val)) {
//                 warningEl.textContent = "⚠️ Please enter numbers only";
//                 warningEl.classList.remove("hidden");
//                 return;
//               }
//               warningEl.classList.add("hidden");
//               data[currentRow] = val;
//               document.getElementById(\`\${currentRow}-value\`).textContent = val ? val + " mg/dl" : "";
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }



// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//             Glucose
//           </div>
//           <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//             Insulin
//           </div>
//           <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//             Comments
//           </div>
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Back Button */}
//         <button
//           id="backGlucoseBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg w-full"
//           onClick={() => window.history.back()}
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with blur background */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-transparent z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-2"></h3>
//           <input
//             id="glucoseModalInput"
//             type="text"
//             className="border w-full px-3 py-2 rounded mb-2 box-border"
//             placeholder="Enter value..."
//           />
//           <p id="glucoseWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Script */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Breakfast", "Lunch", "Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const warningEl = document.getElementById("glucoseWarning");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";

//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Row name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[30%] px-3 py-2";
//                 tdRow.textContent = row;

//                 // Value + Edit button
//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded ml-2";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => openModal(row));

//                 tdValue.appendChild(spanValue);
//                 tdValue.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 table.appendChild(tr);
//               });
//             }

//             function openModal(row) {
//               currentRow = row;
//               modalTitle.textContent = row;
//               modalInput.value = data[row] || "";
//               warningEl.classList.add("hidden");
//               modal.classList.remove("hidden");
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               if (!/^\\d*$/.test(val)) {
//                 warningEl.textContent = "⚠️ Please enter numbers only";
//                 warningEl.classList.remove("hidden");
//                 return;
//               }
//               warningEl.classList.add("hidden");
//               data[currentRow] = val;
//               document.getElementById(\`\${currentRow}-value\`).textContent = val ? val + " mg/dl" : "";
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }


// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//             Glucose
//           </div>
//           <Link href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Insulin
//             </div>
//           </Link>
//           <Link href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Back Button */}
//         <button
//           id="backGlucoseBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg w-full"
//           onClick={() => window.history.back()}
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with blur background */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-transparent z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-2"></h3>
//           <input
//             id="glucoseModalInput"
//             type="text"
//             className="border w-full px-3 py-2 rounded mb-2 box-border"
//             placeholder="Enter value..."
//           />
//           <p id="glucoseWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Script */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Breakfast", "Lunch", "Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const warningEl = document.getElementById("glucoseWarning");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";

//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Row name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[30%] px-3 py-2";
//                 tdRow.textContent = row;

//                 // Value + Edit button
//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded ml-2";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => openModal(row));

//                 tdValue.appendChild(spanValue);
//                 tdValue.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 table.appendChild(tr);
//               });
//             }

//             function openModal(row) {
//               currentRow = row;
//               modalTitle.textContent = row;
//               modalInput.value = data[row] || "";
//               warningEl.classList.add("hidden");
//               modal.classList.remove("hidden");
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               if (!/^\\d*$/.test(val)) {
//                 warningEl.textContent = "⚠️ Please enter numbers only";
//                 warningEl.classList.remove("hidden");
//                 return;
//               }
//               warningEl.classList.add("hidden");
//               data[currentRow] = val;
//               document.getElementById(\`\${currentRow}-value\`).textContent = val ? val + " mg/dl" : "";
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }


// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//             Glucose
//           </div>
//           <Link href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Insulin
//             </div>
//           </Link>
//           <Link href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Back Button */}
//         <button
//           id="backGlucoseBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg w-full"
//           onClick={() => window.history.back()}
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with blur background */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-2"></h3>
//           <input
//             id="glucoseModalInput"
//             type="text"
//             className="border w-full px-3 py-2 rounded mb-2 box-border"
//             placeholder="Enter value..."
//           />
//           <p id="glucoseWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Vanilla JS Script */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             const rows = ["Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const warningEl = document.getElementById("glucoseWarning");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");
//             const backBtn = document.getElementById("backGlucoseBtn");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";
//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[30%] px-3 py-2";
//                 tdRow.textContent = row;

//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded ml-2";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => openModal(row));

//                 tdValue.appendChild(spanValue);
//                 tdValue.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 table.appendChild(tr);
//               });
//             }

//             function openModal(row) {
//               currentRow = row;
//               modalTitle.textContent = row;
//               modalInput.value = data[row] || "";
//               warningEl.classList.add("hidden");
//               modal.classList.remove("hidden");
//               modalInput.focus();
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               if (!/^\\d*$/.test(val)) {
//                 warningEl.textContent = "⚠️ Please enter numbers only";
//                 warningEl.classList.remove("hidden");
//                 return;
//               }
//               warningEl.classList.add("hidden");
//               data[currentRow] = val;
//               document.getElementById(\`\${currentRow}-value\`).textContent = val ? val + " mg/dl" : "";
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);
//             modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });
//             backBtn.addEventListener("click", () => window.history.back());

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }


// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//             Glucose
//           </div>
//           <Link href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Insulin
//             </div>
//           </Link>
//           <Link href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Back Button */}
//         <button
//           id="backGlucoseBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg w-full"
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with blur background */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-2"></h3>
//           <input
//             id="glucoseModalInput"
//             type="text"
//             className="border w-full px-3 py-2 rounded mb-2 box-border"
//             placeholder="Enter value..."
//           />
//           <p id="glucoseWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Vanilla JS Script */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             const rows = ["Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const warningEl = document.getElementById("glucoseWarning");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");
//             const backBtn = document.getElementById("backGlucoseBtn");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";
//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Left cell: meal name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[35%] px-3 py-2";
//                 tdRow.textContent = row;

//                 // Right cell: value + edit button
//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center cursor-pointer";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded ml-2";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => openModal(row));

//                 tdValue.appendChild(spanValue);
//                 tdValue.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 table.appendChild(tr);
//               });
//             }

//             function openModal(row) {
//               currentRow = row;
//               modalTitle.textContent = row;
//               modalInput.value = data[row] || "";
//               warningEl.classList.add("hidden");
//               modal.classList.remove("hidden");
//               modalInput.focus();
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               if (!/^\\d*$/.test(val)) {
//                 warningEl.textContent = "⚠️ Please enter numbers only";
//                 warningEl.classList.remove("hidden");
//                 return;
//               }
//               warningEl.classList.add("hidden");
//               data[currentRow] = val;
//               document.getElementById(\`\${currentRow}-value\`).textContent = val ? val + " mg/dl" : "";
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);
//             modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });
//             backBtn.addEventListener("click", () => window.history.back());

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }



// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//             Glucose
//           </div>
//           <Link href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Insulin
//             </div>
//           </Link>
//           <Link href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Back Button */}
//         <button
//           id="backGlucoseBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg w-full"
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with blur background */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-2"></h3>
//           <input
//             id="glucoseModalInput"
//             type="text"
//             className="border w-full px-3 py-2 rounded mb-2 box-border"
//             placeholder="Enter value..."
//           />
//           <p id="glucoseWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Vanilla JS Script */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             const rows = ["Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const warningEl = document.getElementById("glucoseWarning");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");
//             const backBtn = document.getElementById("backGlucoseBtn");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";
//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Left cell: meal name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[35%] px-3 py-1"; // <-- py-1 for minimal spacing
//                 tdRow.textContent = row;

//                 // Right cell: value + edit button
//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-1 flex justify-between items-center cursor-pointer"; // <-- py-1

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded ml-2";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => openModal(row));

//                 tdValue.appendChild(spanValue);
//                 tdValue.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 table.appendChild(tr);
//               });
//             }

//             function openModal(row) {
//               currentRow = row;
//               modalTitle.textContent = row;
//               modalInput.value = data[row] || "";
//               warningEl.classList.add("hidden");
//               modal.classList.remove("hidden");
//               modalInput.focus();
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               if (!/^\\d*$/.test(val)) {
//                 warningEl.textContent = "⚠️ Please enter numbers only";
//                 warningEl.classList.remove("hidden");
//                 return;
//               }
//               warningEl.classList.add("hidden");
//               data[currentRow] = val;
//               document.getElementById(\`\${currentRow}-value\`).textContent = val ? val + " mg/dl" : "";
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);
//             modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });
//             backBtn.addEventListener("click", () => window.history.back());

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }



// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//             Glucose
//           </div>
//           <Link href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Insulin
//             </div>
//           </Link>
//           <Link href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Back Button */}
//         <button
//           id="backGlucoseBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg w-full"
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with blur background */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-2"></h3>
//           <input
//             id="glucoseModalInput"
//             type="text"
//             className="border w-full px-3 py-2 rounded mb-2 box-border"
//             placeholder="Enter value..."
//           />
//           <p id="glucoseWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Vanilla JS Script */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             const rows = ["Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const warningEl = document.getElementById("glucoseWarning");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");
//             const backBtn = document.getElementById("backGlucoseBtn");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";
//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Left cell: meal name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[35%] px-3 py-2";
//                 tdRow.textContent = row;

//                 // Right cell: value + edit button
//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center cursor-pointer";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded ml-2";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => {
//                   currentRow = row;
//                   modalTitle.textContent = row;
//                   modalInput.value = data[row] || "";
//                   warningEl.classList.add("hidden");
//                   modal.classList.remove("hidden");
//                   modalInput.focus();
//                 });

//                 tdValue.appendChild(spanValue);
//                 tdValue.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 table.appendChild(tr);
//               });
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               if (!/^\\d*$/.test(val)) {
//                 warningEl.textContent = "⚠️ Please enter numbers only";
//                 warningEl.classList.remove("hidden");
//                 return;
//               }
//               warningEl.classList.add("hidden");
//               data[currentRow] = val;
//               document.getElementById(\`\${currentRow}-value\`).textContent = val ? val + " mg/dl" : "";
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);
//             modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });
//             backBtn.addEventListener("click", () => window.history.back());

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }




// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function GlucosePage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="glucoseDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//             Glucose
//           </div>
//           <Link href="/log-insulin">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Insulin
//             </div>
//           </Link>
//           <Link href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-full border-collapse bg-white">
//           <tbody id="glucoseTable"></tbody>
//         </table>

//         {/* Back Button */}
//         <button
//           id="backGlucoseBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg w-full"
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with blur background */}
//       <div
//         id="glucoseModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50"
//       >
//         <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
//           <h3 id="glucoseModalTitle" className="text-lg font-bold mb-2"></h3>
//           <input
//             id="glucoseModalInput"
//             type="text"
//             className="border w-full px-3 py-2 rounded mb-2 box-border"
//             placeholder="Enter Glucose Level..."
//           />
//           <p id="glucoseWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelGlucoseBtn"
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmGlucoseBtn"
//               className="px-4 py-2 rounded bg-green-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Vanilla JS Script */}
//       <Script id="glucoseScript" strategy="afterInteractive">
//         {`
//           (function() {
//             const rows = ["Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner"];
//             const table = document.getElementById("glucoseTable");
//             const modal = document.getElementById("glucoseModal");
//             const modalTitle = document.getElementById("glucoseModalTitle");
//             const modalInput = document.getElementById("glucoseModalInput");
//             const cancelBtn = document.getElementById("cancelGlucoseBtn");
//             const confirmBtn = document.getElementById("confirmGlucoseBtn");
//             const dateInput = document.getElementById("glucoseDate");
//             const backBtn = document.getElementById("backGlucoseBtn");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";
//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold w-[35%] px-3 py-2";
//                 tdRow.textContent = row;

//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center cursor-pointer";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] || "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded ml-2";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => {
//                   currentRow = row;
//                   modalTitle.textContent = row;
//                   modalInput.value = data[row] || "";
//                   modal.classList.remove("hidden");
//                   modalInput.focus();
//                 });

//                 tdValue.appendChild(spanValue);
//                 tdValue.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 table.appendChild(tr);
//               });
//             }

//             function closeModal() {
//               modal.classList.add("hidden");
//               currentRow = null;
//             }

//             function saveModal() {
//               const val = modalInput.value.trim();
//               data[currentRow] = val;
//               document.getElementById(\`\${currentRow}-value\`).textContent = val;
//               closeModal();
//             }

//             cancelBtn.addEventListener("click", closeModal);
//             confirmBtn.addEventListener("click", saveModal);
//             modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });
//             backBtn.addEventListener("click", () => window.history.back());

//             dateInput.addEventListener("change", e => {
//               console.log("Selected date:", e.target.value);
//             });

//             renderTable();
//           })();
//         `}
//       </Script>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import Script from "next/script";

export default function GlucosePage() {
  return (
    <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-[#049EDB]">
      <div className="flex flex-col gap-5 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 rounded-xl shadow-lg mx-2 sm:mx-4">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200"></div>
          <div className="text-xl sm:text-2xl cursor-pointer">Place-Holder logo💧+</div>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300"></div>
        </div>

{/* Date picker */}
<div className="flex flex-col items-center gap-2 sm:gap-4 p-4 sm:p-6">
  <h2 className="text-md sm:text-lg font-bold text-center">Select a Date 📅</h2>
  <input
    id="glucoseDate"
    type="date"
    className="border px-2 sm:px-3 py-2 rounded shadow w-auto text-center font-bold text-sm sm:text-base"
    style={{ minWidth: "9ch" }} // ensures minimum width
  />
</div>


        {/* Labels */}
        <div className="flex flex-wrap justify-around mb-3 gap-2 sm:gap-4">
          <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-green-600 text-sm sm:text-base text-center flex-1 text-ellipsis overflow-hidden">
            Glucose
          </div>
          <Link href="/log-insulin">
            <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer text-sm sm:text-base text-center flex-1 text-ellipsis overflow-hidden">
              Insulin
            </div>
          </Link>
          <Link href="/log-comments">
            <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer text-sm sm:text-base text-center flex-1 text-ellipsis overflow-hidden">
              Comments
            </div>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <tbody id="glucoseTable"></tbody>
          </table>
        </div>

        {/* Back Button */}
        <button
          id="backGlucoseBtn"
          className="bg-gray-600 text-white px-4 sm:px-6 py-2 mt-4 sm:mt-5 rounded text-base sm:text-lg w-full"
        >
          Back
        </button>
      </div>

      {/* Modal with blur background */}
      <div
        id="glucoseModal"
        className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50 p-2 sm:p-4"
      >
        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-md shadow-lg">
          <h3 id="glucoseModalTitle" className="text-md sm:text-lg font-bold mb-2 text-center"></h3>
          <input
            id="glucoseModalInput"
            type="text"
            className="border w-full px-2 sm:px-3 py-2 rounded mb-2 box-border text-sm sm:text-base"
            placeholder="Enter Glucose Level..."
          />
          <p id="glucoseWarning" className="text-red-600 text-xs sm:text-sm mb-3 hidden"></p>
          <div className="flex justify-end gap-2">
            <button
              id="cancelGlucoseBtn"
              className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-gray-300 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              id="confirmGlucoseBtn"
              className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-green-600 text-white text-sm sm:text-base"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Vanilla JS Script */}
      <Script id="glucoseScript" strategy="afterInteractive">
        {`
          (function() {
            const rows = ["Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner"];
            const table = document.getElementById("glucoseTable");
            const modal = document.getElementById("glucoseModal");
            const modalTitle = document.getElementById("glucoseModalTitle");
            const modalInput = document.getElementById("glucoseModalInput");
            const cancelBtn = document.getElementById("cancelGlucoseBtn");
            const confirmBtn = document.getElementById("confirmGlucoseBtn");
            const dateInput = document.getElementById("glucoseDate");
            const backBtn = document.getElementById("backGlucoseBtn");

            const data = {};
            let currentRow = null;

            function renderTable() {
              table.innerHTML = "";
              rows.forEach(row => {
                const tr = document.createElement("tr");
                tr.className = "border";

                const tdRow = document.createElement("td");
                tdRow.className = "bg-sky-950 text-white font-bold w-[35%] px-2 sm:px-3 py-2 text-sm sm:text-base";
                tdRow.textContent = row;

                const tdValue = document.createElement("td");
                tdValue.className = "px-2 sm:px-3 py-2 flex justify-between items-center cursor-pointer text-sm sm:text-base";

                const spanValue = document.createElement("span");
                spanValue.id = \`\${row}-value\`;
                spanValue.textContent = data[row] || "";

                const btn = document.createElement("button");
                btn.className = "bg-green-600 text-white px-2 sm:px-3 py-1 rounded ml-2 text-xs sm:text-sm";
                btn.textContent = "Edit";
                btn.addEventListener("click", () => {
                  currentRow = row;
                  modalTitle.textContent = row;
                  modalInput.value = data[row] || "";
                  modal.classList.remove("hidden");
                  modalInput.focus();
                });

                tdValue.appendChild(spanValue);
                tdValue.appendChild(btn);

                tr.appendChild(tdRow);
                tr.appendChild(tdValue);
                table.appendChild(tr);
              });
            }

            function closeModal() {
              modal.classList.add("hidden");
              currentRow = null;
            }

            function saveModal() {
              const val = modalInput.value.trim();
              data[currentRow] = val;
              document.getElementById(\`\${currentRow}-value\`).textContent = val;
              closeModal();
            }

            cancelBtn.addEventListener("click", closeModal);
            confirmBtn.addEventListener("click", saveModal);
            modal.addEventListener("click", (e) => { if(e.target === modal) closeModal(); });
            backBtn.addEventListener("click", () => window.history.back());
            dateInput.addEventListener("change", e => { console.log("Selected date:", e.target.value); });

            renderTable();
          })();
        `}
      </Script>
    </div>
  );
}
