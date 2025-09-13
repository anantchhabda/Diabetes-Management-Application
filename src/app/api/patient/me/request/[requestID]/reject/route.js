import dbConnect from '../../../../../../lib/db';
import Patient from '../../../../../../lib/models/Patient';
import LinkRequest from '../../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../../lib/auth';

export async function DELETE(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    const mePatient = await Patient.findOne({user: roleCheck.payload.sub}).select('_id');
    if (!mePatient) return NextResponse.json(
        {error: 'Patient profile not found'}, {status: 404}
    );

    const {requestID} = params;
    const request = await LinkRequest.findById(requestID);
    if (!request) {
        return NextResponse.json(
            {message: 'Request not found'}, {status: 404}
        );
    }
    
    if (String(request.patientID) !== String(mePatient._id)) {
        return NextResponse.json(
            {message: 'Forbidden'}, {status: 403}
        );
    }

    await LinkRequest.findByIdAndDelete(requestID);
    return NextResponse.json(
        {message: 'Request rejected successfully'}, {status: 200}
    );
}
