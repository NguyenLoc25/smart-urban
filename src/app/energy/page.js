"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import LoginButton from "@/components/LoginButton";

const EnergyPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <div>
          {/* Nội dung trang khi đã đăng nhập */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Energy</h1>
          <p className="text-lg text-gray-700">
            Khám phá các giải pháp năng lượng tái tạo và cách tối ưu hóa hiệu suất sử dụng điện cho ngôi nhà của bạn.
          </p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Giải pháp năng lượng</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Năng lượng mặt trời</li>
              <li>Năng lượng gió</li>
              <li>Hệ thống lưu trữ điện</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center">
          {/* Hiển thị khi chưa đăng nhập */}
          <h1 className="text-2xl font-semibold text-gray-800">Bạn cần đăng nhập để xem nội dung</h1>
          <p className="text-gray-600 mt-2">Hãy đăng nhập để tiếp tục khám phá các giải pháp năng lượng.</p>
          <div className="mt-4">
            <LoginButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyPage;
