"use client";

import Script from "next/script";

export default function Page() {
  if (typeof window !== 'undefined') {
    //get onboarding Token from local storage
    const token = localStorage.getItem('onboardingToken');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload =JSON.parse(atob(payloadBase64));
        const profileId = payload.profileId;
        const phone = payload.phoneNumber;
        //fill Family ID and Phone fields
        const familyIdInput = document.getElementById('familyId');
        const phoneInput = document.getElementById('phone');
        if (familyIdInput) familyIdInput.value = profileId || '';
        if (phoneInput) phoneInput.value = phone || '';
      } catch (err) {
        console.error('Failed to get FamilyID and phone number', err);
      }
    }
  }
  return (
    <main className="flex flex-col justify-start items-center min-h-screen px-4 gap-8"
          style={{background: 'var(--background)'}}>
      <form
        id="onboardingForm"
        className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
      >
        {/* Family ID */}
        <div>
          <label
            htmlFor="familyId"
            className="block text-lg font-semibold mb-2"
            style={{color: 'var(--color-secondary)'}}
          >
            Family ID
          </label>
          <input
            id="familyId"
            name="familyId"
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

        {/* Full Address */}
        <div>
          <label
            htmlFor="fullAddress"
            className="block text-lg font-semibold mb-2"
            style={{color: 'var(--color-secondary)'}}
          >
            Full Address*
          </label>
          <textarea
            id="fullAddress"
            name="fullAddress"
            rows={3}
            placeholder="Street, City, Country, Postcode"
            className="w-full rounded border px-3 shadow-sm 
                       focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-textBlack)'
            }}
          />
          <p id="error-fullAddress" className="text-sm" style={{color: 'var(--color-error)'}}></p>
        </div>

        {/* Saved message */}
        <p id="savedMsg" className="text-sm mb-2" style={{color: 'var(--color-accent)'}}></p>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 text-lg rounded-md hover:opacity-90 transition"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-textWhite)'
          }}
        >
          Save
        </button>
      </form>

      {/* load your onboarding script */}
      <Script src="/js/family-onboarding.js" strategy='afterInteractive' />
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