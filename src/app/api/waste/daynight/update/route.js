import { writeDayNightStatusToDB_Admin, getDayNightStatus } from '@/services/waste/firebaseDayNightService';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const status = getDayNightStatus();
    await writeDayNightStatusToDB_Admin(status);
    return NextResponse.json({ updatedTo: status });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}