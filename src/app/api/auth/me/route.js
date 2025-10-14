// src/app/api/auth/me/route.js
import dbConnect from "../../../lib/db";
import User from "../../../lib/models/User";
import Patient from "../../../lib/models/Patient";
import Doctor from "../../../lib/models/Doctor";
import FamilyMember from "../../../lib/models/FamilyMember";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAuth } from "../../../lib/auth";

const COOKIE_KEY = "meCacheV1";

// Fast timeout wrapper so we don't hang 30s when offline
async function connectFast(ms = 3000) {
  return Promise.race([
    dbConnect(),
    new Promise((_, rej) =>
      setTimeout(() => rej(new Error(`dbConnect timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Small helper: handles both Next versions where cookies() is sync or async
async function getCookieStore() {
  const c = cookies();
  return typeof c?.then === "function" ? await c : c;
}

export async function GET(req) {
  // Auth first
  const { payload, error } = requireAuth(req);
  if (error) return error; // 401 JSON from requireAuth

  const buildOut = ({ user, profile }) =>
    NextResponse.json({
      userId: String(user._id),
      role: user.role,
      phone: user.phoneNumber,
      onboardingComplete: !!user.onboardingComplete,
      profile: profile || null,
    });

  const buildFromToken = () =>
    NextResponse.json(
      {
        userId: String(payload.sub || ""),
        role: payload.role || "Patient",
        phone: payload.phoneNumber || null,
        onboardingComplete: !!payload.onboardingComplete,
        profile: null,
      },
      { status: 200, headers: { "x-offline-fallback": "token" } }
    );

  try {
    await connectFast(3000);

    const user = await User.findById(payload.sub)
      .select("_id role phoneNumber onboardingComplete")
      .lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let profile = null;
    if (user.role === "Patient") {
      const patient = await Patient.findOne({ user: user._id })
        .select("profileId name")
        .lean();
      if (patient) {
        profile = {
          profileId: String(patient.profileId),
          name: patient.name || null,
        };
      }
    } else if (user.role === "Doctor") {
      const doctor = await Doctor.findOne({ user: user._id })
        .select("profileId name")
        .lean();
      if (doctor) {
        profile = {
          profileId: String(doctor.profileId),
          name: doctor.name || null,
        };
      }
    } else if (user.role === "Family Member") {
      const fam = await FamilyMember.findOne({ user: user._id })
        .select("profileId name")
        .lean();
      if (fam) {
        profile = {
          profileId: String(fam.profileId),
          name: fam.name || null,
        };
      }
    }

    const res = buildOut({ user, profile });

    // Cache snapshot in cookie for offline refreshes
    try {
      res.cookies.set(
        COOKIE_KEY,
        JSON.stringify({
          userId: String(user._id),
          role: user.role,
          phone: user.phoneNumber,
          onboardingComplete: !!user.onboardingComplete,
          profile: profile || null,
        }),
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: "Lax",
        }
      );
    } catch {
      // ignore cookie set failures
    }

    return res;
  } catch {
    // DB unreachable → cookie cache first
    try {
      const jar = await getCookieStore();
      const raw = jar.get(COOKIE_KEY)?.value;
      if (raw) {
        const cached = JSON.parse(raw);
        return NextResponse.json(cached, {
          status: 200,
          headers: { "x-offline-fallback": "cookie" },
        });
      }
    } catch {
      // ignore cookie read errors
    }
    // No cache → minimal token-based fallback
    return buildFromToken();
  }
}
