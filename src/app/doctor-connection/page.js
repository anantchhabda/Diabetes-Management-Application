"use client";

import Header from "../components/header";

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
      {/* ✅ Only one Header is used */}
      <Header />

      <main className="flex flex-col items-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-6 text-center">
          {/* Current Connections */}
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-textBlack)]">
            Current Connections
          </h2>

          <div className="space-y-2">
            {currentConnections.map((c, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[100px_1fr_auto] border border-black"
              >
                <div className="bg-[var(--color-secondary)] text-white font-semibold flex items-center justify-center px-2 py-2">
                  {c.role}
                </div>
                <div className="bg-gray-200 text-[var(--color-textBlack)] flex items-center px-3 font-semibold justify-start">
                  {c.name}
                </div>
                <button className="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Connection Requests */}
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-[var(--color-textBlack)]">
            Connection Requests
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
                <button className="bg-[var(--color-tertiary)] text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
                  Add
                </button>
                <button className="bg-red-600 text-white font-bold px-3 py-1 m-1 rounded hover:opacity-90">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
