// src/app/api/family/me/patients/route.js
import dbConnect from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../lib/auth';
import FamilyMember from '../../../../lib/models/FamilyMember';
import Patient from '../../../../lib/models/Patient';
import LinkRequest from '../../../../lib/models/LinkRequest';

export async function GET(req) {
  await dbConnect();
  const { payload, error } = requireRole(req, ['Family Member']);
  if (error) return error;

  const family = await FamilyMember.findOne({ user: payload.sub }).select('profileId');
  if (!family) {
    return NextResponse.json({ error: 'Family profile not found' }, { status: 404 });
  }

  // Fetch patients linked to this family member
  const patients = await Patient.find({ familyID: family.profileId })
    .select('profileId name dob sex yearOfDiag typeOfDiag');

  // Fetch link requests sent by this doctor
  const requests = await LinkRequest
    .find({requesterUser: family.profileId})
    .select('_id patient patientName status');

  return NextResponse.json({ patients, requests }, { status: 200 });
}
