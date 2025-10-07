"use client";

import Script from "next/script";

export default function Page() {
  return (
    <main className="flex flex-col justify-start items-center min-h-screen px-4 gap-8" 
          style={{background: 'var(--background)'}}>
      <form
        id="settingsForm"
        className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
      >
        {/* Doctor ID */}
        <div>
          <label
            htmlFor="doctorId"
            className="block text-lg font-semibold mb-2"
            style={{color: 'var(--color-secondary)'}}
          >
            Doctor ID
          </label>
          <input
            id="doctorId"
            name="doctorId"
            type="text"
            readOnly
            className="w-full h-10 rounded border-0 px-3 shadow-sm text-white"
            style={{backgroundColor: 'var(--color-secondary)'}}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-lg font-semibold mb-2"
            style={{color: 'var(--color-secondary)'}}
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            readOnly
            className="w-full h-10 rounded border-0 px-3 shadow-sm text-white"
            style={{backgroundColor: 'var(--color-secondary)'}}
          />
          <p id="error-phone" className="text-sm" style={{color: 'var(--color-error)'}}></p>
        </div>

        {/* Full Name */}
        <Field label="Full Name*" id="fullName" placeholder="Full Name" />

        {/* Error for Full Name */}
        <p id="error-fullName" className="text-sm" style={{color: 'var(--color-error)'}}></p>

        {/* Date of Birth */}
        <Field label="Date of Birth*" id="dateOfBirth" type="date" />
        <p id="error-dateOfBirth" className="text-sm" style={{color: 'var(--color-error)'}}></p>

        {/* Clinic Address */}
        <div>
          <label
            htmlFor="clinicAddress"
            className="block text-lg font-semibold mb-2"
            style={{color: 'var(--color-secondary)'}}
          >
            Clinic Address*
          </label>
          <textarea
            id="clinicAddress"
            name="clinicAddress"
            rows={3}
            placeholder="Street, City, Country, Postcode"
            className="w-full rounded border px-3 shadow-sm 
                       focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-textBlack)',
              focusRingColor: 'var(--color-tertiary)'
            }}
          />
          <p id="error-clinicAddress" className="text-sm" style={{color: 'var(--color-error)'}}></p>
        </div>

        {/* Clinic Name */}
        <Field label="Clinic Name*" id="clinicName" placeholder="Clinic Name" />
        <p id="error-clinicName" className="text-sm" style={{color: 'var(--color-error)'}}></p>

        {/* Saved message */}
        <p id="savedMsg" className="text-sm mb-2" style={{color: 'var(--color-accent)'}}></p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            id="cancelBtn"
            className="flex-1 py-3 bg-gray-500 text-white text-lg rounded-md hover:opacity-90 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-lg rounded-md hover:opacity-90 transition"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-textWhite)'
            }}
          >
            Save
          </button>
        </div>
      </form>
      
      <Script src="/js/doctor-settings.js" strategy='afterInteractive' />
    </main>
  );
}

// Reusable input Field component
function Field({ label, id, type = "text", placeholder }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-lg font-semibold mb-2"
        style={{color: 'var(--color-secondary)'}}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder || ""}
        className="w-full h-10 rounded border px-3 shadow-sm 
                   focus:outline-none focus:ring-2"
        style={{
          borderColor: 'var(--color-primary)',
          color: 'var(--color-textBlack)'
        }}
      />
    </div>
  );
}