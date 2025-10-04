import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-5 bg-[var(--color-background)] gap-6">
      {/* Logo */}
      <Image
        src="/logos/DMA-logo-green.png"
        alt="Diabetes Management Logo"
        width={300}
        height={300}
        priority
        className="block"
      />

      {/* Login and register navigators*/}
      <div className="flex flex-col gap-4 w-full max-w-[250px]">
        <a
          href="/login"
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-xl rounded-md text-center font-semibold hover:opacity-90 transition"
          data-i18n="login"
        >
          Log In
        </a>

        <a
          href="/register"
          className="w-full py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-xl rounded-md text-center font-semibold hover:opacity-90 transition"
          data-i18n="register"
        >
          Register
        </a>
      </div>
    </main>
  );
}
