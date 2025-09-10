"use client";

import { useState } from "react";

export default function RegisterModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "Patient",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Register Data:", formData);
        // You can send data to your API here
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-70 flex items-center justify-center">
            <div className="bg-cyan-900 text-white rounded-xl p-6 w-80 shadow-xl">
                <h2 className="text-xl font-bold text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Email */}
                    <div>
                        <label className="block text-sm bg">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded text-black bg-white"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 rounded text-black bg-white"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2 rounded text-black bg-white"
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 rounded text-black bg-white"
                        >
                            <option>Patient</option>
                            <option>Doctor</option>
                            <option>Family</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-teal-500 hover:bg-teal-600 py-2 rounded-lg font-semibold"
                    >
                        Register
                    </button>
                </form>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full mt-3 bg-gray-500 hover:bg-gray-600 py-2 rounded-lg font-semibold"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
