'use client';

import { useState } from 'react';
import { LifeBuoy, MessageCircleQuestion, BookOpenCheck, PhoneCall, X, SparklesIcon} from 'lucide-react';

const supports = [
  {
    icon: <LifeBuoy className="w-8 h-8 text-green-500" />,
    title: 'Hướng dẫn sử dụng',
    description: 'Chi tiết cách vận hành hệ thống và kiểm soát các thiết bị vườn thông minh.',
  },
  {
    icon: <MessageCircleQuestion className="w-8 h-8 text-green-500" />,
    title: 'Câu hỏi thường gặp',
    description: 'Giải đáp những thắc mắc phổ biến về hệ thống và tính năng.',
  },
  {
    icon: <BookOpenCheck className="w-8 h-8 text-green-500" />,
    title: 'Tài liệu kỹ thuật',
    description: 'Tổng hợp tài liệu kỹ thuật liên quan đến phần cứng và phần mềm.',
  },
  {
    icon: <PhoneCall className="w-8 h-8 text-green-500" />,
    title: 'Liên hệ hỗ trợ',
    description: 'Kết nối nhanh chóng với đội ngũ để được hỗ trợ trực tiếp khi gặp sự cố.',
  },
];

export default function Support() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-900 text-green-900 dark:text-green-100 px-6 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-green-600 to-teal-500 bg-clip-text text-transparent mb-6">
          Hỗ Trợ
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Trung tâm hỗ trợ của <span className="font-semibold text-green-600 dark:text-green-300">Smart Urban - Garden</span> sẵn sàng giải đáp và hướng dẫn để bạn vận hành hệ thống hiệu quả.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
          {supports.map((item, index) => (
            <button
              key={index}
              onClick={() => setIsOpen(true)}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-green-100 dark:border-green-700 hover:shadow-2xl transition-transform hover:-translate-y-2 focus:outline-none"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-green-700 dark:text-green-200 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal thông báo */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl text-center relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-200 mb-4">Thông báo</h2>
            <p className="text-gray-700 dark:text-gray-300">Tính năng đang được cập nhật. Vui lòng quay lại sau!</p>
          </div>
        </div>
      )}
    </div>
  );
}
