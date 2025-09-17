import dbConnect from '../../../../lib/db';
import Patient from '../../../../lib/models/Patient';
import Doctor from '../../../../lib/models/Doctor';
import FamilyMember from '../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../../lib/auth';
import {requireRole} from '../../../../lib/auth';

export async function PUT(req, {params}) {
    await dbConnect();
    const {payload, error} = requireAuth(req);
    if (error) return error;
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    const {requestID} = params;
    const request = await LinkRequest.findById(requestID);
    if (!request) {
        return NextResponse.json(
            {message: 'Request not found'},
            {status: 404}
        );
    }
    if (String(request.patientID) !== String(payload._id)) {
        return NextResponse.json(
            {message: 'Forbidden'},
            {status: 403}
        );
    }
    request.status = 'Accepted';
    await request.save();
    if (request.requesterType=='Doctor') {
        await Patient.findByIdAndUpdate(
            request.patientID,
            {$addToSet: {doctorID: request.requesterID}}
        );
        await Doctor.findByIdAndUpdate(
            request.requesterID,
            {$addToSet: {patientID: request.patientID}}
        );
    } else if (request.requesterType=='Family Member') {
        await Patient.findByIdAndUpdate(
            request.patientID,
            {$addToSet: {familyID: request.requesterID}}
        );
        await FamilyMember.findByIdAndUpdate(
            request.requesterID,
            {$addToSet: {patientID: request.patientID}}
        );
    }
    return NextResponse.json(
        {message: 'Request accepted successfully'}
    );
}