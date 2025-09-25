"use client";
import Link from "next/link";
import { useState } from "react";

export default function InsulinPage() {
    const [date, setDate] = useState("Monday 18th August");
    const [data, setData] = useState({});
    const [editingRow, setEditingRow] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [warning, setWarning] = useState(""); // ⚠️ warning state

    // Removed "Type of Insulin"
    const rows = ["Breakfast", "Lunch", "Dinner"];

    const changeDay = (direction) => {
        setDate(direction === -1 ? "Sunday 17th August" : "Tuesday 19th August");
    };

    const openModal = (row) => {
        setEditingRow(row);
        setTempValue(data[row] || "");
        setWarning(""); // reset warning when opening modal
    };

    const saveRow = () => {
        if (editingRow) {
            if (warning) return; // 🚫 prevent saving invalid values
            setData((prev) => ({
                ...prev,
                [editingRow]: tempValue,
            }));
            setEditingRow(null); // close modal
        }
    };

    const saveData = () => {
        alert("Data saved:\n" + JSON.stringify(data, null, 2));
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4">
                {/* Top bar */}
                <div className="flex items-center justify-between bg-sky-500 p-3 text-white">
                    <div className="w-7 h-7 bg-gray-200"></div>
                    <div className="text-2xl">Place-Holder logo💧+</div>
                    <div className="w-7 h-7 rounded-full bg-gray-300"></div>
                </div>

                {/* Date navigation */}
                {/* <div className="flex justify-center items-center my-5 text-lg font-bold">
                    <button onClick={() => changeDay(-1)}>⬅</button>
                    <span className="mx-3">{date}</span>
                    <button onClick={() => changeDay(1)}>➡</button>
                </div> */}
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
                    <Link href={"/log-glucose"}>
                    <div className="px-3 py-1 rounded font-bold text-white bg-sky-500">
                        Glucose
                    </div>
                    </Link>
                    <div className="px-3 py-1 rounded font-bold text-white bg-blue-600">
                        Insulin
                    </div>
                    <Link href={"/log-comments"}>
                    <div className="px-3 py-1 rounded font-bold text-white bg-emerald-600">
                        Comments
                    </div>
                    </Link>
                </div>

                {/* Table */}
                <table className="w-[90%] mx-auto border-collapse bg-white">
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row} className="border">
                                <td className="bg-sky-950 text-white font-bold w-[30%] px-3 py-2">
                                    {row}
                                </td>
                                <td className="px-3 py-2">
                                    {data[row] ? (
                                        <span>
                                            {data[row]}{" "}
                                            <span className="text-sm text-gray-600">mg/dl</span>
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </td>
                                <td className="px-3 py-2">
                                    <button
                                        className="bg-emerald-600 text-white px-3 py-1 rounded"
                                        onClick={() => openModal(row)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Save button */}
                <button
                    onClick={saveData}
                    className="bg-emerald-600 text-white px-6 py-2 mt-5 rounded text-lg"
                >
                    Save
                </button>

                {/* Popup Modal */}
                {editingRow && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
                            <h2 className="text-lg font-bold mb-3">Edit {editingRow}</h2>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 mb-2 rounded"
                                value={tempValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        setTempValue(val);
                                        setWarning(""); // ✅ valid, remove warning
                                    } else {
                                        setWarning("⚠️ Please enter numbers only");
                                    }
                                }}
                                placeholder="Enter value..."
                            />
                            {/* Show warning */}
                            {warning && (
                                <p className="text-red-600 text-sm mb-3">{warning}</p>
                            )}
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                    onClick={() => setEditingRow(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
                                    onClick={saveRow}
                                    disabled={!!warning} // 🚫 disable if invalid
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
