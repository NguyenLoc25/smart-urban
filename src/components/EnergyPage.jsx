import React, { useEffect, useState } from "react";
import TotalChart from "./TotalChart"; 
import QuantityTable from "./QuantityTable";
import ResultChart from "./ResultChart"; 

export default function EnergyPage() {
  // 🔹 Dữ liệu ban đầu
  const [cityConsumptionData, setCityConsumptionData] = useState([
    { time: "00:00", deficit: 100 },
    { time: "06:00", deficit: 150 },
    { time: "12:00", deficit: 200 },
    { time: "18:00", deficit: 250 },
    { time: "24:00", deficit: 180 },
  ]);

  const [data, setData] = useState({ yearly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const quantityData = {
    total: 500,    
    used: 320,     
    available: 180,
  };

  const colors = {
    deficit: "#FF5733", // 🔹 Màu sắc của cột "Chênh lệch"
  };

  // 🔥 Hàm gọi API & xử lý dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🛠 Gọi API song song
        const [solarRes, windRes, hydroRes] = await Promise.all([
          fetch("/api/energy_use_data/year/solar"),
          fetch("/api/energy_use_data/year/wind"),
          fetch("/api/energy_use_data/year/hydro"),
        ]);

        if (!solarRes.ok || !windRes.ok || !hydroRes.ok) {
          throw new Error("Lỗi khi tải dữ liệu từ server");
        }

        // ⏳ Chuyển đổi dữ liệu JSON
        const [solar, wind, hydro] = await Promise.all([
          solarRes.json(),
          windRes.json(),
          hydroRes.json(),
        ]);

        console.log("🔥 Solar Data:", solar);
        console.log("🔥 Wind Data:", wind);
        console.log("🔥 Hydro Data:", hydro);

        // ✅ Chuẩn hóa dữ liệu
        const normalizeData = (data, type) =>
          data
            .map((d) => {
              let year = parseInt(d.year, 10);
              if (isNaN(year)) return null; // Lọc dữ liệu không hợp lệ
              return { ...d, year };
            })
            .filter(Boolean);

        const solarData = normalizeData(solar, "Solar");
        const windData = normalizeData(wind, "Wind");
        const hydroData = normalizeData(hydro, "Hydro");

        // 🎯 Lấy danh sách tất cả các năm có dữ liệu
        const allYears = [...solarData, ...windData, ...hydroData].map((d) => d.year);
        const uniqueYears = [...new Set(allYears)].sort((a, b) => a - b);

        // 📊 Tạo danh sách dữ liệu cho biểu đồ
        const formattedData = uniqueYears.map((year) => ({
          year,
          solar: solarData.find((d) => d.year === year)?.energy ?? 0,
          wind: windData.find((d) => d.year === year)?.energy ?? 0,
          hydro: hydroData.find((d) => d.year === year)?.energy ?? 0,
        }));

        console.log("📊 Processed Data:", formattedData);
        setData({ yearly: formattedData });
      } catch (err) {
        console.error("❌ Lỗi:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🛠 Hiển thị thông báo khi đang tải hoặc có lỗi
  if (loading) return <div className="text-blue-500">⏳ Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500">❌ Lỗi: {error}</div>;

  return (
    <div className="p-4">
      {/* 📌 Hiển thị bảng dữ liệu tổng hợp */}
      <QuantityTable data={quantityData} />

      <h2 className="text-lg font-semibold mb-4">Sản lượng điện theo năm</h2>
      <TotalChart energyData={data} />

      <h2 className="text-lg font-semibold mt-6">Tiêu thụ điện theo thành phố</h2>
      <ResultChart data={cityConsumptionData} colors={colors} />

      {/* 📝 Bảng dữ liệu chi tiết */}
      <table className="w-full border-collapse border border-gray-300 mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Thời gian</th>
            <th className="border p-2">Chênh lệch (MW)</th>
          </tr>
        </thead>
        <tbody>
          {cityConsumptionData.map((row, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{row.time}</td>
              <td className="border p-2">{row.deficit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
