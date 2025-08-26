"use client";

import RegisterModal from "@/components/RegisterModal";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex lg:flex-col gap-10 items-center justify-center bg-gray-100">
      <button
        // onClick={() => setIsOpen(true)}
        className="bg-[#024059] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-700 w-40"
      >
        Log In
      </button>

      {/* <RegisterModal isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}

        <button
        onClick={() => setIsOpen(true)}
        className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-700 w-40"
      >
        Register
      </button>

      <RegisterModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
