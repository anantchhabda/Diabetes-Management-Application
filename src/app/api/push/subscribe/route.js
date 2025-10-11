import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import PushSubscription from "../../../lib/models/pushSubscription";
import Patient from "../../../lib/models/Patient";
import { verifyJwt } from "../../../lib/auth";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // authenticate
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

    // Single active subscription per patient: "latest device wins"
    // 1) Find any subscription by endpoint (could belong to another patient)
    const byEndpoint = await PushSubscription.findOne({ endpoint }); // doc (not lean)

    // 2) Find existing subs for this patient (newest first)
    const existingForPatient = await PushSubscription.find({ patientID }).sort({
      updatedAt: -1,
    });

    // choose a primary doc for this patient (most recent)
    let primary = existingForPatient[0] || null;

    // If we found a doc with this endpoint but it's NOT the same as the chosen primary doc,
    // remove the endpoint doc to avoid unique endpoint conflicts before writing the new one.
    if (
      byEndpoint &&
      (!primary || String(byEndpoint._id) !== String(primary._id))
    ) {
      await PushSubscription.deleteOne({ _id: byEndpoint._id });
    }

    if (primary) {
      // Update the primary with latest endpoint/keys/device
      primary.endpoint = endpoint;
      primary.keys = keys;
      primary.enabled = true;
      primary.deviceLabel = deviceLabel;
      primary.userAgent = userAgent;
      primary.patientID = patientID;
      await primary.save();

      // Remove other duplicates for this patient
      const otherIds = existingForPatient
        .filter((d) => String(d._id) !== String(primary._id))
        .map((d) => d._id);
      if (otherIds.length) {
        await PushSubscription.deleteMany({ _id: { $in: otherIds } });
      }
    } else {
      // No existing sub for this patient — create a fresh one
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

    // Clean up any disabled leftovers for this patient (except the active primary)
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
