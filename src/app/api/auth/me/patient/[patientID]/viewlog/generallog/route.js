import dbConnect from "../../../../../../../lib/db";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../../../../lib/auth";
import Patient from "../../../../../../../lib/models/Patient";
import Doctor from "../../../../../../../lib/models/Doctor";
import FamilyMember from "../../../../../../../lib/models/FamilyMember";
import GeneralLog from "../../../../../../../lib/models/GeneralLog";
import LinkRequest from "../../../../../../../lib/models/LinkRequest";

export async function GET(req, ctx) {
  await dbConnect();

  const { payload, error } = requireRole(req, ["Doctor", "Family Member"]);
  if (error) return error;

  const { patientID } = await ctx.params;
  if (!patientID) {
    return NextResponse.json({ error: "Missing patientID" }, { status: 400 });
  }

  const patient = await Patient.findOne({ profileId: patientID }).select(
    "profileId doctorID familyID"
  );
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  let requesterProfileId = null;
  if (payload.role === "Doctor") {
    const me = await Doctor.findOne({ user: payload.sub }).select("profileId");
    requesterProfileId = me?.profileId || null;
  } else {
    const me = await FamilyMember.findOne({ user: payload.sub }).select(
      "profileId"
    );
    requesterProfileId = me?.profileId || null;
  }
  if (!requesterProfileId) {
    return NextResponse.json({ error: "Requester not found" }, { status: 404 });
  }

  const accepted = await LinkRequest.findOne({
    patient: patient.profileId,
    requesterUser: requesterProfileId,
    requesterRole: payload.role,
    status: "Accepted",
  }).select("_id");

  const arrayOK =
    payload.role === "Doctor"
      ? Array.isArray(patient.doctorID) &&
        patient.doctorID.includes(requesterProfileId)
      : Array.isArray(patient.familyID) &&
        patient.familyID.includes(requesterProfileId);

  if (!accepted && !arrayOK) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  const start = new Date(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const logs = await GeneralLog.find({
    patient: patient.profileId,
    date: { $gte: start, $lt: end },
  }).select("_id comment date");

  return NextResponse.json({ logs }, { status: 200 });
}
