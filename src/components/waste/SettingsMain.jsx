"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import LoginButton from "@/components/LoginButton";

export default function SettingsMain() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayNightStatus, setDayNightStatus] = useState("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const statusRef = ref(db, "/dayNight/currentStatus/status");

    onValue(statusRef, (snapshot) => {
      setDayNightStatus(snapshot.val());
    });
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Đang kiểm tra đăng nhập...</div>;
  }

  if (!user) {
    return (
      <div className="w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Bạn cần đăng nhập để xem nội dung</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Hãy đăng nhập để truy cập phần cài đặt hệ thống.</p>
        <div className="mt-4">
          <LoginButton />
        </div>
      </div>
    );
  }

  const isNight = dayNightStatus === "isNight";
  const statusText = isNight ? "Ban đêm" : "Ban ngày";
  const vehicleStatus = isNight ? "Đang hoạt động" : "Không hoạt động";
  const conveyorStatus = "Chưa hoạt động";

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        ⚙️ Cài đặt hệ thống
      </h1>

      {/* Trạng thái ngày đêm */}
      <div className="p-5 rounded-xl shadow bg-blue-200 text-blue-900 border-l-4 border-blue-600 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-400">
        <p className="font-semibold text-lg flex items-center gap-2">
          🌙 Trạng thái: {statusText}
        </p>
      </div>

      {/* Trạng thái xe */}
      <div className={`p-5 rounded-xl shadow border-l-4 ${
        isNight
          ? "bg-green-200 text-green-900 border-green-600 dark:bg-green-900 dark:text-green-100 dark:border-green-400"
          : "bg-gray-200 text-gray-900 border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-400"
      }`}>
        <p className="font-semibold text-lg flex items-center gap-2">
          🚛 Xe: {vehicleStatus}
        </p>
      </div>

      {/* Trạng thái băng chuyền */}
      <div className="p-5 rounded-xl shadow bg-yellow-200 text-yellow-900 border-l-4 border-yellow-600 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-400">
        <p className="font-semibold text-lg flex items-center gap-2">
          📦 Băng chuyền: {conveyorStatus}
        </p>
      </div>

      {/* Gợi ý / chú thích */}
      <div className="p-4 mt-4 text-sm italic border rounded-lg bg-white text-gray-600 border-gray-300 shadow-sm dark:bg-gray-900 dark:text-gray-400">
        📝 Các chức năng điều khiển chi tiết sẽ được cập nhật sau. Mọi trạng thái hiện tại đang được đồng bộ theo thời gian thực.
      </div>
    </div>
  );
}
