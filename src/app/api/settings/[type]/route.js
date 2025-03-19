import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const ENERGY_PATHS = {
  solar: "energy/physic-info/solar",
  wind: "energy/physic-info/wind",
  water: "energy/physic-info/water",
};

// Lấy danh sách hoặc phần tử theo ID
export async function GET(req, context) {
  try {
    const { type } = await context.params; // ✅ Đợi params

    const energyPath = ENERGY_PATHS[type];
    if (!energyPath) return NextResponse.json({ error: "Invalid energy type" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const snapshot = id
      ? await db.ref(`${energyPath}/${id}`).once("value")
      : await db.ref(energyPath).once("value");

    return NextResponse.json({ data: snapshot.val() || {} });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Thêm dữ liệu mới
export async function POST(req, context) {
  try {
    const { type } = await context.params; // ✅ Đợi params

    const energyPath = ENERGY_PATHS[type];
    if (!energyPath) return NextResponse.json({ error: "Invalid energy type" }, { status: 400 });

    const data = await req.json();
    if (
      (type === "Solar" && (!data.voltage || !data.current || !data.power || !data.size)) ||
      (type === "Wind" && (!data.voltage || !data.current || !data.rotation_speed || !data.shaft_diameter || !data.power)) ||
      (type === "Water" && (!data.voltage || !data.current || !data.rpm || !data.power))
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRef = db.ref(energyPath).push();
    await newRef.set(data);

    return NextResponse.json({ message: `${type} data added successfully`, id: newRef.key });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Cập nhật dữ liệu
export async function PUT(req, context) {
  try {
    const { type } = await context.params; // ✅ Đợi params

    const energyPath = ENERGY_PATHS[type];
    if (!energyPath) return NextResponse.json({ error: "Invalid energy type" }, { status: 400 });

    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.ref(`${energyPath}/${data.id}`).update(data);

    return NextResponse.json({ message: `${type} data updated successfully` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Xóa dữ liệu
export async function DELETE(req, context) {
  try {
    const { type } = await context.params; // ✅ Đợi params

    const energyPath = ENERGY_PATHS[type];
    if (!energyPath) return NextResponse.json({ error: "Invalid energy type" }, { status: 400 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.ref(`${energyPath}/${id}`).remove();

    return NextResponse.json({ message: `${type} data deleted successfully` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
