"use client";

export default function Page() {
  if (typeof window !== "undefined") {
    //get register data from localStorage
    const token = localStorage.getItem("onboardingToken");

    if (token) {
      try {
        //decode Jwt
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
    <main className="flex justify-center items-center min-h-screen px-4">
      <form
        id="onboardingForm"
        className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
      >
        {/* Patient ID */}
        <div>
          <label
            htmlFor="patientId"
            className="block text-lg font-semibold text-slate-800 mb-2"
          >
            Patient ID
          </label>
          <input
            id="patientId"
            name="patientId"
            type="text"
            readOnly
            className="w-full h-10 rounded bg-[var(--color-secondary)] border-0 text-[var(--color-textWhite)] px-3 shadow-sm"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-lg font-semibold text-slate-800 mb-2"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            readOnly
            className="w-full h-10 rounded bg-[var(--color-secondary)] border-0 text-[var(--color-textWhite)] px-3 shadow-sm"
          />
          <p id="error-phone" className="text-red-600 text-sm"></p>
        </div>

        {/* Full Name */}
        <Field label="Full Name*" id="fullName" placeholder="Full Name" />

        {/* Error for Full Name */}
        <p id="error-fullName" className="text-red-600 text-sm"></p>

        {/* Date of Birth */}
        <Field label="Date of Birth*" id="dateOfBirth" type="date" />
        <p id="error-dateOfBirth" className="text-red-600 text-sm"></p>

        {/* Sex */}
        <div>
          <label
            htmlFor="sex"
            className="block text-lg font-semibold text-slate-800 mb-2"
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
            <option value="">Select...</option>
            <option>Male</option>
            <option>Female</option>
            <option>Intersex</option>
            <option>Prefer not to say</option>
          </select>
          <p id="error-sex" className="text-red-600 text-sm"></p>
        </div>

        {/* Full Address */}
        <div>
          <label
            htmlFor="fullAddress"
            className="block text-lg font-semibold text-slate-800 mb-2"
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
          />
          <p id="error-fullAddress" className="text-red-600 text-sm"></p>
        </div>

        {/* Year of Diagnosis */}
        <Field
          label="Year of Diagnosis*"
          id="yearOfDiagnosis"
          type="number"
          placeholder="Year of Diagnosis"
        />
        <p id="error-yearOfDiagnosis" className="text-red-600 text-sm"></p>

        {/* Diagnosis Type */}
        <div>
          <label
            htmlFor="diagnosisType"
            className="block text-lg font-semibold text-slate-800 mb-2"
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
            <option value="">Select...</option>
            <option>Type 1</option>
            <option>Type 2</option>
            <option>Gestational</option>
          </select>
          <p id="error-diagnosisType" className="text-red-600 text-sm"></p>
        </div>

        {/* Saved message */}
        <p id="savedMsg" className="text-green-600 text-sm mb-2"></p>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-textWhite)] text-lg rounded-md hover:opacity-90 transition"
        >
          Save
        </button>
      </form>

      <script
        src="/js/patient-onboarding.js"
        strategy="beforeInteractive"
      ></script>
    </main>
  );
}

// ?
function Field({ label, id, type = "text", placeholder }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-lg font-semibold text-slate-800 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder || ""}
        className="w-full h-10 rounded bg-white border border-[var(--color-gray-300)] px-3 
                   text-[var(--color-gray-900)] placeholder-gray-600 shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#00C896]"
      />
    </div>
  );
}
