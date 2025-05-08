"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebaseConfig";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <div
      className="min-h-screen 
      bg-gradient-to-br from-white to-blue-50 
      dark:from-gray-900 dark:to-gray-800 
      text-gray-900 dark:text-white 
      px-6 py-10 text-center 
      flex flex-col items-center justify-center relative"
    >
      {/* Banner */}
      <div className="w-full max-w-5xl">
        <Image
          src="/smart-waste-banner.jpg"
          alt="Smart Waste Banner"
          width={1200}
          height={400}
          priority
          className="rounded-2xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 hover:scale-105 transition"
        />
      </div>

      {/* Tiêu đề */}
      <h1 className="mt-10 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        <span className="inline-block animate-bounce">👋</span>{" "}
        {user?.displayName
          ? `Xin chào, ${user.displayName}`
          : "Chào mừng đến với"}{" "}
        <span className="text-green-600 dark:text-green-400">
          Smart Waste Dashboard
        </span>
      </h1>

      {/* Mô tả */}
      <p className="mt-6 text-gray-600 dark:text-gray-300 text-lg max-w-2xl leading-relaxed">
        Nền tảng theo dõi và điều phối quy trình{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          thu gom
        </span>
        ,{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          phân loại
        </span>{" "}
        và{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          tái chế
        </span>{" "}
        rác thải thông minh.
        <br />
        Trực quan – Hiệu quả – Tự động hóa.
      </p>

      {/* Nút chuyển sang dashboard */}
      <Link href="/waste/dashboard">
        <Button
          className="mt-8 px-8 py-4 text-lg rounded-xl 
          bg-gradient-to-r from-green-500 to-green-600 
          hover:from-green-600 hover:to-green-700 
          text-white shadow-lg dark:shadow-green-700/50 
          transition hover:scale-105"
        >
          🚀 Bắt đầu giám sát ngay
        </Button>
      </Link>
    </div>
  );
}
