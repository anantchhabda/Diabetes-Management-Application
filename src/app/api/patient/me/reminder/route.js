import dbConnect from "../../../../lib/db";
import Reminder from "../../../../lib/models/Reminder";
import Patient from "../../../../lib/models/Patient";
import PushSubscription from "../../../../lib/models/pushSubscription";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";

function todayYMD(tz) {
  const d = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
  return d.toISOString().slice(0, 10);
}

async function ensureDefaultReminders(patientID) {
  const sub = await PushSubscription.findOne({ patientID, enabled: true })
    .sort({ updatedAt: -1 })
    .lean();
  const tz = sub?.timezone || "Australia/Perth";
  const start = todayYMD(tz);
  const dow = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
  const delta = (1 - dow.getDay() + 7) % 7; // next Monday
  const nextMon = new Date(dow);
  nextMon.setDate(dow.getDate() + delta);
  const nextMonYMD = new Date(nextMon).toISOString().slice(0, 10);

  const defaults = [
    {
      name: "Remember to check your sugar and log it :)",
      interval: "Daily",
      time: "10:00",
      startDate: start,
    },
    {
      name: "Remember to check your sugar and log it :)",
      interval: "Daily",
      time: "18:00",
      startDate: start,
    },
    {
      name: "Take care of your food, eyes and teeth :)",
      interval: "Weekly",
      time: "09:00",
      startDate: nextMonYMD,
    },
  ];

  for (const def of defaults) {
    await Reminder.updateOne(
      {
        patientID,
        name: def.name,
        time: def.time,
        interval: def.interval,
        system: true,
      },
      { $setOnInsert: { ...def, patientID, timezone: tz, system: true } },
      { upsert: true }
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
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );

    await ensureDefaultReminders(patient.profileId);
    let reminders = await Reminder.find({ patientID: patient.profileId }).sort({
      createdAt: 1,
    });

    // monthly rolling logic
    const now = new Date();
    for (let r of reminders) {
      if (r.interval === "Monthly") {
        const [h, m] = r.time.split(":").map(Number);
        let [y, mo, d] = r.startDate.split("-").map(Number);
        let next = new Date(y, mo - 1, d, h, m);
        while (next <= now) {
          mo++;
          if (mo > 12) {
            mo = 1;
            y++;
          }
          next = new Date(y, mo - 1, d, h, m);
        }
        r.startDate = `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(
          2,
          "0"
        )}`;
        await r.save();
      }
    }
    return NextResponse.json({ reminders }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Viewing reminders failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  const roleCheck = requireRole(req, ["Patient"]);
  if (roleCheck.error) return roleCheck.error;

  try {
    const patient = await Patient.findOne({
      user: roleCheck.payload.sub,
    }).select("profileId");
    if (!patient)
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );

    const { name, date, time, interval, timezone } = await req.json();
    if (!name || !date || !time || !interval)
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );

    const reminder = await Reminder.create({
      patientID: patient.profileId,
      name,
      startDate: date,
      time,
      interval,
      timezone: timezone || "Australia/Perth",
    });

    return NextResponse.json(
      {
        message: "Reminder created successfully",
        reminderID: reminder._id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Creating reminder failed", details: err.message },
      { status: 500 }
    );
  }
}
