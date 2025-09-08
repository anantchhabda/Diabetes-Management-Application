import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        enum: ['Male', 'Female', 'Other']
    },
    address: {
        type: String
    },
    yearOfDiag: {
        type: String
    },
    typeOfDiag: {
        type: String
    },
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    familyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember'
    }
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);