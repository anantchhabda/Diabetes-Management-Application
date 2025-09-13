import mongoose from 'mongoose';

const LinkRequestSchema = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        index: true
    },
    requesterRole: {
        type: String,
        enum: ['Doctor', 'Family Member'],
        required: true
    },
    requesterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    requesterName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted'],
        default: 'Pending'
    }
});

export default mongoose.models.LinkRequest || mongoose.model('LinkRequest', LinkRequestSchema);
