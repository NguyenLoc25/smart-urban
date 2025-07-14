'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ref, onValue, set } from 'firebase/database';
import { db } from '@/firebase';

import { MdLightbulbOutline, MdLightbulb, MdOutlineHome } from 'react-icons/md';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaBell, FaBellSlash, FaArrowLeft } from 'react-icons/fa';

export default function Floor1() {
  const pathname = usePathname();
  const [lightOn, setLightOn] = useState(false);
  const [doorOpened, setDoorOpened] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [buzzerActive, setBuzzerActive] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wc1Light, setWc1Light] = useState(false);
  const [wc2Light, setWc2Light] = useState(false);

  const alarmTimeoutRef = useRef(null);

  useEffect(() => {
    const refs = {
      light: ref(db, 'home/floor_1/light_room_1'),
      door: ref(db, 'home/floor_1/door_opened_1'),
      temp: ref(db, 'home/floor_1/temperature_1'),
      humi: ref(db, 'home/floor_1/humidity_1'),
      alarm: ref(db, 'home/floor_1/alarm_triggered_1'),
      alarmEnabled: ref(db, 'home/floor_1/alarm_enabled_1'),
      wc1: ref(db, 'home/floor_1/wc1_light'),
      wc2: ref(db, 'home/floor_1/wc2_light'),
      garageStatus: ref(db, 'home/floor_1/garage/status'),
    };

    const unsub = [
      onValue(refs.light, (snap) => {
        setLightOn(!!snap.val());
        setLoading(false);
      }),
      onValue(refs.door, (snap) => setDoorOpened(!!snap.val())),
      onValue(refs.temp, (snap) => setTemperature(snap.val())),
      onValue(refs.humi, (snap) => setHumidity(snap.val())),
      onValue(refs.alarm, (snap) => {
        const triggered = !!snap.val();
        if (triggered) {
          clearTimeout(alarmTimeoutRef.current);
          setBuzzerActive(true);
        } else {
          alarmTimeoutRef.current = setTimeout(() => {
            setBuzzerActive(false);
          }, 3000);
        }
      }),
      onValue(refs.alarmEnabled, (snap) => setAlarmEnabled(!!snap.val())),
      onValue(refs.wc1, (snap) => setWc1Light(!!snap.val())),
      onValue(refs.wc2, (snap) => setWc2Light(!!snap.val())),
      onValue(refs.garageStatus, (snap) => {
        const status = snap.val();
        setGarageOpen(status === 'open');
      }),
    ];

    return () => {
      unsub.forEach((u) => u());
      clearTimeout(alarmTimeoutRef.current);
    };
  }, []);

  const toggleLight = () => set(ref(db, 'home/floor_1/light_room_1'), !lightOn);
  const toggleAlarmEnabled = () => set(ref(db, 'home/floor_1/alarm_enabled_1'), !alarmEnabled);
  const openGarage = () => set(ref(db, 'home/floor_1/garage/command'), 'open');
  const closeGarage = () => set(ref(db, 'home/floor_1/garage/command'), 'close');

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
        <div className="w-full max-w-6xl bg-white dark:bg-gray-900/80 shadow-2xl rounded-3xl p-6 space-y-6">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-yellow-400 hover:underline mb-2"
          >
            <FaArrowLeft /> Quay lại
          </Link>

          <h1 className="text-2xl font-bold text-center text-blue-800 dark:text-yellow-400">
            Điều khiển Tầng 1
          </h1>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-300 animate-pulse">
              Đang tải trạng thái...
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Cụm 1: Đèn, cửa chính, cửa nhà xe */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`w-full px-4 py-4 rounded-2xl shadow-md text-center font-bold text-xl tracking-wide ${
                    doorOpened
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  <div className="flex justify-center items-center gap-3">
                    {doorOpened ? (
                      <>
                        <BsCheckCircleFill size={28} /> 🚪 CỬA CHÍNH ĐANG MỞ
                      </>
                    ) : (
                      <>
                        <BsCheckCircleFill size={28} className="rotate-45 opacity-40" />
                        🚪 CỬA CHÍNH ĐÃ ĐÓNG
                      </>
                    )}
                  </div>
                </div>

                <DeviceCard
                  icon={lightOn ? <MdLightbulb size={28} /> : <MdLightbulbOutline size={28} />}
                  label="Đèn tầng 1"
                  isOn={lightOn}
                  onToggle={toggleLight}
                  color="#42a5f5"
                />

                {/* Cửa nhà xe */}
                <div className="w-full bg-white dark:bg-gray-800 border rounded-2xl p-4 shadow-md space-y-4 text-center col-span-full">
                  <div
                    className={`text-xl font-bold tracking-wide py-2 rounded-xl ${
                      garageOpen
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    🚗 Cửa nhà xe: {garageOpen ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG'}
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={openGarage}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
                    >
                      MỞ CỬA NHÀ XE
                    </button>
                    <button
                      onClick={closeGarage}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow"
                    >
                      ĐÓNG CỬA NHÀ XE
                    </button>
                  </div>
                </div>
              </section>

              {/* Cụm 2: WC */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DeviceCard
                  icon={wc1Light ? <MdLightbulb size={28} /> : <MdLightbulbOutline size={28} />}
                  label="Đèn WC 1 (Tự động)"
                  isOn={wc1Light}
                  color="#26c6da"
                />
                <DeviceCard
                  icon={wc2Light ? <MdLightbulb size={28} /> : <MdLightbulbOutline size={28} />}
                  label="Đèn WC 2 (Tự động)"
                  isOn={wc2Light}
                  color="#26c6da"
                />
              </section>

              {/* Cụm 3: Nhiệt độ & báo động */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#e0f7fa] dark:bg-[#004d40] border-2 border-cyan-500 dark:border-teal-300 rounded-2xl p-4 shadow-inner text-center font-mono text-lg tracking-wider">
                  <div className="mb-2">
                    🌡️ <span className="text-gray-800 dark:text-white">Nhiệt độ:</span>{' '}
                    <span className="font-bold text-[#00796b] dark:text-[#80cbc4]">
                      {temperature !== null ? `${temperature} °C` : '--'}
                    </span>
                  </div>
                  <div>
                    💧 <span className="text-gray-800 dark:text-white">Độ ẩm:</span>{' '}
                    <span className="font-bold text-[#00796b] dark:text-[#80cbc4]">
                      {humidity !== null ? `${humidity} %` : '--'}
                    </span>
                  </div>
                </div>
                <DeviceCard
                  icon={buzzerActive ? <FaBell size={24} /> : <FaBellSlash size={24} />}
                  label="Còi báo động"
                  isOn={alarmEnabled}
                  onToggle={toggleAlarmEnabled}
                  color="#ef5350"
                />
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
