import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Patient', 'Doctor', 'Family Member'],
        required: true
    },
    //onboarding flags
    onboardingComplete: {
        type: Boolean,
        default: false
    }
});

//hash password automatically
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
