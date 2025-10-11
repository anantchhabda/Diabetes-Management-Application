import dbConnect from '../../../../lib/db';
import Patient from '../../../../lib/models/Patient'
import LinkRequest from '../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    const me = await Patient.findOne({user: roleCheck.payload.sub}).select('profileId');
    if (!me) return NextResponse.json(
        {error: 'Patient profile not found'}, {status: 404}
    )

    const requests = await LinkRequest
        .find({patient: me.profileId, status: 'Pending'})
        .select('_id requesterRole requesterName requesterUser');

    return NextResponse.json({requests}, {status: 200});
}
