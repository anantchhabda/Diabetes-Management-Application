import dbConnect from '../../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole }  from '../../../../../lib/auth';
import Doctor from '../../../../../lib/models/Doctor';
import LinkRequest from '../../../../../lib/models/LinkRequest';

export async function DELETE(req, {params}) {
    await dbConnect();
    const { payload, error } = requireRole(req, ['Doctor']);
    if (error) return error;

    const doctor = await Doctor.findOne({ user: payload.sub}).select('profileId');
    if (!doctor) {
        return NextResponse.json({ error: 'Doctor profile not found'}, {status: 404});
    }

    const { requestId } = await params;

    const deleted = await LinkRequest.findOneAndDelete({ 
        _id: requestId,
        requesterUser: doctor.profileId,
        requesterRole: 'Doctor',
        status: 'Pending'
    });

    if (!deleted) {
        return NextResponse.json({ error: 'Pending request not found or not yours'}, {status: 404});
    }
    return NextResponse.json({ message: 'Request removed'}, {status: 200});
}