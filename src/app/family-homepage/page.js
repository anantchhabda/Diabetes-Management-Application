import Script from "next/script";

export default function FamilyHomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        {/* dynamic greeting */}
        <button
          id="userBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
          data-i18n="helloUser"
        >
          {/* fallback so something shows pre-i18n */}
          Hello, {`{name}`}
        </button>

        {/* view patients */}
        <button
          id="viewPatientsBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
          data-i18n="view_patients"
        >
          View Patients
        </button>

        {/* external js */}
        <Script src="/js/family-homepage.js?v=2" strategy="afterInteractive" />
      </main>
    </div>
  );
}
