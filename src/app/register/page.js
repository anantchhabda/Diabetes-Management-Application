"use client";

import Script from "next/script";

export default function RegisterPage() {
  return (
    <main className="flex justify-center items-center min-h-screen px-4">
      <form
        id="registerForm"
        className="flex flex-col gap-5 w-full max-w-xs bg-white p-6 rounded-xl shadow-lg"
        noValidate
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
          className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-[var(--color-gray-900)] placeholder-[var(--color-gray-600)]"
          required
        />

        {/* Password */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          data-i18n-placeholder="password"
          data-i18n-title="phoneTitle"
          className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-[var(--color-gray-900)] placeholder-[var(--color-gray-600)]"
        />

        {/* Confirm Password */}
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
          data-i18n-placeholder="confirmPassword"
          className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-[var(--color-gray-900)] placeholder-[var(--color-gray-600)]"
        />

        {/* Role */}
        <select
          id="role"
          className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]
                     text-[var(--color-gray-900)] placeholder-[var(--color-gray-600)]"
          defaultValue="Patient"
        >
          {/* Display text is translated via data-i18n; value stays stable for redirects */}
          <option value="Patient" data-i18n="role_patient">Patient</option>
          <option value="Doctor" data-i18n="role_doctor">Doctor</option>
          <option value="Family Member" data-i18n="role_family">Family</option>
        </select>

        {/* Error */}
        <p id="error" className="text-red-600 text-sm"></p>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center hover:opacity-90 transition"
          data-i18n="register"
        >
          Register
        </button>
      </form>

      {/* external script */}
      <Script src="/js/register.js" strategy="afterInteractive" />
    </main>
  );
}
