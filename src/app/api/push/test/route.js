import { NextResponse } from "next/server";
import { webpush } from "../../../lib/webpush";

export async function POST(req) {
  try {
    const { subscription } = await req.json();
    if (!subscription) {
      return NextResponse.json(
        { ok: false, error: "No subscription" },
        { status: 400 }
      );
    }

    // payload includes a unique tag so each test push shows separately
    const payload = JSON.stringify({
      title: "DMA: Test push ✓",
      body: "If you see this, Web Push is working.",
      url: "/reminders",
      tag: "dma-test-" + Date.now(),
      renotify: true,
    });

    await webpush.sendNotification(subscription, payload);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DMA] /api/push/test error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
