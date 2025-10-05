import dbConnect from '../../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../../lib/auth';
import Doctor from '../../../../../lib/models/Doctor';
import Patient from '../../../../../lib/models/Patient';

export async function DELETE(req, { params }) {
    await dbConnect();
    const { payload, error } = requireRole(req, ['Doctor']);
    if (error) return error;

    const {patientID} = await params;

    const doctor = await Doctor.findOne({ user: payload.sub }).select('profileId');
    if (!doctor) {
        return NextResponse.json({ error: 'Doctor profile not found'}, {status: 404});
    }

    const patient = await Patient.findOne({ profileId: patientID }).select('doctorID');
    if (!patient) {
        return NextResponse.json({ error: 'Patient not found'}, {status: 404});
    }

    //Only unlink if this doctor is linked to this patient
    if (patient.doctorID !== doctor.profileId) {
        return NextResponse.json({ error: 'You are not linked to this patient'}, {status: 403});
    }

    //Unlink by deleting doctorID
    patient.doctorID = null;
    await patient.save();

    return NextResponse.json({ message: 'Unlinked succesfully'}, {status: 200});
}