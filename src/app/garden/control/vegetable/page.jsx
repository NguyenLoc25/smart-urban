'use client';

import Link from 'next/link';
import { Sprout, Droplets, Home } from 'lucide-react';

export default function VegetablePage() {
  return (
    <section className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Tiêu đề */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">🥬 Vegetable Control</h1>
        <p className="text-sm text-gray-500">Điều khiển các khu vực trồng rau, thủy canh và nhà nấm</p>
      </div>

      {/* Các khối điều khiển */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Vườn rau */}
        <Link href="/garden/control/vegetable/GardenControl" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl dark:bg-gray-800 dark:hover:bg-green-700 hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-300 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">🌱</div>
            </div>
            <Sprout className="z-10 text-green-600 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Vườn Rau</span>
          </div>
        </Link>

        {/* Thủy canh */}
        <Link href="/garden/control/vegetable/HydroponicControl" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl dark:bg-gray-800 dark:hover:bg-green-700 hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-blue-300 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">💧</div>
            </div>
            <Droplets className="z-10 text-blue-500 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Thủy Canh</span>
          </div>
        </Link>

        {/* Nhà nấm */}
        <Link href="/garden/control/vegetable/MushroomControl" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl dark:bg-gray-800 dark:hover:bg-green-700 hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-purple-300 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">🏠</div>
            </div>
            <Home className="z-10 text-purple-500 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Nhà Nấm</span>
          </div>
        </Link>
      </div>

      <p className="text-center text-xs text-gray-400 italic">
        Hệ thống rau thông minh • Kiểm soát từng khu vực
      </p>
    </section>
  );
}
