import Image from "next/image";
import Script from "next/script";
import styles from "../styles/header.module.css";

export default function Header() {
  return (
    <>
      <header className={`${styles.header} px-4 py-2`}>
        <div className="flex items-center justify-between w-full">
          {/* language buttons (i18n) */}
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

          {/* centered logo */}
          <div className="w-1/3 flex justify-center">
            <Image
              src="/logos/DMA-logo-green.png"
              alt="Diabetes Management Logo"
              id="homeBtn"
              width={60}
              height={60}
              priority
              unoptimized
            />
          </div>

          {/* settings */}
          <div className="w-1/3 flex items-center justify-end">
            <button
              id="settingsBtn"
              className="rounded-full bg-gray-200/90 p-2 hover:bg-gray-300 transition cursor-pointer"
              aria-label="Settings"
              title="Settings"
              data-i18n-title="settings"
            >
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
            </button>

            {/* header logic */}
            <Script src={"/js/header-script.js"} strategy="afterInteractive" />
            <Script
              id="settings-visibility"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function () {
                    var settingsBtn = document.getElementById("settingsBtn");
                    if (!settingsBtn) return;
                    var allowed = new Set([
                      '/patient-homepage',
                      '/doctor-homepage',
                      '/family-homepage'
                    ]);
                    var path = window.location.pathname;
                    settingsBtn.style.display = allowed.has(path) ? '' : 'none';
                  })();
                `,
              }}
            />
          </div>
        </div>
      </header>

      {/* back button - hydration-safe reveal */}
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
      (function () {
        function pathIs(p) {
          var cur = window.location.pathname.replace(/\\/$/, '');
          var want = p.replace(/\\/$/, '');
          return cur === want;
        }

        window.addEventListener('load', function () {
          var backBtn = document.getElementById('backButton');
          if (!backBtn) return;

          var path = window.location.pathname.replace(/\\/$/, '');

          // Hide on homepages
          var homepagePaths = ['/', '/patient-homepage', '/doctor-homepage', '/family-homepage']
            .map(function (p) { return p.replace(/\\/$/, ''); });

          var onDoctorConn = pathIs('/doctor-connection');
          var onFamilyConn = pathIs('/family-connection');

          // Always show on connection pages; otherwise show when not a homepage and there is history
          var shouldShow =
            onDoctorConn || onFamilyConn ||
            (!homepagePaths.includes(path) && (window.history.length > 1));

          if (shouldShow) backBtn.style.display = '';

          // Remove any previously attached handlers (from older scripts)
          var newBtn = backBtn.cloneNode(true);
          backBtn.parentNode.replaceChild(newBtn, backBtn);
          backBtn = newBtn;

          backBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // Force redirect from connection pages to the correct homepage
            if (onDoctorConn) {
              window.location.replace('/doctor-homepage');
              return;
            }
            if (onFamilyConn) {
              window.location.replace('/family-homepage');
              return;
            }

            // Else: normal back
            if (window.history.length > 1) {
              window.history.back();
            }
          });
        }, { once: true });
      })();
    `,
        }}
      />
    </>
  );
}
