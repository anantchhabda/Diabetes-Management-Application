"use client";
import { useState } from "react";

export default function CommentsPage() {
  const [date, setDate] = useState("Monday 18th August");
  const [comment, setComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [tempComment, setTempComment] = useState("");

  const openModal = () => {
    setTempComment(comment); // prefill current comment
    setModalOpen(true);
  };

  const saveComment = () => {
    setComment(tempComment);
    setModalOpen(false);
    alert("Comment saved:\n" + tempComment);
  };

  const changeDay = (direction) => {
    setDate(direction === -1 ? "Sunday 17th August" : "Tuesday 19th September");
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
      <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
          <div className="w-7 h-7 bg-gray-200"></div>
          <div className="text-2xl">💧+</div>
          <div className="w-7 h-7 rounded-full bg-gray-300"></div>
        </div>

        {/* Date navigation */}
        {/* <div className="flex justify-center items-center my-5 text-lg font-bold">
          <button onClick={() => changeDay(-1)}>⬅</button>
          <span className="mx-3">{date}</span>
          <button onClick={() => changeDay(1)}>➡</button> */}

        <div className="flex flex-col items-center gap-4 p-6">
          <h2 className="text-lg font-bold">Select a Date 📅</h2>

          <input
            type="date"
            className="border px-3 py-2 rounded shadow"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-around mb-3">
          <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
            Glucose
          </div>
          <div className="px-3 py-1 rounded font-bold text-white bg-emerald-700">
            Insulin
          </div>
          <div className="px-3 py-1 rounded font-bold text-white bg-sky-400">
            Comments
          </div>
        </div>

        {/* Current comment display */}
        <div className="border p-3 rounded h-40 overflow-y-auto text-lg">
          {comment || "No comments yet."}
        </div>

        {/* Edit button */}
        <button
          onClick={openModal}
          className="bg-green-600 text-white px-6 py-2 mt-4 rounded text-lg"
        >
          Edit
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
            <textarea
              className="w-full h-64 p-3 border-2 border-gray-300 rounded resize-none text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
              placeholder="Type your comment here..."
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveComment}
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
