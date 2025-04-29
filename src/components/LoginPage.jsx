"use client";
import { useState, useEffect } from "react";
import { signInWithGoogle, loginUser, getUserInfo, logoutUser } from "@/lib/user";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(""); // Error for email
  const [passwordError, setPasswordError] = useState(""); // Error for password
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUserInfo();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };
    fetchUser();
  }, []);

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email không được để trống.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email không hợp lệ.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Mật khẩu không được để trống.");
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    validateEmail();
    validatePassword();

    if (emailError || passwordError) return;

    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      router.push("/");
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
      router.push("/");
    } catch (err) {
      setError("Đăng nhập với Google thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        {user ? (
          <>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Đăng nhập</h1>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail} // Validate on blur
              className={`border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm flex items-center gap-2">
                <span>⚠️</span> {/* Error icon */}
                {emailError}
              </p>
            )}

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword} // Validate on blur
              className={`border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm flex items-center gap-2">
                <span>⚠️</span> {/* Error icon */}
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className={`flex items-center justify-center gap-2 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                className="w-5 h-5"
              />
              {loading ? "Đang xử lý..." : "Đăng nhập với Google"}
            </button>
          </div>
        </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Đăng nhập</h1>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail} // Validate on blur
                className={`border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm flex items-center gap-2">
                  <span>⚠️</span> {/* Error icon */}
                  {emailError}
                </p>
              )}

              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword} // Validate on blur
                className={`border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm flex items-center gap-2">
                  <span>⚠️</span> {/* Error icon */}
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-4">
              <button
                onClick={handleGoogleLogin}
                className={`flex items-center justify-center gap-2 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                {loading ? "Đang xử lý..." : "Đăng nhập với Google"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}