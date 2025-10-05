"use client";
import Script from "next/script";

export default function HomePage() {
  //fetch user data
  async function getUserName() {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch user", res.status);
        return "Guest";
      }
      const data = await res.json();
      return data?.profile?.name || "Guest";
    } catch (err) {
      console.error("Error fetching user", err);
      return "Guest";
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
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        <button
          id="userBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Hello ...
        </button>

        <button
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Log Data
        </button>

        <button
          type="button"
          id="setRemindersBtn"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
          id="setRemindersBtn"
        >
          Set Reminders
        </button>
        <Script src="/js/patient-homepage.js" strategy="afterInteractive" />
      </main>
    </div>
  );
}
