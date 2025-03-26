import { NextResponse } from "next/server";

const API_BASE_URL = process.env.LOCALHOST 
? process.env.NEXT_PUBLIC_VERCEL_URL
: process.env.LOCALHOST
? `https://${process.env.VERCEL_URL}` 
: "http://localhost:3000";

export async function GET() {
    try {
        console.log("🔄 Vercel cron job đang chạy...");

        const energyTypes = ["solar", "hydro", "wind"];
        for (const type of energyTypes) {
            console.log(`📥 Lấy dữ liệu ${type}...`);
            const fetchDataResponse = await fetch(`${API_BASE_URL}/api/energy_data/year/${type}`);
            const fetchData = await fetchDataResponse.json();

            if (!fetchData.data || fetchData.data.length === 0) {
                console.log(`⚠️ Không có dữ liệu mới cho ${type}.`);
                continue;
            }

            console.log(`✅ Cập nhật dữ liệu ${type} vào Firebase...`);
            await fetch(`${API_BASE_URL}/api/energy_data/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: fetchData.data }),
            });
        }

        return NextResponse.json({ message: "Cron job hoàn tất" });

    } catch (error) {
        console.error("❌ Lỗi khi chạy cron job:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
