"use client"; // required to use JS in App Router

import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    const form = document.getElementById("loginForm");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const errorMsg = document.getElementById("error");
    const toggleBtn = document.getElementById("togglePassword");

    // Handle form submit
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const phone = phoneInput.value.trim();
      const password = passwordInput.value;

      if (!/^\d{7,15}$/.test(phone)) {
        errorMsg.textContent = "Please enter a valid phone number (7-15 digits)";
        return;
      }

      if (!password) {
        errorMsg.textContent = "Password cannot be empty";
        return;
      }

      errorMsg.textContent = "";
      alert(`Logging in with:\nPhone: ${phone}\nPassword: ${password}`);
    });

    // Toggle password visibility
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      toggleBtn.textContent = isPassword ? "Hide" : "Show";
    });

    // Restrict phone input to numbers only
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, "");
    });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-cyan-500 px-4">
      <form
        id="loginForm"
        className="flex flex-col gap-5 w-full max-w-xs bg-white p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-[#004B5E]">Login</h1>

        {/* Phone Number */}
        <input
          type="tel"
          id="phone"
          placeholder="Phone Number"
          required
          inputMode="numeric"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
        />

        {/* Password */}
        <div className="relative w-full">
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#00C896]
                       text-gray-900 placeholder-gray-600"
          />
          <button
            type="button"
            id="togglePassword"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#004B5E] font-semibold"
          >
            Show
          </button>
        </div>

        {/* Error message */}
        <p id="error" className="text-red-600 text-sm"></p>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#004B5E] text-white text-lg rounded-md hover:opacity-90 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
