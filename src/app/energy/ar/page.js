"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import ARVideo from "@/components/energy/ar/Ar";

const AR = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (err) => {
        setError("Đã xảy ra lỗi khi kiểm tra đăng nhập");
        setLoading(false);
        console.error("Auth error:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-6 max-w-md bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/50">
          <h3 className="text-lg font-medium text-red-700 dark:text-red-300">
            {error}
          </h3>
          <p className="mt-2 text-red-600 dark:text-red-400/80">
            Vui lòng thử tải lại trang hoặc liên hệ hỗ trợ nếu lỗi tiếp diễn
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 rounded-md text-sm font-medium transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Truy cập bị hạn chế
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bạn cần đăng nhập để xem bảng điều khiển năng lượng thông minh.
          </p>
          <div className="space-y-3">
            <a
              href="/login"
              className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              Đăng nhập ngay
            </a>
            <a
              href="/register"
              className="block w-full px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow-sm transition-colors"
            >
              Tạo tài khoản mới
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ARVideo />
    </div>
  );
};

export default AR;
