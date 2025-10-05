"use client";

import Link from "next/link";
import Script from "next/script";
import Header from "../components/header";

export default function InsulinPage() {
  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-2 bg-[#049EDB]">
      <div className="flex flex-col gap-5 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 rounded-xl shadow-lg mx-2 sm:mx-4">


        {/* Date picker */}
        <div className="flex flex-col items-center gap-2 sm:gap-4 p-4 sm:p-6">
          <h2 className="text-md sm:text-lg font-bold text-center">Select a Date 📅</h2>
          <input
            id="insulinDate"
            type="date"
            className="border px-2 sm:px-3 py-2 rounded shadow w-auto text-center font-bold text-sm sm:text-base"
            style={{ minWidth: "12.5ch" }} // ensures minimum width
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

      <Script src="/js/log-insulin.js" strategy="afterInteractive" />
    </div>
  );
}
