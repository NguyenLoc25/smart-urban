'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { Sun, Moon, Settings, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginButtonFixed from '@/components/waste/LoginButtonFixed';

export default function ControlPage() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('loading');
  const [isSimulating, setIsSimulating] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const db = getDatabase();
  const isNight = mode === 'night';

  // Kiểm tra đăng nhập
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && u.email !== 'nguyenhoangviet4969@gmail.com') {
        alert('❌ Email không được cấp quyền truy cập!');
        signOut(auth);
        setUser(null);
      } else {
        setUser(u);
      }
      setReady(true);
    });
    return unsub;
  }, []);

  // Đọc chế độ từ Firebase
  useEffect(() => {
    if (!user) return;
    const fetchMode = async () => {
      try {
        const snap = await get(ref(db, '/waste/carControl/mode'));
        if (snap.exists()) setMode(snap.val());
      } catch (err) {
        console.error('🔐 Firebase error:', err.code);
      }
    };
    fetchMode();
  }, [user]);

  // Toggle thủ công
  const toggleDayNight = async () => {
    if (isSimulating) {
      alert('⚠️ Đang bật mô phỏng, không thể điều khiển thủ công!');
      return;
    }
    const newMode = isNight ? 'day' : 'night';
    try {
      await set(ref(db, '/waste/carControl/mode'), newMode);
      await set(ref(db, '/waste/carControl/source'), 'manual');
      setMode(newMode);
    } catch (err) {
      alert('⚠️ Không đủ quyền đổi chế độ!');
    }
  };

  // Toggle mô phỏng
  const toggleSimulation = async () => {
    if (isSimulating) {
      // Tắt mô phỏng
      setIsSimulating(false);
      setCountdown(0);
      await set(ref(db, '/waste/carControl/mode'), 'day');
      await set(ref(db, '/waste/carControl/source'), 'simulate');
      setMode('day');
      return;
    }
    if (mode === 'night') {
      alert('⚠️ Hãy tắt chế độ thủ công trước khi bật mô phỏng!');
      return;
    }

    try {
      await set(ref(db, '/waste/carControl/mode'), 'night');
      await set(ref(db, '/waste/carControl/source'), 'simulate');
      setMode('night');
      setIsSimulating(true);
      setCountdown(60);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsSimulating(false);
            setMode('day');
            set(ref(db, '/waste/carControl/mode'), 'day');
            set(ref(db, '/waste/carControl/source'), 'simulate');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      alert('⚠️ Không đủ quyền bật mô phỏng!');
    }
  };

  // Giao diện
  if (!ready)
    return (
      <div className="text-center py-10 text-gray-500">
        Đang kiểm tra đăng nhập…
      </div>
    );

  if (!user)
    return (
      <div className="w-full text-center py-12">
        <h1 className="text-2xl font-semibold">
          Bạn cần đăng nhập để điều khiển hệ thống
        </h1>
        <p className="text-gray-600 mt-2">
          Chỉ người dùng đã xác thực mới có thể thao tác.
        </p>
        <div className="mt-6">
          <LoginButtonFixed />
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Settings className="text-blue-500" size={28} />
        Điều khiển hệ thống
      </h1>

      {/* Toggle thủ công */}
      <Card className="border-blue-300 dark:border-blue-700">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            {isNight ? <Moon size={20} /> : <Sun size={20} />}
            Chế độ thủ công
          </CardTitle>

          <label className="relative inline-flex items-center cursor-pointer scale-90">
            <input
              type="checkbox"
              checked={isNight}
              onChange={toggleDayNight}
              disabled={isSimulating}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full dark:bg-gray-600 peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {isNight
              ? '🌙 Đang ở chế độ ban đêm – xe sẽ hoạt động.'
              : '🌞 Đang ở chế độ ban ngày – xe sẽ không hoạt động.'}
          </p>
        </CardContent>
      </Card>

      {/* Toggle mô phỏng */}
      <Card className="border-indigo-300 dark:border-indigo-700">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Timer size={20} />
            Mô phỏng 1 phút ban đêm
          </CardTitle>

          <label className="relative inline-flex items-center cursor-pointer scale-90">
            <input
              type="checkbox"
              checked={isSimulating}
              onChange={toggleSimulation}
              disabled={isNight && !isSimulating}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full dark:bg-gray-600 peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </CardHeader>
        <CardContent>
          {isSimulating ? (
            <p className="text-sm">
              ⏳ Đang mô phỏng, còn{' '}
              <strong>
                {Math.floor(countdown / 60).toString().padStart(2, '0')}:
                {(countdown % 60).toString().padStart(2, '0')}
              </strong>{' '}
              sẽ tự tắt.
            </p>
          ) : (
            <p className="text-sm">
              Khi bật, sẽ chạy <strong>ban đêm</strong> 1 phút rồi tự chuyển về{' '}
              <strong>ban ngày</strong>.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
