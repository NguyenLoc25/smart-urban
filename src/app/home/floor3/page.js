// Floor 3 UI code adapted to match Floor 1 and Floor 2 layout style

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ref, onValue, set } from 'firebase/database';
import { db } from '@/firebase';

import { MdLightbulbOutline, MdLightbulb, MdOutlineHome } from 'react-icons/md';
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';

export default function Floor3() {
  const pathname = usePathname();
  const [lightOn, setLightOn] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lightRef = ref(db, 'home/light_room_3');
    const doorRef = ref(db, 'home/door_status');

    const unsubscribeLight = onValue(lightRef, (snapshot) => {
      setLightOn(Boolean(snapshot.val()));
      setLoading(false);
    });

    const unsubscribeDoor = onValue(doorRef, (snapshot) => {
      setDoorOpen(Boolean(snapshot.val()));
      setLoading(false);
    });

    return () => {
      unsubscribeLight();
      unsubscribeDoor();
    };
  }, []);

  const toggleLight = async () => {
    try {
      await set(ref(db, 'home/light_room_3'), !lightOn);
    } catch (error) {
      console.error('Firebase update failed:', error);
    }
  };

  const floorLinks = [
    { label: 'Tầng 1', href: '/home/floor1' },
    { label: 'Tầng 2', href: '/home/floor2' },
    { label: 'Tầng 3', href: '/home/floor3' },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100">
      <aside className="w-56 bg-white dark:bg-gray-900 shadow-lg p-4 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <MdOutlineHome className="text-2xl text-blue-600 dark:text-yellow-400" />
          <h2 className="font-bold text-lg">Smart Home</h2>
        </div>
        <nav className="space-y-3">
          {floorLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg font-medium transition hover:bg-blue-100 dark:hover:bg-gray-700 ${
                pathname === link.href
                  ? 'bg-blue-200 dark:bg-gray-700 text-blue-800 dark:text-yellow-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex justify-center items-start p-6">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900/80 shadow-2xl rounded-3xl p-6 space-y-6">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-yellow-400 hover:underline mb-2"
          >
            <FaArrowLeft /> Quay lại
          </Link>

          <h1 className="text-2xl font-bold text-center text-blue-800 dark:text-yellow-400">
            🛋️ Điều khiển Tầng 3
          </h1>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-300 animate-pulse">
              Đang tải trạng thái...
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DeviceCard
                  icon={lightOn ? <MdLightbulb size={28} /> : <MdLightbulbOutline size={28} />}
                  label="Đèn tầng 3"
                  isOn={lightOn}
                  onToggle={toggleLight}
                  color="#ffa726"
                />
                <div
                  className={`w-full px-4 py-4 rounded-2xl shadow-md text-center font-bold text-xl tracking-wide flex items-center justify-center gap-3 ${
                    doorOpen
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {doorOpen ? <FaDoorOpen size={26} /> : <FaDoorClosed size={26} />}
                  {doorOpen ? 'CỬA ĐANG MỞ' : 'CỬA ĐÃ ĐÓNG'}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DeviceCard({ icon, label, isOn, onToggle, color }) {
  return (
    <div
      className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl shadow-md transition-all duration-300 ${
        isOn ? '' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
      }`}
      style={{ backgroundColor: isOn ? color : undefined, color: isOn ? '#fff' : undefined }}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div className="text-lg font-medium">{label}</div>
      </div>
      {onToggle && (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={isOn} onChange={onToggle} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-300 peer-checked:bg-white rounded-full transition-colors"></div>
          <div
            className={`absolute left-1 top-0.5 w-5 h-5 bg-blue-500 rounded-full shadow-md transition-transform ${
              isOn ? 'translate-x-5' : 'translate-x-0'
            }`}
          ></div>
        </label>
      )}
    </div>
  );
}
