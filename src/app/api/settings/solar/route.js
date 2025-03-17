import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const SOLAR_PATH = "energy/physic-info/solar";

// Lấy danh sách hoặc một tấm pin theo ID
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const snapshot = await db.ref(`${SOLAR_PATH}/${id}`).once("value");
      return NextResponse.json({ data: snapshot.val() || null });
    }

    const snapshot = await db.ref(SOLAR_PATH).once("value");
    return NextResponse.json({ data: snapshot.val() || {} });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Thêm tấm pin mới
export async function POST(req) {
  try {
    const { voltage, current, power, size } = await req.json();
    if (!voltage || !current || !power || !size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRef = db.ref(SOLAR_PATH).push();
    await newRef.set({ voltage, current, power, size });

    return NextResponse.json({ message: "Solar panel added successfully", id: newRef.key });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Cập nhật tấm pin
export async function PUT(req) {
  try {
    const { id, voltage, current, power, size } = await req.json();
    if (!id || !voltage || !current || !power || !size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.ref(`${SOLAR_PATH}/${id}`).update({ voltage, current, power, size });

    return NextResponse.json({ message: "Solar panel updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Xóa tấm pin
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await db.ref(`${SOLAR_PATH}/${id}`).remove();

    return NextResponse.json({ message: "Solar panel deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}