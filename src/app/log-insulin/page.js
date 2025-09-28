// With React Cancelled
// "use client";
// import Link from "next/link";
// import { useState } from "react";

// export default function InsulinPage() {
//     const [date, setDate] = useState("Monday 18th August");
//     const [data, setData] = useState({});
//     const [editingRow, setEditingRow] = useState(null);
//     const [tempValue, setTempValue] = useState("");
//     const [warning, setWarning] = useState(""); // ⚠️ warning state

//     // Removed "Type of Insulin"
//     const rows = ["Breakfast", "Lunch", "Dinner"];

//     const changeDay = (direction) => {
//         setDate(direction === -1 ? "Sunday 17th August" : "Tuesday 19th August");
//     };

//     const openModal = (row) => {
//         setEditingRow(row);
//         setTempValue(data[row] || "");
//         setWarning(""); // reset warning when opening modal
//     };

//     const saveRow = () => {
//         if (editingRow) {
//             if (warning) return; // 🚫 prevent saving invalid values
//             setData((prev) => ({
//                 ...prev,
//                 [editingRow]: tempValue,
//             }));
//             setEditingRow(null); // close modal
//         }
//     };

//     const saveData = () => {
//         alert("Data saved:\n" + JSON.stringify(data, null, 2));
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen px-4">
//             <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//                 {/* Top bar */}
//                 <div className="flex items-center justify-between bg-sky-500 p-3 text-white">
//                     <div className="w-7 h-7 bg-gray-200"></div>
//                     <div className="text-2xl">Place-Holder logo💧+</div>
//                     <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//                 </div>

//                 {/* Date navigation */}
//                 {/* <div className="flex justify-center items-center my-5 text-lg font-bold">
//                     <button onClick={() => changeDay(-1)}>⬅</button>
//                     <span className="mx-3">{date}</span>
//                     <button onClick={() => changeDay(1)}>➡</button>
//                 </div> */}
//                 <div className="flex flex-col items-center gap-4 p-6">
//                     <h2 className="text-lg font-bold">Select a Date 📅</h2>

//                     <input
//                         type="date"
//                         className="border px-3 py-2 rounded shadow"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                     />


//                 </div>

//                 {/* Labels */}
//                 <div className="flex justify-around mb-3">
//                     <Link href={"/log-glucose"}>
//                     <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//                         Glucose
//                     </div>
//                     </Link>
//                     <div className="px-3 py-1 rounded font-bold text-white bg-blue-600">
//                         Insulin
//                     </div>
//                     <Link href={"/log-comments"}>
//                     <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//                         Comments
//                     </div>
//                     </Link>
//                 </div>

//                 {/* Table */}
//                 <table className="w-[90%] mx-auto border-collapse bg-white">
//                     <tbody>
//                         {rows.map((row) => (
//                             <tr key={row} className="border">
//                                 <td className="bg-sky-950 text-white font-bold w-[30%] px-3 py-2">
//                                     {row}
//                                 </td>
//                                 <td className="px-3 py-2">
//                                     {data[row] ? (
//                                         <span>
//                                             {data[row]}{" "}
//                                             <span className="text-sm text-gray-600">mg/dl</span>
//                                         </span>
//                                     ) : (
//                                         ""
//                                     )}
//                                 </td>
//                                 <td className="px-3 py-2">
//                                     <button
//                                         className="bg-emerald-600 text-white px-3 py-1 rounded"
//                                         onClick={() => openModal(row)}
//                                     >
//                                         Edit
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {/* Save button */}
//                 <button
//                     onClick={saveData}
//                     className="bg-emerald-600 text-white px-6 py-2 mt-5 rounded text-lg"
//                 >
//                     Save
//                 </button>

//                 {/* Popup Modal */}
//                 {editingRow && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
//                             <h2 className="text-lg font-bold mb-3">Edit {editingRow}</h2>
//                             <input
//                                 type="text"
//                                 className="w-full border px-3 py-2 mb-2 rounded"
//                                 value={tempValue}
//                                 onChange={(e) => {
//                                     const val = e.target.value;
//                                     if (/^\d*$/.test(val)) {
//                                         setTempValue(val);
//                                         setWarning(""); // ✅ valid, remove warning
//                                     } else {
//                                         setWarning("⚠️ Please enter numbers only");
//                                     }
//                                 }}
//                                 placeholder="Enter value..."
//                             />
//                             {/* Show warning */}
//                             {warning && (
//                                 <p className="text-red-600 text-sm mb-3">{warning}</p>
//                             )}
//                             <div className="flex justify-end gap-3">
//                                 <button
//                                     className="px-4 py-2 bg-gray-400 text-white rounded"
//                                     onClick={() => setEditingRow(null)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
//                                     onClick={saveRow}
//                                     disabled={!!warning} // 🚫 disable if invalid
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


//Without React First Attempt
// export default function InsulinPage() {
//     return (
//         <div className="flex justify-center items-center min-h-screen px-4">
//             <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//                 {/* Top bar */}
//                 <div className="flex items-center justify-between bg-sky-500 p-3 text-white">
//                     <div className="w-7 h-7 bg-gray-200"></div>
//                     <div className="text-2xl">Place-Holder logo💧+</div>
//                     <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//                 </div>

//                 {/* Date input */}
//                 <div className="flex flex-col items-center gap-4 p-6">
//                     <h2 className="text-lg font-bold">Select a Date 📅</h2>
//                     <input
//                         id="dateInput"
//                         type="date"
//                         className="border px-3 py-2 rounded shadow"
//                     />
//                 </div>

//                 {/* Labels */}
//                 <div className="flex justify-around mb-3">
//                     <a href="/log-glucose">
//                         <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
//                             Glucose
//                         </div>
//                     </a>
//                     <div className="px-3 py-1 rounded font-bold text-white bg-blue-600">
//                         Insulin
//                     </div>
//                     <a href="/log-comments">
//                         <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//                             Comments
//                         </div>
//                     </a>
//                 </div>

//                 {/* Table */}
//                 <table className="w-[90%] mx-auto border-collapse bg-white">
//                     <tbody>
//                         <tr className="border">
//                             <td className="bg-sky-950 text-white font-bold w-[30%] px-3 py-2">Breakfast</td>
//                             <td id="BreakfastValue" className="px-3 py-2"></td>
//                             <td className="px-3 py-2">
//                                 <button className="editBtn bg-emerald-600 text-white px-3 py-1 rounded" data-row="Breakfast">
//                                     Edit
//                                 </button>
//                             </td>
//                         </tr>
//                         <tr className="border">
//                             <td className="bg-sky-950 text-white font-bold w-[30%] px-3 py-2">Lunch</td>
//                             <td id="LunchValue" className="px-3 py-2"></td>
//                             <td className="px-3 py-2">
//                                 <button className="editBtn bg-emerald-600 text-white px-3 py-1 rounded" data-row="Lunch">
//                                     Edit
//                                 </button>
//                             </td>
//                         </tr>
//                         <tr className="border">
//                             <td className="bg-sky-950 text-white font-bold w-[30%] px-3 py-2">Dinner</td>
//                             <td id="DinnerValue" className="px-3 py-2"></td>
//                             <td className="px-3 py-2">
//                                 <button className="editBtn bg-emerald-600 text-white px-3 py-1 rounded" data-row="Dinner">
//                                     Edit
//                                 </button>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>

//                 {/* Save button */}
//                 <button
//                     id="saveBtn"
//                     className="bg-emerald-600 text-white px-6 py-2 mt-5 rounded text-lg"
//                 >
//                     Save
//                 </button>
//             </div>

//             {/* Modal */}
//             <div id="modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
//                     <h2 id="modalTitle" className="text-lg font-bold mb-3"></h2>
//                     <input
//                         id="modalInput"
//                         type="text"
//                         className="w-full border px-3 py-2 mb-2 rounded"
//                         placeholder="Enter value..."
//                     />
//                     <p id="warning" className="text-red-600 text-sm mb-3 hidden"></p>
//                     <div className="flex justify-end gap-3">
//                         <button id="cancelBtn" className="px-4 py-2 bg-gray-400 text-white rounded">
//                             Cancel
//                         </button>
//                         <button id="confirmBtn" className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50">
//                             Save
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ Script runs client-side only */}
//             <script src="/js/insulin.js" defer></script>
//         </div>
//     );
// }



// // //React-free attempt 2
// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function InsulinPage() {
//     return (
//         <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//             <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//                 {/* Top bar */}
//                 <div className="flex items-center justify-between bg-sky-500 p-3 text-white">
//                     <div className="w-7 h-7 bg-gray-200"></div>
//                     <div className="text-2xl">Place-Holder logo💧+</div>
//                     <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//                 </div>

//                 {/* Date picker */}
//                 <div className="flex flex-col items-center gap-4 p-6">
//                     <h2 className="text-lg font-bold">Select a Date 📅</h2>
//                     <input
//                         id="insulinDate"
//                         type="date"
//                         className="border px-3 py-2 rounded shadow"
//                     />
//                 </div>

//                 {/* Labels */}
//                 <div className="flex justify-around mb-3">
//                     <Link href="/log-glucose">
//                         <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//                             Glucose
//                         </div>
//                     </Link>

//                     <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//                         Insulin
//                     </div>

//                     <Link href="/log-comments">
//                         <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//                             Comments
//                         </div>
//                     </Link>
//                 </div>


//                 {/* Table */}
//                 <table className="w-[90%] mx-auto border-collapse bg-white">
//                     <tbody id="insulinTable"></tbody>
//                 </table>

//                 {/* Back button */}
//                 <button
//                     id="backInsulinBtn"
//                     className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg"
//                     onClick={() => window.history.back()}
//                 >
//                     Back
//                 </button>

//                 {/* Modal with blur background */}
//                 <div
//                     id="insulinModal"
//                     className="hidden fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center"
//                 >
//                     <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
//                         <h2 id="insulinModalTitle" className="text-lg font-bold mb-3"></h2>
//                         <input
//                             id="insulinModalInput"
//                             type="text"
//                             className="w-full border px-3 py-2 mb-2 rounded"
//                             placeholder="Enter value..."
//                         />
//                         <p id="insulinWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//                         <div className="flex justify-end gap-3">
//                             <button
//                                 id="cancelInsulinBtn"
//                                 className="px-4 py-2 bg-gray-400 text-white rounded"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 id="confirmInsulinBtn"
//                                 className="px-4 py-2 bg-emerald-600 text-white rounded"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Script */}
//             <Script id="insulinScript" strategy="afterInteractive">
//                 {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Breakfast", "Lunch", "Dinner"];
//             const table = document.getElementById("insulinTable");
//             const modal = document.getElementById("insulinModal");
//             const modalTitle = document.getElementById("insulinModalTitle");
//             const modalInput = document.getElementById("insulinModalInput");
//             const warningEl = document.getElementById("insulinWarning");
//             const cancelBtn = document.getElementById("cancelInsulinBtn");
//             const confirmBtn = document.getElementById("confirmInsulinBtn");
//             const dateInput = document.getElementById("insulinDate");

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
//                 tdValue.className = "px-3 py-2";
//                 tdValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const tdBtn = document.createElement("td");
//                 tdBtn.className = "px-3 py-2";
//                 const btn = document.createElement("button");
//                 btn.className = "bg-emerald-600 text-white px-3 py-1 rounded";
//                 btn.textContent = "Edit";
//                 btn.addEventListener("click", () => openModal(row));
//                 tdBtn.appendChild(btn);

//                 tr.appendChild(tdRow);
//                 tr.appendChild(tdValue);
//                 tr.appendChild(tdBtn);
//                 table.appendChild(tr);
//               });
//             }

//             function openModal(row) {
//               currentRow = row;
//               modalTitle.textContent = row;
//               modalInput.value = data[row] || "";
//               warningEl.classList.add("hidden");
//               modal.classList.remove("hidden"); // modal background now blurry
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
//             </Script>
//         </div>
//     );
// }


// "use client";

// import Link from "next/link";
// import Script from "next/script";

// export default function InsulinPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-4 p-6">
//           <h2 className="text-lg font-bold">Select a Date 📅</h2>
//           <input
//             id="insulinDate"
//             type="date"
//             className="border px-3 py-2 rounded shadow"
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <Link href="/log-glucose">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Glucose
//             </div>
//           </Link>

//           <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
//             Insulin
//           </div>

//           <Link href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-[90%] mx-auto border-collapse bg-white">
//           <tbody id="insulinTable"></tbody>
//         </table>

//         {/* Back button */}
//         <button
//           id="backInsulinBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg"
//           onClick={() => window.history.back()} // 🔹 Goes back to previous page
//         >
//           Back
//         </button>

//         {/* Modal with blur background */}
//         <div
//           id="insulinModal"
//           className="hidden fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center"
//         >
//           {/* ✅ Changed modal background to transparent + blur */}
//           <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
//             <h2 id="insulinModalTitle" className="text-lg font-bold mb-3"></h2>
//             <input
//               id="insulinModalInput"
//               type="text"
//               className="w-full border px-3 py-2 mb-2 rounded"
//               placeholder="Enter value..."
//             />
//             <p id="insulinWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//             <div className="flex justify-end gap-3">
//               <button
//                 id="cancelInsulinBtn"
//                 className="px-4 py-2 bg-gray-400 text-white rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 id="confirmInsulinBtn"
//                 className="px-4 py-2 bg-emerald-600 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Script */}
//       <Script id="insulinScript" strategy="afterInteractive">
//         {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Breakfast", "Lunch", "Dinner"];
//             const table = document.getElementById("insulinTable");
//             const modal = document.getElementById("insulinModal");
//             const modalTitle = document.getElementById("insulinModalTitle");
//             const modalInput = document.getElementById("insulinModalInput");
//             const warningEl = document.getElementById("insulinWarning");
//             const cancelBtn = document.getElementById("cancelInsulinBtn");
//             const confirmBtn = document.getElementById("confirmInsulinBtn");
//             const dateInput = document.getElementById("insulinDate");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";

//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Row name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold px-3 py-2 w-[35%]";
//                 tdRow.textContent = row;

//                 // Value + Edit button in same cell (✅ compact, no extra gap)
//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`; // ✅ ID added for direct update
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
//               modal.classList.remove("hidden"); // modal background blurry
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

//               // ✅ Directly update span to remove gap, no rerender needed
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

// export default function InsulinPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-4 sm:p-8 rounded-xl shadow-lg mx-2 sm:mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200"></div>
//           <div className="text-xl sm:text-2xl">Place-Holder logo💧+</div>
//           <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300"></div>
//         </div>

// {/* Date picker */}
// <div className="flex flex-col items-center gap-2 sm:gap-4 p-4 sm:p-6">
//   <h2 className="text-md sm:text-lg font-bold text-center">Select a Date 📅</h2>
//   <input
//     id="insulinDate"
//     type="date"
//     className="border px-2 sm:px-3 py-2 rounded shadow w-auto text-center font-bold text-sm sm:text-base"
//     style={{ minWidth: "9ch" }} // minimum width for empty input
//   />
// </div>



//         {/* Labels */}
//         <div className="flex flex-wrap justify-around mb-3 gap-2 sm:gap-4">
//           <Link href="/log-glucose">
//             <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer text-sm sm:text-base text-center flex-1">
//               Glucose
//             </div>
//           </Link>

//           <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-green-600 text-sm sm:text-base text-center flex-1">
//             Insulin
//           </div>

//           <Link href="/log-comments">
//             <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer text-sm sm:text-base text-center flex-1">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse bg-white">
//             <tbody id="insulinTable"></tbody>
//           </table>
//         </div>

//         {/* Back button */}
//         <button
//           id="backInsulinBtn"
//           className="bg-gray-600 text-white px-4 sm:px-6 py-2 mt-4 sm:mt-5 rounded text-base sm:text-lg w-full"
//         >
//           Back
//         </button>
//       </div>

//       {/* Modal with blur background */}
//       <div
//         id="insulinModal"
//         className="hidden fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50 p-2 sm:p-4"
//       >
//         <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm sm:max-w-md shadow-lg">
//           <h2 id="insulinModalTitle" className="text-md sm:text-lg font-bold mb-3 text-center"></h2>
//           <input
//             id="insulinModalInput"
//             type="text"
//             className="w-full border px-2 sm:px-3 py-2 mb-2 rounded text-sm sm:text-base box-border"
//             placeholder="Enter value..."
//           />
//           <p id="insulinWarning" className="text-red-600 text-xs sm:text-sm mb-3 hidden"></p>
//           <div className="flex justify-end gap-2">
//             <button
//               id="cancelInsulinBtn"
//               className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-gray-300 text-sm sm:text-base"
//             >
//               Cancel
//             </button>
//             <button
//               id="confirmInsulinBtn"
//               className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-green-600 text-white text-sm sm:text-base"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Script */}
//       <Script id="insulinScript" strategy="afterInteractive">
//         {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner"];
//             const table = document.getElementById("insulinTable");
//             const modal = document.getElementById("insulinModal");
//             const modalTitle = document.getElementById("insulinModalTitle");
//             const modalInput = document.getElementById("insulinModalInput");
//             const warningEl = document.getElementById("insulinWarning");
//             const cancelBtn = document.getElementById("cancelInsulinBtn");
//             const confirmBtn = document.getElementById("confirmInsulinBtn");
//             const dateInput = document.getElementById("insulinDate");
//             const backBtn = document.getElementById("backInsulinBtn");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";
//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Left cell: row name
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
//                 btn.className = "bg-green-600 text-white px-3 py-1 rounded ml-2";
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

// export default function InsulinPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white">
//           <div className="w-7 h-7 bg-gray-200"></div>
//           <div className="text-2xl">Place-Holder logo💧+</div>
//           <div className="w-7 h-7 rounded-full bg-gray-300"></div>
//         </div>

// {/* Date picker */}
// <div className="flex flex-col items-center gap-2 sm:gap-4 p-4 sm:p-6">
//   <h2 className="text-md sm:text-lg font-bold text-center">Select a Date 📅</h2>
//   <input
//     id="insulinDate"
//     type="date"
//     className="border px-2 sm:px-3 py-2 rounded shadow w-auto text-center font-bold text-sm sm:text-base"
//     style={{ minWidth: "9ch" }} // minimum width for empty input
//   />
// </div>

//         {/* Labels */}
//         <div className="flex justify-around mb-3">
//           <Link href="/log-glucose">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Glucose
//             </div>
//           </Link>

//           <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
//             Insulin
//           </div>

//           <Link href="/log-comments">
//             <div className="px-3 py-1 rounded font-bold text-white bg-[#049EDB] cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-[90%] mx-auto border-collapse bg-white">
//           <tbody id="insulinTable"></tbody>
//         </table>

//         {/* Back button */}
//         <button
//           id="backInsulinBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-lg"
//           onClick={() => window.history.back()}
//         >
//           Back
//         </button>

//         {/* Modal with blur background */}
//         <div
//           id="insulinModal"
//           className="hidden fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center"
//         >
//           <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
//             <h2 id="insulinModalTitle" className="text-lg font-bold mb-3"></h2>
//             <input
//               id="insulinModalInput"
//               type="text"
//               className="w-full border px-3 py-2 mb-2 rounded"
//               placeholder="Enter value..."
//             />
//             <p id="insulinWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//             <div className="flex justify-end gap-3">
//               <button
//                 id="cancelInsulinBtn"
//                 className="px-4 py-2 bg-gray-400 text-white rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 id="confirmInsulinBtn"
//                 className="px-4 py-2 bg-green-600 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Script */}
//       <Script id="insulinScript" strategy="afterInteractive">
//         {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Breakfast", "Lunch", "Dinner"];
//             const table = document.getElementById("insulinTable");
//             const modal = document.getElementById("insulinModal");
//             const modalTitle = document.getElementById("insulinModalTitle");
//             const modalInput = document.getElementById("insulinModalInput");
//             const warningEl = document.getElementById("insulinWarning");
//             const cancelBtn = document.getElementById("cancelInsulinBtn");
//             const confirmBtn = document.getElementById("confirmInsulinBtn");
//             const dateInput = document.getElementById("insulinDate");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";

//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 // Row name
//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold px-3 py-2 w-[35%]";
//                 tdRow.textContent = row;

//                 // Value + Edit button in same cell
//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-green-600 text-white px-3 py-1 rounded ml-2"; // ✅ match Glucose edit button
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
//               modal.classList.remove("hidden"); // blurry background
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

// export default function InsulinPage() {
//   return (
//     <div className="flex justify-center items-center min-h-screen px-4 sm:px-2 bg-[#049EDB]">
//       <div className="flex flex-col gap-5 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 rounded-xl shadow-lg mx-2 sm:mx-4">
//         {/* Top bar */}
//         <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
//           <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200"></div>
//           <div className="text-xl sm:text-2xl cursor-pointer">Place-Holder logo💧+</div>
//           <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-300"></div>
//         </div>

//         {/* Date picker */}
//         <div className="flex flex-col items-center gap-2 sm:gap-4 p-4 sm:p-6">
//           <h2 className="text-md sm:text-lg font-bold text-center">Select a Date 📅</h2>
//           <input
//             id="insulinDate"
//             type="date"
//             className="border px-2 sm:px-3 py-2 rounded shadow w-auto text-center font-bold text-sm sm:text-base"
//             style={{ minWidth: "9ch" }}
//           />
//         </div>

//         {/* Labels */}
//         <div className="flex flex-wrap justify-around mb-3 gap-2 sm:gap-4">
//           <Link href="/log-glucose">
//             <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] text-sm sm:text-base text-center cursor-pointer">
//               Glucose
//             </div>
//           </Link>

//           <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-green-600 text-sm sm:text-base text-center">
//             Insulin
//           </div>

//           <Link href="/log-comments">
//             <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] text-sm sm:text-base text-center cursor-pointer">
//               Comments
//             </div>
//           </Link>
//         </div>

//         {/* Table */}
//         <table className="w-full sm:w-[90%] mx-auto border-collapse bg-white">
//           <tbody id="insulinTable"></tbody>
//         </table>

//         {/* Back button */}
//         <button
//           id="backInsulinBtn"
//           className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-sm sm:text-lg w-full"
//           onClick={() => window.history.back()}
//         >
//           Back
//         </button>

//         {/* Modal with blur background */}
//         <div
//           id="insulinModal"
//           className="hidden fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-2 sm:p-4"
//         >
//           <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 id="insulinModalTitle" className="text-lg sm:text-xl font-bold mb-3"></h2>
//             <input
//               id="insulinModalInput"
//               type="text"
//               className="w-full border px-3 py-2 mb-2 rounded text-sm sm:text-base"
//               placeholder="Enter value..."
//             />
//             <p id="insulinWarning" className="text-red-600 text-sm mb-3 hidden"></p>
//             <div className="flex justify-end gap-3">
//               <button
//                 id="cancelInsulinBtn"
//                 className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-400 text-white rounded text-sm sm:text-base"
//               >
//                 Cancel
//               </button>
//               <button
//                 id="confirmInsulinBtn"
//                 className="px-3 sm:px-4 py-1 sm:py-2 bg-green-600 text-white rounded text-sm sm:text-base"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Script */}
//       <Script id="insulinScript" strategy="afterInteractive">
//         {`
//           (function() {
//             if (typeof document === "undefined") return;

//             const rows = ["Breakfast", "Lunch", "Dinner"];
//             const table = document.getElementById("insulinTable");
//             const modal = document.getElementById("insulinModal");
//             const modalTitle = document.getElementById("insulinModalTitle");
//             const modalInput = document.getElementById("insulinModalInput");
//             const warningEl = document.getElementById("insulinWarning");
//             const cancelBtn = document.getElementById("cancelInsulinBtn");
//             const confirmBtn = document.getElementById("confirmInsulinBtn");
//             const dateInput = document.getElementById("insulinDate");

//             const data = {};
//             let currentRow = null;

//             function renderTable() {
//               table.innerHTML = "";
//               rows.forEach(row => {
//                 const tr = document.createElement("tr");
//                 tr.className = "border";

//                 const tdRow = document.createElement("td");
//                 tdRow.className = "bg-sky-950 text-white font-bold px-3 py-2 w-[35%] sm:w-[30%]";
//                 tdRow.textContent = row;

//                 const tdValue = document.createElement("td");
//                 tdValue.className = "px-3 py-2 flex justify-between items-center";

//                 const spanValue = document.createElement("span");
//                 spanValue.id = \`\${row}-value\`;
//                 spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

//                 const btn = document.createElement("button");
//                 btn.className = "bg-green-600 text-white px-3 py-1 rounded ml-2 text-xs sm:text-sm";
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

//             // Reactive date picker for device compatibility
//             function adjustDateWidth() {
//               const length = dateInput.value.length || 10;
//               dateInput.style.width = length + "ch";
//             }
//             adjustDateWidth();
//             dateInput.addEventListener("input", adjustDateWidth);
//             dateInput.addEventListener("change", e => console.log("Selected date:", e.target.value));

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

export default function InsulinPage() {
  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-2 bg-[#049EDB]">
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
    id="insulinDate"
    type="date"
    className="border px-2 sm:px-3 py-2 rounded shadow w-auto text-center font-bold text-sm sm:text-base"
    style={{ minWidth: "9ch" }} // ensures minimum width
  />
</div>


        {/* Labels */}
        <div className="flex flex-wrap justify-around mb-3 gap-2 sm:gap-4">
          <Link href="/log-glucose">
            <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] text-sm sm:text-base text-center cursor-pointer">
              Glucose
            </div>
          </Link>

          <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-green-600 text-sm sm:text-base text-center flex-1">
            Insulin
          </div>

          <Link href="/log-comments">
            <div className="px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] text-sm sm:text-base text-center cursor-pointer">
              Comments
            </div>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full sm:w-[90%] mx-auto border-collapse bg-white">
            <tbody id="insulinTable"></tbody>
          </table>
        </div>

        {/* Back button */}
        <button
          id="backInsulinBtn"
          className="bg-gray-600 text-white px-6 py-2 mt-5 rounded text-sm sm:text-lg w-full"
          onClick={() => window.history.back()}
        >
          Back
        </button>

        {/* Modal with blur background */}
        <div
          id="insulinModal"
          className="hidden fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-2 sm:p-4"
        >
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 id="insulinModalTitle" className="text-lg sm:text-xl font-bold mb-3"></h2>
            <input
              id="insulinModalInput"
              type="text"
              className="w-full border px-3 py-2 mb-2 rounded text-sm sm:text-base"
              placeholder="Enter value..."
            />
            <p id="insulinWarning" className="text-red-600 text-sm mb-3 hidden"></p>
            <div className="flex justify-end gap-3">
              <button
                id="cancelInsulinBtn"
                className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-400 text-white rounded text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                id="confirmInsulinBtn"
                className="px-3 sm:px-4 py-1 sm:py-2 bg-green-600 text-white rounded text-sm sm:text-base"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Script */}
      <Script id="insulinScript" strategy="afterInteractive">
        {`
          (function() {
            if (typeof document === "undefined") return;

            const rows = ["Breakfast", "Lunch", "Dinner"];
            const table = document.getElementById("insulinTable");
            const modal = document.getElementById("insulinModal");
            const modalTitle = document.getElementById("insulinModalTitle");
            const modalInput = document.getElementById("insulinModalInput");
            const warningEl = document.getElementById("insulinWarning");
            const cancelBtn = document.getElementById("cancelInsulinBtn");
            const confirmBtn = document.getElementById("confirmInsulinBtn");
            const dateInput = document.getElementById("insulinDate");

            const data = {};
            let currentRow = null;

            function renderTable() {
              table.innerHTML = "";
              rows.forEach(row => {
                const tr = document.createElement("tr");
                tr.className = "border";

                const tdRow = document.createElement("td");
                tdRow.className = "bg-sky-950 text-white font-bold px-3 py-2 w-[35%] sm:w-[30%]";
                tdRow.textContent = row;

                const tdValue = document.createElement("td");
                tdValue.className = "px-3 py-2 flex justify-between items-center";

                const spanValue = document.createElement("span");
                spanValue.id = \`\${row}-value\`;
                spanValue.textContent = data[row] ? data[row] + " mg/dl" : "";

                const btn = document.createElement("button");
                btn.className = "bg-green-600 text-white px-3 py-1 rounded ml-2 text-xs sm:text-sm";
                btn.textContent = "Edit";
                btn.addEventListener("click", () => openModal(row));

                tdValue.appendChild(spanValue);
                tdValue.appendChild(btn);

                tr.appendChild(tdRow);
                tr.appendChild(tdValue);
                table.appendChild(tr);
              });
            }

            function openModal(row) {
              currentRow = row;
              modalTitle.textContent = row;
              modalInput.value = data[row] || "";
              warningEl.classList.add("hidden");
              modal.classList.remove("hidden");
            }

            function closeModal() {
              modal.classList.add("hidden");
              currentRow = null;
            }

            function saveModal() {
              const val = modalInput.value.trim();
              if (!/^\\d*$/.test(val)) {
                warningEl.textContent = "⚠️ Please enter numbers only";
                warningEl.classList.remove("hidden");
                return;
              }
              warningEl.classList.add("hidden");
              data[currentRow] = val;
              document.getElementById(\`\${currentRow}-value\`).textContent = val ? val + " mg/dl" : "";
              closeModal();
            }

            cancelBtn.addEventListener("click", closeModal);
            confirmBtn.addEventListener("click", saveModal);

            // Reactive date picker for device compatibility
            function adjustDateWidth() {
              const length = dateInput.value.length || 10;
              dateInput.style.width = length + "ch";
            }
            adjustDateWidth();
            dateInput.addEventListener("input", adjustDateWidth);
            dateInput.addEventListener("change", e => console.log("Selected date:", e.target.value));

            renderTable();
          })();
        `}
      </Script>
    </div>
  );
}
