// import admin from "@/lib/firebaseAdmin";
// import { NextResponse } from "next/server";

// const db = admin.database();
// const WIND_PATH = "energy/physic-info/wind";

// // 📌 Lấy danh sách hoặc một turbine theo ID
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (id) {
//       const snapshot = await db.ref(`${WIND_PATH}/${id}`).get();
//       return NextResponse.json({ data: snapshot.exists() ? snapshot.val() : null });
//     }

//     const snapshot = await db.ref(WIND_PATH).get();
//     return NextResponse.json({ data: snapshot.exists() ? snapshot.val() : {} });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // 📌 Thêm turbine mới
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { voltage, current, rotation_speed } = body;

//     if (!voltage || !current || !rotation_speed) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const newRef = db.ref(WIND_PATH).push();
//     await newRef.set({ voltage, current, rotation_speed });

//     return NextResponse.json({ message: "Wind turbine added successfully", id: newRef.key });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // 📌 Cập nhật turbine
// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const { id, voltage, current, rotation_speed } = body;

//     if (!id || !voltage || !current || !rotation_speed) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     await db.ref(`${WIND_PATH}/${id}`).update({ voltage, current, rotation_speed });

//     return NextResponse.json({ message: "Wind turbine updated successfully" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // 📌 Xóa turbine
// export async function DELETE(req) {
//   try {
//     const body = await req.json();
//     const { id } = body;

//     if (!id) {
//       return NextResponse.json({ error: "Missing ID" }, { status: 400 });
//     }

//     await db.ref(`${WIND_PATH}/${id}`).remove();

//     return NextResponse.json({ message: "Wind turbine deleted successfully" });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
