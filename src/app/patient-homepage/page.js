import Script from "next/script";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        {/* dynamic greeting*/}
        <button
          id="userBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
          data-i18n="helloUser" /* fallback just in case i18n issue*/
        >
          Hello, {`{name}`}
        </button>

        {/* log data button */}
        <button
          id="logDataBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
          data-i18n="logData"
        >
          Log Data
        </button>

        {/* set reminders */}
        <button
          id="setRemindersBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
          data-i18n="setReminders"
        >
          Set Reminders
        </button>

        {/* view connections */}
        <button
          id="viewConnectionsBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
          data-i18n="viewConnections"
        >
          View Connections
        </button>

        {/* NEW: read-only helper must come BEFORE page logic */}
        <Script src="/js/readonly-view.js?v=8" strategy="afterInteractive" />

        {/* external logic js */}
        <Script
          src="/js/patient-homepage.js?v=19"
          strategy="afterInteractive"
        />
      </main>
    </div>
  );
}
