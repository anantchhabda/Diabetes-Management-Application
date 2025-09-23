import mongoose from 'mongoose';

const LinkRequestSchema = new mongoose.Schema({
    patient: {
        type: String,
        ref: 'Patient',
        required: true,
        index: true
    },
    requesterRole: {
        type: String,
        enum: ['Doctor', 'Family Member'],
        required: true
    },
    requesterUser: {
        type: String,
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
