import dbConnect from '../../../../lib/db';
import Doctor from '../../../../lib/models/Doctor';
import FamilyMember from '../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../../lib/auth';
import {requireRole} from '../../../../lib/auth';

export async function POST(req, {params}) {
    await dbConnect();
    const {payload, error} = requireAuth(req);
    if (error) return error;
    const roleCheck = requireRole(req, ['Doctor', 'FamilyMember']);
    if (roleCheck.error) return roleCheck.error;
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
    requesterType: roleCheck.payload.role,
    requesterID: requester._id,
    requesterName: requester.name,
    patientID,
    status: 'Pending'
    });
    if (existingRequest) {
        return NextResponse.json(
            {message: 'Request already pending'},
            {status: 200}
        );
    }
    const newRequest = await LinkRequest.create({
    requesterType: roleCheck.payload.role,
    requesterID: requester._id,
    requesterName: requester.name,
    patientID,
    status: 'Pending'
    });
    return NextResponse.json({
        message: 'Request sent successfully',
        requestID: newRequest._id
        });
}