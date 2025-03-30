import { db, ref, push, set } from "@/lib/firebaseConfig";

export async function POST(req) {
  try {
    const { name, value } = await req.json();
    const newRef = push(ref(db, "data"));
    await set(newRef, { id: newRef.key, name, value });

    return Response.json({ success: true, id: newRef.key });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}



