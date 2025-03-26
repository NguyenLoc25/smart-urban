import { db } from "@/lib/firebaseAdmin";
import crypto from "crypto";

export async function POST(req) {
    try {
        const body = await req.json();

        if (!body.data || !Array.isArray(body.data)) {
            throw new Error("Dữ liệu không hợp lệ");
        }

        // Lọc dữ liệu chỉ có mã quốc gia là "VNM"
        const filteredData = body.data.filter(item => item.Code === "VNM");

        if (filteredData.length === 0) {
            return new Response(
                JSON.stringify({ message: "Không có dữ liệu Việt Nam để lưu" }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Ghi dữ liệu vào Realtime Database
        const updates = {};
        filteredData.forEach((item) => {
            const hash = crypto.createHash("sha256").update(JSON.stringify(item)).digest("hex");
            updates[`energy/renewable/solar/${hash}`] = item;
        });

        await db.ref().update(updates); // Cập nhật dữ liệu lên Firebase

        return new Response(
            JSON.stringify({ message: `Đã lưu ${filteredData.length} bản ghi vào Firebase` }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("❌ Lỗi khi lưu Firebase:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
