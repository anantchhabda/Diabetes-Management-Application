import Script from "next/script";

export default function FamilyConnections() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col items-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-6 text-center border border-black">
          {/* search button */}
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

          {/* dynamic current connections */}
          <h2 className="text-2xl font-semibold mb-4 mt-6 text-[var(--color-textBlack)]">
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

          {/* dynamic outgoing requests */}
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-[var(--color-textBlack)]">
            Outgoing Requests
          </h2>
          <div id="outgoingRequestsContainer" className="space-y-2">
            <div
              id="noOutgoingRequests"
              className="text-sm text-gray-600 italic"
            >
              No outgoing requests yet.
            </div>
          </div>
        </div>
      </main>

      {/* search pop up*/}
      <div
        id="searchPopup"
        className="hidden fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center border border-black">
          {/* search by patient ID */}
          <div id="searchView">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Search Patient by ID
            </h3>

            <div className="text-left">
              <label
                htmlFor="patientIdInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Patient ID:
              </label>
              <input
                id="patientIdInput"
                type="text"
                placeholder="Enter patient ID"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-black bg-white"
                maxLength={32}
              />
              <p id="searchError" className="text-red-600 text-sm h-5"></p>
            </div>

            <div className="flex justify-end gap-2 mt-2">
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
                Next
              </button>
            </div>
          </div>

          {/* confirm send */}
          <div id="confirmView" className="hidden">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Connection Request
            </h3>

            <div className="flex flex-col items-center bg-white border border-gray-300 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Patient Name:</span>{" "}
                <span id="confirmPatientName">—</span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Patient ID:</span>{" "}
                <span id="confirmPatientId">—</span>
              </p>
              <p className="text-sm text-gray-800 mt-3 font-semibold">
                Confirm Request
              </p>
            </div>

            {/* center buttons*/}
            <div className="flex justify-center gap-3">
              <button
                id="backToSearchBtn"
                className="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90"
              >
                Cancel
              </button>
              <button
                id="sendRequestBtn"
                className="bg-green-600 text-white px-3 py-1 rounded hover:opacity-90"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* external js*/}
      <Script src="/js/family-connection.js?v=2" strategy="afterInteractive" />
    </div>
  );
}
