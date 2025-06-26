// app/api/waste/route.js

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // ✅ đường dẫn tùy theo cấu trúc của bạn

export async function GET() {
  try {
    const cycleMs = 6 * 60 * 1000;
    const now = Date.now();
    const elapsed = now % cycleMs;

    const mode = elapsed < 3 * 60 * 1000 ? 'day' : 'night';

    await db.ref('/waste/carControl/mode').set(mode);

    return NextResponse.json({
      status: 'ok',
      time: new Date(now).toLocaleTimeString('vi-VN'),
      mode,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
