//get outgoing request
import dbConnect from '../../../../lib/db';
import LinkRequest from '../../../../lib/models/LinkRequest';
import Doctor from '../../../../lib/models/Doctor';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Doctor']);
    if (roleCheck.error) return roleCheck.error;

    const me = await Doctor.findOne({user: roleCheck.payload.sub}).select('profileId');
    if (!me) return NextResponse.json(
        {error: 'Doctor profile not found'}, {status: 404}
    )

    const requests = await LinkRequest.find({requesterUser: me.profileId, status: 'Pending'})
        .select('_id patient patientName');
    return NextResponse.json({requests}, {status: 200});
}
