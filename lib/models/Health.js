import mongoose from 'mongoose';

const HealthSchema = new mongoose.Schema({
    patients: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: Date,
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    waistCircumference: {
        type: Number
    },
    hemoglobin: {
        type: String
    },
    bloodPressure: {
        type: String
    },
    cholesterol: {
        type: String
    },
});

export default mongoose.models.Health || mongoose.model('Health', HealthSchema);
