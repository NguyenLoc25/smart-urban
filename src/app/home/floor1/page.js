'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBBDrRw2cqSv8yuiQToX3NR-1B_ci_awZo",
  authDomain: "datn-5b6dc.firebaseapp.com",
  databaseURL: "https://datn-5b6dc-default-rtdb.firebaseio.com",
  projectId: "datn-5b6dc",
  storageBucket: "datn-5b6dc.firebasestorage.app",
  messagingSenderId: "1058163518154",
  appId: "1:1058163518154:web:67af917afb710699d4e233",
  measurementId: "G-EFRN2QNWC9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Floor1Page() {
  // Trạng thái các thiết bị
  const [lightOn, setLightOn] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);

  // Lắng nghe từ Firebase
  useEffect(() => {
    onValue(ref(db, 'light_livingroom'), (snap) => setLightOn(snap.val() === true));
    onValue(ref(db, 'door_main'), (snap) => setDoorOpen(snap.val() === true));
    onValue(ref(db, 'door_garage'), (snap) => setGarageOpen(snap.val() === true));
    onValue(ref(db, 'alarm'), (snap) => setAlarmOn(snap.val() === true));
  }, []);

  // Các hàm toggle
  const toggleLight = () => set(ref(db, 'light_livingroom'), !lightOn);
  const toggleDoor = () => set(ref(db, 'door_main'), !doorOpen);
  const toggleGarage = () => set(ref(db, 'door_garage'), !garageOpen);
  const toggleAlarm = () => set(ref(db, 'alarm'), !alarmOn);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 md:p-10">
      <Link href="/home" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Quay lại
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Quản lý Tầng 1</h1>
        <p className="text-gray-700 mb-6">Giám sát và điều khiển các thiết bị thông minh ở tầng 1.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Đèn phòng khách */}
          <DeviceCard
            title="Đèn phòng khách"
            description="Bật/tắt từ web"
            state={lightOn}
            onToggle={toggleLight}
          />

          {/* Cửa ra vào */}
          <DeviceCard
            title="Cửa ra vào"
            description="Mở cửa bằng mật khẩu"
            state={doorOpen}
            onToggle={toggleDoor}
          />

          {/* Cửa nhà xe */}
          <DeviceCard
            title="Cửa nhà xe"
            description="Mở/đóng từ xa"
            state={garageOpen}
            onToggle={toggleGarage}
          />

          {/* Báo động nhà xe */}
          <DeviceCard
            title="Báo động"
            description="Bật/tắt cảnh báo"
            state={alarmOn}
            onToggle={toggleAlarm}
          />

          {/* Đèn WC (không có nút vì dùng cảm biến) */}
          <div className="bg-yellow-100 p-6 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-yellow-800">Đèn WC</h2>
            <p className="text-gray-600">Tự động bật khi có người (cảm biến PIR)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Card tái sử dụng
function DeviceCard({ title, description, state, onToggle }) {
  return (
    <div className={`p-6 rounded-xl shadow text-center ${state ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <h2 className="text-lg font-semibold text-blue-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onToggle}
        className={`px-5 py-2 rounded-full font-semibold text-white transition ${
          state ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {state ? 'Tắt' : 'Bật'}
      </button>
    </div>
  );
}
