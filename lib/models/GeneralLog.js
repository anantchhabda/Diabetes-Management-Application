import mongoose from 'mongoose';

const GeneralLogSchema = new mongoose.Schema({
    patients: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    comment: {
        type: String,
        required: true, 
        trim: true
    }
});

export default mongoose.models.GeneralLog || mongoose.model('GeneralLog', GeneralLogSchema);
