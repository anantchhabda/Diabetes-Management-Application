import Script from "next/script";

export default function Page() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("onboardingToken");
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        const profileId = payload.profileId;
        const phone = payload.phoneNumber;

        const doctorIdInput = document.getElementById("doctorId");
        const phoneInput = document.getElementById("phone");
        if (doctorIdInput) doctorIdInput.value = profileId || "";
        if (phoneInput) phoneInput.value = phone || "";
      } catch (err) {
        console.error("Failed to get DoctorID and phone number", err);
      }
    }
  }

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
        {/* Doctor ID */}
        <div>
          <label
            htmlFor="doctorId"
            className="block text-lg font-semibold mb-2"
            style={{ color: "var(--color-secondary)" }}
            data-i18n="doctorId_label"
          >
            {/* fallback so it's visible before i18n applies */}
            Doctor ID
          </label>
          <input
            id="doctorId"
            name="doctorId"
            type="text"
            readOnly
            className="w-full h-10 rounded border-0 px-3 shadow-sm text-white"
            style={{ backgroundColor: "var(--color-secondary)" }}
            data-i18n-title="doctorId_title"
          />
        </div>

        {/* Phone Number */}
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
            className="text-sm"
            style={{ color: "var(--color-error)" }}
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
          className="text-sm"
          style={{ color: "var(--color-error)" }}
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
          className="text-sm"
          style={{ color: "var(--color-error)" }}
        ></p>

        {/* Clinic Address */}
        <div>
          <label
            htmlFor="clinicAddress"
            className="block text-lg font-semibold mb-2"
            style={{ color: "var(--color-secondary)" }}
            data-i18n="clinicAddress_label"
          >
            Clinic Address*
          </label>
          <textarea
            id="clinicAddress"
            name="clinicAddress"
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
            id="error-clinicAddress"
            className="text-sm"
            style={{ color: "var(--color-error)" }}
          ></p>
        </div>

        {/* Clinic Name */}
        <Field
          labelKey="clinicName_label"
          labelFallback="Clinic Name*"
          id="clinicName"
          placeholderKey="clinicName_placeholder"
          placeholderFallback="Clinic Name"
        />

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

      <Script src="/js/doctor-onboarding.js" strategy="afterInteractive" />
    </main>
  );
}

// i18n-aware field with  fallback text
function Field({
  labelKey,
  labelFallback = "",
  id,
  type = "text",
  placeholderKey,
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
        {labelFallback}
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
        {...(placeholderKey ? { "data-i18n-placeholder": placeholderKey } : {})}
        placeholder={placeholderFallback}
      />
    </div>
  );
}
