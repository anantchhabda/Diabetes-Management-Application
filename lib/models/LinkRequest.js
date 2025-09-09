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
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 24*60*60*1000)
    }
});

//one active pending per patient per requester
LinkRequestSchema.index(
    {patientID: 1, requesterID: 1, status: 1},
    {unique: true, partialFilterExpression: {status: "Pending"}}
);

export default mongoose.models.LinkRequest || mongoose.model('LinkRequest', LinkRequestSchema);
