import dbConnect from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../lib/auth';
import Doctor from '../../../../lib/models/Doctor';
import Patient from '../../../../lib/models/Patient';
import LinkRequest from '../../../../lib/models/LinkRequest';

export async function GET(req) {
  await dbConnect();
  const { payload, error } = requireRole(req, ['Doctor']);
  if (error) return error;

  const doctor = await Doctor.findOne({ user: payload.sub }).select('profileId');
  if (!doctor) {
    return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
  }
2
  // Fetch patients linked to this doctor
  const patients = await Patient.find({ doctorID: doctor.profileId })
    .select('profileId name dob sex yearOfDiag typeOfDiag');
    
  // Fetch link requests sent by this doctor
  const requests = await LinkRequest.find({
      requesterUser: doctor.profileId,
      status: 'Pending'
    })
    .select('_id patient patientName status');

  return NextResponse.json({ patients, requests }, { status: 200 });
}
  