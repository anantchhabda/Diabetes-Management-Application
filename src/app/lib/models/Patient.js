import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  profileId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  sex: {
    type: String,
    enum: ["Male", "Female", "Intersex", "Prefer not to say"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  // optional diagnosis fields 
  yearOfDiag: {
    type: Number,
    required: false,
    min: 1900,
    max: new Date().getFullYear(),
    // convert empty string from forms to undefined to avoid cast errors
    set: (v) => (v === "" || v === null ? undefined : v),
  },
  typeOfDiag: {
    type: String,
    enum: ["Type 1", "Type 2", "Gestational"],
    required: false,
  },

  // keep arrays for connection links
  doctorID: [
    {
      type: String,
      ref: "Doctor",
    },
  ],
  familyID: [
    {
      type: String,
      ref: "FamilyMember",
    },
  ],
});

// reuse existing model if already compiled
export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
