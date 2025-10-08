// "use client";

// import Script from "next/script";
// import Link from "next/link";

// export default function HomePage() {
//   // Fetch and update the username right after the page loads
//   if (typeof window !== "undefined") {
//     (async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           document.getElementById("userBtn").textContent = "Hello Guest";
//           return;
//         }

//         const res = await fetch("/api/auth/me", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           console.error("Failed to fetch user", res.status);
//           document.getElementById("userBtn").textContent = "Hello Guest";
//           return;
//         }

//         const data = await res.json();
//         const name = data?.profile?.name || "Guest";
//         document.getElementById("userBtn").textContent = `Hello ${name}`;
//       } catch (err) {
//         console.error("Error fetching user", err);
//         document.getElementById("userBtn").textContent = "Hello Guest";
//       }
//     })();
//   }

//   return (
//     <div className="min-h-screen bg-[var(--color-background)]">
//       <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
//         {/* User greeting */}
//         <button
//           id="userBtn"
//           type="button"
//           className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
//         >
//           Hello ...
//         </button>

//         {/* Log Data */}
//         <button
//           type="button"
//           className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
//         >
//           Log Data
//         </button>

//         {/* Set Reminders */}
//         <button
//           type="button"
//           id="setRemindersBtn"
//           className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
//         >
//           Set Reminders
//         </button>

//         {/* ✅ Link to Patient Connections page */}
//         <Link
//           href="/patient-connection"
//           className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
//         >
//           View Connections
//         </Link>

//         {/* Optional: custom JS file */}
//         <Script src="/js/patient-homepage.js" strategy="afterInteractive" />
//       </main>
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [username, setUsername] = useState("...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setUsername("Guest");
          return;
        }

        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch user", res.status);
          setUsername("Guest");
          return;
        }

        const data = await res.json();
        const name = data?.profile?.name || "Guest";
        setUsername(name);
      } catch (err) {
        console.error("Error fetching user", err);
        setUsername("Guest");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        {/* User greeting */}
        <button
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Hello {username}
        </button>

        {/* Log Data */}
        <button
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Log Data
        </button>

        {/* Set Reminders */}
        <button
          type="button"
          id="setRemindersBtn"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Set Reminders
        </button>

        {/* ✅ Link to Patient Connections page */}
        <Link
          href="/patient-connection"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          View Connections
        </Link>

        {/* Optional: custom JS file */}
        <Script src="/js/patient-homepage.js" strategy="afterInteractive" />
      </main>
    </div>
  );
}
