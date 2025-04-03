import React, { useEffect, useState } from "react";
import TotalChart from "@/components/TotalChart"; 
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
        const [solarYearRes, windYearRes, hydroYearRes, solarMonthRes, windMonthRes, hydroMonthRes] = await Promise.all([
          fetch("/api/energy_use_data/year/solar"),
          fetch("/api/energy_use_data/year/wind"),
          fetch("/api/energy_use_data/year/hydro"),
          fetch("/api/energy_use_data/month/solar"),
          fetch("/api/energy_use_data/month/wind"),
          fetch("/api/energy_use_data/month/hydro"),
        ]);
  
        // Kiểm tra nếu có bất kỳ API nào trả về mã lỗi
        const allRes = [solarYearRes, windYearRes, hydroYearRes, solarMonthRes, windMonthRes, hydroMonthRes];
        const failedRes = allRes.filter(res => !res.ok); // Tìm tất cả các API không thành công
  
        if (failedRes.length > 0) {
          // In ra lỗi chi tiết từ API không thành công
          failedRes.forEach((res) => {
            console.error(`❌ Lỗi từ API: ${res.url} - Mã trạng thái: ${res.status}`);
          });
          throw new Error("Lỗi khi tải dữ liệu từ server");
        }
  
        const [solarYear, windYear, hydroYear, solarMonth, windMonth, hydroMonth] = await Promise.all([
          solarYearRes.json(),
          windYearRes.json(),
          hydroYearRes.json(),
          solarMonthRes.json(),
          windMonthRes.json(),
          hydroMonthRes.json(),
        ]);
  
        const normalizeData = (data, key) =>
          data.map((d) => ({
            [key]: d[key],
            energy: parseInt(d.energy, 10) || 0
          })).filter(d => d.energy > 0);
  
        const solarYearData = normalizeData(solarYear, "year");
        const windYearData = normalizeData(windYear, "year");
        const hydroYearData = normalizeData(hydroYear, "year");
  
        const solarMonthData = normalizeData(solarMonth, "month");
        const windMonthData = normalizeData(windMonth, "month");
        const hydroMonthData = normalizeData(hydroMonth, "month");
  
        const uniqueYears = [...new Set([...solarYearData, ...windYearData, ...hydroYearData].map(d => d.year))].sort((a, b) => a - b);
        const uniqueMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  
        const formattedYearlyData = uniqueYears.map(year => ({
          year,
          solar: solarYearData.find(d => d.year === year)?.energy ?? 0,
          wind: windYearData.find(d => d.year === year)?.energy ?? 0,
          hydro: hydroYearData.find(d => d.year === year)?.energy ?? 0,
        }));
  
        const formattedMonthlyData = uniqueMonths.map(month => ({
          month,
          solar: solarMonthData.find(d => d.month === month)?.energy ?? 0,
          wind: windMonthData.find(d => d.month === month)?.energy ?? 0,
          hydro: hydroMonthData.find(d => d.month === month)?.energy ?? 0,
        }));
  
        setData({ yearly: formattedYearlyData, monthly: formattedMonthlyData });
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