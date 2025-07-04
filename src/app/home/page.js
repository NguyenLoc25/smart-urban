'use client';

import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import {
  PiDoorOpenFill,
  PiLightbulbFilamentFill,
  PiGarageFill,
} from 'react-icons/pi';
// ❌ Xoá dòng dưới nếu không còn dùng chat assistant
// import ChatAssistant from '@/components/ChatAssistant';

export default function HomePage() {
  const floors = [
    {
      id: 1,
      name: 'Tầng 1',
      description: 'Quản lý cửa chính, nhà xe, đèn tự động, báo trộm, nhiệt độ & độ ẩm.',
      gradient: 'from-[#6a11cb] to-[#2575fc]',
      icon: <PiDoorOpenFill size={36} />,
    },
    {
      id: 2,
      name: 'Tầng 2',
      description: 'Hệ thống đèn, báo cháy và còi cảnh báo.',
      gradient: 'from-[#00b09b] to-[#96c93d]',
      icon: <PiLightbulbFilamentFill size={36} />,
    },
    {
      id: 3,
      name: 'Tầng 3',
      description: 'Cửa vân tay và đèn giám sát thông minh.',
      gradient: 'from-[#f953c6] to-[#b91d73]',
      icon: <PiGarageFill size={36} />,
    },
  ];

  return (
    <div className="min-h-screen relative text-gray-800 dark:text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/background.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-10 dark:opacity-20"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/80 dark:from-black/30 dark:to-gray-900/70 backdrop-blur-sm z-10" />

      {/* Main content */}
      <div className="relative z-20 container mx-auto px-6 py-16">
        <h1 className="text-5xl font-extrabold mb-4 text-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-yellow-400 dark:to-orange-500 drop-shadow-lg">
          SMART-HOME
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-200 text-center mb-12 drop-shadow-sm">
          🌟 Chào mừng bạn đến với cuộc sống tối giản – nơi ngôi nhà hiểu bạn.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {floors.map((floor) => (
            <Link key={floor.id} href={`/home/floor${floor.id}`}>
              <div
                className={`rounded-3xl p-6 shadow-2xl bg-gradient-to-br ${floor.gradient} text-white transition-all duration-300 hover:scale-[1.03] cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-2xl font-bold italic drop-shadow-sm">
                    {floor.icon}
                    {floor.name}
                  </div>
                  <FiChevronRight
                    size={28}
                    className="text-white group-hover:translate-x-1 transition"
                  />
                </div>
                <p className="text-base md:text-lg font-light leading-relaxed">
                  {floor.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ❌ Bỏ phần chat box */}
      {/* <ChatAssistant /> */}
    </div>
  );
}
