'use client';

import { useEffect, useState } from 'react';
import { db, ref, onValue, set } from '@/lib/firebaseConfig';
import { Switch } from '@/components/ui/switch';
import PhunSuong from './PhunSuong'; // đúng đường dẫn bạn đã lưu

export default function MushroomControlPage() {
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [isMisting, setIsMisting] = useState(false);

  useEffect(() => {
    const humiRef = ref(db, 'garden/mushroom/mode/humidity');
    const tempRef = ref(db, 'garden/mushroom/mode/temperature');
    const mistRef = ref(db, 'garden/mushroom/mode/mist_status');
    const autoRef = ref(db, 'garden/mushroom/mode/auto_mode');

    onValue(humiRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setHumidity(val);
    });

    onValue(tempRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setTemperature(val);
    });

    onValue(mistRef, (snapshot) => {
      const val = snapshot.val();
      setIsMisting(val === 'ON');
    });

    onValue(autoRef, (snapshot) => {
      const val = snapshot.val();
      setIsAuto(val);
    });
  }, []);

  const handleMistToggle = () => {
    if (!isAuto) {
      const newStatus = isMisting ? 'OFF' : 'ON';
      set(ref(db, 'garden/mushroom/mode/mist_status'), newStatus);
    }
  };

  const handleAutoToggle = (checked) => {
    setIsAuto(checked);
    set(ref(db, 'garden/mushroom/mode/auto_mode'), checked);
  };

  return (
    <section className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🥬Trồng trọt</h1>
      <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 max-w-sm w-full space-y-4 mx-auto">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">🏠 Nhà nấm</h2>
          <div className="flex items-center gap-2">
            <Switch checked={isAuto} onCheckedChange={handleAutoToggle} className="bg-white data-[state=checked]:bg-white dark:bg-white dark:data-[state=checked]:bg-white" />
          </div>
        </div>

        <p className="text-gray-900 dark:text-white">Độ ẩm: <strong>{humidity}%</strong></p>
        <p className="text-gray-900 dark:text-white">Nhiệt độ: <strong>{temperature}°C</strong></p>

        <button
          onClick={handleMistToggle}
          disabled={isAuto}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            isAuto
              ? 'bg-gray-300 cursor-not-allowed'
              : isMisting
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isMisting ? 'Tắt phun sương' : 'Phun sương'}
        </button>
      </div>
      <PhunSuong isMisting={isMisting} />
    </section>
  );
}
