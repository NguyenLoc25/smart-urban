import React from "react";

const AuthRequiredMessage = () => (
  <div className="text-center py-16">
    <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-red-500 dark:text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
      Yêu cầu xác thực
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
      Vui lòng đăng nhập để xem dữ liệu năng lượng và phân tích
    </p>
  </div>
);

export default AuthRequiredMessage;