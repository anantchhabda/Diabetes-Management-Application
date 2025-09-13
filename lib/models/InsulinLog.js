import mongoose from 'mongoose';

const InsulinLogSchema = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    type: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required: true,
    },
    dose: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

export default mongoose.models.InsulinLog || mongoose.model('InsulinLog', InsulinLogSchema);
