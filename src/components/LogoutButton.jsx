"use client";
import { signOut } from "next-auth/react";
import { logoutUser } from "@/lib/user";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Đăng xuất Firebase nếu có
      await signOut(); // Đăng xuất NextAuth nếu có
      router.push("/login"); // Chuyển về trang đăng nhập
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    }
  };

  return (
    <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
      Đăng xuất
    </button>
  );
}
