import dbConnect from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../lib/auth';
import Patient from '../../../../lib/models/Patient';
import Doctor from '../../../../lib/models/Doctor';
import FamilyMember from '../../../../lib/models/FamilyMember';
import GlucoseLog from '../../../../lib/models/GlucoseLog';

export async function GET(req, { params }) {
    await dbConnect();

    // Only Doctors and Family Members can view via this route
    const {payload, error} = requireRole(req, ['Doctor', 'Family Member']);
    if (error) return error;

    const {patientId} = await params;

    // Load patient and verify linkage depending on the viewer role
    let patient =
        (await Patient.findById(patientId).select('_id doctorID familyID user')) ||
        (await Patient.findOne({user: patientId}).select('_id doctorID familyID user'));
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    if (payload.role === 'Doctor') {
        const me = await Doctor.findOne({ user: payload.sub }).select('_id');
        if (!me || String(patient.doctorID) !== String(me._id)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    } else {
        const me = await FamilyMember.findOne({ user: payload.sub }).select('_id');
        if (!me || String(patient.familyID) !== String(me._id)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    const url = new URL(req.url);
    const date = url.searchParams.get('date');
    if(!date) {
        return NextResponse.json(
            {error: 'date is required'}, {status: 400}
        );
    }

    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const logs = await GlucoseLog.find({
        patient: patient._id,
        date: { $gte: start, $lt: end }
    }).select('_id type glucoseLevel date');

    return NextResponse.json({ logs }, {status: 200});
}
