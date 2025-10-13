export default function PatientOverview() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-[#049EDB]">
        <div className="flex flex-col gap-5 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 rounded-xl shadow-lg mx-2 sm:mx-4">
          {/* title and date */}
          <div className="flex flex-col items-center gap-2 sm:gap-3 w-full">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center" data-i18n="title_patient_data">
              Patient Data
            </h1>

            <div className="flex flex-col items-center gap-2 sm:gap-2.5 w-full max-w-xs">
              <h2 className="text-md sm:text-lg font-semibold text-gray-800 text-center" data-i18n="select_date">
                Select a Date 📅
              </h2>

              {/* wrapped date */}
              <div className="relative w-auto">
                <input
                  id="dataDate"
                  type="date"
                  style={{ width: "16ch" }}
                  className="border px-2 sm:px-3 py-2 rounded shadow text-center font-bold
                           text-gray-900 bg-white placeholder-gray-500 text-sm sm:text-base
                           [color-scheme:light] min-w-[16ch]"
                  title="Choose date"
                  data-i18n-title="choose_date"
                />
                <span
                  id="dateOverlay"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center font-bold text-gray-900 text-sm sm:text-base"
                  aria-hidden="true"
                  style={{ visibility: "hidden" }}
                ></span>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="flex gap-2 sm:gap-3">
            <button
              id="tabGlucose"
              type="button"
              data-tab="glucose"
              className="flex-1 px-2 sm:px-3 py-1 rounded font-bold text-white bg-green-600 text-sm sm:text-base"
              aria-pressed="true"
              data-i18n="tab_glucose"
            >
              Glucose
            </button>
            <button
              id="tabInsulin"
              type="button"
              data-tab="insulin" 
              className="flex-1 px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] text-sm sm:text-base"
              aria-pressed="false"
              data-i18n="tab_insulin"
            >
              Insulin
            </button>
            <button
              id="tabComments"
              type="button"
              data-tab="comments"
              className="flex-1 px-2 sm:px-3 py-1 rounded font-bold text-white bg-[#049EDB] text-sm sm:text-base"
              aria-pressed="false"
              data-i18n="tab_comments"
            >
              Comments
            </button>
          </div>

          {/* content area */}
          <div id="contentArea" className="w-full">
            <div id="tableWrap" className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <tbody id="dataTable">
                  {/* Rows will be populated by JS */}
                </tbody>
              </table>
            </div>

            {/* comments view */}
            <div id="commentsWrap" className="hidden relative border rounded h-40 sm:h-48 overflow-y-auto text-base sm:text-lg p-2 sm:p-3 text-gray-900">
              <div id="commentsDisplay" className="w-full h-full p-2 sm:p-3"></div>
            </div>
          </div>
        </div>

        {/* Load the patient overview specific JavaScript */}
        <script src="/js/patient-overview.js?v=1" defer></script>
      </div>

      {/* Footer text for viewing other's profile */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-3 text-center">
        <p id="footerText" className="text-sm"></p>
      </div>
      <script src="/js/footer-script.js" defer></script>
    </>
  );
}