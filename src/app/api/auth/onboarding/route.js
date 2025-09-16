import dbConnect from '../../../lib/db';
import {Types} from 'mongoose';
import User from '../../../lib/models/User';
import Patient from '../../../lib/models/Patient';
import Doctor from '../../../lib/models/Doctor';
import FamilyMember from '../../../lib/models/FamilyMember';
import {NextResponse} from 'next/server';
import {requireAuth, signJwt} from '../../../lib/auth';

export async function POST(req) {
    await dbConnect();
    const {payload, error} = requireAuth(req);
    if (error) return error; 

    const user = await User.findById(payload.sub);
    if (!user) return NextResponse.json(
        {error: 'User not found'},
        {status: 404} );

    // 1) If already completed, short-circuit with 409 (your intended behavior)
    if (user.onboardingComplete) {
        let profileId = null;
    if (user.role === 'Patient') {
        const p = await Patient.findOne({ user: user._id }).select('_id');
        profileId = p ? String(p._id) : null;
    } else if (user.role === 'Doctor') {
        const d = await Doctor.findOne({ user: user._id }).select('_id');
        profileId = d ? String(d._id) : null;
    } else if (user.role === 'Family Member') {
        const f = await FamilyMember.findOne({ user: user._id }).select('_id');
        profileId = f ? String(f._id) : null;
    }
    return NextResponse.json(
        { message: 'Onboarding completed', role: user.role, profileId },
        { status: 409 }
    );
    }

    const isAllowed = 
        payload.scope === 'onboarding' ||
        (payload.scope === 'auth' && !user.onboardingComplete);
        
    if (!isAllowed) return NextResponse.json(
            {message: 'Unauthorized or access expired'},
            {status: 401}
    );
    try {
        const body = await req.json();
        let created;    //Capture the created profile doc

        const pre = payload.profileId;
        if (!Types.ObjectId.isValid(pre)) return NextResponse.json({ error: 'Invalid profileId' }, { status: 400 });
        
        if (user.role=='Patient') {
            const {name, dob, sex, address, yearOfDiag, typeOfDiag} = body;
            if (!name || !dob || !sex || !address || !yearOfDiag || !typeOfDiag) {
                return NextResponse.json({error: 'All fields are required'}, {status: 400});
            }
            created = await Patient.create({
                user: user._id,
                _id: pre, 
                name, dob: new Date(dob), sex,
                address, yearOfDiag, typeOfDiag
            });
        
        } else if (user.role=='Doctor') {
            const {name, dob, clinicName, clinicAddress} = body;
            if (!name || !dob || !clinicName || !clinicAddress) {
                return NextResponse.json({error: 'All fields are required'}, {status: 400});
            }
            created = await Doctor.create({
                user: user._id,
                _id: pre, 
                name, dob: new Date(dob), 
                clinicName, clinicAddress
            });

        } else if (user.role=='Family Member') {
            const {name, dob, address} = body;
            if (!name || !dob || !address) {
                return NextResponse.json({error: 'All fields are required'}, {status: 400});
            }
            created = await FamilyMember.create({
                user: user._id,
                _id: pre, 
                name, dob: new Date(dob), address
            });
        }

        // Only flip the flag if the profile was actually created
        if (!created?._id) {
            return NextResponse.json({ error: 'Profile creation failed' }, { status: 500 });
        }
        
        user.onboardingComplete = true;
        await user.save();

        const authToken = signJwt({
            sub: user._id, 
            role: user.role, 
            scope: 'auth'
        });

        const profileKey = 
            user.role === 'Patient' ? 'patientId' :
            user.role === 'Doctor' ? 'doctorId' : 'familyMemberId';
        
        return NextResponse.json(
            {message: 'Onboarding complete', 
            role: user.role, 
            [profileKey]: String(created._id),
            authToken},
            {status: 201}
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Onboarding failed'},
            {status: 500}
        );
    }
}
