"use client";

import Link from "next/link";

export default function HomePage() {
  // Fetch user data
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

  // Immediately fetch and update the button text after the page loads
  if (typeof window !== "undefined") {
    getUserName().then((name) => {
      const btn = document.getElementById("userBtn");
      if (btn) btn.textContent = `Hello, Dr. ${name}`;
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
          Hello, Dr. ...
        </button>

        {/*links to Doctor Connections page */}
        <Link
          href="/doctor-connection"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          View Patients
        </Link>
      </main>
    </div>
  );
}
