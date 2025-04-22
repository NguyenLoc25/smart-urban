import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// API GET: Lấy dữ liệu năng lượng theo giờ
export async function GET(req) {
  try {
    const segments = req.nextUrl.pathname.split("/");
    const energyType = segments[segments.length - 1]; // solar, wind, hydro

    const snapshot = await db.ref(`energy/renewable/hour/${energyType}`).once("value");

    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Không có dữ liệu" }, { status: 404 });
    }

    const data = snapshot.val();

    // Chuyển dữ liệu thành danh sách có cấu trúc cố định
    const formattedData = Object.values(data)
      .map((item) => ({
        hour: Number(item.Hour) || 0, // Đảm bảo hour là số (0-23)
        energy: Number(item[`Electricity from ${energyType} - TWh`]) || 0, // Đơn vị có thể là MWh thay vì TWh
        month: Number(item.Month) || 0, // Tháng nếu có
        year: Number(item.Year) || 0, // Năm nếu có
        code: item.code || "VNM", // Mã nếu có
        entity: item.Entity || "", // Entity nếu có
      }))
      // Lọc các mục có hour hợp lệ và energy > 0
      .filter((item) => item.hour >= 0 && item.hour <= 23 && item.energy > 0)
      .sort((a, b) => a.hour - b.hour); // Sắp xếp theo giờ tăng dần

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu từ Firebase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}