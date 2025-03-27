import { NextResponse } from "next/server";

const API_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";


  export async function GET() {
    try {
        console.log("🔄 Vercel cron job đang chạy...");

        const energyTypes = ["solar", "hydro", "wind"];

        for (const type of energyTypes) {
            console.log(`📥 Lấy dữ liệu ${type}...`);

            const fetchDataResponse = await fetch(`${API_BASE_URL}/api/energy_data/year/${type}`);
            if (!fetchDataResponse.ok) throw new Error(`Không thể lấy dữ liệu ${type}`);

            const fetchData = await fetchDataResponse.json();

            if (!fetchData.data?.length) {
                console.log(`⚠️ Không có dữ liệu mới cho ${type}.`);
                continue;
            }

            console.log(`✅ Cập nhật dữ liệu ${type} vào Firebase...`);
            const postResponse = await fetch(`${API_BASE_URL}/api/energy_data/year/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: fetchData.data }),
            });

            if (!postResponse.ok) throw new Error(`Không thể cập nhật dữ liệu ${type}`);
        }

        return NextResponse.json({ message: "Cron job hoàn tất" });

    } catch (error) {
        console.error("❌ Lỗi khi chạy cron job:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
