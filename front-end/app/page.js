"use client";

import RegisterModal from "@/components/RegisterModal";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col gap-10 items-center justify-center bg-gray-100">
      {/* Logo at the top */}
      <Image
        src="/Logo_Placeholder2.png"   // make sure this is in the public/ folder
        alt="Diabetes Management Logo"
        width={180}
        height={180}
        priority
      />

      {/* Login Button */}
      {/* <div className="h-screen flex lg:flex-col gap-10 items-center justify-center bg-gray-100"></div> */}
      <button
        // onClick={() => setIsOpen(true)}
        className="bg-[#024059] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-700 w-40"
      >
        Log In
      </button>

      {/* <RegisterModal isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}

      {/* Register Modal */}
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
