import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
    profileId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Intersex', 'Prefer not to say'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    yearOfDiag: {
        type: String,
        required: true
    },
    typeOfDiag: {
        type: String,
        enum: ["Type 1", "Type 2", "Gestational"],
        required: true
    },
    doctorID: {
        type: String,
        ref: 'Doctor'
    },
    familyID: {
        type: String,
        ref: 'FamilyMember'
    }
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
