import React from "react";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      ))}
    </div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  </div>
);

export default LoadingSkeleton;