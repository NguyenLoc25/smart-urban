// TotalChart/components/States/EmptyState.jsx
import React from 'react';

const EmptyState = () => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
    <div className="text-gray-400 dark:text-gray-500 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-gray-500 dark:text-gray-300 font-medium">Không có dữ liệu để hiển thị</p>
    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Vui lòng chọn khoảng thời gian khác</p>
  </div>
);

export default EmptyState;