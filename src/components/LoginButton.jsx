"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithGoogle, getUserInfo } from "@/lib/user";

export default function LoginButton() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUserInfo();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      // Đăng nhập vào Firebase trước
      const firebaseUser = await signInWithGoogle();
      setUser(firebaseUser);


      // Chuyển hướng sau khi đăng nhập thành công
      router.push("/");
    } catch (err) {
      setError(err.message);
      console.error("Lỗi đăng nhập Google:", err);
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin} 
      className="bg-red-500 text-white p-2 rounded mt-2 hover:bg-red-600 transition-all"
    >
      Đăng nhập với Google
    </button>
  );
}
