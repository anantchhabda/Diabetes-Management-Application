import Script from "next/script";

export default function PatientConnections() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col items-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-6 text-center border border-black">
          {/* Current connections */}
          <h2
            className="text-2xl font-semibold mb-4 mt-2 text-[var(--color-textBlack)]"
            data-i18n="current_connections"
          >
            Current Connections
          </h2>
          <div id="currentConnectionsContainer" className="space-y-2">
            <div
              id="noCurrentConnections"
              className="text-sm text-gray-600 italic"
              data-i18n="no_current_connections"
            >
              No current connections yet.
            </div>
          </div>

          {/* Connection requests */}
          <h2
            className="text-2xl font-semibold mt-10 mb-4 text-[var(--color-textBlack)]"
            data-i18n="connection_requests"
          >
            Connection Requests
          </h2>
          <div id="connectionRequestsContainer" className="space-y-2">
            <div
              id="noConnectionRequests"
              className="text-sm text-gray-600 italic"
              data-i18n="no_connection_requests"
            >
              No connection requests yet.
            </div>
          </div>
        </div>
      </main>

      {/*bumped version to invalidate cache */}
      <Script src="/js/patient-connection.js?v=5" strategy="afterInteractive" />
    </div>
  );
}
