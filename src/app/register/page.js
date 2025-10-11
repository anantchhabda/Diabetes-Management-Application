"use client";
import Script from "next/script";

export default function RegisterPage() {
  return (
    <main className="flex justify-center items-center min-h-screen px-4">
      <form
        id="registerForm"
        noValidate
        className="flex flex-col gap-5 w-full max-w-xs bg-white p-6 rounded-xl shadow-lg"
      >
        <h1
          className="text-2xl font-bold text-center text-[#004B5E]"
          data-i18n="registerTitle"
        >
          Register
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
            autoComplete="new-password"
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

        <div className="relative w-full">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            autoComplete="new-password"
            data-i18n-placeholder="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                       text-gray-900 placeholder-gray-700"
          />
          <button
            type="button"
            id="toggleConfirmPassword"
            data-i18n="show"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-secondary)] font-semibold"
          >
            Show
          </button>
        </div>

        <select
          id="role"
          defaultValue="Patient"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-gray-900 bg-white [color-scheme:light]"
        >
          <option value="Patient" data-i18n="role_patient">
            Patient
          </option>
          <option value="Doctor" data-i18n="role_doctor">
            Doctor
          </option>
          <option value="Family Member" data-i18n="role_family">
            Family
          </option>
        </select>

        <p
          id="error"
          role="alert"
          aria-live="polite"
          className="text-red-600 text-sm min-h-[1.25rem]"
        ></p>

        <button
          type="submit"
          data-i18n="register"
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md hover:opacity-90 transition"
        >
          Register
        </button>
      </form>

      <Script src="/js/register.js" strategy="afterInteractive" />
    </main>
  );
}
