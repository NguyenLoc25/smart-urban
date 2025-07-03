'use client';
import useGardenData from "@/app/garden/useGardenData";
import Chart from "./Chart";
import Chatbox from "./Chatbox";

export default function SmartGardenDashboard() {
  const {
    soilHumidity,
    hydroWaterTemp,
    mushroomTemperature,
    chickenTemperature,
  } = useGardenData();

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-green-700">
          Chào mừng đến với Khu Vườn Thông Minh 🌱
        </h1>
        <p className="text-gray-600 italic max-w-2xl mx-auto">
          “Mỗi chiếc lá là một cảm biến của sự sống – và khu vườn là trái tim thông minh của ngôi nhà.”
        </p>
        <img
          src="/garden/garden4.jpg"
          alt="Smart Garden"
          className="w-full max-w-xl mx-auto rounded-xl shadow-lg"
        />
      </div>

      {/* Garden Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4">
          <div className="text-green-500 text-2xl">🥬</div>
          <div>
            <h2 className="text-lg font-semibold">Rau sạch</h2>
            <p className="text-sm text-gray-500">
              Độ ẩm đất: {soilHumidity !== null ? `${soilHumidity}%` : "Đang tải..."}
            </p>
          </div>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4">
          <div className="text-blue-500 text-2xl">💧</div>
          <div>
            <h2 className="text-lg font-semibold">Thủy canh</h2>
            <p className="text-sm text-gray-500">
              Nhiệt độ nước: {hydroWaterTemp !== null ? `${hydroWaterTemp}°C` : "Đang tải..."}
            </p>
          </div>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4">
          <div className="text-indigo-500 text-2xl">🍄</div>
          <div>
            <h2 className="text-lg font-semibold">Nhà nấm</h2>
            <p className="text-sm text-gray-500">
              Nhiệt độ: {mushroomTemperature !== null ? `${mushroomTemperature}°C` : "Đang tải..."}
            </p>
          </div>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4">
          <div className="text-orange-500 text-2xl">🐔</div>
          <div>
            <h2 className="text-lg font-semibold">Chuồng gà</h2>
            <p className="text-sm text-gray-500">
              Nhiệt độ: {chickenTemperature !== null ? `${chickenTemperature}°C` : "Đang tải..."}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div
        className="bg-white rounded-2xl shadow p-4 text-center cursor-pointer hover:shadow-lg transition"
      >
        <h2 className="text-xl font-semibold mb-2 pointer-events-none">
          Biểu đồ
        </h2>
        <div className="pointer-events-none">
          <Chart />
        </div>
      </div>

      {/* Status Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Tưới nước tự động</h2>
          <p className="text-sm text-gray-500">Lần gần nhất: 07:30 sáng hôm nay</p>
          <span className="text-green-600 text-sm font-medium">🟢 Hoạt động</span>
        </div>
        <div className="bg-white shadow rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Cho gà ăn</h2>
          <p className="text-sm text-gray-500">Lần gần nhất: 18:00 hôm qua</p>
          <span className="text-yellow-600 text-sm font-medium">🟡 Cần kiểm tra</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-10">
        Thiết kế bởi Nhóm Smart Garden • Cập nhật lần cuối: 13/06/2025
      </div>

      {/* Chatbox */}
      <Chatbox />
    </div>
  );
}
