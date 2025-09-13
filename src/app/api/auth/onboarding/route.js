import dbConnect from '../../../../lib/db';
import User from '../../../../lib/models/User';
import Patient from '../../../../lib/models/Patient';
import Doctor from '../../../../lib/models/Doctor';
import FamilyMember from '../../../../lib/models/FamilyMember';
import {NextResponse} from 'next/server';
import {requireAuth} from '../../../../lib/auth';
import {signJwt} from '../../../../lib/auth';

export async function POST(req) {
    await dbConnect();
    const {payload, error} = requireAuth(req);
    if (error) return error; 
    if (payload.scope !== 'onboarding') {
        return NextResponse.json(
            {message: 'Unauthorized or access expired'},
            {status: 401}
        );
    }
    const body = await req.json();
    const user = await User.findById(payload._id);
    if (!user) return NextResponse.json(
        {error: 'User not found'},
        {status: 404} );
    if (user.onboardingComplete) {
        return NextResponse.json(
            {message: 'Onboarding completed'},
            {status: 409}
        );
    }
    try {
        if (user.role=='Patient') {
            const {name, dob, sex, address, yearOfDiag, typeOfDiag} = body;
            if (!name || !dob || !sex || !address || !yearOfDiag || !typeOfDiag) {
                return NextResponse.json({error: 'All fields are required'}, {status: 400});
            }
            await Patient.create({userID: user._id, name, dob: new Date(dob), sex, address, yearOfDiag, typeOfDiag});
        } else if (user.role=='Doctor') {
            const {name, dob, clinicName, clinicAddress} = body;
            if (!name || !dob || !clinicName || !clinicAddress) {
                return NextResponse.json({error: 'All fields are required'}, {status: 400});
            }
            await Doctor.create({userID: user._id, name, dob: new Date(dob), clinicName, clinicAddress});
        } else if (user.role=='Family Member') {
            const {name, dob, address} = body;
            if (!name || !dob || !address) {
                return NextResponse.json({error: 'All fields are required'}, {status: 400});
            }
            await FamilyMember.create({userID: user._id, name, dob: new Date(dob), address});
        }
        user.onboardingComplete = true;
        await user.save();
        const authToken = signJwt({_id: String(user._id), role: user.role, scope: 'auth'});
        return NextResponse.json(
            {message: 'Onboarding complete', role: user.role, authToken},
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