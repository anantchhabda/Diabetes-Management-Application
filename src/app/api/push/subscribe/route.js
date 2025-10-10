// src/app/api/push/subscribe/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import PushSubscription from "../../../lib/models/pushSubscription"; // match actual filename
import Patient from "../../../lib/models/Patient";
import { verifyJwt } from "../../../lib/auth";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // authenticate via your existing helper (reads Authorization header internally)
    const auth = verifyJwt(req);
    if (!auth) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // find patient for this user
    const patient = await Patient.findOne({ user: auth.sub }).select(
      "profileId"
    );
    if (!patient) {
      return NextResponse.json(
        { ok: false, error: "No patient profile found" },
        { status: 404 }
      );
    }
    const patientID = patient.profileId;

    const { endpoint, keys, deviceLabel, userAgent } = body || {};
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { ok: false, error: "Invalid subscription payload" },
        { status: 400 }
      );
    }

    // ---- Single-subscription-per-patient strategy ----
    // Keep exactly ONE doc per patientID; newest device overwrites the previous
    const byEndpoint = await PushSubscription.findOne({ endpoint }).lean();
    const existingForPatient = await PushSubscription.find({ patientID }).sort({
      updatedAt: -1,
    });

    let primary = existingForPatient[0] || null;

    // If another doc already has this endpoint (from older/stale), remove it to avoid unique conflicts
    if (
      byEndpoint &&
      (!primary || String(byEndpoint._id) !== String(primary._id))
    ) {
      await PushSubscription.deleteOne({ _id: byEndpoint._id });
    }

    if (primary) {
      // Update the primary with the latest device and endpoint
      primary.endpoint = endpoint;
      primary.keys = keys;
      primary.enabled = true;
      primary.deviceLabel = deviceLabel;
      primary.userAgent = userAgent;
      primary.patientID = patientID;
      await primary.save();

      // Remove any other duplicates for this patient to enforce single doc
      const otherIds = existingForPatient
        .filter((d) => String(d._id) !== String(primary._id))
        .map((d) => d._id);
      if (otherIds.length) {
        await PushSubscription.deleteMany({ _id: { $in: otherIds } });
      }
    } else {
      // No existing subscription for this patient — create fresh
      const created = await PushSubscription.create({
        endpoint,
        keys,
        enabled: true,
        deviceLabel,
        userAgent,
        patientID,
      });
      primary = created;
    }

    // Optional: belt & braces cleanup of disabled leftovers
    await PushSubscription.deleteMany({
      patientID,
      enabled: false,
      _id: { $ne: primary._id },
    });

    return NextResponse.json(
      { ok: true, id: primary._id.toString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[DMA] subscribe error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
