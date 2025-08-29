'use client';
import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password cannot be empty');
      return;
    }

    setError('');
    alert(`Logging in with:\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cyan-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-[300px] bg-white p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-[#004B5E]">Login</h1>

        {/* Email field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-[#00C896]
                     text-gray-900 placeholder-gray-600"
          required
        />

        {/* Password field with toggle */}
        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-[#00C896]
                       text-gray-900 placeholder-gray-600"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#004B5E] font-semibold"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Error message */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Login button */}
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
