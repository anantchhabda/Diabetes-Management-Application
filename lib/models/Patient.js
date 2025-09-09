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
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    yearOfDiag: {
        type: Number
    },
    typeOfDiag: {
        type: String,
        enum: ["Type 1", "Type 2", "Gestational"]
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
