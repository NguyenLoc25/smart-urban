'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listenToSensorData } from './firebaseRealtime';
import { PawPrint, Leaf, Tractor, Lightbulb } from 'lucide-react';

export default function ControlPage() {
  const [weather, setWeather] = useState({ temperature: '--', humidity: '--' });

  useEffect(() => {
    listenToSensorData((data) => {
      setWeather(data);
    });
  }, []);

  return (
    <section >
      {/* Góc phải có biểu tượng thời tiết */}
      <div className="absolute top-4 right-4 text-sm text-gray-400 dark:text-gray-300 select-none">
        ☀️ {weather.temperature}°C • Độ ẩm {weather.humidity}%
      </div>

      {/* Tiêu đề */}
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">🌿 Trung tâm điều khiển</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Điều khiển mọi thành phần trong vườn thông minh</p>
      </div>

      {/* Các khối điều khiển */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Animal Control */}
        <Link href="/garden/control/animal" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl dark:bg-gray-800 dark:hover:bg-green-700 hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-100 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">🐔</div>
            </div>
            <PawPrint className="z-10 text-green-600 dark:text-green-400 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Vật nuôi</span>
          </div>
        </Link>

        {/* Vegetable Control */}
        <Link href="/garden/control/vegetable" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl dark:bg-gray-800 dark:hover:bg-green-700 hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-100 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">🥬</div>
            </div>
            <Leaf className="z-10 text-green-600 dark:text-green-400 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Trồng trọt</span>
          </div>
        </Link>

        {/* Cable Car Control */}
        <Link href="/garden/control/cablecar" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl dark:bg-gray-800 dark:hover:bg-green-700 hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-100 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">🚜</div>
            </div>
            <Tractor className="z-10 text-green-600 dark:text-green-400 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Thiết bị phun thuốc</span>
          </div>
        </Link>

        {/* Light Control */}
        <Link href="/garden/control/light" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl dark:bg-gray-800 dark:hover:bg-green-700 hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-100 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">💡</div>
            </div>
            <Lightbulb className="z-10 text-green-600 dark:text-green-400 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Chiếu sáng
            </span>
          </div>
        </Link>
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 italic">
        Hệ thống hoạt động ổn định • Cập nhật thời gian thực
      </p>
    </section>
  );
}
