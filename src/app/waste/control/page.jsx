'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { Sun, Moon, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginButtonFixed from '@/components/waste/LoginButtonFixed';

export default function ControlPage() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('loading');
  const [mockEnabled, setMockEnabled] = useState(true);
  const db = getDatabase();

  function getCycleTime() {
    const cycleMs = 6 * 60 * 1000;
    const now = Date.now();
    const elapsed = now % cycleMs;

    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const mockMode = elapsed < 3 * 60 * 1000 ? 'day' : 'night';

    const remaining = mockMode === 'day' ? 3 * 60 * 1000 - elapsed : cycleMs - elapsed;
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

  useEffect(() => {
    if (!mockEnabled || !user) return;

    const updateMode = async () => {
      try {
        await set(ref(db, '/waste/carControl/mode'), mockTime.mode);
      } catch (err) {
        console.error('⚠️ Lỗi cập nhật Firebase:', err.message);
      }
    };

    updateMode();
  }, [mockTime.mode, mockEnabled, user]);

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

  useEffect(() => {
    if (!user || mockEnabled) return;

    const fetchMode = async () => {
      try {
        const snap = await get(ref(db, '/waste/carControl/mode'));
        if (snap.exists()) setMode(snap.val());
      } catch (err) {
        console.error('🔐 Firebase error:', err.code);
      }
    };

    fetchMode();
  }, [user, mockEnabled]);

  const isNight = mockEnabled ? mockTime.mode === 'night' : mode === 'night';

  const toggleDayNight = async () => {
    if (mockEnabled) return; // ❌ Không cho toggle khi đang mô phỏng

    const newMode = isNight ? 'day' : 'night';
    try {
      await set(ref(db, '/waste/carControl/mode'), newMode);
      setMode(newMode);
    } catch (err) {
      alert('⚠️ Không đủ quyền thay đổi chế độ!');
    }
  };

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

      {/* 🔁 Mô phỏng ngày đêm */}
      <Card className="border-yellow-300 dark:border-yellow-600">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            ⏱️ Mô phỏng chế độ ngày/đêm (6 phút)
            <label className="relative inline-flex items-center cursor-pointer scale-90">
              <input
                type="checkbox"
                checked={mockEnabled}
                onChange={() => setMockEnabled(prev => !prev)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full dark:bg-gray-600 peer-checked:bg-yellow-500
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border
                after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            {mockEnabled
              ? '🔄 Đang mô phỏng tự động – không phụ thuộc dữ liệu Firebase.'
              : '📡 Đang sử dụng chế độ thật từ Firebase.'}
          </p>
        </CardContent>
      </Card>

      {/* ⚙️ Toggle ngày/đêm thủ công */}
      <Card className="border-blue-300 dark:border-blue-700">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            {isNight ? <Moon size={20} /> : <Sun size={20} />}
            Chế độ hoạt động
          </CardTitle>

          <label className="relative inline-flex items-center scale-90">
            <input
              type="checkbox"
              checked={isNight}
              onChange={toggleDayNight}
              disabled={mockEnabled}
              className="sr-only peer"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                mockEnabled
                  ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-gray-300 dark:bg-gray-600 peer-checked:bg-blue-500'
              } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border
              after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
            />
          </label>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            {isNight
              ? '🌙 Đang ở chế độ ban đêm – xe sẽ hoạt động.'
              : '🌞 Đang ở chế độ ban ngày – xe sẽ không hoạt động.'}
          </p>
          {mockEnabled && (
            <p className="text-xs text-gray-500 mt-1">
              🔒 Không thể chuyển thủ công khi đang mô phỏng.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ⏰ Đồng hồ mô phỏng */}
      {mockEnabled && (
        <Card className="border-gray-300 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              ⏰ Mô phỏng chu kỳ ngày/đêm (6 phút)
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-1 text-sm text-gray-800 dark:text-gray-300">
            <p>
              Thời gian hiện tại trong chu kỳ:{' '}
              <span className="font-mono">
                {mockTime.minutes.toString().padStart(2, '0')}:
                {mockTime.seconds.toString().padStart(2, '0')}
              </span>
            </p>
            <p>
              Trạng thái:{' '}
              <span className="font-semibold">
                {mockTime.mode === 'day' ? '🌞 Ban ngày' : '🌙 Ban đêm'}
              </span>
            </p>
            <p>
              Sắp chuyển sang {mockTime.mode === 'day' ? 'ban đêm' : 'ban ngày'} sau:{' '}
              <span className="font-mono">
                {mockTime.remMin.toString().padStart(2, '0')}:
                {mockTime.remSec.toString().padStart(2, '0')}
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
