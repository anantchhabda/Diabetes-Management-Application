import Script from "next/script";

// reusable Tailwind classes
const inputBase =
  "w-full h-10 rounded bg-white border border-gray-300 px-3 " +
  "text-gray-900 placeholder-gray-600 shadow-sm " +
  "focus:outline-none focus:ring-2 focus:ring-[#00C896] [color-scheme:light]";

const selectBase =
  "w-full h-10 rounded bg-white border border-gray-300 px-3 " +
  "text-gray-900 shadow-sm " +
  "focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] [color-scheme:light]";

const textAreaBase =
  "w-full rounded bg-white border border-gray-300 px-3 " +
  "text-gray-900 placeholder-gray-600 shadow-sm " +
  "focus:outline-none focus:ring-2 focus:ring-[#00C896] [color-scheme:light]";

export default function Page() {
  return (
    <main
      suppressHydrationWarning={true}
      className="flex flex-col justify-start items-center min-h-screen px-4 gap-8"
      style={{ background: "var(--background)" }}
    >
      <form
        id="onboardingForm"
        noValidate
        className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
      >
        {/* Patient ID (readonly) */}
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

        {/* Phone Number (readonly) */}
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
          <p id="error-phone" className="hidden text-red-600 text-sm"></p>
        </div>

        {/* Full Name */}
        <Field
          labelKey="fullName_label"
          labelFallback="Full Name*"
          id="fullName"
          placeholderKey="fullName_placeholder"
          placeholderFallback="Full Name"
        />
        <p id="error-fullName" className="hidden text-red-600 text-sm"></p>

        {/* Date of Birth */}
        <Field
          labelKey="dob_label"
          labelFallback="Date of Birth*"
          id="dateOfBirth"
          type="date"
        />
        <p id="error-dateOfBirth" className="hidden text-red-600 text-sm"></p>

        {/* Sex */}
        <div>
          <label
            htmlFor="sex"
            className="block text-lg font-semibold text-slate-800 mb-2"
            data-i18n="sex_label"
          >
            Sex*
          </label>
          <select id="sex" name="sex" required className={selectBase}>
            <option value="" data-i18n="select_placeholder">
              Select...
            </option>
            <option value="Male" data-i18n="sex_male">
              Male
            </option>
            <option value="Female" data-i18n="sex_female">
              Female
            </option>
            <option value="Intersex" data-i18n="sex_intersex">
              Intersex
            </option>
            <option value="Prefer not to say" data-i18n="sex_prefer_not">
              Prefer not to say
            </option>
          </select>
          <p id="error-sex" className="hidden text-red-600 text-sm"></p>
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
            placeholder="Street, City, Country"
            className={textAreaBase}
            data-i18n-placeholder="address_placeholder"
          />
          <p id="error-fullAddress" className="hidden text-red-600 text-sm"></p>
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
          className="hidden text-red-600 text-sm"
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
            className={selectBase}
          >
            <option value="" data-i18n="select_placeholder">
              Select...
            </option>
            <option value="Type 1" data-i18n="diag_type1">
              Type 1
            </option>
            <option value="Type 2" data-i18n="diag_type2">
              Type 2
            </option>
            <option value="Gestational" data-i18n="diag_gestational">
              Gestational
            </option>
          </select>
          <p
            id="error-diagnosisType"
            className="hidden text-red-600 text-sm"
          ></p>
        </div>

        {/* Saved message */}
        <p id="savedMsg" className="text-green-600 text-sm mb-2"></p>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md hover:opacity-90 transition"
          data-i18n="save"
        >
          Save
        </button>
      </form>

      <Script src="/js/patient-onboarding.js" strategy="afterInteractive" />
    </main>
  );
}

/** Wrapper for i18l */
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
        className={inputBase}
        {...(placeholderKey ? { "data-i18n-placeholder": placeholderKey } : {})}
      />
    </div>
  );
}
