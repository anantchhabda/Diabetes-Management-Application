import dbConnect from '../../../../lib/db';
import Patient from '../../../../lib/models/Patient'
import Doctor from '../../../../lib/models/Doctor'
import FamilyMember from '../../../../lib/models/FamilyMember';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    const me = await Patient.findOne({user: roleCheck.payload.sub}).select('profileId doctorID familyID');
    if (!me) return NextResponse.json(
        {error: 'Patient profile not found'}, {status: 404}
    )
    const connections = [];
    //fetch all doctors
    if (me.doctorID && me.doctorID.length > 0) {
        const doctors = await Doctor.find({profileId: {$in: me.doctorID}}).select('name profileId');
        doctors.forEach(d => connections.push({role:'Doctor', name: d.name, requesterID: d.profileId}));
    }
    //fetch all family members
    if (me.familyID && me.familyID.length > 0) {
        const families = await FamilyMember.find({profileId: {$in: me.familyID}}).select('name profileId');
        families.forEach(f => connections.push({role:'Family', name: f.name, requesterID: f.profileId}));
    }
    return NextResponse.json({connections}, {status: 200});
}