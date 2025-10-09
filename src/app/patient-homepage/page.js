import Script from "next/script";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        {/* Greeting (text only updated later by JS) */}
        <button
          id="userBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Hello ...
        </button>

        {/* Log Data (button; JS navigates) */}
        <button
          id="logDataBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Log Data
        </button>

        {/* Set Reminders (button; JS navigates) */}
        <button
          id="setRemindersBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Set Reminders
        </button>

        {/* View Connections (button; JS navigates) */}
        <button
          id="viewConnectionsBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          View Connections
        </button>

        {/* After hydration: greeting + nav wiring (no DOM reshaping) */}
        <Script src="/js/patient-homepage.js" strategy="afterInteractive" />
      </main>
    </div>
  );
}
