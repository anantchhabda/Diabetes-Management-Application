export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4 gap-8 bg-[rgba(58,211,249,1)]">
      <form
        id="onboardingForm"
        className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-lg mx-4"
      >
        {/* Family ID */}
        <div>
          <label
            htmlFor="familyId"
            className="block text-lg font-semibold text-slate-800 mb-2"
          >
            Family ID
          </label>
          <input
            id="familyId"
            name="familyId"
            type="text"
            value="PDP-000123"
            readOnly
            className="w-full h-10 rounded bg-[#0c6a70] border-0 text-white/95 px-3 shadow-sm"
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
            value="0488665812"
            readOnly
            className="w-full h-10 rounded bg-[#0c6a70] border-0 text-white/95 px-3 shadow-sm"
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
          <p id="error-fullAddress" className="text-red-600 text-sm"></p>
        </div>



        {/* Saved message */}
        <p id="savedMsg" className="text-green-600 text-sm mb-2"></p>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#004B5E] text-white text-lg rounded-md hover:opacity-90 transition"
        >
          Save
        </button>
      </form>

      <script src="/js/family-onboarding.js" defer></script>
    </main>
  );
}

// Reusable input Field component
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