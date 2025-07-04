"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import SolarPlace from "@/components/energy/iot/solarplace/SolarPlace";

const Page = () => {
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

  return user ? <SolarPlace /> : (
    <div className="w-full text-center">
      <h1 className="text-2xl font-semibold text-gray-800">Bạn cần đăng nhập để xem nội dung</h1>
      <p className="text-gray-600 mt-2">Hãy đăng nhập để tiếp tục khám phá các giải pháp năng lượng.</p>
    </div>
  );
};

export default Page;
