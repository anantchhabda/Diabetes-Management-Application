"use client";
import Header from '../components/header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <button 
            className="w-full py-4 px-6 bg-[var(--color-accent)] text-white text-xl font-bold rounded-md shadow-lg hover:opacity-90 transition"
            onClick={() => {/* Add navigation logic */}}
          >
            Log Data
          </button>

          <button 
            className="w-full py-4 px-6 bg-[var(--color-secondary)] text-white text-xl font-bold rounded-md shadow-lg hover:opacity-90 transition"
            onClick={() => {/* Add navigation logic */}}
          >
            Set Reminder
          </button>
        </div>
      </main>
    </div>
  );
}