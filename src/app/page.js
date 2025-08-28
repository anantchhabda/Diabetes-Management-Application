// src/app/page.js
'use client';
import RegisterModal from "@/components/RegisterModal";
import { useRouter } from 'next/navigation'; // App Router navigation
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isOpenRegister, setIsOpenRegister] = useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: 'rgba(219, 222, 226, 1)',
      boxSizing: 'border-box',
    }}>

      {/* Logo */}
      <div style={{
        width: '25vw',
        maxWidth: '120px',
        height: '25vw',
        maxHeight: '120px',
        marginBottom: '5vh',
        animation: 'pulse 2s infinite',
      }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '250px' }}>
        <button
          style={buttonStyle('#004B5E')}
          onClick={() => router.push('/login')}
        >
          Log In
        </button>

        <button
          style={buttonStyle('#00C896')}
          onClick={() => setIsOpenRegister(true)}
        >
          Register
        </button>
      </div>

      <RegisterModal isOpen={isOpenRegister} onClose={() => setIsOpenRegister(false)} />

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

// Reusable button style function
function buttonStyle(color) {
  return {
    width: '100%',
    padding: '12px 0',
    backgroundColor: color,
    color: 'white',
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };
}
