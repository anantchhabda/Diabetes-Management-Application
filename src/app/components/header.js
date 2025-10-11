import Image from "next/image";
import Script from "next/script";
import styles from "../styles/header.module.css";

export default function Header() {
  return (
    <header className={`${styles.header} px-4 py-2`}>
      <div className="flex items-center justify-between w-full">
        {/* empty space */}
        <div className="w-1/3"></div>

        {/* centered logo */}
        <div className="w-1/3 flex justify-center">
          <Image
            src="/logos/DMA-logo-green.png"
            alt="Diabetes Management Logo"
            id="homeBtn"
            width={60}
            height={60}
            priority
          />
        </div>

        {/* language and setting on right side */}
        <div className="w-1/3 flex items-center justify-end gap-4">
          {/* language toggles */}
          <div className="flex gap-2">
            <button
              type="button"
              className="px-2 py-1 sm:px-3 sm:py-1 rounded-md border border-white/40 bg-white/10 text-white hover:bg-white/20 transition text-xs sm:text-sm"
              data-lang="en"
              id="lang-en"
            >
              English
            </button>
            <button
              type="button"
              className="px-2 py-1 sm:px-3 sm:py-1 rounded-md border border-white/40 bg-white/10 text-white hover:bg-white/20 transition text-xs sm:text-sm"
              data-lang="ne"
              id="lang-ne"
            >
              नेपाली
            </button>
          </div>

          {/* settings button*/}
          <button
            type="button"
            id="settingsBtn"
            className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#999999"
            >
              <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Z" />
            </svg>
          </button>
          <Script src={`/js/header-script.js?v=${Date.now()}`} strategy="afterInteractive" />
        </div>
      </div>
    </header>
  );
}
