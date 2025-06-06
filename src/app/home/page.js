'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        SMART-HOME
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-10">
        Chào mừng đến với ngôi nhà thông minh
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((floor, idx) => {
          const bgColors = [
            'from-purple-500 to-indigo-400',
            'from-teal-500 to-emerald-400',
            'from-pink-500 to-rose-400',
          ];
          const textColor = 'text-white';

          return (
            <Link key={floor} href={`/home/floor${floor}`}>
              <div
                className={`h-52 rounded-2xl shadow-xl bg-gradient-to-br ${bgColors[idx]} hover:scale-105 transform transition-all duration-300 cursor-pointer flex flex-col justify-center items-center p-6`}
              >
                <h2 className={`text-3xl font-bold ${textColor} mb-2`}>
                  Tầng {floor}
                </h2>
                <p className={`${textColor} text-base`}>
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
