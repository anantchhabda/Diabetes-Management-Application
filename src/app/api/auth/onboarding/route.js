import dbConnect from "../../../lib/db";
import User from "../../../lib/models/User";
import Patient from "../../../lib/models/Patient";
import Doctor from "../../../lib/models/Doctor";
import FamilyMember from "../../../lib/models/FamilyMember";
import { NextResponse } from "next/server";
import { requireAuth, signJwt } from "../../../lib/auth";

export async function POST(req) {
  await dbConnect();

  // Auth
  const { payload, error } = requireAuth(req);
  if (error) return error;

  const user = await User.findById(payload.sub);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Already finished onboarding
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

  if (!isAllowed) {
    return NextResponse.json(
      { message: "Unauthorized or access expired" },
      { status: 401 }
    );
  }

  if (!user.profileId) {
    return NextResponse.json({ error: "Invalid profileId" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Small helpers
    const s = (v) => (typeof v === "string" ? v.trim() : v);
    let created;

    if (user.role === "Patient") {
      const name = s(body.name);
      const dob = s(body.dob);
      const sex = s(body.sex);
      const address = s(body.address);
      // OPTIONAL now:
      const yearOfDiag =
        typeof body.yearOfDiag === "number" && Number.isFinite(body.yearOfDiag)
          ? body.yearOfDiag
          : undefined;
      const typeOfDiag = s(body.typeOfDiag) || undefined;

      // Required ONLY for core fields
      if (!name || !dob || !sex || !address) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }

      // Build doc with optionals only if provided
      const doc = {
        profileId: user.profileId,
        user: user._id,
        name,
        dob: new Date(dob),
        sex,
        address,
      };
      if (yearOfDiag !== undefined) doc.yearOfDiag = yearOfDiag;
      if (typeOfDiag) doc.typeOfDiag = typeOfDiag;

      created = await Patient.create(doc);
    } else if (user.role === "Doctor") {
      const name = s(body.name);
      const dob = s(body.dob);
      const clinicName = s(body.clinicName);
      const clinicAddress = s(body.clinicAddress);

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
    } else if (user.role === "Family Member") {
      const name = s(body.name);
      const dob = s(body.dob);
      const address = s(body.address);

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
    } else {
      return NextResponse.json({ error: "Unsupported role" }, { status: 400 });
    }

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
