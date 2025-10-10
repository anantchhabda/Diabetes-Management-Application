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

    const patient = await Patient.findOne({ user: user.sub });
    if (!patient) {
      return NextResponse.json(
        { ok: false, error: "No patient profile found" },
        { status: 404 }
      );
    }

    const patientID = patient.profileId;

    // one active subscription per user
    const { endpoint, keys, deviceLabel, userAgent } = body;

    // match any existing user by endpoint
    let sub = await PushSubscription.findOne({ endpoint });

    // if not match by patientId and useragent
    if (!sub) {
      sub = await PushSubscription.findOne({ patientID, userAgent });
    }

    if (sub) {
      // update and re-enable
      sub.keys = keys;
      sub.enabled = true;
      sub.endpoint = endpoint;
      sub.deviceLabel = deviceLabel;
      sub.userAgent = userAgent;
      sub.patientID = patientID;
      await sub.save();
    } else {
      // create new one cleanly
      await PushSubscription.create({
        endpoint,
        keys,
        enabled: true,
        patientID,
        deviceLabel,
        userAgent,
      });
    }

    //
    await PushSubscription.deleteMany({ patientID, enabled: false });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DMA] subscribe error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
