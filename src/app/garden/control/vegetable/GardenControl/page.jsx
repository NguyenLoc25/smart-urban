//src/app/garden/control/vegetable/GardenControl/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { db, ref, onValue, set } from '@/lib/firebaseConfig';
import { Switch } from '@/components/ui/switch';

export default function GardenControlPage() {
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [isAuto, setIsAuto] = useState(false);
  const [isPumpOn, setIsPumpOn] = useState(false);

  useEffect(() => {
    const soilRef = ref(db, 'garden/soil_watering/mode/soil_percent');
    const autoRef = ref(db, 'garden/soil_watering/mode/auto_mode');
    const pumpRef = ref(db, 'garden/soil_watering/mode/pump_status');

    onValue(soilRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setSoilMoisture(val);
    });

    onValue(autoRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setIsAuto(val);
    });

    onValue(pumpRef, (snapshot) => {
      const val = snapshot.val();
      setIsPumpOn(val === 'ON');
    });
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

  return (
    <section className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🥬 Vegetable Control</h1>
      <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">🌱 Vườn Rau</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tự động</span>
            <Switch checked={isAuto} onCheckedChange={handleAutoToggle} />
          </div>
        </div>

        <p className="text-gray-700">Độ ẩm đất: <strong>{soilMoisture}%</strong></p>

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
