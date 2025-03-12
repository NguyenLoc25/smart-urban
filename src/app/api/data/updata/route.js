import { db, ref, update } from "@/lib/firebaseConfig";

export async function PUT(req) {
  try {
    const { id, name, value } = await req.json();
    await update(ref(db, `data/${id}`), { name, value });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
