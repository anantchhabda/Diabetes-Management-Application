import Script from "next/script";

export default function LogDataPage() {
  const GLUCOSE_ROWS = [
    "Before Breakfast",
    "After Breakfast",
    "Before Lunch",
    "After Lunch",
    "Before Dinner",
    "After Dinner",
  ];
  const rowKey = (s) => `row_${s.toLowerCase().replace(/\s+/g, "_")}`;

  return (
    <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 bg-[#049EDB]">
      <div className="flex flex-col gap-5 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 rounded-xl shadow-lg mx-2 sm:mx-4">
        {/* title and date */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 w-full">
          <h1
            className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center"
            data-i18n="title_log_data"
          >
            Log Data
          </h1>

          <div className="flex flex-col items-center gap-2 sm:gap-2.5 w-full max-w-xs">
            <h2
              className="text-md sm:text-lg font-semibold text-gray-800 text-center"
              data-i18n="select_date"
            >
              Select a Date 📅
            </h2>

            {/* wrapped date so we can overlay with nepalese */}
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
              {/* overlay showing nepalese digits */}
              <span
                id="dateOverlay"
                className="pointer-events-none absolute inset-0 flex items-center justify-center font-bold text-gray-900 text-sm sm:text-base"
                aria-hidden="true"
                style={{ visibility: "hidden" }}
              ></span>
            </div>

            <p
              id="dateWarning"
              className="hidden text-red-600 text-xs sm:text-sm"
              data-i18n="date_warning_select_date"
            >
              Please select a date before saving.
            </p>
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

        {/* area for content */}
        <div id="contentArea" className="w-full">
          <div id="tableWrap" className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <tbody id="dataTable">
                {GLUCOSE_ROWS.map((row) => (
                  <tr className="border" key={row} data-row={row}>
                    <td
                      className="bg-sky-950 text-white font-bold w-[35%] px-2 sm:px-3 py-2 text-sm sm:text-base"
                      data-i18n={rowKey(row)}
                    >
                      {row}
                    </td>
                    <td className="px-2 sm:px-3 py-2 flex justify-between items-center text-sm sm:text-base">
                      <span
                        data-cell-for={row}
                        className="text-gray-900"
                        suppressHydrationWarning={true}
                      />
                      <button
                        type="button"
                        className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded ml-2 text-xs sm:text-sm"
                        data-edit-for={row}
                        data-i18n="edit"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* comments */}
          <div
            id="commentsWrap"
            className="hidden relative border rounded h-40 sm:h-48 overflow-y-auto text-base sm:text-lg p-2 sm:p-3 text-gray-900"
          >
            <textarea
              id="commentsInput"
              className="w-full h-full p-2 sm:p-3 border-2 border-gray-300 rounded resize-none
                         text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600
                         text-gray-900 bg-white placeholder-gray-500"
              placeholder="Type your comment here..."
              data-i18n-placeholder="comments_placeholder"
            />
          </div>
        </div>

        {/* save */}
        <button
          id="saveBtn"
          type="button"
          className="bg-green-600 text-white px-4 sm:px-6 py-2 mt-2 sm:mt-3 rounded text-base sm:text-lg w-full hover:opacity-90 transition"
          data-i18n="save"
        >
          Save
        </button>
        <p
          id="saveNotice"
          className="hidden text-center text-green-700 text-sm mt-1"
          data-i18n="saved_successfully"
        >
          Saved successfully
        </p>
      </div>

      {/* modal */}
      <div
        id="editorModal"
        className="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editorTitle"
      >
        <div className="bg-white w-full max-w-sm sm:max-w-md rounded-lg shadow-lg p-4 sm:p-6">
          <h3
            id="editorTitle"
            className="text-center text-lg font-bold text-gray-900 mb-3"
          ></h3>
          <input
            id="editorInput"
            type="number"
            inputMode="decimal"
            step="any"
            className="border w-full px-3 py-2 rounded text-sm sm:text-base text-gray-900 bg-white placeholder-gray-500 mb-2"
            placeholder="Enter value..."
            data-i18n-placeholder="enter_value"
          />
          <p
            id="editorWarning"
            className="hidden text-xs sm:text-sm text-red-600 mb-3"
          ></p>
          <div className="flex justify-end gap-2">
            <button
              id="editorCancel"
              type="button"
              className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-gray-300"
              data-i18n="cancel"
            >
              Cancel
            </button>
            <button
              id="editorOk"
              type="button"
              className="px-3 sm:px-4 py-1 sm:py-2 rounded bg-green-600 text-white"
              data-i18n="ok"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* loading strategy deferred */}
      <Script src="/js/offline.js?v=19" strategy="beforeInteractive" />
      <Script src="/js/log-data.js?v=19" strategy="afterInteractive" />
    </div>
  );
}
