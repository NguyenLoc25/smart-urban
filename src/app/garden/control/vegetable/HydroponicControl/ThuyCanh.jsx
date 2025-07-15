import { useEffect, useState } from 'react';

export default function ThuyCanh({ isPumpOn }) {
  const [waterLevel, setWaterLevel] = useState(0); // phần trăm chiều cao nước

  const MAX_WATER_HEIGHT = 73; // chỉ dân tới 65% chiều cao

  useEffect(() => {
    let interval = null;
    if (isPumpOn) {
      interval = setInterval(() => {
        setWaterLevel((prev) =>
          prev < MAX_WATER_HEIGHT ? prev + 2 : MAX_WATER_HEIGHT
        );
      }, 200);
    } else {
      clearInterval(interval);
      setWaterLevel(0); // khi tắt bơm thì rút hết
    }

    return () => clearInterval(interval);
  }, [isPumpOn]);

  return (
    <div className="relative w-full h-40 border-4 border-blue-300 rounded-xl overflow-hidden bg-sky-100">
      {/* Mặt nước */}
      <div
        className="absolute bottom-0 left-0 w-full bg-blue-400 transition-all duration-300"
        style={{ height: `${waterLevel}%` }}
      ></div>

      {/* Cây nằm trên */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-5xl select-none whitespace-nowrap">
        🪻🌻🌷🪻🌻🌷🪻🌻🌷🪻🌻🌷
      </div>
    </div>
  );
}
