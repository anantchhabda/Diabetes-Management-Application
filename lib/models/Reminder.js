import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
    patients: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    type: {
        type: String,
        enum: ['Take Medication', 'Report Glucose', 'Report Insulin'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    interval: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly'],
            required: true
    },
    daysOfWeek: [{
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    }],
    daysOfMonth: {
        type: Number,
        min: 1,
        max:31
    },
    time: [{
        type: Date,
        required: true
    }],
    active: {
        type: Boolean, 
        default: true
    },
});

//enforce interval-specific rules
ReminderSchema.pre('validate', function(next) {
    if (this.interval=='Daily') {
        this.daysOfWeek = undefined;
        this.daysOfMonth = undefined;
    } else if (this.interval == 'Weekly') {
        this.daysOfMonth = undefined;
    } else if (this.interval == 'Monthly') {
        this.daysOfWeek = undefined;
    }
    next()
});

export default mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);
