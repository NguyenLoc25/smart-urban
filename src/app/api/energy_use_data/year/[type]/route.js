import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// API GET: Lấy dữ liệu năng lượng theo năm
export async function GET(req) {
  try {
    const segments = req.nextUrl.pathname.split("/");
    const energyType = segments[segments.length - 1]; // solar, wind, hydro

    const snapshot = await db.ref(`energy/renewable/year/${energyType}`).once("value");

    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Không có dữ liệu" }, { status: 404 });
    }

    const data = snapshot.val();

    // Chuyển dữ liệu thành danh sách có cấu trúc cố định
    const formattedData = Object.values(data)
      .map((item) => ({
        year: Number(item.Year) || 0, // Đảm bảo year là số
        energy: Number(item[`Electricity from ${energyType} - TWh`]) || 0, // Đảm bảo energy là số
      }))
      .filter((item) => item.year > 0) // Loại bỏ dữ liệu không hợp lệ
      .sort((a, b) => a.year - b.year); // Sắp xếp theo năm tăng dần

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu từ Firebase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
