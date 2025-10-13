"use client";

import Script from "next/script";

export default function Page() {
  return (
    <main
      className="flex flex-col justify-start items-center min-h-screen px-4 gap-8"
      style={{ background: "var(--background)" }}
    >
      <form
        id="settingsForm"
        className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
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
          />
          <p
            id="error-phone"
            className="text-red-600 text-sm hidden"
            data-i18n="error_phone"
          ></p>
        </div>

        {/* Full Name (required) */}
        <Field
          labelKey="fullName_label"
          labelFallback="Full Name*"
          id="fullName"
          placeholderKey="fullName_placeholder"
          placeholderFallback="Full Name"
        />
        <p
          id="error-fullName"
          className="text-red-600 text-sm hidden"
          data-i18n="error_fullName"
        ></p>

        {/* Date of Birth (required) */}
        <Field
          labelKey="dob_label"
          labelFallback="Date of Birth*"
          id="dateOfBirth"
          type="date"
        />
        <p
          id="error-dateOfBirth"
          className="text-red-600 text-sm hidden"
          data-i18n="error_dob"
        ></p>

        {/* Full Address (required) */}
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
            placeholder="Street, City, Country, Postcode"
            data-i18n-placeholder="address_placeholder"
          />
          <p
            id="error-fullAddress"
            className="text-red-600 text-sm hidden"
            data-i18n="error_address"
          ></p>
        </div>

        {/* Saved message — hidden by default; only shown after successful save */}
        <p
          id="savedMsg"
          className="text-sm mb-2 hidden"
          style={{ color: "var(--color-accent)" }}
          aria-live="polite"
          data-i18n="saved_message"
        ></p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            id="logoutBtn"
            className="flex-1 py-3 bg-gray-500 text-white text-lg rounded-md hover:opacity-90 transition"
            data-i18n="logout"
          >
            Log Out
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-lg rounded-md hover:opacity-90 transition"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-textWhite)",
            }}
            data-i18n="save"
          >
            Save
          </button>
        </div>
      </form>

      {/* i18n + page logic */}
      <Script src="/js/i18n.js" strategy="afterInteractive" />
      <Script src="/js/family-settings.js?v=3" strategy="afterInteractive" />
    </main>
  );
}

/** Minimal i18n-aware input wrapper */
function Field({
  labelKey,
  labelFallback,
  id,
  type = "text",
  placeholderKey = null,
  placeholderFallback = "",
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
