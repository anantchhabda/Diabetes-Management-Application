import mongoose from 'mongoose';

const GlucoseLogSchema = new mongoose.Schema({
    patient: {
        type: String,
        ref: 'Patient',
        required: true
    },
    type: {
        type: String,
        enum: ['Before Breakfast', 'After Breakfast', 'Before Lunch', 'After Lunch', 'Before Dinner', 'After Dinner'],
        required: true
    },
    glucoseLevel: {
        type: Number,
        required: true
    },
    flag: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

//flag high glucose level
GlucoseLogSchema.pre('save', function(next) {
    const high_glucose_threshold = 10.0;
    this.flag = this.glucoseLevel >= high_glucose_threshold;
    next();
});

export default mongoose.models.GlucoseLog || mongoose.model('GlucoseLog', GlucoseLogSchema);
