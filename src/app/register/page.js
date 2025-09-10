"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Patient",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{7,15}$/.test(formData.phone)) {
      setError("Please enter a valid phone number (7-15 digits)");
      return;
    }
    if (!formData.password) {
      setError("Password cannot be empty");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    alert(
      `Registering with:\nPhone: ${formData.phone}\nRole: ${formData.role}`
    );
    // TODO: send formData to your API
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen px-4"
      style={{ backgroundColor: "rgba(58, 211, 249, 1)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-xs bg-white p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-[#004B5E]">
          Register
        </h1>

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          inputMode="numeric"
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
        >
          <option>Patient</option>
          <option>Doctor</option>
          <option>Family</option>
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-[#004B5E] text-white text-lg rounded-md hover:opacity-90 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
