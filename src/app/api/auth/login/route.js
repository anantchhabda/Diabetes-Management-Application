import dbConnect from '../../../lib/db';
import User from '../../../lib/models/User';
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
        const token = signJwt({
            sub: String(user._id), 
            phoneNumber: user.phoneNumber, 
            role: user.role, 
            scope: 'onboarding',
            profileId: user.profileId
        });

        return NextResponse.json(
            {userId: user._id,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profileId: user.profileId,
            token},
            {status: 201} //create onboarding token
            );
    }
    
    const authToken = signJwt({
        sub: user._id, 
        phoneNumber: user.phoneNumber, 
        role: user.role, 
        scope: 'auth',
        profileId: user.profileId
    });

    
    return NextResponse.json(
        {userId: user._id, 
        role: user.role, 
        profileId: user.profileId,
        authToken},
        {status: 200} //login okay
    );
}
    
