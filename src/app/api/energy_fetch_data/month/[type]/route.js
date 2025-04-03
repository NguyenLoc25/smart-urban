import { db } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

// Định nghĩa các đường dẫn cho từng loại năng lượng
const ENERGY_PATHS = {
    solar: "energy/renewable/month/solar",
    wind: "energy/renewable/month/wind",
    hydro: "energy/renewable/month/hydro",
};

// Định nghĩa các trường sản lượng năng lượng theo từng loại
const ENERGY_FIELDS = {
    solar: "Electricity from solar - TWh",
    wind: "Electricity from wind - TWh",
    hydro: "Electricity from hydro - TWh",
};

export async function POST(req) {
    try {
        // Lấy type từ URL (ví dụ: hydro, solar, wind)
        const type = req.nextUrl.pathname.split("/").pop();

        // Kiểm tra xem type có hợp lệ hay không
        const energyPath = ENERGY_PATHS[type];
        if (!energyPath) {
            return NextResponse.json({ error: "Invalid energy type" }, { status: 400 });
        }

        // Lấy dữ liệu từ yêu cầu (body của POST)
        const data = await req.json();
        const uuid = uuidv4(); // Tạo ID duy nhất cho bản ghi mới

        // Lấy tên trường sản lượng năng lượng tương ứng với type
        const energyField = ENERGY_FIELDS[type];

        // Tạo đối tượng dữ liệu mới một cách linh hoạt
        const newData = {
            Code: data.Code,
            [energyField]: data[energyField], // Tự động gán trường sản lượng điện tùy theo type
            Entity: data.Entity,
            Year: data.Year,
            Month: data.Month,
        };

        // Lưu dữ liệu vào Firebase tại đường dẫn tương ứng với loại năng lượng
        await db.ref(`${energyPath}/${uuid}`).set(newData);

        // Trả về phản hồi thành công cùng với ID mới
        return NextResponse.json({ message: `${type} data added successfully`, id: uuid });
    } catch (error) {
        // Trả về lỗi trong trường hợp có vấn đề xảy ra
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
