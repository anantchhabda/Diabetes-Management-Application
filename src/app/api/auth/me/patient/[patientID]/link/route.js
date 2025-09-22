<<<<<<< HEAD
import dbConnect from '../../../../../../lib/db';
import Patient from '../../../../../../lib/models/Patient';
import Doctor from '../../../../../../lib/models/Doctor';
import FamilyMember from '../../../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../../lib/auth';

export async function POST(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Doctor', 'Family Member']);
    if (roleCheck.error) return roleCheck.error;

    try {
        const {patientID} = await params;     //Patient._id
        const patient = await Patient.findById(patientID).select('_id');
        if (!patient) {
            return NextResponse.json(
            {message: 'Patient not found'}, {status: 404}
            );
        }

        let requester;
        if (roleCheck.payload.role === 'Doctor') {
            requester = await Doctor.findOne({user: roleCheck.payload.sub}).select('name');
        } else {
            requester = await FamilyMember.findOne({user: roleCheck.payload.sub}).select('name');
        }
        if (!requester) return NextResponse.json(
            {message:'Requester not found'}, {status: 404}
        );
        
        //If request accepted, return status
        const accepted = await LinkRequest.findOne({
            patient: patient._id,
            requesterUser: roleCheck.payload.sub,
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
            patient: patient._id,
            requesterUser: roleCheck.payload.sub,
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
            patient: patient._id,
            requesterUser: roleCheck.payload.sub,
            requesterRole: roleCheck.payload.role,
            requesterName: requester.name,
            status: 'Pending'
        });

        return NextResponse.json(
            {message: 'Request sent successfully',
            status: 'Pending',
            requestID: newRequest._id},
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
=======
import dbConnect from '../../../../lib/db';
import Doctor from '../../../../lib/models/Doctor';
import FamilyMember from '../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../../lib/auth';
import {requireRole} from '../../../../lib/auth';

export async function POST(req, {params}) {
    await dbConnect();
    const {payload, error} = requireAuth(req);
    if (error) return error;
    const roleCheck = requireRole(req, ['Doctor', 'FamilyMember']);
    if (roleCheck.error) return roleCheck.error;
    const {patientID} = params;
    let requester;
    if (roleCheck.payload.role=='Doctor') {
        requester = await Doctor.findOne({userID: roleCheck.payload._id});
    } else {
        requester = await FamilyMember.findOne({userID: roleCheck.payload._id});
    }
    if (!requester) {
        return NextResponse.json(
            {message: 'Requester not found'},
            {status: 404}
        );
    }
    const existingRequest = await LinkRequest.findOne({
    requesterType: roleCheck.payload.role,
    requesterID: requester._id,
    requesterName: requester.name,
    patientID,
    status: 'Pending'
    });
    if (existingRequest) {
        return NextResponse.json(
            {message: 'Request already pending'},
            {status: 200}
        );
    }
    const newRequest = await LinkRequest.create({
    requesterType: roleCheck.payload.role,
    requesterID: requester._id,
    requesterName: requester.name,
    patientID,
    status: 'Pending'
    });
    return NextResponse.json({
        message: 'Request sent successfully',
        requestID: newRequest._id
        });
}
>>>>>>> b7e8a4d999327b82f90097fa35c3e8773ee6d4e0
