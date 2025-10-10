import dbConnect from '../../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../../lib/auth';
import FamilyMember from '../../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../../lib/models/LinkRequest';

export async function DELETE(req, {params}) {
    await dbConnect();
    const {payload, error} = requireRole(req, ['Family Member']);
    if (error) return error;

    const family = await FamilyMember.findOne({user: payload.sub}).select('profileId');
    if (!family) {
        return NextResponse.json({ error: 'Family member profile not found'}, {status: 404});
    }

    const deleted = await LinkRequest.findOneAndDelete({
        _id: params.requestId,
        requesterUser: family.profileId,
        requesterRole: 'Family Member',
        status: 'Pending'
    }).select('_id');

    if (!deleted) {
        return NextResponse.json({ error: 'Pending request not found or not yours'}, {status: 404});
    }
    return NextResponse.json({ message: 'Request removed'}, {status: 200});
}