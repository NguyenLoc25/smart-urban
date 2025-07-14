'use client';

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, set, off, get } from 'firebase/database';
import { db } from '@/lib/firebaseConfig';
import { Switch } from '@/components/ui/switch';
import ThuyCanh from './ThuyCanh';

export default function HydroponicControl() {
  const [waterTemp, setWaterTemp] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [autoTime, setAutoTime] = useState('');
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef(null);

  const setupAutoInterval = (delay) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      await set(ref(db, 'garden/hydroponic/mode/pump_status'), 'ON');
      setTimeout(async () => {
        await set(ref(db, 'garden/hydroponic/mode/pump_status'), 'OFF');
      }, 5000);
    }, delay * 1000 + 5000);
  };

  useEffect(() => {
    const tempRef = ref(db, 'garden/hydroponic/mode/water_temp');
    const autoRef = ref(db, 'garden/hydroponic/mode/auto_mode');
    const pumpRef = ref(db, 'garden/hydroponic/mode/pump_status');
    const timeRef = ref(db, 'garden/hydroponic/mode/auto_time');

    // Lấy dữ liệu ban đầu
    const fetchInitialData = async () => {
      try {
        const [autoSnap, timeSnap] = await Promise.all([get(autoRef), get(timeRef)]);
        const autoVal = autoSnap.val();
        const timeVal = parseInt(timeSnap.val());

        if (autoVal && !isNaN(timeVal)) {
          setIsAuto(true);
          setAutoTime(String(timeVal));
          setupAutoInterval(timeVal);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error);
      }
    };

    fetchInitialData();

    onValue(tempRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setWaterTemp(val);
    });

    onValue(autoRef, (snapshot) => {
      const val = snapshot.val();
      setIsAuto(val);
    });

    onValue(pumpRef, (snapshot) => {
      const val = snapshot.val();
      setIsPumpOn(val === 'ON');
    });

    return () => {
      off(tempRef);
      off(autoRef);
      off(pumpRef);
      off(timeRef);
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleManualPump = async () => {
    if (!isAuto) {
      const newStatus = isPumpOn ? 'OFF' : 'ON';
      try {
        await set(ref(db, 'garden/hydroponic/mode/pump_status'), newStatus);
      } catch (error) {
        console.error('Lỗi khi cập nhật bơm thủy canh:', error);
      }
    }
  };

  const handleAutoToggle = async (checked) => {
    if (checked) {
      setShowModal(true);
    } else {
      setIsAuto(false);
      clearInterval(intervalRef.current);
      try {
        await set(ref(db, 'garden/hydroponic/mode/auto_mode'), false);
        await set(ref(db, 'garden/hydroponic/mode/auto_time'), '');
        await set(ref(db, 'garden/hydroponic/mode/pump_status'), 'OFF');
      } catch (error) {
        console.error('Lỗi khi tắt chế độ tự động:', error);
      }
    }
  };

  const confirmAuto = async () => {
    const delay = parseInt(autoTime);
    if (isNaN(delay) || delay < 1) return;

    setIsAuto(true);
    setShowModal(false);

    try {
      await set(ref(db, 'garden/hydroponic/mode/auto_mode'), true);
      await set(ref(db, 'garden/hydroponic/mode/auto_time'), delay);
      setupAutoInterval(delay);
    } catch (error) {
      console.error('Lỗi khi xác nhận chế độ tự động:', error);
    }
  };

  return (
    <section className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🥬 Trồng trọt </h1>
      <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 max-w-sm w-full space-y-4 mx-aut">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">💧 Thủy Canh</h2>
          <div className="flex items-center gap-2">
            <Switch
              checked={isAuto}
              onCheckedChange={handleAutoToggle}
              className="bg-white data-[state=checked]:bg-white dark:bg-white dark:data-[state=checked]:bg-white"
            />
          </div>
        </div>

        <p className="text-gray-900 dark:text-white">
          Nhiệt độ nước: <strong>{waterTemp}°C</strong>
        </p>

        <button
          onClick={handleManualPump}
          disabled={isAuto}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            isAuto
              ? 'bg-gray-300 cursor-not-allowed'
              : isPumpOn
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPumpOn ? 'Tắt bơm' : 'Bật bơm'}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xs p-5 rounded-xl shadow-lg space-y-4">
            <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white">
              ⏱️ Nhập thời gian chờ (giây)
            </h3>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={autoTime}
              onChange={(e) => setAutoTime(e.target.value)}
              placeholder="Nhập số giây..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={confirmAuto}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <ThuyCanh isPumpOn={isPumpOn} />
    </section>
  );
}
