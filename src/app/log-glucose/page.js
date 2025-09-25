"use client";
import { useState } from "react";
import Link from "next/link"; // Import Link

export default function TrackerPage() {
  const meals = [
    "Before Breakfast",
    "After Breakfast",
    "Before Lunch",
    "After Lunch",
    "Before Dinner",
    "After Dinner",
  ];

  const [data, setData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMeal, setCurrentMeal] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [date, setDate] = useState("2025-09-25");

  const handleEdit = (meal) => {
    setCurrentMeal(meal);
    setTempValue(data[meal] || "");
    setModalOpen(true);
  };

  const handleSaveModal = () => {
    setData({ ...data, [currentMeal]: tempValue });
    setModalOpen(false);
  };

  const saveData = () => {
    alert("Data saved!\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-[#049EDB]">
      <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-sky-500 p-3 text-white rounded-t-lg">
          <div className="w-7 h-7 bg-gray-200"></div>
          <div className="text-2xl cursor-pointer">Place-Holder logo💧+</div>
          <div className="w-7 h-7 rounded-full bg-gray-300"></div>
        </div>

        {/* Date picker */}
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
          <Link href="/log-insulin">
            <div className="px-3 py-1 rounded font-bold text-white bg-emerald-700 cursor-pointer">
              Insulin
            </div>
          </Link>
          <Link href="/log-comments">
          <div className="px-3 py-1 rounded font-bold text-white bg-green-600">
            Comments
          </div>
          </Link>
        </div>

        {/* Table */}
        <table className="w-11/12 mx-auto border-collapse bg-white">
          <tbody>
            {meals.map((meal) => (
              <tr key={meal} className="border">
                <td className="bg-sky-950 text-white font-bold p-2 w-1/3">
                  {meal}
                </td>
                <td className="p-2">{data[meal] || ""}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(meal)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Save Button */}
        <button
          onClick={saveData}
          className="bg-green-600 text-white text-lg font-bold px-5 py-2 rounded mt-5"
        >
          Save
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm shadow-lg">
            <h3 className="text-lg font-bold mb-4">{currentMeal}</h3>
            <textarea
              className="border w-full p-2 rounded mb-4"
              rows={4}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
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
