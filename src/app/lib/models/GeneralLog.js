import mongoose from 'mongoose';

const GeneralLogSchema = new mongoose.Schema({
    patient: {
        type: String,
        ref: 'Patient',
        required: true
    },
    comment: {
        type: String,
        required: true, 
        trim: true
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export default mongoose.models.GeneralLog || mongoose.model('GeneralLog', GeneralLogSchema);
