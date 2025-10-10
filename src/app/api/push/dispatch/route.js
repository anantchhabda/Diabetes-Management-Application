export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Reminder from "../../../lib/models/Reminder";
import PushSubscription from "../../../lib/models/pushSubscription";
import { webpush } from "../../../lib/webpush";

//timezone helper
function ymdInTZ(date, tz) {
  const d = new Date(date.toLocaleString("en-US", { timeZone: tz }));
  return d.toISOString().slice(0, 10);
}

//check reminder is due now
function isDueNow(rem, windowMin = 2) {
  try {
    const tz = rem.timezone || "Australia/Perth";
    const now = new Date();
    const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));

    const [h, m] = String(rem.time || "00:00")
      .split(":")
      .map((n) => parseInt(n, 10));

    const nowMins = local.getHours() * 60 + local.getMinutes();
    const remMins = h * 60 + m;
    const timeMatch = Math.abs(nowMins - remMins) <= windowMin;
    if (!timeMatch) return false;

    const ymd = ymdInTZ(now, tz);

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
        // one-time reminder
        const start = String(rem.startDate || "").slice(0, 10);
        return start && start === ymd;
      }
    }
  } catch (e) {
    console.error("[DMA][isDueNow] error:", e);
    return false;
  }
}

//dispatch handler trigerred by cron
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const qsSecret = url.searchParams.get("cron_secret");
    const headerAuth = req.headers.get("authorization");
    const CRON_SECRET = process.env.CRON_SECRET;

    // cron secret
    if (
      CRON_SECRET &&
      !(qsSecret === CRON_SECRET || headerAuth === `Bearer ${CRON_SECRET}`)
    ) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    // dynamic test window, can increase size from 2 min to 5min --> for testing really
    const parsed = parseInt(url.searchParams.get("window"), 10);
    const windowMin = Number.isFinite(parsed) ? parsed : 2;

    await dbConnect();

    //load all reminders for all patients
    const reminders = await Reminder.find({}).lean();

    //filter due now reminders
    const due = reminders.filter((r) => isDueNow(r, windowMin));
    if (due.length === 0) {
      return NextResponse.json(
        {
          ok: true,
          msg: "No reminders due now",
          sentCount: 0,
          dueCount: 0,
          subsTried: 0,
          windowMin,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    let sentCount = 0;
    let subsTried = 0;

    //send notification for each due reminder
    for (const rem of due) {
      if (!rem.patientID) continue;

      const tz = rem.timezone || "Australia/Perth";
      const todayYMD = ymdInTZ(new Date(), tz);

      // Skip if already sent today
      if (rem.lastSentAt) {
        const lastYMD = ymdInTZ(new Date(rem.lastSentAt), tz);
        if (lastYMD === todayYMD) continue;
      }

      const subs = await PushSubscription.find({
        enabled: true,
        patientID: rem.patientID,
      }).lean();

      if (!subs || subs.length === 0) continue;

      const tag = `dma-rem-${rem._id}-${todayYMD}`;
      let delivered = 0;

      for (const sub of subs) {
        subsTried++;
        try {
          const payload = JSON.stringify({
            title: `Reminder: ${rem.name}`,
            body: `Time for your ${
              rem.interval?.toLowerCase() || "one-time"
            } reminder at ${rem.time}.`,
            url: "/reminders",
            tag,
            renotify: true,
          });

          await webpush.sendNotification(sub, payload);
          delivered++;
          sentCount++;
        } catch (err) {
          if (err?.statusCode === 410 || err?.statusCode === 404) {
            try {
              await PushSubscription.updateOne(
                { _id: sub._id },
                { $set: { enabled: false } }
              );
            } catch {}
          } else {
            console.error(
              "[DMA][push send] error:",
              err?.statusCode,
              err?.message || err
            );
          }
        }
      }

      //mark reminder as set
      if (delivered > 0) {
        try {
          await Reminder.updateOne(
            { _id: rem._id },
            { $set: { lastSentAt: new Date() } }
          );
        } catch {}
      }
    }

    //json summary for testing
    return NextResponse.json(
      { ok: true, sentCount, dueCount: due.length, subsTried, windowMin },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[DMA][dispatch] error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
