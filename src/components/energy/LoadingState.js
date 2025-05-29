'use client';
import React from "react";

const loadingMessages = {
  initial: "⏳ Đang chuẩn bị dữ liệu...",
  posting: "🔄 Đang gửi dữ liệu lên server...",
  fetching: "📥 Đang tải dữ liệu mới từ server...",
  complete: "✅ Hoàn tất! Đang hiển thị kết quả..."
};

const loadingProgress = {
  initial: 20,
  posting: 50,
  fetching: 80,
  complete: 100
};

export default function LoadingState({ dataProcessingStage, energyDevices }) {
  const currentMessage = loadingMessages[dataProcessingStage] || "Đang tải...";
  const currentProgress = loadingProgress[dataProcessingStage] || 30;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
              style={{ animationDuration: '1.5s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">
                {dataProcessingStage === 'posting' && '📤'}
                {dataProcessingStage === 'fetching' && '📥'}
                {dataProcessingStage === 'initial' && '⏳'}
                {dataProcessingStage === 'complete' && '✅'}
              </span>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 text-center">
            {currentMessage}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            {dataProcessingStage === 'posting' && 'Vui lòng chờ trong giây lát...'}
            {dataProcessingStage === 'fetching' && 'Dữ liệu đang được xử lý...'}
            {dataProcessingStage === 'initial' && 'Đang khởi tạo hệ thống...'}
            {dataProcessingStage === 'complete' && 'Đang hoàn tất quá trình...'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Tiến trình</span>
            <span>{currentProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500 dark:text-gray-400">
            <p>Trạng thái hiện tại: <span className="font-mono">{dataProcessingStage}</span></p>
            <p className="mt-1">Số lượng thiết bị: <span className="font-mono">{energyDevices.length}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}