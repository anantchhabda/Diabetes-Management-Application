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
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    clinicAddress: {
        type: String,
        required: true
    }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);