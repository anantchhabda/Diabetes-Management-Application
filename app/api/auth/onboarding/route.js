export const runtime = 'nodejs';

import {dbConnect} from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import Patient from '../../../../lib/models/Patient.js';
import Doctor from '../../../../lib/models/Doctor.js';
import FamilyMember from '../../../../lib/models/FamilyMember.js';
import {NextResponse} from 'next/server';
import {requireAuth, signJWT} from '../../../../lib/auth.js';

export async function POST(req) {
    await dbConnect();

    //Must have a valid JWT
    const {payload, error} = requireAuth(req);
    if (error) return error;
    
    //Only onboarding tokens can complete onboarding
    if (payload.scope !== 'onboarding') {
        return NextResponse.json(
            {message: 'Unauthorized or token expired'},
            {status: 401}
        );
    }
    
    const body = await req.json();

    //Load user & make sure they haven't finished already
    const user = await User.findById(payload.sub);
    if (!user) return NextResponse.json({error: 'User not found'}, {status: 404});
    if (user.onboardingComplete) {
        return NextResponse.json({error: 'Onboarding already complete'}, {status: 409});
    }

    try {
        //Role-specific creation
        if (user.role === 'Patient') {
            const {name, dob, sex, address, yearOfDiag, typeOfDiag} = body;
            if (!name || !dob || !sex || !address || !yearOfDiag || !typeOfDiag) {
                return NextResponse.json({error: 'all fields are required'}, {status: 400});
            }
            await Patient.create({user: user._id, name, dob: new Date(dob), sex, address, yearOfDiag, typeOfDiag});
        } else if (user.role === 'Doctor') {
            const {name, dob, clinicName, clinicAddress} = body;
            if (!name || !dob || !clinicName || !clinicAddress) {
                return NextResponse.json({error: 'all fields are required'}, {status: 400});
            }
            await Doctor.create({user: user._id, name, dob: new Date(dob), clinicName, clinicAddress});
        } else if (user.role=='Family Member') {
            const {name, dob, address} = body;
            if (!name || !dob) {
                return NextResponse.json({error: 'all fields are required'}, {status: 400});
            }
            await FamilyMember.create({user: user._id, name, dob: new Date(dob), address});
        }

        //Onboarding done, issue a normal auth token
        user.onboardingComplete = true;
        user.onboardingStep = 'done';
        await user.save();
    
        const authToken = signJWT({sub: String(user._id), role: user.role, scope: 'auth'});
        return NextResponse.json({token: authToken, role: user.role}, {status: 201});
        
    } catch (err) {
        // If you have unique(user) on role models, this trips on double submit
        if (err?.code === 11000) {
            return NextResponse.json({error: 'Profile already exists'}, {status: 409});
        }
        console.error(err);
        return NextResponse.json({error: 'Onboarding failed'}, {status: 500});
    }
}
