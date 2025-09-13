import dbConnect from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../lib/auth';
import Doctor from '../../../../lib/models/Doctor';
import Patient from '../../../../lib/models/Patient';

export async function GET(req) {
  await dbConnect();
  const { payload, error } = requireRole(req, ['Doctor']);
  if (error) return error;

  const doctor = await Doctor.findOne({ user: payload.sub }).select('_id');
  if (!doctor) {
    return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
  }

  const patients = await Patient.find({ doctorID: doctor._id })
    .select('_id name dob sex yearOfDiag typeOfDiag');

  return NextResponse.json({ patients }, { status: 200 });
}
