import {dbConnect} from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import bcrypt from 'bcryptjs';
import {NextResponse} from 'next/server';
import {signJWT} from '../../../../lib/auth.js';

export async function POST(req) {
    await dbConnect()
    const {phone, password} = await req.json();
    if (!phone || !password) {
        return NextResponse.json({error: 'phone, password required'}, {status: 400});
    }
    
    const user = await User.findOne({phone});
    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 401});
    }
    const matched = await user.compare(password, user.password);
    if (!matched) {
        return NextResponse.json({error: 'Incorrect password'}, {status: 401});
    }

    if (!user.onboardingComplete) {
        const token = signJWT({sub: String(user._id), role: user.role, scope: 'onboarding'}, {expiresIn: '1d'});
        const next = 
            user.role === 'Patient' ? '/onboarding/patient':
            user.role === 'Doctor' ? '/onboarding/doctor':
                                    '/onboarding/familymember';
        return NextResponse.json({token, role: user.role, next}, {status: 200});
    }

    const token signJWT({sub: String(user._id), role: user.role, scope: 'auth'}, {expiresIn: '1d'});
    return NextResponse.json(
        {token, role: user.role},
        {status: 200}
    );
}
