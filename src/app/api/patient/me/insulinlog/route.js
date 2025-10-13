import dbConnect from "../../../../lib/db";
import Patient from "../../../../lib/models/Patient";
import InsulinLog from "../../../../lib/models/InsulinLog";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";

export async function POST(req) {
  // Block writes when viewing read-only
  if (req.headers.get("x-read-only") === "1") {
    return NextResponse.json(
      { message: "Read-only view: writes disabled." },
      { status: 403 }
    );
  }

  await dbConnect();
  const roleCheck = requireRole(req, ["Patient"]);
  if (roleCheck.error) return roleCheck.error;

  try {
    const { type, dose, date } = await req.json();
    if (!type || dose == null || dose === "" || !date) {
      return NextResponse.json(
        { message: "Type, insulin dose and date are required" },
        { status: 400 }
      );
    }

    const patient = await Patient.findOne({
      user: roleCheck.payload.sub,
    }).select("profileId");
    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    const log = await InsulinLog.create({
      patient: patient.profileId,
      type,
      dose,
      date: new Date(date),
    });

    return NextResponse.json(
      {
        message: "Insulin log created successfully",
        insulinLogID: log._id,
        log,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[DMA] POST insulin log error:", err);
    return NextResponse.json(
      { error: "Logging insulin failed", details: err.message },
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
    if (!date) {
      return NextResponse.json(
        { message: "Date is required" },
        { status: 400 }
      );
    }

    const startDate = new Date(date);
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const logs = await InsulinLog.find({
      patient: patient.profileId,
      date: { $gte: startDate, $lt: nextDate },
    }).select("_id type dose date");

    return NextResponse.json({ logs }, { status: 200 });
  } catch (err) {
    console.error("[DMA] GET insulin log error:", err);
    return NextResponse.json(
      { error: "Viewing insulin log failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  // Block writes when viewing read-only
  if (req.headers.get("x-read-only") === "1") {
    return NextResponse.json(
      { message: "Read-only view: writes disabled." },
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

    // IMPORTANT: date comes from query string (matches your log-data.js)
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const { type, dose } = await req.json();
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const startDate = new Date(date);
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Empty dose => delete entry for that type/day
    if (dose == null || dose === "") {
      const delRes = await InsulinLog.deleteOne({
        patient: patient.profileId,
        type,
        date: { $gte: startDate, $lt: nextDate },
      });
      if (delRes.deletedCount === 0) {
        return NextResponse.json({ error: "Log not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Log cleared" }, { status: 200 });
    }

    const updated = await InsulinLog.findOneAndUpdate(
      {
        patient: patient.profileId,
        type,
        date: { $gte: startDate, $lt: nextDate },
      },
      { $set: { dose } },
      { new: true }
    );

    if (!updated) {
      // If no existing record for that date/type, tell client to create (your JS does POST on 404)
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Insulin log updated", log: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("[DMA] PATCH insulin log error:", err);
    return NextResponse.json(
      { error: "Updating insulin log failed", details: err.message },
      { status: 500 }
    );
  }
}
