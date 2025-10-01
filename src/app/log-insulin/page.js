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