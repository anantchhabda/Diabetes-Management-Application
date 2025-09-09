import dbConnect from '../../../../lib/db';
import User from '../../../../lib/models/User';
import Patient from '../../../../lib/models/Patient';
import Doctor from '../../../../lib/models/Doctor';
import FamilyMember from '../../../../lib/models/FamilyMember';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../../lib/auth';

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