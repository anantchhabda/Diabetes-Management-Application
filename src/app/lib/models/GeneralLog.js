import mongoose from 'mongoose';

const GeneralLogSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
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
});

export default mongoose.models.GeneralLog || mongoose.model('GeneralLog', GeneralLogSchema);
