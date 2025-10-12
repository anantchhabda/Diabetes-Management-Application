import dbConnect from '../../../../../../lib/db';
import Doctor from '../../../../../../lib/models/Doctor'
import Patient from '../../../../../../lib/models/Patient';
import LinkRequest from '../../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../../lib/auth';
import FamilyMember from '../../../../../../lib/models/FamilyMember';

export async function PUT(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    const {requestID} = await params;
    const request = await LinkRequest.findById(requestID)
        .select('_id patient requesterRole requesterUser status');
    
    if (!request) return NextResponse.json(
        {message: 'Request not found'},
        {status: 404}
    );

    const mePatient = await Patient.findOne({user: roleCheck.payload.sub}).select('profileId doctorID familyID user');
    if (!mePatient) return NextResponse.json(
        {error: 'Patient profile not found'}, {status: 404}
    );
        
    if (String(request.patient) !== String(mePatient.profileId)) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (request.status === 'Accepted') return NextResponse.json(
        {message: 'Already accepted'}, {status: 200}
    );

    if (request.requesterRole === 'Doctor') {
        const d = await Doctor.findOne({profileId: request.requesterUser}).select('profileId');
        if(!d) return NextResponse.json(
            {error: 'Doctor profile not found'}, {status: 404});
        mePatient.doctorID = d.profileId;
    } else if (request.requesterRole === 'Family Member') {
        const f = await FamilyMember.findOne({profileId: request.requesterUser}).select('profileId');
        if (!f) return NextResponse.json(
            {error: ' Family profile not found'}, {status: 404});
        mePatient.familyID = f.profileId;
    } else {
        return NextResponse.json(
            {error: 'Unknown requesterRole'}, {status: 400}
        );
    }

    await mePatient.save();
    request.status = 'Accepted';
    await request.save();

    return NextResponse.json(
        {message: 'Request accepted successfully'}, {status: 200}
    );
}
