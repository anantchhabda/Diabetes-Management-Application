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

      <Script src="/js/log-glucose.js" strategy="afterInteractive" />
    </div>
  );
}