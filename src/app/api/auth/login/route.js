import dbConnect from '../../../lib/db';
import mongoose from 'mongoose';
import User from '../../../lib/models/User';
import Patient from '../../../lib/models/Patient';
import Doctor from '../../../lib/models/Doctor';
import FamilyMember from '../../../lib/models/FamilyMember';
import bcrypt from 'bcryptjs';
import {NextResponse} from 'next/server';
import {signJwt} from '../../../lib/auth';

export async function POST(req) {
    await dbConnect()
    const {phoneNumber, password} = await req.json();

    if (!phoneNumber || !password) {
        return NextResponse.json({error: 'phoneNumber, Password required'}, {status: 400});
    }

    const user = await User.findOne({phoneNumber});
    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
        return NextResponse.json({error: 'Incorrect password'}, {status: 401});
    }

    if (!user.onboardingComplete) {
        const preProfileId = new mongoose.Types.ObjectId();
        const token = signJwt({
            sub: String(user._id), 
            phoneNumber: user.phoneNumber, 
            role: user.role, 
            scope: 'onboarding',
            profileId: String(preProfileId)
        });

        return NextResponse.json(
            {userId: user._id,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token},
            {status: 201} //create onboarding token
            );
    }
    
    const authToken = signJwt({
        sub: user._id, 
        phoneNumber: user.phoneNumber, 
        role: user.role, 
        scope: 'auth'
    });

    //fetch profileId to include in response
    let profileId = null;
    if (user.role === 'Patient') {
        const p = await Patient.findOne({user: user._id}).select('_id');
        profileId = p ? String(p._id) : null;

    } else if (user.role === 'Doctor') {
        const d = await Doctor.findOne({user: user._id}).select('_id');
        profileId = d ? String(d._id): null;

    } else if (user.role === 'Family Member') {
        const f = await FamilyMember.findOne({user: user._id}).select('_id')
        profileId = f ? String(f._id): null;
    }
    return NextResponse.json(
        {userId: user._id, 
        role: user.role, 
        profileId,
        authToken},
        {status: 200} //login okay
    );
}
    
