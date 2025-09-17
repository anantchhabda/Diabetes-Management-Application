import dbConnect from '../../../../lib/db';
import User from '../../../../lib/models/User';
import Patient from '../../../../lib/models/Patient';
import Doctor from '../../../../lib/models/Doctor';
import FamilyMember from '../../../../lib/models/FamilyMember';
import {NextResponse} from 'next/server';
import {verifyJwt} from '../../../../lib/auth';

export async function POST(req) {
    await dbConnect();
    const decoded = verifyJwt(req);
    if (!decoded) {
        return NextResponse.json(
            {message: 'Unauthorized or token expired'},
            {status: 401}
        )
    }
    const {roleSpecificData} = await req.json();
    if (decoded.role=='Patient') {
        await Patient.create({userID: decoded._id, ...roleSpecificData});
    } else if (decoded.role=='Doctor') {
        await Doctor.create({userID: decoded._id, ...roleSpecificData});
    } else if (decoded.role=='Family Member') {
        await FamilyMember.create({userID: decoded._id, ...roleSpecificData});
    }
    return NextResponse.json(
        {message: 'Onboarding complete'},
        {status: 200}
    );
}