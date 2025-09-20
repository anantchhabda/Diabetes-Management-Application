"use client"; // needed if you're in Next.js app directory

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-5 bg-[var(--color-background)]">
      {/* Inbuilt logo --> change to external logo file? */}
      <div className="w-[25vw] max-w-[120px] h-[25vw] max-h-[120px] mb-[5vh]">
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <path
            d="M32 2 C20 20, 8 32, 32 62 C56 32, 44 20, 32 2 Z"
            fill="#00C896"
            stroke="#006D75"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Login  and register buttons */}
      <div className="flex flex-col gap-5 w-full max-w-[250px]">
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center hover:opacity-90 transition"
        >
          Log In
        </button>

        <button
          onClick={() => router.push("/register")}
          className="w-full py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center hover:opacity-90 transition"
        >
          Register
        </button>
      </div>
    </main>
  );
}
