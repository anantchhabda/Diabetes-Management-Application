"use client";

import Script from "next/script";

export default function Page() {
  if (typeof window !== "undefined") {
    // get register data from localStorage
    const token = localStorage.getItem("onboardingToken");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        const profileId = payload.profileId;
        const phone = payload.phoneNumber;
        const patientInput = document.getElementById("patientId");
        const phoneInput = document.getElementById("phone");
        if (patientInput) patientInput.value = profileId || "";
        if (phoneInput) phoneInput.value = phone || "";
      } catch (err) {
        console.error("Failed to get PatientId and phone number", err);
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
        {/* Patient ID */}
        <div>
          <label
            htmlFor="patientId"
            className="block text-lg font-semibold text-slate-800 mb-2"
            data-i18n="patientId_label"
          >
            Patient ID
          </label>
          <input
            id="patientId"
            name="patientId"
            type="text"
            readOnly
            className="w-full h-10 rounded bg-[var(--color-secondary)] border-0 text-[var(--color-textWhite)] px-3 shadow-sm"
            data-i18n-title="patientId_title"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-lg font-semibold text-slate-800 mb-2"
            data-i18n="phone_label"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            readOnly
            className="w-full h-10 rounded bg-[var(--color-secondary)] border-0 text-[var(--color-textWhite)] px-3 shadow-sm"
            data-i18n-title="phone_title"
          />
          <p
            id="error-phone"
            className="text-red-600 text-sm"
            data-i18n="error_phone"
          ></p>
        </div>

        {/* Full Name */}
        <Field
          labelKey="fullName_label"
          labelFallback="Full Name*"
          id="fullName"
          placeholderKey="fullName_placeholder"
          placeholderFallback="Full Name"
        />
        <p
          id="error-fullName"
          className="text-red-600 text-sm"
          data-i18n="error_fullName"
        ></p>

        {/* Date of Birth */}
        <Field
          labelKey="dob_label"
          labelFallback="Date of Birth*"
          id="dateOfBirth"
          type="date"
        />
        <p
          id="error-dateOfBirth"
          className="text-red-600 text-sm"
          data-i18n="error_dob"
        ></p>

        {/* Sex */}
        <div>
          <label
            htmlFor="sex"
            className="block text-lg font-semibold text-slate-800 mb-2"
            data-i18n="sex_label"
          >
            Sex*
          </label>
          <select
            id="sex"
            name="sex"
            required
            className="w-full h-10 rounded bg-white border border-[var(--color-gray-300)] px-3 
                       text-[var(--color-gray-900)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]"
          >
            <option value="" data-i18n="select_placeholder">
              Select...
            </option>
            <option data-i18n="sex_male">Male</option>
            <option data-i18n="sex_female">Female</option>
            <option data-i18n="sex_intersex">Intersex</option>
            <option data-i18n="sex_prefer_not">Prefer not to say</option>
          </select>
          <p
            id="error-sex"
            className="text-red-600 text-sm"
            data-i18n="error_sex"
          ></p>
        </div>

        {/* Full Address */}
        <div>
          <label
            htmlFor="fullAddress"
            className="block text-lg font-semibold text-slate-800 mb-2"
            data-i18n="address_label"
          >
            Full Address*
          </label>
          <textarea
            id="fullAddress"
            name="fullAddress"
            rows={3}
            placeholder="Street, City, Country, Postcode"
            className="w-full rounded bg-white border border-[var(--color-gray-300)] px-3 
                       text-gray-900 placeholder-gray-600 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#00C896]"
            data-i18n-placeholder="address_placeholder"
          />
          <p
            id="error-fullAddress"
            className="text-red-600 text-sm"
            data-i18n="error_address"
          ></p>
        </div>

        {/* Year of Diagnosis */}
        <Field
          labelKey="yod_label"
          labelFallback="Year of Diagnosis*"
          id="yearOfDiagnosis"
          type="number"
          placeholderKey="yod_placeholder"
          placeholderFallback="Year of Diagnosis"
        />
        <p
          id="error-yearOfDiagnosis"
          className="text-red-600 text-sm"
          data-i18n="error_yod"
        ></p>

        {/* Diagnosis Type */}
        <div>
          <label
            htmlFor="diagnosisType"
            className="block text-lg font-semibold text-slate-800 mb-2"
            data-i18n="diagnosisType_label"
          >
            Type of Diagnosis*
          </label>
          <select
            id="diagnosisType"
            name="diagnosisType"
            required
            className="w-full h-10 rounded bg-white border border-[var(--color-gray-300)] px-3 
                       text-[var(--color-gray-900)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]"
          >
            <option value="" data-i18n="select_placeholder">
              Select...
            </option>
            <option data-i18n="diag_type1">Type 1</option>
            <option data-i18n="diag_type2">Type 2</option>
            <option data-i18n="diag_gestational">Gestational</option>
          </select>
          <p
            id="error-diagnosisType"
            className="text-red-600 text-sm"
            data-i18n="error_diagType"
          ></p>
        </div>

        {/* Saved message */}
        <p
          id="savedMsg"
          className="text-green-600 text-sm mb-2"
          data-i18n="saved_message"
        ></p>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md hover:opacity-90 transition"
          data-i18n="save"
        >
          Save
        </button>
      </form>

      {/* external scripts */}
      {/* Your layout already loads /js/i18n.js lazily; this page just needs its own page script */}
      <Script src="/js/patient-onboarding.js" strategy="afterInteractive" />
    </main>
  );
}

/** Wrapped Field with i18n-friendly props */
function Field({
  labelKey,
  labelFallback,
  id,
  type = "text",
  placeholderKey,
  placeholderFallback,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-lg font-semibold text-slate-800 mb-2"
        {...(labelKey ? { "data-i18n": labelKey } : {})}
      >
        {labelFallback || ""}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholderFallback || ""}
        className="w-full h-10 rounded bg-white border border-[var(--color-gray-300)] px-3 
                   text-[var(--color-gray-900)] placeholder-gray-600 shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#00C896]"
        {...(placeholderKey ? { "data-i18n-placeholder": placeholderKey } : {})}
      />
    </div>
  );
}
