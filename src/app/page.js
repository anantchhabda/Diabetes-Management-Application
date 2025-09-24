"use client"; // needed if you're in Next.js app directory

import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-5 bg-[var(--color-background)]">
      <Image
          src="/logos/DMA-logo-black.png"
          alt="Diabetes Management Logo"
          width={300}
          height={300}
          priority
      />

      <div className="flex flex-col gap-5 w-full max-w-[250px]">
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-xl rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Log In
        </button>

        <button
          onClick={() => router.push("/register")}
          className="w-full py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-xl rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Register
        </button>
      </div>
    </main>
  );
}
