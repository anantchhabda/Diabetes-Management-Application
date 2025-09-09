import mongoose from 'mongoose';

const LinkRequestSchema = new mongoose.Schema({
    requesterType: {
        type: String,
        enum: ['Doctor', 'Family Member'],
        required: true
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    requesterID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    requesterName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }
});

export default mongoose.models.LinkRequest || mongoose.model('LinkRequest', LinkRequestSchema);