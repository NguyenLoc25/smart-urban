'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { Sun, Moon, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginButtonFixed from '@/components/waste/LoginButtonFixed';

export default function ControlPage() {
  const [user, setUser]   = useState(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode]   = useState('loading');

  const db      = getDatabase();
  const isNight = mode === 'night';

  // ✅ Tính thời gian mô phỏng theo chu kỳ 6 phút
  function getCycleTime() {
    const cycleMs = 6 * 60 * 1000;
    const now = Date.now();
    const elapsed = now % cycleMs;

    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const mockMode = elapsed < 3 * 60 * 1000 ? 'day' : 'night';

    const remaining = mockMode === 'day'
      ? 3 * 60 * 1000 - elapsed
      : cycleMs - elapsed;

    const remMin = Math.floor(remaining / 60000);
    const remSec = Math.floor((remaining % 60000) / 1000);

    return { minutes, seconds, mode: mockMode, remMin, remSec };
  }

  const [mockTime, setMockTime] = useState(getCycleTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setMockTime(getCycleTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Kiểm tra đăng nhập
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u && u.email !== 'nguyenhoangviet4969@gmail.com') {
        alert('❌ Email không được cấp quyền truy cập trang này!');
        signOut(auth);
        setUser(null);
      } else {
        setUser(u);
      }
      setReady(true);
    });
    return unsub;
  }, []);

  // ✅ Đọc chế độ từ Firebase
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

  // ✅ Chuyển chế độ thủ công
  const toggleDayNight = async () => {
    const newMode = isNight ? 'day' : 'night';
    try {
      await set(ref(db, '/waste/carControl/mode'), newMode);
      setMode(newMode);
    } catch (err) {
      alert('⚠️ Không đủ quyền thay đổi chế độ!');
    }
  };

  // ✅ Giao diện
  if (!ready)
    return <div className="text-center py-10 text-gray-500">Đang kiểm tra đăng nhập…</div>;

  if (!user)
    return (
      <div className="w-full text-center py-12">
        <h1 className="text-2xl font-semibold">Bạn cần đăng nhập để điều khiển hệ thống</h1>
        <p className="text-gray-600 mt-2">Chỉ người dùng đã xác thực mới có thể thao tác.</p>
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

      {/* ✅ Toggle chế độ thủ công */}
      <Card className="border-blue-300 dark:border-blue-700">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
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
          <p className="text-sm">
            {isNight
              ? '🌙 Đang ở chế độ ban đêm – xe sẽ hoạt động.'
              : '🌞 Đang ở chế độ ban ngày – xe sẽ không hoạt động.'}
          </p>
        </CardContent>
      </Card>

      {/* ✅ Thời gian mô phỏng ngày/đêm */}
      <Card className="border-gray-300 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            ⏰ Mô phỏng chu kỳ ngày/đêm (6 phút)
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-1 text-sm text-gray-800 dark:text-gray-300">
          <p>
            Thời gian hiện tại trong chu kỳ:{" "}
            <span className="font-mono">
              {mockTime.minutes.toString().padStart(2, '0')}:
              {mockTime.seconds.toString().padStart(2, '0')}
            </span>
          </p>
          <p>
            Trạng thái:{" "}
            <span className="font-semibold">
              {mockTime.mode === 'day' ? '🌞 Ban ngày' : '🌙 Ban đêm'}
            </span>
          </p>
          <p>
            Sắp chuyển sang {mockTime.mode === 'day' ? 'ban đêm' : 'ban ngày'} sau:{" "}
            <span className="font-mono">
              {mockTime.remMin.toString().padStart(2, '0')}:
              {mockTime.remSec.toString().padStart(2, '0')}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
