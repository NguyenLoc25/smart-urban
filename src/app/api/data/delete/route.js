import { db, ref, remove } from "@/lib/firebaseConfig";

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await remove(ref(db, `data/${id}`));

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
