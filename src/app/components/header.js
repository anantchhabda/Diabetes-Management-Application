import Image from "next/image";
import Link from "next/link";
import styles from "../styles/header.module.css";

export default function Header() {
  return (
    <>
      <header className={`${styles.header} px-3 py-2`}>
        <div className="flex items-center justify-between w-full">
          {/* language buttons */}
          <div className="w-1/3 min-w-0 flex flex-wrap items-center justify-start gap-1 sm:gap-2">
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

          {/* logo */}
          <div className="w-1/3 flex justify-center">
            <Link href="/homepage" className={styles.logoLink}>
              <Image
                src="/logos/DMA-logo-green.png"
                alt="Diabetes Management Logo"
                width={56}
                height={56}
                priority
              />
            </Link>
          </div>

          {/* settings */}
          <div className="w-1/3 flex items-center justify-end">
            <Link
              href="/settings"
              className={styles.settingsButton}
              aria-label="Settings"
              title="Settings"
              data-i18n-title="settings"
            >
              <div className="rounded-full bg-gray-200/90 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="22"
                  viewBox="0 -960 960 960"
                  width="22"
                  fill="#666"
                  role="img"
                  aria-hidden="true"
                >
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Z" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* back button, stays hidden until page has nicely hydrated */}
      <button
        id="backButton"
        suppressHydrationWarning
        style={{ display: "none" }}
        className="fixed bottom-5 left-5 z-50 bg-[var(--color-secondary)] text-[var(--color-textWhite)] px-4 py-2 rounded-full shadow-lg font-semibold hover:bg-[var(--color-tertiary)] transition"
        title="Back"
        data-i18n-title="back"
        aria-label="Back"
      >
        ← <span data-i18n="back">Back</span>
      </button>
      <script
        dangerouslySetInnerHTML={{
          __html: `
      // Reveal only after full load, via inline style (avoids className mismatch)
      window.addEventListener('load', function () {
        var backBtn = document.getElementById('backButton');
        if (!backBtn) return;

        var path = window.location.pathname;

        // Do not show back button on any homepage routes
        var homepagePaths = [
          '/',
          '/homepage',
          '/patient-homepage',
          '/doctor-homepage',
          '/family-homepage'
        ];

        var shouldShow = !homepagePaths.includes(path) && (window.history.length > 1);

        if (shouldShow) {
          backBtn.style.display = ''; // unhide
        }

        backBtn.addEventListener('click', function () {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/homepage';
          }
        });
      }, { once: true });
    `,
        }}
      />
    </>
  );
}
