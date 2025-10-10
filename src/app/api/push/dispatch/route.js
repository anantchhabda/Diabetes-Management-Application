// src/app/api/push/dispatch/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Reminder from "../../../lib/models/Reminder";
import PushSubscription from "../../../lib/models/pushSubscription";
import { webpush } from "../../../lib/webpush";

// check if a reminder is due "now" in its timezone (±2 minutes)
function isDueNow(rem) {
  try {
    const tz = rem.timezone || "Australia/Perth";

    const now = new Date();
    const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));

    const [h, m] = String(rem.time || "00:00")
      .split(":")
      .map((n) => parseInt(n, 10));
    const nowMins = local.getHours() * 60 + local.getMinutes();
    const remMins = h * 60 + m;
    const timeMatch = Math.abs(nowMins - remMins) <= 2; // ±2 minutes tolerance
    if (!timeMatch) return false;

    const ymd = local.toISOString().slice(0, 10);

    switch (rem.interval) {
      case "Daily":
        return true;

      case "Weekly": {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const todayShort = dayNames[local.getDay()];
        return rem.dayOfWeek === todayShort;
      }

      case "Monthly": {
        const targetDom =
          typeof rem.dayOfMonth === "number"
            ? rem.dayOfMonth
            : rem.startDate
            ? parseInt(String(rem.startDate).slice(8, 10), 10)
            : null;
        if (!targetDom) return false;
        return local.getDate() === targetDom;
      }

      default: {
        // match specific calendar date
        const start = String(rem.startDate || "").slice(0, 10);
        return start && start === ymd;
      }
    }
  } catch (e) {
    console.error("[DMA][isDueNow] error:", e);
    return false;
  }
}

export async function GET(req) {
  try {
    // Secure CRON secret check
    const url = new URL(req.url);
    const qsSecret = url.searchParams.get("cron_secret");
    const headerAuth = req.headers.get("authorization");
    const CRON_SECRET = process.env.CRON_SECRET;

    if (
      CRON_SECRET &&
      !(qsSecret === CRON_SECRET || headerAuth === `Bearer ${CRON_SECRET}`)
    ) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    //

    await dbConnect();

    const reminders = await Reminder.find({});
    const due = reminders.filter(isDueNow);

    if (due.length === 0) {
      return NextResponse.json({ ok: true, msg: "No reminders due now" });
    }

    let sentCount = 0;

    for (const rem of due) {
      if (!rem.patientID) continue;

      // find all subscriptions for this patientID
      const subs = await PushSubscription.find({
        enabled: true,
        patientID: rem.patientID,
      });

      if (!subs || subs.length === 0) continue;

      for (const sub of subs) {
        try {
          const payload = JSON.stringify({
            title: `Reminder: ${rem.name}`,
            body: `Time for your ${
              rem.interval?.toLowerCase() || "one-time"
            } reminder at ${rem.time}.`,
            url: "/reminders",
            tag: `dma-rem-${rem._id}-${Date.now()}`,
            renotify: true,
          });

          await webpush.sendNotification(sub, payload);
          sentCount++;
        } catch (err) {
          console.error(
            "[DMA][push send] error:",
            err?.statusCode,
            err?.message || err
          );
          // clean dead endpoints
          if (err?.statusCode === 410 || err?.statusCode === 404) {
            try {
              sub.enabled = false;
              await sub.save();
            } catch (_) {}
          }
        }
      }
    }

    return NextResponse.json({ ok: true, sentCount });
  } catch (err) {
    console.error("[DMA][dispatch] error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
