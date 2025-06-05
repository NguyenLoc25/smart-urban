'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function Floor2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      {/* Nút quay về trang chủ */}
      <Link href="/home" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Quay lại
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Quản lý Tầng 2</h1>
        <p className="text-gray-700 mb-6">Giám sát và điều khiển các thiết bị thông minh ở tầng 1.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-4 rounded-xl shadow hover:bg-blue-200 transition">
            <h2 className="text-lg font-semibold text-blue-800">Đèn phòng khách</h2>
            <p className="text-gray-600">Bật/tắt, hẹn giờ</p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl shadow hover:bg-green-200 transition">
            <h2 className="text-lg font-semibold text-green-800">Cửa ra vào</h2>
            <p className="text-gray-600">Mở cửa bằng mật khẩu</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl shadow hover:bg-yellow-200 transition">
            <h2 className="text-lg font-semibold text-yellow-800">Cảm biến chuyển động</h2>
            <p className="text-gray-600">Giám sát chuyển động 24/7</p>
          </div>
          <div className="bg-red-100 p-4 rounded-xl shadow hover:bg-red-200 transition">
            <h2 className="text-lg font-semibold text-red-800">Báo động</h2>
            <p className="text-gray-600">Kích hoạt khi có xâm nhập</p>
          </div>
        </div>
      </div>
    </div>
  );
}
