"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/user";

export default function LoginButtonFixed({ className = "" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    if (loading) return; // Ngăn bấm liên tục
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("🔥 Google Login Error:", err);
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
