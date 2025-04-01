import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const ENERGY_PATHS = {
  solar: "energy/physic-info/solar",
  wind: "energy/physic-info/wind",
  hydro: "energy/physic-info/hydro",
};

// Lấy danh sách hoặc phần tử theo ID
export async function GET(req, context) {
  try {
    const { type } = await context.params;
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

// Thêm dữ liệu mới với UUID
export async function POST(req, context) {
  try {
    const { type } = await context.params;
    const energyPath = ENERGY_PATHS[type];
    if (!energyPath) return NextResponse.json({ error: "Invalid energy type" }, { status: 400 });

    const data = await req.json();
    if (
      (type === "solar" && (!data.voltage || !data.current || !data.output_power || !data.size)) ||
      (type === "wind" && (!data.voltage || !data.current || !data.rotation_speed)) ||
      (type === "hydro" && (!data.shaft_diameter || !data.rpm))
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    

    const uuid = uuidv4();
    const newData = { uuid, id: uuid, ...data }; // Đặt uuid lên đầu
    
    await db.ref(`${energyPath}/${uuid}`).set(newData);
    

    return NextResponse.json({ message: `${type} data added successfully`, id: uuid });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Cập nhật dữ liệu
export async function PUT(req, context) {
  try {
    const { type } = await context.params;
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
    const { type } = await context.params;
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
