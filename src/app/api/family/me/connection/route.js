import dbConnect from '../../../../lib/db';
import LinkRequest from '../../../../lib/models/LinkRequest';
import FamilyMember from '../../../../lib/models/FamilyMember';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Family Member']);
    if (roleCheck.error) return roleCheck.error;

    const me = await FamilyMember.findOne({user: roleCheck.payload.sub}).select('profileId');
    if (!me) return NextResponse.json(
        {error: 'Family member profile not found'}, {status: 404}
    )

    const connections = await LinkRequest.find({requesterUser: me.profileId, status: 'Accepted'})
        .select('_id patient patientName');
    return NextResponse.json({connections}, {status: 200});
}
