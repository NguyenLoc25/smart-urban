// src/app/garden/control/vegetable/GardenControl/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { db, ref, onValue, set } from '@/lib/firebaseConfig';
import { Switch } from '@/components/ui/switch';

export default function GardenControlPage() {
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [targetMoisture, setTargetMoisture] = useState(60);
  const [inputValue, setInputValue] = useState(60);

  useEffect(() => {
    const soilRef = ref(db, 'garden/soil_watering/mode/soil_percent');
    const autoRef = ref(db, 'garden/soil_watering/mode/auto_mode');
    const pumpRef = ref(db, 'garden/soil_watering/mode/pump_status');
    const targetRef = ref(db, 'garden/soil_watering/mode/target_soil_percent');

    const unsubSoil = onValue(soilRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setSoilMoisture(val);
    });

    const unsubAuto = onValue(autoRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setIsAuto(val);
    });

    const unsubPump = onValue(pumpRef, (snapshot) => {
      const val = snapshot.val();
      setIsPumpOn(val === 'ON');
    });

    const unsubTarget = onValue(targetRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) {
        setTargetMoisture(val);
        setInputValue(val); // khởi tạo ô input khi load xong
      }
    });

    return () => {
      unsubSoil();
      unsubAuto();
      unsubPump();
      unsubTarget();
    };
  }, []);

  const handleManualPump = () => {
    if (!isAuto) {
      const newStatus = isPumpOn ? 'OFF' : 'ON';
      set(ref(db, 'garden/soil_watering/mode/pump_status'), newStatus);
    }
  };

  const handleAutoToggle = (checked) => {
    setIsAuto(checked);
    set(ref(db, 'garden/soil_watering/mode/auto_mode'), checked);
  };

  const handleOkClick = () => {
    const percent = parseInt(inputValue);
    if (!isNaN(percent) && percent >= 0 && percent <= 100) {
      setTargetMoisture(percent);
      set(ref(db, 'garden/soil_watering/mode/target_soil_percent'), percent);
    } else {
      alert('Vui lòng nhập số từ 0 đến 100!');
    }
  };

  return (
    <section className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900 max-w-sm w-full space-y-4 mx-auto">
      <h1 className="text-2xl font-bold">🥬 Vegetable Control</h1>
      <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 max-w-sm w-full space-y-4 mx-auto">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">🌱 Vườn Rau</h2>
          <div className="flex items-center gap-2">
            <Switch checked={isAuto} onCheckedChange={handleAutoToggle} className="bg-white data-[state=checked]:bg-white dark:bg-white dark:data-[state=checked]:bg-white" />
          </div>
        </div>      

        <p className=" text-gray-900 dark:text-white">
          Độ ẩm đất: <strong>{soilMoisture}%</strong>
        </p>

        {isAuto && (
          <div className="space-y-2">
            <label htmlFor="target-moisture" className="block text-gray-900 dark:text-white font-medium">
              Nhập độ ẩm mục tiêu (%)
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="target-moisture"
                type="number"
                min={0}
                max={100}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring- text-lg font-semibold text-gray-900 "
              />
              <button
                onClick={handleOkClick}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
              >
                OK
              </button>
            </div>
            <p className="text-sm text-gray-900 dark:text-gray 800">Đang đặt: {targetMoisture}%</p>
          </div>
        )}

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
          {isPumpOn ? 'Tắt tưới nước' : 'Tưới nước'}
        </button>
      </div>
    </section>
  );
}
