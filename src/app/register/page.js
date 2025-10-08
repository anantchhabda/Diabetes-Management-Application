"use client";

import Script from "next/script";

export default function RegisterPage() {
  return (
    <main
      suppressHydrationWarning={true}
      className="flex justify-center items-center min-h-screen px-4 bg-[var(--background)]"
    >
      <form
        id="registerForm"
        noValidate
        className="flex flex-col gap-5 w-full max-w-xs bg-white p-6 rounded-xl shadow-lg"
      >
        <h1
          className="text-2xl font-bold text-center text-[var(--color-secondary)]"
          data-i18n="registerTitle"
        >
          Register
        </h1>

        {/* Phone */}
        <input
          type="tel"
          id="phone"
          placeholder="Phone Number"
          inputMode="numeric"
          data-i18n-placeholder="phone"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-gray-900 bg-white placeholder-gray-600"
        />

        {/* Password */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          data-i18n-placeholder="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-gray-900 bg-white placeholder-gray-600"
        />

        {/* Confirm Password */}
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
          data-i18n-placeholder="confirmPassword"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-gray-900 bg-white placeholder-gray-600"
        />

        {/* Role */}
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

        {/* Error */}
        <p id="error" className="text-red-600 text-sm"></p>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] 
                     text-lg rounded-md text-center hover:opacity-90 transition"
          data-i18n="register"
        >
          Register
        </button>
      </form>

      {/* External js script */}
      <Script src="/js/register.js" strategy="afterInteractive" />
    </main>
  );
}
