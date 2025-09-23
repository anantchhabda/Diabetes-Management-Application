"use client";

export default function HomePage() {
  
  //fetch user data
  async function getUserName() {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!res.ok) {
        console.error('Failed to fetch user', res.status);
        return 'Guest';
      }
      const data = await res.json();
      return data?.profile?.name || 'Guest';
    } catch (err) {
      console.error('Error fetching user', err);
      return 'Guest';
    }
  }

  //immediately fetch and update the button text after the page loads
  if (typeof window !== "undefined") {
    getUserName().then((name) => {
      const btn = document.getElementById("userBtn");
      if (btn) btn.textContent = `Hello ${name}`;
    });
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4 gap-8 bg-[rgba(58,211,249,1)]">
      <button
        id='userBtn'
        type="button"
        className="w-full max-w-xs py-3 bg-[#00C896] text-white text-lg rounded-md text-center hover:opacity-90 transition"
      >
        Hello ...
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
