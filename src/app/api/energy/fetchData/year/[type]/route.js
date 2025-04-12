import { parse } from "csv-parse/sync";
import { db } from "@/lib/firebaseAdmin";
import crypto from "crypto";

const csvUrls = {
    solar: "https://ourworldindata.org/grapher/solar-energy-consumption.csv?v=1",
    hydro: "https://ourworldindata.org/grapher/hydropower-consumption.csv?v=1",
    wind: "https://ourworldindata.org/grapher/wind-generation.csv?v=1",
};

export async function GET(req) {
    try {
        const { pathname } = new URL(req.url);
        const segments = pathname.split("/");
        const energyType = req.nextUrl.pathname.split("/").pop();

        const csvUrl = csvUrls[energyType];

        if (!csvUrl) {
            throw new Error("Loại năng lượng không hợp lệ");
        }

        const csvResponse = await fetch(csvUrl);
        if (!csvResponse.ok) {
            throw new Error(`Lỗi tải CSV: HTTP ${csvResponse.status}`);
        }

        const csvData = await csvResponse.text();
        const jsonData = parse(csvData, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        return new Response(JSON.stringify({ data: jsonData }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const segments = req.nextUrl.pathname.split("/");
        const energyType = segments[segments.length - 1];
        
        if (!body.data || !Array.isArray(body.data)) {
            throw new Error("Dữ liệu không hợp lệ");
        }

        const filteredData = body.data.filter(item => item.Code === "VNM");
        if (filteredData.length === 0) {
            return new Response(JSON.stringify({ message: "Không có dữ liệu Việt Nam để lưu" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const updates = {};
        filteredData.forEach((item) => {
            const hash = crypto.createHash("sha256").update(JSON.stringify(item)).digest("hex");
            updates[`energy/renewable/year/${energyType}/${hash}`] = item;
        });

        await db.ref().update(updates);

        return new Response(JSON.stringify({ message: `Đã lưu ${filteredData.length} bản ghi vào Firebase` }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("❌ Lỗi khi cập nhật Firebase:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        }); 
    }
}
