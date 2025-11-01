'use client';

import { useEffect, useState } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import { Sun, Moon, Settings, Timer, Activity, Bug } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ControlPage() {
  const [mode, setMode] = useState('loading');
  const [isSimulating, setIsSimulating] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const db = getDatabase();
  const isNight = mode === 'night';

  // Đọc chế độ từ Firebase
  useEffect(() => {
    const fetchMode = async () => {
      try {
        const snap = await get(ref(db, '/waste/carControl/mode'));
        if (snap.exists()) setMode(snap.val());
      } catch (err) {
        console.error('🔐 Firebase error (carControl):', err.code);
      }
    };

    fetchMode();
  }, []);

  // Toggle ngày đêm
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
      alert('⚠️ Không thể đổi chế độ!');
    }
  };

  // Toggle mô phỏng 2 phút
  const toggleSimulation = async () => {
    if (isSimulating) {
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
      setCountdown(120);

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
      alert('⚠️ Không thể bật mô phỏng!');
    }
  };

  // Format thời gian countdown
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Xóa dữ liệu conveyor (Debug)
  const clearConveyorData = async () => {
    try {
      await set(ref(db, '/waste/conveyor'), null);
      alert('✅ Đã xóa dữ liệu conveyor thành công!');
      console.log('🗑️ Conveyor data cleared');
    } catch (err) {
      alert('❌ Không thể xóa dữ liệu: ' + err.message);
      console.error('Error clearing conveyor:', err);
    }
  };

  // Giao diện
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Settings className="text-green-600 dark:text-green-400" size={32} />
            Điều khiển hệ thống
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg px-4">
            Quản lý chế độ hoạt động của xe thông minh
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-2 rounded-full ${isNight ? 'bg-slate-100 dark:bg-slate-800' : 'bg-orange-100 dark:bg-orange-900'}`}>
                {isNight ? <Moon className="text-slate-600 dark:text-slate-400" size={20} /> : <Sun className="text-orange-600 dark:text-orange-400" size={20} />}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Chế độ hiện tại</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
                  {isNight ? 'Ban đêm' : 'Ban ngày'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-2 rounded-full ${isSimulating ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Timer className={`${isSimulating ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Mô phỏng</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
                  {isSimulating ? 'Đang chạy' : 'Tắt'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-2 rounded-full ${isNight ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Activity className={`${isNight ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Trạng thái xe</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
                  {isNight ? 'Hoạt động' : 'Dừng'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chế độ thủ công */}
          <Card className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${isNight ? 'bg-slate-100 dark:bg-slate-800' : 'bg-orange-100 dark:bg-orange-900'}`}>
                    {isNight ? <Moon className="text-slate-600 dark:text-slate-400" size={24} /> : <Sun className="text-orange-600 dark:text-orange-400" size={24} />}
                  </div>
                  <span className="text-gray-800 dark:text-white">Chế độ thủ công</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNight}
                    onChange={toggleDayNight}
                    disabled={isSimulating}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`p-4 rounded-lg ${isNight ? 'bg-slate-50 dark:bg-slate-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isNight
                      ? '🌙 Đang ở chế độ ban đêm – xe sẽ hoạt động tự động.'
                      : '🌞 Đang ở chế độ ban ngày – xe sẽ không hoạt động.'}
                  </p>
                </div>
                {isSimulating && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      ⚠️ Đang trong chế độ mô phỏng, không thể điều khiển thủ công
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mô phỏng */}
          <Card className="bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${isSimulating ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Timer className={`${isSimulating ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} size={24} />
                  </div>
                  <span className="text-gray-800 dark:text-white">Mô phỏng ban đêm</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSimulating}
                    onChange={toggleSimulation}
                    disabled={isNight && !isSimulating}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isSimulating ? (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        ⏳ Đang mô phỏng ban đêm
                      </p>
                      <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatTime(countdown)}
                      </span>
                    </div>
                    <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((120 - countdown) / 120) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Khi bật, hệ thống sẽ chạy ở <strong>chế độ ban đêm</strong> trong 2 phút, 
                      sau đó tự động chuyển về <strong>chế độ ban ngày</strong>.
                    </p>
                  </div>
                )}
                {isNight && !isSimulating && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      ⚠️ Hãy tắt chế độ thủ công trước khi bật mô phỏng
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={clearConveyorData}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <Bug size={20} />
            <span>Debug Xóa dữ liệu Conveyor</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hệ thống điều khiển xe thông minh • Phiên bản 2.0
          </p>
        </div>
      </div>
    </div>
  );
}