import mongoose from 'mongoose';

const FamilyMemberSchema = new mongoose.Schema({
    profileId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String, 
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String
    }
});

export default mongoose.models.FamilyMember || mongoose.model('FamilyMember', FamilyMemberSchema);
