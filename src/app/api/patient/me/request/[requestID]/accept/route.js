import dbConnect from '../../../../../../../lib/db';
import Patient from '../../../../../../../lib/models/Patient';
import Doctor from '../../../../../../../lib/models/Doctor';
import FamilyMember from '../../../../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../../../lib/auth';

export async function PUT(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const {requestID} = params;
        const request = await LinkRequest.findById(requestID);
        if (!request) {
            return NextResponse.json(
                {message: 'Request not found'},
                {status: 404}
            );
        }
        if (String(request.patientID) !== String(roleCheck.payload._id)) {
            return NextResponse.json(
                {message: 'Forbidden'},
                {status: 403}
            );
        }
        request.status = 'Accepted';
        await request.save();
        if (request.requesterRole=='Doctor') {
            await Patient.findByIdAndUpdate(
                request.patientID,
                {$addToSet: {doctorID: request.requesterID}}
            );
            await Doctor.findByIdAndUpdate(
                request.requesterID,
                {$addToSet: {patientID: request.patientID}}
            );
        } else if (request.requesterRole=='Family Member') {
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
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Accepting request failed', details: err.message },
            {status: 500}
        );
    }
}