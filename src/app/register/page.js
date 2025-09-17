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
        <h1 className="text-2xl font-bold text-center text-[#004B5E]">
          Register
        </h1>

        {/* Phone */}
        <input
          type="tel"
          id="phone"
          placeholder="Phone Number"
          inputMode="numeric"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
          required
        />

        {/* Password */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
        />

        {/* Confirm Password */}
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
        />

        {/* Role */}
        <select
          id="role"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
        >
          <option>Patient</option>
          <option>Doctor</option>
          <option>Family</option>
        </select>

        {/* Error message */}
        <p id="error" className="text-red-600 text-sm"></p>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#004B5E] text-white text-lg rounded-md text-center hover:opacity-90 transition"
        >
          Register
        </button>
      </form>

      {/* Attach external script */}
      <Script src="/js/register.js" strategy="afterInteractive" />
    </main>
  );
}
