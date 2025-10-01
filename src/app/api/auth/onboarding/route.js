import dbConnect from "../../../lib/db";
import User from "../../../lib/models/User";
import Patient from "../../../lib/models/Patient";
import Doctor from "../../../lib/models/Doctor";
import FamilyMember from "../../../lib/models/FamilyMember";
import { NextResponse } from "next/server";
import { requireAuth, signJwt } from "../../../lib/auth";

export async function POST(req) {
  await dbConnect();
  const { payload, error } = requireAuth(req);
  if (error) return error;

  const user = await User.findById(payload.sub);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // 1) If already completed, short-circuit with 409 (your intended behavior)
  if (user.onboardingComplete) {
    return NextResponse.json(
      {
        message: "Onboarding completed",
        role: user.role,
        profileId: user.profileId,
      },
      { status: 409 }
    );
  }

  const isAllowed =
    payload.scope === "onboarding" ||
    (payload.scope === "auth" && !user.onboardingComplete);

  if (!isAllowed)
    return NextResponse.json(
      { message: "Unauthorized or access expired" },
      { status: 401 }
    );

  if (!user.profileId) {
    return NextResponse.json({ error: "Invalid profileId" }, { status: 400 });
  }

  try {
    const body = await req.json();
    let created; //Capture the created profile doc

    if (user.role == "Patient") {
      const { name, dob, sex, address, yearOfDiag, typeOfDiag } = body;
      if (!name || !dob || !sex || !address || !yearOfDiag || !typeOfDiag) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }
      created = await Patient.create({
        profileId: user.profileId,
        user: user._id,
        name,
        dob: new Date(dob),
        sex,
        address,
        yearOfDiag,
        typeOfDiag,
      });
    } else if (user.role == "Doctor") {
      const { name, dob, clinicName, clinicAddress } = body;
      if (!name || !dob || !clinicName || !clinicAddress) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }
      created = await Doctor.create({
        profileId: user.profileId,
        user: user._id,
        name,
        dob: new Date(dob),
        clinicName,
        clinicAddress,
      });
    } else if (user.role == "Family Member") {
      const { name, dob, address } = body;
      if (!name || !dob || !address) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }
      created = await FamilyMember.create({
        profileId: user.profileId,
        user: user._id,
        name,
        dob: new Date(dob),
        address,
      });
    }

    // Only flip the flag if the profile was actually created
    if (!created?.profileId) {
      return NextResponse.json(
        { error: "Profile creation failed" },
        { status: 500 }
      );
    }

    user.onboardingComplete = true;
    await user.save();

    const authToken = signJwt({
      sub: user._id,
      role: user.role,
      scope: "auth",
      profileId: user.profileId,
    });

    return NextResponse.json(
      {
        message: "Onboarding complete",
        role: user.role,
        profileId: String(created.profileId),
        authToken,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
  }
}
