'use client';

import Image from 'next/image';
import { SparklesIcon } from 'lucide-react';

const teamMembers = [
  {
    name: 'Trần Nhã Linh',
    role: 'Web Development & IoT Design',
    image: '/garden/member4.jpg', 
  },
  {
    name: 'Huỳnh Kim Xuyến',
    role: 'IoT Concept & Hardware Design',
    image: '/garden/member3.jpg',
  },
  {
    name: 'ThS. Nguyễn Thị Tú Trinh',
    role: 'Supervisor',
    image: '/garden/member2.jpg',
  },
  {
    name: 'ThS. Hồ Văn Bình',
    role: 'Supervisor',
    image: '/garden/member1.jpg',
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-900 text-green-900 dark:text-green-100 px-6 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex justify-center items-center gap-3 mb-4 animate-pulse">
          <SparklesIcon className="text-green-500 w-8 h-8" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-green-600 to-teal-500 bg-clip-text text-transparent">
            Về Chúng Tôi
          </h1>
          <SparklesIcon className="text-green-500 w-8 h-8" />
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12">
          <span className="font-semibold text-green-600 dark:text-green-300">Smart Urban - Garden</span> là dự án tự động hóa nông nghiệp ứng dụng công nghệ IoT, giúp người dùng giám sát và điều khiển khu vườn thông minh từ xa với dữ liệu thời gian thực và giao diện tương tác thân thiện.
        </p>

        <h2 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-8 relative inline-block">
          <span className="relative z-10">✨ Đội Ngũ Thực Hiện ✨</span>
          <span className="absolute left-0 bottom-1 w-full h-2 bg-gradient-to-r from-green-300 via-yellow-200 to-pink-300 blur-sm rounded-full -z-1"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 p-6 flex flex-col items-center group border border-green-100 dark:border-green-700"
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-green-300 dark:border-green-500 mb-4 shadow-lg">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200 group-hover:text-yellow-500 transition">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
