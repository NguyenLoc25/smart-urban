'use client';

import { useEffect, useState } from 'react';
import { BellIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useGardenData from './useGardenData';

export default function Notice() {
  const data = useGardenData();
  const router = useRouter();
  const [notices, setNotices] = useState([]);

  // Cập nhật danh sách cảnh báo khi dữ liệu thay đổi
  useEffect(() => {
    const newNotices = [];

    if (data.soilHumidity !== null && data.soilHumidity < 30) {
      newNotices.push({ id: 'soil', message: `🌱 Độ ẩm đất thấp: ${data.soilHumidity}%` });
    }

    if (data.fishWaterLevel !== null && data.fishWaterLevel < 40) {
      newNotices.push({ id: 'fish', message: `🐟 Mực nước hồ cá thấp: ${data.fishWaterLevel}` });
    }

    if (data.chickenTemperature !== null && data.chickenTemperature > 35) {
      newNotices.push({ id: 'chicken-temp', message: `🔥 Nhiệt độ chuồng gà cao: ${data.chickenTemperature}°C` });
    }

    if (data.mushroomHumidity !== null && data.mushroomHumidity < 60) {
      newNotices.push({ id: 'mushroom-humid', message: `🍄 Độ ẩm nấm thấp: ${data.mushroomHumidity}%` });
    }

    if (data.hydroWaterTemp !== null && data.hydroWaterTemp > 30) {
      newNotices.push({ id: 'hydro-temp', message: `💧 Nhiệt độ nước thủy canh cao: ${data.hydroWaterTemp}°C` });
    }

    setNotices(newNotices);
  }, [data]);

  // Tự động ẩn từng thông báo sau 7s
  useEffect(() => {
    const timers = notices.map((notice) =>
      setTimeout(() => {
        setNotices((prev) => prev.filter((n) => n.id !== notice.id));
      }, 7000)
    );

    return () => timers.forEach(clearTimeout);
  }, [notices]);

  if (notices.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-2 z-50">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-600 text-red-800 dark:text-red-100 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800 transition"
          onClick={() => router.push('/garden/notice')}
        >
          <BellIcon className="w-5 h-5" />
          <span className="font-medium">{notice.message}</span>
          <XIcon
            className="w-4 h-4 cursor-pointer hover:text-red-600 dark:hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation();
              setNotices((prev) => prev.filter((n) => n.id !== notice.id));
            }}
          />
        </div>

      ))}
    </div>
  );
}