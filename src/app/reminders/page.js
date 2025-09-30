import Header from '../components/header';

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        <h1 className="text-2xl font-bold">Manage Your Reminders</h1>
        <p className="text-lg">Set, edit, and delete your reminders for better diabetes management.</p>

        <button
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Add Reminder
        </button>

        <button
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          View Reminders
        </button>
      </main>
    </div>
  );
}