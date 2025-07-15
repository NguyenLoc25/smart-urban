'use client';
import React, { useState } from "react";

export default function AdviceChart({ 
  renewableEnergy = 0, 
  consumption = 0, 
  loading = false 
}) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculations
  const percentage = consumption > 0 
    ? (renewableEnergy / consumption) * 100
    : renewableEnergy > 0 ? Infinity : 0;
  
  const status = renewableEnergy >= consumption 
    ? (renewableEnergy > consumption ? "dư" : "đủ")
    : "thiếu";
  
  const difference = Math.abs(renewableEnergy - consumption);
  const percentageText = percentage === Infinity ? "∞" : percentage.toFixed(2);

  // Color schemes
  const statusColors = {
    "đủ": { 
      bg: "from-green-400 to-green-500", 
      text: "text-green-700",
      icon: "✓",
      message: "Cân bằng hoàn hảo"
    },
    "dư": { 
      bg: "from-blue-400 to-blue-600", 
      text: "text-blue-700",
      icon: "💡",
      message: "Năng lượng dư thừa"
    },
    "thiếu": { 
      bg: "from-orange-400 to-orange-500", 
      text: "text-orange-700",
      icon: "⚠️",
      message: "Cần hành động"
    }
  };

  return (
    <div className={`bg-gradient-to-r ${statusColors[status].bg} p-4 sm:p-6 rounded-xl shadow-lg text-white transition-all duration-300`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
        <h3 className="text-lg sm:text-xl font-bold">Trạng thái năng lượng</h3>
        <span className="text-xs sm:text-sm bg-white/20 px-2 py-1 rounded-full self-start sm:self-auto">
          {statusColors[status].icon} {statusColors[status].message}
        </span>
      </div>
      
      {/* Main Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex-1">
          <p className="text-2xl sm:text-3xl font-bold mb-1">{status.toUpperCase()}</p>
          <p className="text-xs sm:text-sm opacity-90">
            {status === "đủ" 
              ? "Năng lượng tái tạo vừa đủ"
              : status === "dư" 
                ? `Dư ${difference.toLocaleString()} kWh`
                : `Thiếu ${difference.toLocaleString()} kWh`}
          </p>
        </div>
        <div className="text-right bg-white/10 p-2 sm:p-3 rounded-lg flex-1 sm:max-w-[160px]">
          <p className="text-3xl sm:text-4xl font-bold">{percentageText}%</p>
          <p className="text-xs sm:text-sm opacity-90">Tỉ lệ đáp ứng</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="w-full bg-gray-300/30 rounded-full h-2 sm:h-3 mb-1 sm:mb-2">
          <div 
            className={`h-2 sm:h-3 rounded-full ${
              status === "thiếu" ? "bg-orange-500" : 
              status === "đủ" ? "bg-green-500" : "bg-blue-500"
            }`} 
            style={{ 
              width: `${percentage === Infinity ? 100 : Math.min(percentage, 100)}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs px-1">
          <span>0%</span>
          <span>100%</span>
          {percentage > 100 && <span className="text-blue-200">Dư {percentage.toFixed(0)}%</span>}
        </div>
      </div>

      {/* Toggle Details Button */}
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className={`w-full py-2 sm:py-3 mb-3 sm:mb-4 flex items-center justify-center gap-2 bg-white/20 rounded-lg hover:bg-white/30 transition ${showDetails ? 'rounded-b-none' : ''} text-sm sm:text-base`}
      >
        {showDetails ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Ẩn chi tiết
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Xem chi tiết
          </>
        )}
      </button>

      {/* Detailed Section */}
      {showDetails && (
        <div className="mt-0 p-3 sm:p-4 bg-white/10 rounded-b-lg backdrop-blur-sm animate-fadeIn">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="bg-white/5 p-2 sm:p-3 rounded-lg">
              <p className="text-xs sm:text-sm opacity-80 mb-1">Sản xuất</p>
              <p className="font-bold text-lg sm:text-xl">
                {loading ? '...' : `${renewableEnergy.toLocaleString()} kWh`}
              </p>
            </div>
            <div className="bg-white/5 p-2 sm:p-3 rounded-lg">
              <p className="text-xs sm:text-sm opacity-80 mb-1">Tiêu thụ</p>
              <p className="font-bold text-lg sm:text-xl">
                {loading ? '...' : `${consumption.toLocaleString()} kWh`}
              </p>
            </div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${statusColors[status].text} bg-white/90`}>
            <p className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Khuyến nghị:</p>
            {status === "đủ" ? (
              <p className="text-xs sm:text-sm">Hệ thống đang hoạt động ở trạng thái tối ưu. Tiếp tục duy trì hiệu suất hiện tại.</p>
            ) : status === "dư" ? (
              <div>
                <p className="text-xs sm:text-sm mb-1 sm:mb-2">Hệ thống đang sản xuất dư thừa năng lượng. Bạn có thể:</p>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                  <li>Lưu trữ lượng điện dư vào hệ thống pin</li>
                  <li>Bán lại điện cho lưới điện</li>
                  <li>Điều chỉnh giảm sản lượng nếu cần</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-xs sm:text-sm mb-1 sm:mb-2">Hệ thống đang thiếu hụt năng lượng. Cần:</p>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                  <li>Bổ sung {difference.toLocaleString()} kWh từ nguồn khác</li>
                  <li>Giảm tiêu thụ bằng cách tối ưu hóa thiết bị</li>
                  <li>Xem xét tăng sản xuất năng lượng tái tạo</li>
                  <li>Kiểm tra hệ thống có sự cố không</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}