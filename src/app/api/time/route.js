import { db } from "@/lib/firebaseAdmin";
import PreciseVirtualClock from "@/lib/VirtualClock";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clock = new PreciseVirtualClock();
    const virtualNow = clock.getVirtualTime();
    return NextResponse.json({
      virtualTime: virtualNow,
      realTime: Date.now(),
      status: clock.getDayNightStatus(),
      ratio: clock.realToVirtualRatio
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get time data" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const clock = new PreciseVirtualClock();
    const result = await clock.syncWithFirebase(db);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sync time" },
      { status: 500 }
    );
  }
}