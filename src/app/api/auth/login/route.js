import { connectToDB } from "@/lib/db";
import User from "../../../../lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signJwt } from "../../../../lib/auth";

export async function POST(req) {
  await dbConnect();
  const { phoneNumber, password } = await req.json();
  if (!phone || !password) {
    return NextResponse.json(
      { error: "Phone, Password required" },
      { status: 400 }
    );
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  if (!user.onboardingComplete) {
    const token = signJwt({
      _id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      scope: "onboarding",
    });
    return NextResponse.json(
      { _id: user._id, phoneNumber: user.phoneNumber, role: user.role, token },
      { status: 201 } //created
    );
  }
  const authToken = signJwt({
    _id: user._id,
    phoneNumber: user.phoneNumber,
    role: user.role,
    scope: "auth",
  });
  return NextResponse.json(
    { _id: user._id, role: user.role, authToken },
    { status: 200 }
  );
}
