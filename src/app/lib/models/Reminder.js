import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
    patientID: {
        type: String,
        ref: 'Patient'
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
    dayOfWeek: {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    dayOfMonth: {
        type: Number,
        min: 1,
        max:31
    },
    startDate: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

//enforce interval-specific rules

ReminderSchema.pre('validate', function(next) {
    let dateObj;
    if (typeof this.startDate === 'string') {
        const [year, month, day] = this.startDate.split('-').map(Number);
        dateObj = new Date(year, month - 1, day); // js months are 0-indexed
    } else {
        dateObj = this.startDate;
    }
    if (this.interval === 'Weekly') {
        const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        this.dayOfWeek = dayNames[dateObj.getDay()];
    }

    next();
});

export default mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);