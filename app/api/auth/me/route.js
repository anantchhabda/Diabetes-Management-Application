export const runtime = 'nodejs';

import {dbConnect} from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import Patient from '../../../../lib/models/Patient.js';
import Doctor from '../../../../lib/models/Doctor.js';
import FamilyMember from '../../../../lib/models/FamilyMember.js';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../../lib/auth.js';
import {verifyJWT} from '../../../../lib/auth.js'

export async function GET(req) {
    await dbConnect();
    const {payload, error} = requireAuth(req);
    if (error) return error;
    const user = await User.findById(payload.sub).select('role phone');
    if (!user) return NextResponse.json({error: 'User not found'}, {status: 404});
    let name=''
    switch(user.role) {
        case 'Patient':
            const patient = await Patient.findOne({userID: user._id});
            name = patient.name;
            break;
        case 'Doctor':
            const doctor = await Doctor.findOne({userID: user._id});
            name = doctor.name;
            break;
        case 'Family Member':
            const familyMember = await FamilyMember.findOne({userID: user._id});
            name = familyMember.name;
            break;
    }
    return NextResponse.json(
        {_id: user._id, role: user.role, phone: user.phone, name}
    );
}
