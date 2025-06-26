import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

async function handleCycle() {
  const cycleMs = 6 * 60 * 1000;
  const now = Date.now();
  const elapsed = now % cycleMs;

  const mode = elapsed < 3 * 60 * 1000 ? 'day' : 'night';

  await db.ref('/waste/carControl/mode').set(mode);

  return { mode, time: new Date(now).toLocaleTimeString('vi-VN') };
}

export async function GET() {
  try {
    const { mode, time } = await handleCycle();
    return NextResponse.json({ status: 'ok', time, mode });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { mode, time } = await handleCycle();
    return NextResponse.json({ status: 'ok', time, mode });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
