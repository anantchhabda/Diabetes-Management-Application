import Script from "next/script";

export default function Page() {
  return (
    <main
      className="flex flex-col justify-start items-center min-h-screen px-4 gap-8"
      style={{ background: "var(--background)" }}
    >
      <form
        id="onboardingForm"
        className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
        noValidate
      >
        {/* Family ID (readonly) */}
        <div>
          <label
            htmlFor="familyId"
            className="block text-lg font-semibold mb-2"
            style={{ color: "var(--color-secondary)" }}
            data-i18n="familyId_label"
          >
            Family ID
          </label>
          <input
            id="familyId"
            name="familyId"
            type="text"
            readOnly
            className="w-full h-10 rounded border-0 px-3 shadow-sm text-white"
            style={{ backgroundColor: "var(--color-secondary)" }}
            data-i18n-title="familyId_title"
            title="Read-only family identifier"
          />
        </div>

        {/* Phone Number (readonly) */}
        <div>
          <label
            htmlFor="phone"
            className="block text-lg font-semibold mb-2"
            style={{ color: "var(--color-secondary)" }}
            data-i18n="phone_label"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            readOnly
            className="w-full h-10 rounded border-0 px-3 shadow-sm text-white"
            style={{ backgroundColor: "var(--color-secondary)" }}
            data-i18n-title="phone_title"
            title="Auto-filled from your registration"
          />
          <p
            id="error-phone"
            className="text-sm"
            style={{ color: "var(--color-error)" }}
          ></p>
        </div>

        {/* Full Name */}
        <Field
          id="fullName"
          labelKey="fullName_label"
          labelFallback="Full Name*"
          placeholderKey="fullName_placeholder"
          placeholderFallback="Full Name"
        />
        <p
          id="error-fullName"
          className="text-sm"
          style={{ color: "var(--color-error)" }}
        ></p>

        {/* Date of Birth */}
        <Field
          id="dateOfBirth"
          type="date"
          labelKey="dob_label"
          labelFallback="Date of Birth*"
        />
        <p
          id="error-dateOfBirth"
          className="text-sm"
          style={{ color: "var(--color-error)" }}
        ></p>

        {/* Full Address */}
        <div>
          <label
            htmlFor="fullAddress"
            className="block text-lg font-semibold mb-2"
            style={{ color: "var(--color-secondary)" }}
            data-i18n="address_label"
          >
            Full Address*
          </label>
          <textarea
            id="fullAddress"
            name="fullAddress"
            rows={3}
            className="w-full rounded border px-3 shadow-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--color-primary)",
              color: "var(--color-textBlack)",
            }}
            data-i18n-placeholder="address_placeholder"
            placeholder="Street, City, Country"
          />
          <p
            id="error-fullAddress"
            className="text-sm"
            style={{ color: "var(--color-error)" }}
          ></p>
        </div>

        {/* Saved message */}
        <p
          id="savedMsg"
          className="text-sm mb-2"
          style={{ color: "var(--color-accent)" }}
        ></p>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 text-lg rounded-md hover:opacity-90 transition"
          style={{
            backgroundColor: "var(--color-secondary)",
            color: "var(--color-textWhite)",
          }}
          data-i18n="save"
        >
          Save
        </button>
      </form>

      {/* run after DOM ready so prefill works */}
      <Script src="/js/family-onboarding.js?v=2" strategy="afterInteractive" />
    </main>
  );
}

// reusable Field with i18n hooks
function Field({
  id,
  type = "text",
  labelKey,
  labelFallback,
  placeholderKey,
  placeholderFallback,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-lg font-semibold mb-2"
        style={{ color: "var(--color-secondary)" }}
        {...(labelKey ? { "data-i18n": labelKey } : {})}
      >
        {labelFallback || ""}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="w-full h-10 rounded border px-3 shadow-sm focus:outline-none focus:ring-2"
        style={{
          borderColor: "var(--color-primary)",
          color: "var(--color-textBlack)",
        }}
        placeholder={placeholderFallback || ""}
        {...(placeholderKey ? { "data-i18n-placeholder": placeholderKey } : {})}
      />
    </div>
  );
}
