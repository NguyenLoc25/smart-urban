import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// Ví dụ API lấy dữ liệu
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const snapshot = await db.ref(`/users/${email}`).once("value");
    return NextResponse.json({ data: snapshot.val() || {} });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Lấy danh sách email từ biến môi trường
const emailToDataPath = JSON.parse(process.env.NEXT_PUBLIC_EMAILS || "{}");

// Lấy danh sách dữ liệu
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const dataPath = emailToDataPath[email];
    if (!dataPath) {
      return NextResponse.json({ error: "No data path found for this email" }, { status: 404 });
    }

    const snapshot = await db.ref(dataPath).once("value");
    const fetchedData = snapshot.val();

    return NextResponse.json({ data: fetchedData || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Thêm dữ liệu mới
export async function POST(req) {
  try {
    const { email, name, value } = await req.json();
    if (!email || !name || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dataPath = emailToDataPath[email];
    if (!dataPath) {
      return NextResponse.json({ error: "No data path found for this email" }, { status: 404 });
    }

    const newRef = db.ref(dataPath).push();
    await newRef.set({ name, value });

    return NextResponse.json({ message: "Data added successfully", id: newRef.key });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Cập nhật dữ liệu
export async function PUT(req) {
  try {
    const { email, id, name, value } = await req.json();
    if (!email || !id || !name || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dataPath = emailToDataPath[email];
    if (!dataPath) {
      return NextResponse.json({ error: "No data path found for this email" }, { status: 404 });
    }

    await db.ref(`${dataPath}/${id}`).update({ name, value });

    return NextResponse.json({ message: "Data updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Xoá dữ liệu
export async function DELETE(req) {
  try {
    const { email, id } = await req.json();
    if (!email || !id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dataPath = emailToDataPath[email];
    if (!dataPath) {
      return NextResponse.json({ error: "No data path found for this email" }, { status: 404 });
    }

    await db.ref(`${dataPath}/${id}`).remove();

    return NextResponse.json({ message: "Data deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
