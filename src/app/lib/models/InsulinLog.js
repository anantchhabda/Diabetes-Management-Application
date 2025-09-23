import mongoose from 'mongoose';

const InsulinLogSchema = new mongoose.Schema({
    patient: {
        type: String,
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
}, { timestamps: true });

export default mongoose.models.InsulinLog || mongoose.model('InsulinLog', InsulinLogSchema);
