import mongoose from 'mongoose';

const FamilyMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String, 
        required: true
    },
    dob: {
        type: Date
    },
    address: {
        type: String
    }
});

export default mongoose.models.FamilyMember || mongoose.model('FamilyMember', FamilyMemberSchema);
