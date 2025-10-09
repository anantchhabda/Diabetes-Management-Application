import Script from "next/script";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        {/* greeting */}
        <button
          id="userBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Hello ...
        </button>

        {/* log data button */}
        <button
          id="logDataBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Log Data
        </button>

        {/* set reminders */}
        <button
          id="setRemindersBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Set Reminders
        </button>

        {/* view connections */}
        <button
          id="viewConnectionsBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          View Connections
        </button>

        {/* external js */}
        <Script src="/js/patient-homepage.js" strategy="afterInteractive" />
      </main>
    </div>
  );
}
