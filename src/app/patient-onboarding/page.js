export default function Page() {
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
            value="PDP-000123"
            readOnly
            className="w-full h-10 rounded bg-[#0c6a70] border-0 text-white/95 px-3 shadow-sm"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-lg font-semibold text-slate-800 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full h-10 rounded bg-white border border-gray-300 px-3 
                       text-gray-900 placeholder-gray-600 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          />
        </div>

        {/* Full Name */}
        <Field label="Full Name*" id="fullName" placeholder="Full Name" />

        {/* Date of Birth */}
        <Field label="Date of Birth*" id="dateOfBirth" type="date" />

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
            className="w-full h-10 rounded bg-white border border-gray-300 px-3 
                       text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          >
            <option value="">Select...</option>
            <option>Male</option>
            <option>Female</option>
            <option>Intersex</option>
            <option>Prefer not to say</option>
          </select>
        </div>

        {/* Phone */}
        <Field
          label="Phone Number*"
          id="phone"
          type="tel"
          placeholder="Phone Number"
        />

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
            className="w-full rounded bg-white border border-gray-300 px-3 
                       text-gray-900 placeholder-gray-600 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          />
        </div>

        {/* Year of Diagnosis */}
        <Field
          label="Year of Diagnosis*"
          id="yearOfDiagnosis"
          type="number"
          placeholder="Year of Diagnosis"
        />

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
            className="w-full h-10 rounded bg-white border border-gray-300 px-3 
                       text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]"
          >
            <option value="">Select...</option>
            <option>Type 1</option>
            <option>Type 2</option>
            <option>Gestational</option>
          </select>
        </div>

        {/* Save Button*/}
        <button
          type="submit"
          className="w-full py-3 bg-[#004B5E] text-white text-lg rounded-md hover:opacity-90 transition"
        >
          Save
        </button>
      </form>

      <script src="/js/patient-onboarding.js" defer></script>
    </main>
  );
}

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
        className="w-full h-10 rounded bg-white border border-gray-300 px-3 
                   text-gray-900 placeholder-gray-600 shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#00C896]"
      />
    </div>
  );
}
