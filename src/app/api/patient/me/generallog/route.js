import dbConnect from "../../../../lib/db";
import GeneralLog from "../../../../lib/models/GeneralLog";
import Patient from "../../../../lib/models/Patient";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";

export async function POST(req) {
  if (req.headers.get("x-read-only") === "1") {
    return NextResponse.json({ message: "Read-only view" }, { status: 403 });
  }

  await dbConnect();
  const roleCheck = requireRole(req, ["Patient"]);
  if (roleCheck.error) return roleCheck.error;

  try {
    const { comment, date } = await req.json();
    if (!comment || !date)
      return NextResponse.json(
        { error: "Comment and date required" },
        { status: 400 }
      );

    const patient = await Patient.findOne({
      user: roleCheck.payload.sub,
    }).select("profileId");
    if (!patient)
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );

    const log = await GeneralLog.create({
      patient: patient.profileId,
      comment,
      date: new Date(date),
    });

    return NextResponse.json(
      { message: "General log created", log },
      { status: 200 }
    );
  } catch (err) {
    console.error("[DMA] POST general log error:", err);
    return NextResponse.json(
      { error: "General log create failed" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await dbConnect();
  const roleCheck = requireRole(req, ["Patient"]);
  if (roleCheck.error) return roleCheck.error;

  try {
    const patient = await Patient.findOne({
      user: roleCheck.payload.sub,
    }).select("profileId");
    if (!patient)
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    const date = new URL(req.url).searchParams.get("date");
    if (!date)
      return NextResponse.json({ error: "Date required" }, { status: 400 });

    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const logs = await GeneralLog.find({
      patient: patient.profileId,
      date: { $gte: start, $lt: end },
    });

    return NextResponse.json({ logs }, { status: 200 });
  } catch (err) {
    console.error("[DMA] GET general log error:", err);
    return NextResponse.json(
      { error: "View general log failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  if (req.headers.get("x-read-only") === "1") {
    return NextResponse.json({ message: "Read-only view" }, { status: 403 });
  }

  await dbConnect();
  const roleCheck = requireRole(req, ["Patient"]);
  if (roleCheck.error) return roleCheck.error;

  try {
    const patient = await Patient.findOne({
      user: roleCheck.payload.sub,
    }).select("profileId");
    if (!patient)
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    const date = new URL(req.url).searchParams.get("date");
    const { comment } = await req.json();
    if (!date)
      return NextResponse.json({ error: "Date required" }, { status: 400 });

    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const updated = await GeneralLog.findOneAndUpdate(
      { patient: patient.profileId, date: { $gte: start, $lt: end } },
      comment ? { $set: { comment } } : {},
      { new: true, upsert: false }
    );

    if (!updated)
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    return NextResponse.json(
      { message: "Updated", log: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("[DMA] PATCH general log error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
