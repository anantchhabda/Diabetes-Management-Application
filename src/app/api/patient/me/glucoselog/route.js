import dbConnect from "../../../../lib/db";
import Patient from "../../../../lib/models/Patient";
import GlucoseLog from "../../../../lib/models/GlucoseLog";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";

export async function POST(req) {
  // Reject writes when viewing read-only
  const ro = req.headers.get("x-read-only");
  if (ro === "1") {
    return NextResponse.json(
      { message: "Read-only view: writes are disabled." },
      { status: 403 }
    );
  }

  await dbConnect();
  const roleCheck = requireRole(req, ["Patient"]);
  if (roleCheck.error) return roleCheck.error;

  try {
    const patient = await Patient.findOne({
      user: roleCheck.payload.sub,
    }).select("profileId");
    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }
    const { type, glucoseLevel, date } = await req.json();
    if (!type || !glucoseLevel || !date) {
      return NextResponse.json(
        { message: "Type, glucose level and date are required" },
        { status: 400 }
      );
    }

    const log = await GlucoseLog.create({
      patient: patient.profileId,
      type,
      glucoseLevel,
      date: new Date(date), //automatically stored at midnight of that date
    });

    return NextResponse.json(
      {
        message: "Glucose log created successfully",
        glucoseLogID: log._id,
        alert: log.flag ? "High glucose detected" : null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Logging glucose failed", details: err.message },
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
    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    if (!date)
      return NextResponse.json(
        { message: "Date is required" },
        { status: 400 }
      );

    const startDate = new Date(date);
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const logs = await GlucoseLog.find({
      patient: patient.profileId,
      date: { $gte: startDate, $lt: nextDate }, //all documents for a single day (before 00:00 of the next day)
    });
    return NextResponse.json({ logs });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Viewing glucose log failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  // Reject writes when viewing read-only
  const ro = req.headers.get("x-read-only");
  if (ro === "1") {
    return NextResponse.json(
      { message: "Read-only view: writes are disabled." },
      { status: 403 }
    );
  }

  await dbConnect();
  const roleCheck = requireRole(req, ["Patient"]);
  if (roleCheck.error) return roleCheck.error;

  try {
    const patient = await Patient.findOne({
      user: roleCheck.payload.sub,
    }).select("profileId");
    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const startDate = new Date(date);
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const { type, glucoseLevel } = await req.json();
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    if (glucoseLevel == null || glucoseLevel == "") {
      await GlucoseLog.deleteOne({
        patient: patient.profileId,
        date: { $gte: startDate, $lt: nextDate },
        type,
      });
      return NextResponse.json({ message: "Log cleared" }, { status: 200 });
    }

    const updated = await GlucoseLog.findOneAndUpdate(
      {
        patient: patient.profileId,
        type,
        date: { $gte: startDate, $lt: nextDate },
      },
      { $set: { glucoseLevel } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    const high_glucose_threshold = 10.0;
    const flag = updated.glucoseLevel > high_glucose_threshold;
    updated.flag = flag;
    await updated.save();

    return NextResponse.json(
      {
        message: "Glucose log updated",
        log: updated,
        alert: flag ? "High glucose detected" : null,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Updating glucose log failed", details: err.message },
      { status: 500 }
    );
  }
}
