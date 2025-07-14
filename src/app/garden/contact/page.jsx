'use client';

import { Mail, Phone, MapPin, Send, SparklesIcon } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-900 px-6 py-12 text-green-900 dark:text-green-100">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center items-center gap-3 mb-4 animate-pulse">
          <SparklesIcon className="text-green-500 w-8 h-8" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-green-600 to-teal-500 bg-clip-text text-transparent">
            Liên Hệ
          </h1>
          <SparklesIcon className="text-green-500 w-8 h-8" />
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Nếu bạn có bất kỳ thắc mắc nào về hệ thống Smart Urban - Garden, đừng ngần ngại liên hệ với chúng tôi qua các kênh bên dưới.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-green-100 dark:border-green-700">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-green-500" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Email</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">SmartGarden@gmail.com</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-green-100 dark:border-green-700">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="text-green-500" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Số điện thoại</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">+84 123 456 789</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-green-100 dark:border-green-700 sm:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="text-green-500" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Địa chỉ</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300"> 227 Nguyễn Văn Cừ, Phường, Chợ Quán, Hồ Chí Minh TP.HCM</p>
          </div>
        </div>

 
      </div>
    </div>
  );
}
