import { NextResponse } from "next/server";
import { VAPID_PUBLIC_KEY } from "../../../lib/webpush";

export async function GET() {
  if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY.length < 50) {
    console.error("[DMA][public-key] Missing or invalid VAPID_PUBLIC_KEY");
    return NextResponse.json({ error: "Invalid key" }, { status: 500 });
  }

  return NextResponse.json({ key: VAPID_PUBLIC_KEY });
}
