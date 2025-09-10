// src/app/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterModal from "@/components/RegisterModal";

export default function HomePage() {
  const router = useRouter();
  const [isOpenRegister, setIsOpenRegister] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "rgba(219, 222, 226, 1)",
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <div className="w-[25vw] max-w-[120px] h-[25vw] max-h-[120px] mb-[5vh]">
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <path
            d="M32 2 C20 20, 8 32, 32 62 C56 32, 44 20, 32 2 Z"
            fill="#00C896"
            stroke="#006D75"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          maxWidth: "250px",
        }}
      >
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 bg-[#004B5E] text-white text-lg rounded-md hover:opacity-90 transition"
        >
          Log In
        </button>

        <button
          style={{
            backgroundColor: "#00C896",
            color: "#fff",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "6px",
          }}
          onClick={() => setIsOpenRegister(true)}
        >
          Register
        </button>
      </div>

      {/* Registration Modal */}
      <RegisterModal
        isOpen={isOpenRegister}
        onClose={() => setIsOpenRegister(false)}
      />

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
