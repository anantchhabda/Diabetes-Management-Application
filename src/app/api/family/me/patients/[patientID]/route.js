import dbConnect from '../../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../../lib/auth';
import FamilyMember from '../../../../../lib/models/FamilyMember';
import Patient from '../../../../../lib/models/Patient';

export async function DELETE(req, { params }) {
    await dbConnect();
    const { payload, error } = requireRole(req, ['Family Member']);
    if (error) return error;

    const {patientID} = await params;

    const family = await FamilyMember.findOne({ user: payload.sub }).select('profileId');
    if (!family) {
        return NextResponse.json({ error: 'Family profile not found'}, {status: 404});
    }

    const patient = await Patient.findOne({ profileId: patientID }).select('familyID');
    if (!patient) {
        return NextResponse.json({ error: 'Patient not found'}, {status: 404});
    }

    //Only unlink if this doctor is linked to this patient
    if (patient.familyID !== family.profileId) {
        return NextResponse.json({ error: 'You are not linked to this patient'}, {status: 403});
    }

    //Unlink by deleting familyID
    patient.familyID = null;
    await patient.save();

    return NextResponse.json({ message: 'Unlinked succesfully'}, {status: 200});
}