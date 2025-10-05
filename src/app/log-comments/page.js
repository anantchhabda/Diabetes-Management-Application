"use client";

import Script from "next/script";
import Header from "../components/header";

export default function CommentsPage() {
  return (
    <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-[#049EDB]">
      <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-4 sm:p-8 rounded-xl shadow-lg mx-2 sm:mx-4">

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
      
      <Script src="/js/log-comments.js" strategy="afterInteractive" />
    </div>
  );
}

