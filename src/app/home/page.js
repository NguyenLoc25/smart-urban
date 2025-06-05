'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      {/* Tiêu đề màu đỏ đậm */}
      <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
        SMART HOME
      </h1>

      <p className="text-xl text-gray-700 dark:text-gray-300 mb-10">
        Chào mừng đến với ngôi nhà thông minh của bạn
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((floor, idx) => {
          const bgColors = [
            'from-yellow-400 to-yellow-200',
            'from-teal-400 to-emerald-300',
            'from-pink-400 to-rose-300',
          ];

          return (
            <Link key={floor} href={`/home/floor${floor}`}>
              <div
                className={`h-64 rounded-2xl shadow-xl bg-gradient-to-br ${bgColors[idx]} bg-opacity-90 hover:scale-105 transform transition-all duration-300 cursor-pointer flex flex-col justify-center items-center p-6`}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 drop-shadow-sm">
                  Tầng {floor}
                </h2>
                <p className="text-gray-800 dark:text-gray-200 text-base">
                  Xem và quản lý các thiết bị thông minh
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
