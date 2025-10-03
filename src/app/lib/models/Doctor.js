import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
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
    clinicName: {
        type: String,
        required: true
    },
    clinicAddress: {
        type: String,
        required: true
    }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
