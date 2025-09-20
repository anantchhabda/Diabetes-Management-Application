"use client";
import { useRouter } from 'next/navigation';
import Header from '../components/header';

export default function HomePage() {
  const userName = "John Doe"; // can be dynamic later

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        <button
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center hover:opacity-90 transition"
        >
          Hello {userName}
        </button>

        <button
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center hover:opacity-90 transition"
        >
          Log Data
        </button>

        <button
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center hover:opacity-90 transition"
        >
          Set Reminders
        </button>
      </main>
    </div>
  );
}
