import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import PushSubscription from "../../../lib/models/pushSubscription";
import Patient from "../../../lib/models/Patient";
import { verifyAuth } from "../../../lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    const user = await verifyAuth(authHeader);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    //
    const patient = await Patient.findOne({ user: user.sub });
    if (!patient) {
      return NextResponse.json(
        { ok: false, error: "No patient profile found" },
        { status: 404 }
      );
    }

    const patientID = patient.profileId;

    const existing = await PushSubscription.findOne({
      endpoint: body.endpoint,
    });
    if (existing) {
      existing.keys = body.keys;
      existing.enabled = true;
      existing.patientID = patientID;
      await existing.save();
    } else {
      await PushSubscription.create({
        ...body,
        patientID,
        enabled: true,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DMA] subscribe error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
