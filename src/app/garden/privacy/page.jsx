'use client';

import { ShieldCheck, Lock, UserX, Ban, CheckCircle, SparklesIcon } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-900 text-green-900 dark:text-green-100 px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center gap-3 mb-4 animate-pulse">
          <SparklesIcon className="text-green-500 w-8 h-8" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-green-600 to-teal-500 bg-clip-text text-transparent">
            Chính Sách Quyền Riêng Tư
          </h1>
          <SparklesIcon className="text-green-500 w-8 h-8" />
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Chúng tôi cam kết tôn trọng và bảo vệ quyền riêng tư của người dùng trong quá trình sử dụng hệ thống <span className="font-semibold text-green-600 dark:text-green-300">Smart Urban - Garden</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-green-100 dark:border-green-700">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-green-500" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Dữ liệu thu thập</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Chỉ thu thập các dữ liệu như nhiệt độ, độ ẩm, mực nước nhằm phục vụ điều khiển và giám sát.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-green-100 dark:border-green-700">
            <div className="flex items-center gap-3 mb-2">
              <UserX className="text-green-500" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Không thu thập thông tin cá nhân</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Không yêu cầu hoặc lưu trữ thông tin như tên, email, số điện thoại,...</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-green-100 dark:border-green-700">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="text-green-500" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Bảo mật dữ liệu</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Dữ liệu được lưu trữ an toàn, chỉ sử dụng nội bộ trong hệ thống.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-green-100 dark:border-green-700">
            <div className="flex items-center gap-3 mb-2">
              <Ban className="text-green-500" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Không chia sẻ bên thứ ba</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Cam kết không chia sẻ, bán hoặc tiết lộ dữ liệu cho bất kỳ bên thứ ba nào.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-green-100 dark:border-green-700 sm:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-500" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Sự đồng ý của bạn</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Việc sử dụng hệ thống đồng nghĩa với việc bạn đồng ý với chính sách sử dụng dữ liệu phục vụ mục đích tự động hóa và giám sát.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
