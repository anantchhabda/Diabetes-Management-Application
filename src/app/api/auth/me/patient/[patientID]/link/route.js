import dbConnect from '../../../../../../../lib/db';
import Doctor from '../../../../../../../lib/models/Doctor';
import FamilyMember from '../../../../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../../../lib/auth';

export async function POST(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Doctor', 'Family Member']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const {patientID} = params;
        let requester;
        if (roleCheck.payload.role=='Doctor') {
            requester = await Doctor.findOne({userID: roleCheck.payload._id});
        } else {
            requester = await FamilyMember.findOne({userID: roleCheck.payload._id});
        }
        if (!requester) {
            return NextResponse.json(
                {message: 'Requester not found'},
                {status: 404}
            );
        }
        const existingRequest = await LinkRequest.findOne({
        requesterRole: roleCheck.payload.role,
        requesterID: requester._id,
        patientID,
        status: 'Pending'
        });
        if (existingRequest) {
            return NextResponse.json(
                {message: 'Request already pending'},
                {status: 409}
            );
        }
        const newRequest = await LinkRequest.create({
        requesterRole: roleCheck.payload.role,
        requesterID: requester._id,
        requesterName: requester.name,
        patientID,
        status: 'Pending'
        });
        return NextResponse.json({
            message: 'Request sent successfully',
            requestID: newRequest._id
            });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Sending request failed', details: err.message },
            {status: 500}
        );
    }
}