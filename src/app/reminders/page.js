import Script from "next/script";
import Header from '../components/header';

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <div id="remindersApp">
        <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
          <h1 className="text-2xl font-bold">Current Reminders</h1>
          <button
            type="button"
            className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
            id="addReminderBtn"
          >
            Add Reminder
          </button>
          <Script src="/js/reminders.js" strategy="afterInteractive" />
        </main>
      </div>
    </div>
  );
}