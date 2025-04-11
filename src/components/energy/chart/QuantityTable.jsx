import React from "react";

export default function QuantityTable({ data }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Số lượng vị trí</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Trạng thái</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Total Positions */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tổng vị trí</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{data.total}</div>
        </div>
        
        {/* Used Positions */}
        <div className="bg-red-50/50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Đã sử dụng</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data.used}</div>
          <div className="text-xs mt-1 text-red-500 dark:text-red-400">
            {Math.round((data.used / data.total) * 100)}% đã sử dụng
          </div>
        </div>
        
        {/* Available Positions */}
        <div className="bg-green-50/50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Còn trống</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data.available}</div>
          <div className="text-xs mt-1 text-green-500 dark:text-green-400">
            {Math.round((data.available / data.total) * 100)}% còn trống
          </div>
        </div>
      </div>
      
      {/* Optional: Progress bar */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-green-500" 
            style={{
              width: `${(data.used / data.total) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}