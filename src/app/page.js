export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-5 bg-[var(--color-background)] gap-6">
      {/* Logo */}
      <img
        src="/logos/DMA-logo-green.png"
        alt="Diabetes Management Logo"
        width="300"
        height="300"
        loading="eager"
        className="block"
      />

      {/* Language toggles */}
      <div className="flex gap-2 -mt-2">
        <button
          type="button"
          className="px-4 py-2 rounded-md border border-white/40 bg-white/10 text-white hover:bg-white/20 transition"
          data-lang="en"
          id="lang-en"
        >
          English
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-md border border-white/40 bg-white/10 text-white hover:bg-white/20 transition"
          data-lang="ne"
          id="lang-ne"
        >
          नेपाली
        </button>
      </div>

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
