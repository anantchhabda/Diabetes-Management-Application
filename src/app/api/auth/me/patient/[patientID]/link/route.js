import dbConnect from '../../../../../../lib/db';
import Patient from '../../../../../../lib/models/Patient';
import Doctor from '../../../../../../lib/models/Doctor';
import FamilyMember from '../../../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../../lib/auth';

export async function GET(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Doctor', 'Family Member']);
    if (roleCheck.error) return roleCheck.error;
        
    const {patientID} = await params;     //Patient._id
    const patient = await Patient.findOne({profileId: patientID}).select('profileId name');
    if (!patient) {
       return NextResponse.json({message: 'Patient not found'}, {status: 404});
    }
    return NextResponse.json({patient}, {status: 200});
}
        

export async function POST(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Doctor', 'Family Member']);
    if (roleCheck.error) return roleCheck.error;

    try {
        const {patientID} = await params;     //Patient._id
        const patient = await Patient.findOne({profileId: patientID}).select('profileId name');
        if (!patient) {
            return NextResponse.json(
            {message: 'Patient not found'}, {status: 404}
            );
        }

        let requester;
        if (roleCheck.payload.role === 'Doctor') {
            requester = await Doctor.findOne({user: roleCheck.payload.sub}).select('profileId name');
        } else {
            requester = await FamilyMember.findOne({user: roleCheck.payload.sub}).select('profileId name');
        }
        if (!requester) return NextResponse.json(
            {message:'Requester not found'}, {status: 404}
        );
        
        //If request accepted, return status
        const accepted = await LinkRequest.findOne({
            patient: patient.profileId,
            requesterUser: requester.profileId,
            requesterRole: roleCheck.payload.role,
            status: 'Accepted'
        }).select('_id');

        if (accepted) {
            return NextResponse.json(
                {message: 'Already linked',
                status: 'Accepted',
                requestId: String(accepted._id)},
                {status: 200}   
            );
        }

        const existing = await LinkRequest.findOne({
            patient: patient.profileId,
            requesterUser: requester.profileId,
            requesterRole: roleCheck.payload.role,
            status: 'Pending'
        }).select('_id');
        if (existing) {
            return NextResponse.json(
                {message: 'Request already pending'},
                {status: 409}
            );
        }

        const newRequest = await LinkRequest.create({
            patient: patient.profileId,
            patientName: patient.name,
            requesterUser: requester.profileId,
            requesterRole: roleCheck.payload.role,
            requesterName: requester.name,
            status: 'Pending'
        });

        return NextResponse.json(
            {message: 'Request sent successfully',
            status: 'Pending',
            requestId: newRequest._id},
            {status: 200}
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Sending request failed', details: err.message},
            {status: 500}
        );
    }
}

//delete current connection
export async function DELETE(req, { params }) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Doctor', 'Family Member']);
    if (roleCheck.error) return roleCheck.error;
    
    const {patientID} = await params;
    if (!patientID) {
        return NextResponse.json({ error: 'Missing patientID' }, { status: 400 });
    }
    
    const patient = await Patient.findOne({profileId: patientID}).select('profileId doctorID familyID');
    if (!patient) return NextResponse.json(
        {error: 'Patient profile not found'}, {status: 404}
    );
    
    let removed = false;
    let requester;
    if (roleCheck.payload.role === 'Doctor') {
        requester = await Doctor.findOne({user: roleCheck.payload.sub}).select('profileId');
    } else {
        requester = await FamilyMember.findOne({user: roleCheck.payload.sub}).select('profileId');
    }
    //remove from doctorID if exists
    if (patient.doctorID.includes(requester.profileId)) {
        patient.doctorID = patient.doctorID.filter(id => id !== requester.profileId);
        removed = true;
    }
    //remove from familyID if exists
    if (patient.familyID.includes(requester.profileId)) {
        patient.familyID = patient.familyID.filter(id => id !== requester.profileId);
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
        requesterUser: requester.profileId,
        status: 'Accepted'
    });
   
    return NextResponse.json(
        { message: 'Connection and accepted link request removed successfully' },
        { status: 200 }
    );
}
