// import admin from "@/lib/firebaseAdmin";
// import { NextResponse } from "next/server";

// const db = admin.database();
// const WATER_PATH = "energy/physic-info/water";

// // 📌 Lấy danh sách hoặc một thiết bị theo ID
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (id) {
//       const snapshot = await db.ref(`${WATER_PATH}/${id}`).get();
//       return NextResponse.json({ data: snapshot.exists() ? snapshot.val() : null });
//     }

//     const snapshot = await db.ref(WATER_PATH).get();
//     return NextResponse.json({ data: snapshot.exists() ? snapshot.val() : {} });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // 📌 Thêm thiết bị mới
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { shaft_diameter, rpm } = body;

//     if (!shaft_diameter || !rpm) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const newRef = db.ref(WATER_PATH).push();
//     await newRef.set({ shaft_diameter, rpm });

//     return NextResponse.json({ message: "Water device added successfully", id: newRef.key });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // 📌 Cập nhật thiết bị
// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const { id, shaft_diameter, rpm } = body;

//     if (!id || !shaft_diameter || !rpm) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     await db.ref(`${WATER_PATH}/${id}`).update({ shaft_diameter, rpm });

//     return NextResponse.json({ message: "Water device updated successfully" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // 📌 Xóa thiết bị
// export async function DELETE(req) {
//   try {
//     const body = await req.json();
//     const { id } = body;

//     if (!id) {
//       return NextResponse.json({ error: "Missing ID" }, { status: 400 });
//     }

//     await db.ref(`${WATER_PATH}/${id}`).remove();

//     return NextResponse.json({ message: "Water device deleted successfully" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
