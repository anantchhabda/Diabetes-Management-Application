// src/app/api/auth/me/route.js
import dbConnect from "../../../lib/db";
import User from "../../../lib/models/User";
import Patient from "../../../lib/models/Patient";
import Doctor from "../../../lib/models/Doctor";
import FamilyMember from "../../../lib/models/FamilyMember";
import { NextResponse } from "next/server";
import { requireAuth } from "../../../lib/auth";

export async function GET(req) {
  await dbConnect();

  // Always authenticate via Authorization header (handled inside requireAuth)
  const { payload, error } = requireAuth(req);
  if (error) return error; // 401 JSON

  try {
    const user = await User.findById(payload.sub)
      .select("_id role phoneNumber onboardingComplete")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let profile = null;

    if (user.role === "Patient") {
      const patient = await Patient.findOne({ user: user._id })
        .select("profileId name")
        .lean();
      if (patient) {
        profile = {
          profileId: String(patient.profileId),
          name: patient.name || null,
        };
      }
    } else if (user.role === "Doctor") {
      const doctor = await Doctor.findOne({ user: user._id })
        .select("profileId name")
        .lean();
      if (doctor) {
        profile = {
          profileId: String(doctor.profileId),
          name: doctor.name || null,
        };
      }
    } else if (user.role === "Family Member") {
      const fam = await FamilyMember.findOne({ user: user._id })
        .select("profileId name")
        .lean();
      if (fam) {
        profile = {
          profileId: String(fam.profileId),
          name: fam.name || null,
        };
      }
    }

    return NextResponse.json({
      userId: String(user._id),
      role: user.role,
      phone: user.phoneNumber,
      onboardingComplete: !!user.onboardingComplete,
      profile, // { profileId, name } or null
    });
  } catch (e) {
    console.error("[/api/auth/me] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
