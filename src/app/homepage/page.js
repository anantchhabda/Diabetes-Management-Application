"use client";

export default function HomePage() {
  const userName = "John Doe"; // can be dynamic later

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4 gap-8 bg-[rgba(58,211,249,1)]">
      <button
        type="button"
        className="w-full max-w-xs py-3 bg-[#00C896] text-white text-lg rounded-md text-center hover:opacity-90 transition"
      >
        Hello {userName}
      </button>

      {/* Button to log data --> Glucose/Insulin*/}
      <button
        type="button"
        className="w-full max-w-xs py-3 bg-[#004B5E] text-white text-lg rounded-md text-center hover:opacity-90 transition"
      >
        Log Data
      </button>

      {/* Set customer reminders */}
      <button
        type="button"
        className="w-full max-w-xs py-3 bg-[#00C896] text-white text-lg rounded-md text-center hover:opacity-90 transition"
      >
        Set Reminders
      </button>
    </main>
  );
}
