import { db } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

// Đường dẫn dữ liệu trong Realtime Database
const ENERGY_DATA_PATH = "energy/city";

// Lấy dữ liệu từ Firebase
export async function GET(req) {
  try {
    const snapshot = await db.ref(ENERGY_DATA_PATH).once("value");
    const data = snapshot.val();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Gửi dữ liệu mới lên Firebase
export async function POST(req) {
    try {
      const body = await req.json();
      const { year, month, day, production } = body;
  
      if (!year || !month || !day || production === undefined) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }
  
      const uuid = uuidv4(); // tạo ID ngẫu nhiên
  
      const data = {
        id: uuid,
        year,
        month,
        day,
        production,
      };
  
      const ref = db.ref(`${ENERGY_DATA_PATH}/${uuid}`);
      await ref.set(data);
  
      return NextResponse.json({ success: true, data });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }
