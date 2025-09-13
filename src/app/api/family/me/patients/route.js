// src/app/api/family/me/patients/route.js
import dbConnect from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../lib/auth';
import FamilyMember from '../../../../lib/models/FamilyMember';
import Patient from '../../../../lib/models/Patient';

export async function GET(req) {
  await dbConnect();
  const { payload, error } = requireRole(req, ['Family Member']);
  if (error) return error;

  const family = await FamilyMember.findOne({ user: payload.sub }).select('_id');
  if (!family) {
    return NextResponse.json({ error: 'Family profile not found' }, { status: 404 });
  }

  const patients = await Patient.find({ familyID: family._id })
    .select('_id name dob sex yearOfDiag typeOfDiag');

  return NextResponse.json({ patients }, { status: 200 });
}
