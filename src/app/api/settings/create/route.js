import { db, ref, get, set, push } from "@/lib/firebaseConfig";
import { getAuth } from "firebase/auth";
import { NextResponse } from "next/server";

// Lấy danh sách email từ biến môi trường
const emailToDataPath = JSON.parse(process.env.NEXT_PUBLIC_EMAILS || "{}");

export async function GET(req) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const dataPath = emailToDataPath[user.email];
    if (!dataPath) {
      return NextResponse.json({ error: "No data path found for this user" }, { status: 404 });
    }

    const dataRef = ref(db, dataPath);
    const snapshot = await get(dataRef);
    const fetchedData = snapshot.val();

    return NextResponse.json({ data: fetchedData || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { name, value } = await req.json();
    if (!name || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dataPath = emailToDataPath[user.email];
    if (!dataPath) {
      return NextResponse.json({ error: "No data path found for this user" }, { status: 404 });
    }

    const newRef = push(ref(db, dataPath));
    await set(newRef, { name, value });

    return NextResponse.json({ message: "Data added successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
