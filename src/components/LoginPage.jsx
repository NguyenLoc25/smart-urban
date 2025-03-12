"use client";
import { useState, useEffect } from "react";
import { signInWithGoogle, loginUser, getUserInfo, logoutUser } from "@/lib/user";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUserInfo();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };  

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-80px)] max-h-[80vh] bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <img src={user.photoURL || "/default-avatar.png"} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-gray-300" />
            <p className="text-xl font-semibold">{user.displayName || user.email}</p>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
  
            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                required 
              />
              <input 
                type="password" 
                placeholder="Mật khẩu" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" 
                required 
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
              >
                Đăng nhập
              </button>
            </form>
  
            <div className="mt-4">
              <button 
                onClick={handleGoogleLogin} 
                className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
              >
                <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
                Đăng nhập với Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}  
