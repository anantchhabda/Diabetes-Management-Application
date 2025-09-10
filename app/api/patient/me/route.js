export const runtime = 'nodejs';

import { dbConnect } from '../../../../lib/db.js';
import Patient from '../../../../lib/models/Patient.js';
import { NextResponse } from 'next/server';
import { requireRole } from '../../../../lib/auth.js';

export async function GET(req) {
  await dbConnect();
  const {payload, error} = requireRole(req, ['Patient']);
  if (error) return error;
  if (payload.scope !== 'auth') {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }


  //fetch patient's profile and include user basics (phone + role)
  const me = await Patient.findOne({ user: payload.sub })
    .populate("user", "phone role"); // show phone from User

  if (!me) {
    return Reponse.json({error: "Patient profile missing"}, {status: 404});
  }
  return Response.json(me, {status: 200});
}

//PUT /api/patient/me
export async function PUT(req) {
  await dbConnect();
  const {payload, error} = requireRole(req, ["Patient"]);
  if (error) return error;
  if (payload.scope !== 'auth') {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    //Read JSON body once
    const body = (await req.json()) || {};
  
    // Only allow fields you intend to update; avoid userId/role changes here
    const allowed = ["name", "dob", "sex", "address", "yearOfDiag", "typeOfDiag"];

    const update = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, k)) {
        update[k] = body[k];
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    if ('dob' in update && update.dob) {
      update.dob = new Date(update.dob);
    }

    const updated = await Patient.findOneAndUpdate(
      { user: payload.sub },
      { $set: update },
      { new: true, runValidators: true }
    )
      .populate('user', 'phone role')
      .lean();

    if (!updated) {
      return NextResponse.json({ error: 'Patient profile missing' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    if (err?.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
