//src/app/garden/control/vegetable/HydropnicControl/page.jsx

'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, set, off } from 'firebase/database';
import { db } from '@/lib/firebaseConfig';
import { Switch } from '@/components/ui/switch';

export default function HydroponicControl() {
  const [waterTemp, setWaterTemp] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [isPumpOn, setIsPumpOn] = useState(false);

  useEffect(() => {
    const tempRef = ref(db, 'garden/hydroponic/mode/water_temp');
    const autoRef = ref(db, 'garden/hydroponic/mode/auto_mode');
    const pumpRef = ref(db, 'garden/hydroponic/mode/pump_status');

    onValue(tempRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setWaterTemp(val);
    });

    onValue(autoRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setIsAuto(val);
    });

    onValue(pumpRef, (snapshot) => {
      const val = snapshot.val();
      setIsPumpOn(val === 'ON');
    });

    return () => {
      off(tempRef);
      off(autoRef);
      off(pumpRef);
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
    setIsAuto(checked);
    try {
      await set(ref(db, 'garden/hydroponic/mode/auto_mode'), checked);
    } catch (error) {
      console.error('Lỗi khi bật/tắt chế độ tự động:', error);
    }
  };

  return (
    <section className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🥬 Vegetable Control</h1>
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">💧 Thủy Canh</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tự động</span>
            <Switch checked={isAuto} onCheckedChange={handleAutoToggle} />
          </div>
        </div>

        <p className="text-gray-700">
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
    </section>
  );
}
