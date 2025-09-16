"use client";
import { useRouter } from 'next/navigation';
import Header from '../components/header';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-[var(--color-secondary)] text-[var(--color-textWhite)] p-4 rounded-md mb-6 max-w-sm mx-auto">
          <h1 className="text-2xl font-bold">Hello, John Doe</h1>
        </div>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <button 
            className="w-full py-4 px-6 bg-[var(--color-accent)] text-[var(--color-textWhite)] text-xl font-bold rounded-md shadow-lg hover:opacity-90 transition"
            onClick={() => router.push('/log-data')}
          >
            Log Data
          </button>

          <button 
            className="w-full py-4 px-6 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-xl font-bold rounded-md shadow-lg hover:opacity-90 transition"
            onClick={() => router.push('/set-reminder')}
          >
            Set Reminder
          </button>
        </div>
      </main>
    </div>
  );
}