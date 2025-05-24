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
    
    // Convert Firebase object to array
    const dataArray = data ? Object.values(data) : [];
    
    return NextResponse.json({ success: true, data: dataArray });
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

// Cập nhật dữ liệu đã tồn tại
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const { year, month, day, production } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing record ID" },
        { status: 400 }
      );
    }

    if (!year || !month || !day || production === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if record exists
    const snapshot = await db.ref(`${ENERGY_DATA_PATH}/${id}`).once("value");
    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    const data = {
      id,
      year,
      month,
      day,
      production,
    };

    await db.ref(`${ENERGY_DATA_PATH}/${id}`).update(data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Xóa dữ liệu
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing record ID" },
        { status: 400 }
      );
    }

    // Check if record exists
    const snapshot = await db.ref(`${ENERGY_DATA_PATH}/${id}`).once("value");
    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    await db.ref(`${ENERGY_DATA_PATH}/${id}`).remove();

    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}