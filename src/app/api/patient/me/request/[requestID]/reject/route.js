import dbConnect from '../../../../../../../lib/db';
import LinkRequest from '../../../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../../../lib/auth';

export async function DELETE(req, {params}) {
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
        await LinkRequest.findByIdAndDelete(requestID);
        return NextResponse.json(
            {message: 'Request rejected successfully'}
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Rejecting request failed', details: err.message },
            {status: 500}
        );
    }
}