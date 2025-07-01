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
    <div className={`bg-gradient-to-r ${statusColors[status].bg} p-6 rounded-xl shadow-lg text-white transition-all duration-300`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">Trạng thái năng lượng</h3>
        <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
          {statusColors[status].icon} {statusColors[status].message}
        </span>
      </div>
      
      {/* Main Status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-3xl font-bold mb-1">{status.toUpperCase()}</p>
          <p className="text-sm opacity-90">
            {status === "đủ" 
              ? "Năng lượng tái tạo vừa đủ"
              : status === "dư" 
                ? `Dư ${difference.toLocaleString()} kWh`
                : `Thiếu ${difference.toLocaleString()} kWh`}
          </p>
        </div>
        <div className="text-right bg-white/10 p-3 rounded-lg">
          <p className="text-4xl font-bold">{percentageText}%</p>
          <p className="text-sm opacity-90">Tỉ lệ đáp ứng</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-300/30 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full ${
              status === "thiếu" ? "bg-orange-500" : 
              status === "đủ" ? "bg-green-500" : "bg-blue-500"
            }`} 
            style={{ 
              width: `${percentage === Infinity ? 100 : Math.min(percentage, 100)}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs px-1">
          <span>0%</span>
          <span>100%</span>
          {percentage > 100 && <span className="text-blue-200">Dư {percentage.toFixed(0)}%</span>}
        </div>
      </div>

      {/* Toggle Details Button */}
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className={`w-full py-3 mb-4 flex items-center justify-center gap-2 bg-white/20 rounded-lg hover:bg-white/30 transition ${showDetails ? 'rounded-b-none' : ''}`}
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
        <div className="mt-0 p-4 bg-white/10 rounded-b-lg backdrop-blur-sm animate-fadeIn">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm opacity-80 mb-1">Sản xuất</p>
              <p className="font-bold text-xl">
                {loading ? '...' : `${renewableEnergy.toLocaleString()} kWh`}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm opacity-80 mb-1">Tiêu thụ</p>
              <p className="font-bold text-xl">
                {loading ? '...' : `${consumption.toLocaleString()} kWh`}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${statusColors[status].text} bg-white/90`}>
            <p className="font-semibold text-lg mb-2">Khuyến nghị:</p>
            {status === "đủ" ? (
              <p className="text-sm">Hệ thống đang hoạt động ở trạng thái tối ưu. Tiếp tục duy trì hiệu suất hiện tại.</p>
            ) : status === "dư" ? (
              <div>
                <p className="text-sm mb-2">Hệ thống đang sản xuất dư thừa năng lượng. Bạn có thể:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Lưu trữ lượng điện dư vào hệ thống pin</li>
                  <li>Bán lại điện cho lưới điện</li>
                  <li>Điều chỉnh giảm sản lượng nếu cần</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-2">Hệ thống đang thiếu hụt năng lượng. Cần:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
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