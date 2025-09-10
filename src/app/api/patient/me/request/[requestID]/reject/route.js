import dbConnect from '../../../../lib/db';
import LinkRequest from '../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../../lib/auth';
import {requireRole} from '../../../../lib/auth';

export async function DELETE(req, {params}) {
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
    await LinkRequest.findByIdAndDelete(requestID);
    return NextResponse.json(
        {message: 'Request rejected successfully'}
    );
}