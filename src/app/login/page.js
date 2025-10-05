import Script from "next/script";

export default function Page() {
  return (
    <main className="flex justify-center items-center min-h-screen px-4">
      <form
        id="loginForm"
        className="flex flex-col gap-5 w-full max-w-xs bg-white p-6 rounded-xl shadow-lg"
      >
        <h1
          className="text-2xl font-bold text-center text-[#004B5E]"
          data-i18n="loginTitle"
        >
          Login
        </h1>

        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Phone Number"
          required
          inputMode="numeric"
          autoComplete="tel"
          pattern="[0-9]{7,15}"
          data-i18n-placeholder="phone"
          data-i18n-title="phone_title"
          className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-gray-900 placeholder-gray-700"
        />

        <div className="relative w-full">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            data-i18n-placeholder="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                       text-gray-900 placeholder-gray-700"
          />
          <button
            type="button"
            id="togglePassword"
            data-i18n="show"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-secondary)] font-semibold"
          >
            Show
          </button>
        </div>

        <p
          id="error"
          role="alert"
          aria-live="polite"
          className="text-red-600 text-sm min-h-[1.25rem]"
        ></p>

        <button
          type="submit"
          data-i18n="login"
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md hover:opacity-90 transition"
        >
          Log In
        </button>
      </form>

      <Script src="/js/login.js" strategy="afterInteractive" />
    </main>
  );
}
