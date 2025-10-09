import Script from "next/script";

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center">
      <div
        id="remindersApp"
        className="w-full max-w-2xl flex flex-col items-center py-10 px-4"
      >
        {/* Title */}
        <h1
          className="text-2xl font-bold text-center text-[var(--color-textWhite)] mb-8"
          data-i18n="current_reminders"
        >
          Current Reminders
        </h1>

        {/* Add Reminder Button */}
        <button
          type="button"
          id="addReminderBtn"
          className="w-full sm:w-80 py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md font-semibold text-center hover:opacity-90 transition mb-8"
          data-i18n="add_reminder"
        >
          Add Reminder
        </button>

        {/* Reminders List */}
        <div id="remindersList" className="w-full flex flex-col gap-3"></div>

        {/* external js with cache bust*/}
        <Script src="/js/reminders.js?v=4" strategy="afterInteractive" />
      </div>
    </div>
  );
}
