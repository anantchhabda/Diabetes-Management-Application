import Script from "next/script";

export default function PatientConnections() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col items-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-6 text-center border border-black">
          {/* dynamic current connections */}
          <h2 className="text-2xl font-semibold mb-4 mt-2 text-[var(--color-textBlack)]">
            Current Connections
          </h2>
          <div id="currentConnectionsContainer" className="space-y-2">
            <div
              id="noCurrentConnections"
              className="text-sm text-gray-600 italic"
            >
              No current connections yet.
            </div>
          </div>

          {/* dynamic connection requests*/}
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-[var(--color-textBlack)]">
            Connection Requests
          </h2>
          <div id="connectionRequestsContainer" className="space-y-2">
            <div
              id="noConnectionRequests"
              className="text-sm text-gray-600 italic"
            >
              No connection requests yet.
            </div>
          </div>
        </div>
      </main>

      {/* external js with cache bust bump up version*/}
      <Script src="/js/patient-connection.js?v=2" strategy="afterInteractive" />
    </div>
  );
}
