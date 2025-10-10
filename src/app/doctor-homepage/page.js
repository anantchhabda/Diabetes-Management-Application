import Script from "next/script";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="flex flex-col justify-center items-center px-4 gap-8 pt-8">
        <button
          id="userBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          Hello, Dr. …
        </button>

        <button
          id="viewPatientsBtn"
          type="button"
          className="w-full max-w-xs py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
        >
          View Patients
        </button>

        {/* cache bust by bumping version */}
        <Script src="/js/doctor-homepage.js?v=2" strategy="afterInteractive" />
      </main>
    </div>
  );
}
