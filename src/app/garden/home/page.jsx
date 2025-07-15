'use client';

import useGardenData from "@/app/garden/useGardenData";
import Chart from "@/app/garden/home/Chart";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";

export default function SmartGardenDashboard() {
  const router = useRouter();

  const {
    soilHumidity,
    hydroWaterTemp,
    mushroomTemperature,
    chickenTemperature,
    lastWateredTime,
    lastFedTime,
  } = useGardenData();

  const formatTime = (isoString) => {
    if (!isoString) return "Đang tải...";
    try {
      const date = new Date(isoString);
      return format(date, "HH:mm 'ngày' dd/MM/yyyy", { locale: vi });
    } catch {
      return "Dữ liệu lỗi";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-300">
          Chào mừng đến với Khu Vườn Thông Minh 🌱
        </h1>
        <p className="text-green-800 dark:text-green-100 max-w-2xl mx-auto">
          “Mỗi chiếc lá là một cảm biến của sự sống – và khu vườn là trái tim thông minh của ngôi nhà.”
        </p>
        <img
          src="/garden/garden4.png"
          alt="Smart Garden"
          className="w-full max-w-xl mx-auto rounded-xl shadow-lg"
        />
      </div>

      {/* Garden Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => router.push("/garden/control/vegetable/GardenControl")}
          className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="text-green-500 text-2xl">🥬</div>
          <div>
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-200">Rau sạch</h2>
            <p className="text-sm text-green-900 dark:text-green-400">
              Độ ẩm đất: {soilHumidity !== null ? `${soilHumidity}%` : "Đang tải..."}
            </p>
          </div>
        </div>

        <div
          onClick={() => router.push("/garden/control/vegetable/HydroponicControl")}
          className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="text-blue-500 text-2xl">💧</div>
          <div>
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-200">Thủy canh</h2>
            <p className="text-sm text-green-900 dark:text-green-400">
              Nhiệt độ nước: {hydroWaterTemp !== null ? `${hydroWaterTemp}°C` : "Đang tải..."}
            </p>
          </div>
        </div>

        <div
          onClick={() => router.push("/garden/control/vegetable/MushroomControl")}
          className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="text-indigo-500 text-2xl">🍄</div>
          <div>
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-200">Nhà nấm</h2>
            <p className="text-sm text-green-900 dark:text-green-400">
              Nhiệt độ: {mushroomTemperature !== null ? `${mushroomTemperature}°C` : "Đang tải..."}
            </p>
          </div>
        </div>

        <div
          onClick={() => router.push("/garden/control/animal")}
          className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="text-orange-500 text-2xl">🐔</div>
          <div>
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-200">Chuồng gà</h2>
            <p className="text-sm text-green-900 dark:text-green-400">
              Nhiệt độ: {chickenTemperature !== null ? `${chickenTemperature}°C` : "Đang tải..."}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-4 text-center text-green-900 dark:text-green-200">
          Biểu đồ
        </h2>
        <Chart />
      </div>

      {/* Status Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-green-900 dark:text-green-200">Tưới nước tự động</h2>
          <p className="text-sm text-green-900 dark:text-green-400">
            Lần gần nhất: {formatTime(lastWateredTime)}
          </p>
          <span className="text-green-500 text-sm font-medium">🟢 Hoạt động</span>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-green-900 dark:text-green-200">Cho gà ăn</h2>
          <p className="text-sm text-green-900 dark:text-green-400">
            Lần gần nhất: {formatTime(lastFedTime)}
          </p>
          <span className="text-green-500 text-sm font-medium">🟢 Hoạt động</span>
        </div>
      </div>
    </div>
  );
}
