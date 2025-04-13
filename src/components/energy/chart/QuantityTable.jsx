import React from "react";

export default function QuantityTable({ data }) {
  const usedPercentage = Math.round((data.used / data.total) * 100);
  const availablePercentage = Math.round((data.available / data.total) * 100);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Số lượng vị trí</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tổng quan tình trạng sử dụng</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Hoạt động</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Positions */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng vị trí</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{data.total}</div>
            </div>
          </div>
        </div>
        
        {/* Used Positions */}
        <div className="bg-gradient-to-br from-red-50/70 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-200/50 dark:bg-red-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Đã sử dụng</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data.used}</div>
              <div className="text-xs mt-1 text-red-500 dark:text-red-400">
                {usedPercentage}% đã sử dụng
              </div>
            </div>
          </div>
        </div>
        
        {/* Available Positions */}
        <div className="bg-gradient-to-br from-green-50/70 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-200/50 dark:bg-green-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Còn trống</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data.available}</div>
              <div className="text-xs mt-1 text-green-500 dark:text-green-400">
                {availablePercentage}% còn trống
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>Tỷ lệ sử dụng</span>
          <span>{usedPercentage}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-green-500 relative"
            style={{ width: `${usedPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}