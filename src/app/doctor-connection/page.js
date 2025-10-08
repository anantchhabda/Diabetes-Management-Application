"use client";

import Script from "next/script";

export default function DoctorConnections() {
  const currentConnections = [
    { role: "Doctor", name: "John Smith" },
    { role: "Doctor", name: "Jane Smith" },
    { role: "Family Member", name: "Jane Doe" },
  ];

  const connectionRequests = [
    { role: "Doctor", name: "Doctor Eggman" },
    { role: "Family Member", name: "Julia Doe" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col items-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-6 text-center">

          {/* --- Search Bar Button --- */}
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-textBlack)]">
            Search for Connections
          </h2>
          <div className="flex justify-center mb-6">
            <button
              id="openSearchBtn"
              className="w-2/3 bg-gray-200 text-gray-700 border border-black rounded-lg py-2 hover:bg-gray-300 transition text-sm font-medium"
            >
              🔍 Search by ID
            </button>
          </div>

          {/* --- Current Connections --- */}
          <h2 className="text-2xl font-semibold mb-4 mt-6 text-[var(--color-textBlack)]">
            Current Connections
          </h2>
          <div className="space-y-2">
            {currentConnections.map((c, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[100px_1fr_auto_auto] border border-black"
              >
                <div className="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
                  {c.role}
                </div>
                <div className="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
                  {c.name}
                </div>
                <button className="bg-[var(--color-tertiary)] text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
                  View
                </button>
                <button className="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
                  Remove
                </button>
              </div>
            ))}
          </div>


          {/* --- Outgoing Requests --- */}
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-[var(--color-textBlack)]">
            Outgoing Requests
          </h2>
          <div className="space-y-2">
            {connectionRequests.map((r, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[100px_1fr_auto_auto] border border-black"
              >
                <div className="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
                  {r.role}
                </div>
                <div className="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
                  {r.name}
                </div>
                <button className="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- Search Popup Modal --- */}
      <div
        id="searchPopup"
        className="hidden fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center border border-black">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Confirm Connection Request
          </h3>

          <div className="text-left">
            <label htmlFor="patientNameInput" className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name:
            </label>
            <input
              id="patientNameInput"
              type="text"
              placeholder="Enter patient name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            <label htmlFor="patientIdInput" className="block text-sm font-medium text-gray-700 mb-1">
              Patient ID:
            </label>
            <input
              id="patientIdInput"
              type="text"
              placeholder="Enter patient ID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              id="cancelSearchBtn"
              className="bg-gray-400 text-white px-3 py-1 rounded hover:opacity-90"
            >
              Cancel
            </button>
            <button
              id="confirmSearchBtn"
              className="bg-[var(--color-primary)] text-white px-3 py-1 rounded hover:opacity-90"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>

      {/* --- Load external JS --- */}
      <Script src="/js/doctor-connection.js" strategy="afterInteractive" />
    </div>
  );
}

