"use client";

import React, { useMemo, useState } from "react";

// Patient Onboarding page (.js)
// Matches the layout in your latest screenshot:
// - Small "Patient Onboarding / Profile" text at top-left
// - Centered logo inside a black ring
// - Single, centered form column
// - Grey vertical bar to the right (visual track)
// - Remove the "Etc..." field and include all required fields
// Place this file at: app/patient-onboarding/page.js

const Empty = {
  patientId: "PDP-000123", // read-only
  password: "",
  fullName: "",
  dateOfBirth: "",
  sex: "",
  phone: "",
  fullAddress: "",
  yearOfDiagnosis: "",
  diagnosisType: "",
};

export default function PatientOnboardingPage() {
  const [form, setForm] = useState(Empty);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(null);
  const currentYear = new Date().getFullYear();

  const required = useMemo(
    () => [
      "fullName",
      "dateOfBirth",
      "sex",
      "phone",
      "fullAddress",
      "yearOfDiagnosis",
      "diagnosisType",
    ],
    []
  );

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const e = {};
    for (const k of required) {
      const v = form[k];
      if (typeof v === "string" && v.trim() === "") e[k] = "Required";
    }
    if (form.phone && !/^\+?[0-9 ()-]{7,}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (form.yearOfDiagnosis) {
      const y = Number(form.yearOfDiagnosis);
      if (!Number.isInteger(y) || y < 1900 || y > currentYear) e.yearOfDiagnosis = `Enter a year between 1900 and ${currentYear}`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(null);
    if (!validate()) return;
    await new Promise((r) => setTimeout(r, 300));
    setSaved({ when: new Date() });
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#049EDB]">
      {/* small header text at top-left like the screenshot */}
      <div className="px-3 pt-3 text-slate-200 text-sm">Patient Onboarding / Profile</div>

      <main className="relative mx-auto max-w-xl px-6 pb-20">
        {/* Logo in a black ring, centered */}
        <div className="flex justify-center pt-4 pb-2">
          <img src="/logo.png" alt="Logo" width="240" height="240" className="block" />
        </div>

        <section className="relative">
          {/* visual right-side bar */}
          

          <form onSubmit={handleSubmit} className="max-w-md mx-auto pr-6">
            {/* Patient ID (read-only teal) */}
            <Field label="Patient ID" id="patientId">
              <input
                id="patientId"
                name="patientId"
                type="text"
                value={form.patientId}
                readOnly
                className="w-full h-10 rounded bg-[#0c6a70] border-0 text-white/95 px-3 shadow-sm"
              />
            </Field>

            {/* Password */}
            <Field label="Password" id="password" hint="Minimum 8 characters">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full h-10 rounded bg-white border-0 px-3 shadow-sm"
              />
            </Field>

            {/* First Name */}
            <Field label="Full Name*" id="fullName" error={errors.fullName}>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                required
                className={inputClass(errors.fullName)}
              />
            </Field>

            {/* Date of Birth */}
            <Field label="Date of Birth*" id="dob" error={errors.dateOfBirth}>
              <input
                id="dob"
                name="dateOfBirth"
                type="date"
                lang="en"
                value={form.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
                required
                className={inputClass(errors.dateOfBirth)}
              />
            </Field>

            {/* Sex */}
            <Field label="Sex*" id="sex" error={errors.sex}>
              <select
                id="sex"
                name="sex"
                value={form.sex}
                onChange={(e) => update("sex", e.target.value)}
                required
                className={inputClass(errors.sex)}
              >
                <option value="" disabled>
                  Select...
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Intersex</option>
                <option>Prefer not to say</option>
              </select>
            </Field>

            {/* Phone */}
            <Field label="Phone Number*" id="phone" error={errors.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="e.g., +61 4xx xxx xxx"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
                className={inputClass(errors.phone)}
              />
            </Field>

            {/* Address chunks */}
            <Field label="Full Address*" id="fullAddress" error={errors.fullAddress}>
              <textarea
                id="fullAddress"
                name="fullAddress"
                rows={3}
                placeholder="Street, City, Country, Postcode"
                value={form.fullAddress}
                onChange={(e) => update("fullAddress", e.target.value)}
                required
                className={inputClass(errors.fullAddress)}
              />
            </Field>

            {/* Year of Diagnosis */}
            <Field label="Year of Diagnosis*" id="yod" error={errors.yearOfDiagnosis}>
              <input
                id="yod"
                name="yearOfDiagnosis"
                type="number"
                min={1900}
                max={currentYear}
                step={1}
                placeholder={`e.g., ${currentYear}`}
                value={form.yearOfDiagnosis}
                onChange={(e) => update("yearOfDiagnosis", e.target.value)}
                required
                className={inputClass(errors.yearOfDiagnosis)}
              />
            </Field>

            {/* Diagnosis Type */}
            <Field label="Type of Diagnosis*" id="diagtype" error={errors.diagnosisType}>
              <select
                id="diagtype"
                name="diagnosisType"
                value={form.diagnosisType}
                onChange={(e) => update("diagnosisType", e.target.value)}
                required
                className={inputClass(errors.diagnosisType)}
              >
                <option value="" disabled>
                  Select...
                </option>
                <option>Type 1</option>
                <option>Type 2</option>
                <option>Gestational</option>
              </select>
            </Field>

            {/* Save */}
            <div className="pt-2 pb-8">
              <button
                type="submit"
                className="block w-[160px] mx-auto rounded bg-emerald-500 px-6 py-2 text-2xl font-extrabold text-slate-900 shadow hover:bg-emerald-600"
              >
                Save
              </button>
              {saved && (
                <p className="mt-2 text-center text-sm text-white/90">
                  Saved at {saved.when.toLocaleTimeString()}
                </p>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

function Field({ label, id, children, hint, error }) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-2xl font-semibold text-slate-800 mb-2">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-100/90">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-medium text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return [
    "w-full h-10 rounded bg-white px-3",
    hasError
      ? "ring-2 ring-rose-500 outline-none"
      : "shadow-sm border-0 focus:outline-none focus:ring-2 focus:ring-sky-300",
  ].join(" ");
}
