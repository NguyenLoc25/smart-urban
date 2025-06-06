'use client';
import React from "react";

export default function SyncStatus({ syncStatus, lastSyncTime }) {
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center space-x-2">
        {syncStatus.isSyncing ? (
          <>
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            <span className="text-sm">Đang đồng bộ dữ liệu...</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Dữ liệu đã đồng bộ</span>
          </>
        )}
      </div>
      {lastSyncTime && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Cập nhật lúc: {new Date(lastSyncTime).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}