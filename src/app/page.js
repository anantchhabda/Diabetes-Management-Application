// src/app/page.js
import React from 'react';

export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'rgba(219, 222, 226, 1)', // light grey
    }}>
      
      {/* Top Icon */}
      <div style={{
        width: '120px',
        height: '120px',
        marginBottom: '50px',
        animation: 'pulse 2s infinite', // animation applied here
      }}>
        {/* Blood-drop icon */}
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <path
            d="M32 2 C20 20, 8 32, 32 62 C56 32, 44 20, 32 2 Z"
            fill="#00C896" // green color
            stroke="#006D75" // dark teal outline
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button style={{
          width: '180px',
          height: '50px',
          backgroundColor: '#004B5E', // dark teal
          color: 'white',
          fontSize: '1.2rem',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}>
          Log In
        </button>

        <button style={{
          width: '180px',
          height: '50px',
          backgroundColor: '#00C896', // green
          color: 'white',
          fontSize: '1.2rem',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}>
          Register
        </button>
      </div>

      {/* Keyframes for animation */}
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
