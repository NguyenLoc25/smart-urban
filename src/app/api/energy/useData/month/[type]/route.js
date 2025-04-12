import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// API GET: Lấy dữ liệu năng lượng theo tháng
export async function GET(req) {
  try {
    const segments = req.nextUrl.pathname.split("/");
    const energyType = segments[segments.length - 1]; // solar, wind, hydro

    const snapshot = await db.ref(`energy/renewable/month/${energyType}`).once("value");

    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Không có dữ liệu" }, { status: 404 });
    }

    const data = snapshot.val();

    // Chuyển dữ liệu thành danh sách có cấu trúc cố định
    const formattedData = Object.values(data)
      .map((item) => ({
        month: Number(item.Month) || 0, // Đảm bảo month là số
        energy: Number(item[`Electricity from ${energyType} - TWh`]) || 0, // Đảm bảo energy là số
        year: Number(item.Year) || 0, // Đảm bảo year là số
        code: item.Code || "", // Lấy thêm mã nếu có
        entity: item.Entity || "", // Lấy thêm Entity nếu có
      }))
      // Lọc các mục có month hợp lệ và energy > 0
      .filter((item) => item.month > 0 && item.energy > 0)
      .sort((a, b) => a.month - b.month); // Sắp xếp theo tháng tăng dần

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu từ Firebase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
