import dbConnect from '../../../../../../lib/db';
import Patient from '../../../../../../lib/models/Patient';
import LinkRequest from '../../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../../lib/auth';

export async function DELETE(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    const {requestID} = await params;

    const mePatient = await Patient.findOne({user: roleCheck.payload.sub}).select('profileId');
    if (!mePatient) return NextResponse.json(
        {error: 'Patient profile not found'}, {status: 404}
    );

    const request = await LinkRequest.findById(requestID);
    if (!request) {
        return NextResponse.json(
            {message: 'Request not found'}, {status: 404}
        );
    }
    
    if (String(request.patient) !== String(mePatient.profileId)) {
        return NextResponse.json(
            {message: 'Forbidden'}, {status: 403}
        );
    }

    if (request.status === 'Accepted') {
        return NextResponse.json(
            {message:'Already accepted'}, {status: 409}
        );
    }

    await LinkRequest.findByIdAndDelete(requestID);
    return NextResponse.json(
        {message: 'Request rejected successfully'}, {status: 200}
    );
}
