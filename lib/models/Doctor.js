import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clinicName: {
        type: String,
        required: true
    },
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    name: {
        type: String
    },
    dob: {
        type: Date
    },
    clinicAddress: {
        type: String
    }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);