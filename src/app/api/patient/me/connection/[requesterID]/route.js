import dbConnect from '../../../../../lib/db';
import Patient from '../../../../../lib/models/Patient';
import LinkRequest from '../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../lib/auth';

export async function DELETE(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    const {requesterID} = await params;
    if (!requesterID) {
        return NextResponse.json({ error: 'Missing requesterID' }, { status: 400 });
    }

    const patient = await Patient.findOne({user: roleCheck.payload.sub}).select('profileId doctorID familyID');
    if (!patient) return NextResponse.json(
        {error: 'Patient profile not found'}, {status: 404}
    );

    let removed = false;
    //remove from doctorID if exists
    if (patient.doctorID.includes(requesterID)) {
        patient.doctorID = patient.doctorID.filter(id => id !== requesterID);
        removed = true;
    }
    //remove from familyID if exists
    if (patient.familyID.includes(requesterID)) {
        patient.familyID = patient.familyID.filter(id => id !== requesterID);
        removed = true;
    }

    if (!removed) {
        return NextResponse.json(
            {message: 'Connection not found'}, {status: 404}
        );
    }
    
    await patient.save()

    //delete accepted link request
    await LinkRequest.deleteOne({
        patient: patient.profileId,
        requesterUser: requesterID,
        status: 'Accepted'
    });

    return NextResponse.json(
        { message: 'Connection and accepted link request removed successfully' },
        { status: 200 }
    );
}
