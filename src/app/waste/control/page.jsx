'use client';

import { useEffect, useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Sun, Moon, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginButton from "@/components/LoginButton";

export default function ControlPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayNight, setDayNight] = useState("loading");

  const db = getDatabase();
  const isNight = dayNight === "isNight";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    const fetchStatus = async () => {
      const snapshot = await get(ref(db, "/dayNight/currentStatus/status"));
      if (snapshot.exists()) {
        setDayNight(snapshot.val());
      }
    };

    fetchStatus();
    return () => unsubscribe();
  }, []);

  const toggleDayNight = async () => {
    const newVal = isNight ? "isDay" : "isNight";
    await set(ref(db, "/dayNight/currentStatus/status"), newVal);
    setDayNight(newVal);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Đang kiểm tra đăng nhập...</div>;
  }

  if (!user) {
    return (
      <div className="w-full text-center py-12">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Bạn cần đăng nhập để điều khiển hệ thống</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Chỉ người dùng đã xác thực mới có thể thao tác điều khiển.</p>
        <div className="mt-6">
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Settings className="text-blue-500" size={28} />
        Điều khiển hệ thống
      </h1>

      <Card className="border-blue-300 dark:border-blue-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-blue-700 dark:text-blue-300 text-base font-medium flex items-center gap-2">
            {isNight ? <Moon size={20} /> : <Sun size={20} />}
            Chế độ hoạt động
          </CardTitle>
          <label className="relative inline-flex items-center cursor-pointer scale-90">
            <input
              type="checkbox"
              checked={isNight}
              onChange={toggleDayNight}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full dark:bg-gray-600 peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {isNight
              ? "🌙 Đang ở chế độ ban đêm – xe sẽ hoạt động."
              : "🌞 Đang ở chế độ ban ngày – xe sẽ không hoạt động."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
