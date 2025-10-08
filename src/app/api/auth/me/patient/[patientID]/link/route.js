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

export async function DELETE(req, { params }) {
    await dbConnect();
    const { payload, error } = requireRole(req, ['Doctor', 'Family Member']);
    if (error) return error;

    const {patientID} = await params;
    const patient = await Patient.findOne({ profileId: patientID }).select('doctorID');
    if (!patient) {
        return NextResponse.json({ error: 'Patient not found'}, {status: 404});
    }

    if (payload.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: payload.sub }).select('profileId');
        if (!doctor) {
            return NextResponse.json({ error: 'Doctor/Family Memver profile not found'}, {status: 404});
        }
        //Only unlink if this doctor is linked to this patient
        if (String(patient.doctorID) !== String(doctor.profileId)) {
            return NextResponse.json({ error: 'You are not linked to this patient'}, {status: 403});
        }
        //Unlink by deleting doctorID
        patient.doctorID = null;
        await patient.save();
        return NextResponse.json({ message: 'Unlinked succesfully'}, {status: 200});
    }

    if (payload.role === 'Family Member') {
        const family = await FamilyMember.findOne({ user: payload.sub }).select('profileId');
        if (!family) {
            return NextResponse.json({ error: 'Family profile not found'}, {status: 404});
        }
        //Only unlink if this doctor is linked to this patient
        if (String(patient.familyID) !== String(family.profileId)) {
            return NextResponse.json({ error: 'You are not linked to this patient'}, {status: 403});
        }
    
        //Unlink by deleting familyID
        patient.familyID = null;
        await patient.save();
        return NextResponse.json({ message: 'Unlinked succesfully'}, {status: 200});
    }
}
