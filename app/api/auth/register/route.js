export const runtime = 'nodejs';

import {dbConnect} from '../../../../lib/db.js';
import {signJWT} from '../../../../lib/auth.js';
import User from '../../../../lib/models/User.js';
import {NextResponse} from 'next/server';

export async function POST(req) {
    await dbConnect(); //connect to MongoDB
    const {phone, password, confirmPassword, role} = await req.json(); //read user data

    if (!phone || !password || !confirmPassword || !role) {
        return NextResponse.json({error: "phone, password, confirmPassword, role are required"}, {status: 400});
    }

    //confirm password must match
    if (password !== confirmPassword) {
        return NextResponse.json({error: 'Passwords do not match'}, {status: 400});
    }
        
    try {
        //Create user now; your User pre-save will hash password
        const user = await User.create({phone, password, role}); 

        //Issue 1-day onboarding token
        const token = signJWT({sub: String(user._id), role, scope: 'onboarding'}, {expiresIn: '1d'});
        const next = 
            role === 'Patient': '/onboarding/patient':
            role === 'Doctor':  '/onboarding/doctor':
                                '/onboarding/familymember';
        return NextResponse.json({token, role, next}, {status: 201});
    } catch (err) {
        if (err?.code === 11000) {
            return NextResponse.json({error: 'Phone already in use'}, {status: 409});
        }
        console.error(err);
        return NextResponse.json({error: 'Registration failed'}, {status: 500});
    }
}
