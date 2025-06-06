'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// Firebase config
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

// Component tái sử dụng cho từng thiết bị
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

export default function Floor2Page() {
  const [bedroomLight, setBedroomLight] = useState(false);
  const [acOn, setAcOn] = useState(false);

  // Lấy dữ liệu từ Firebase
  useEffect(() => {
    const bedroomLightRef = ref(db, 'floor2/bedroom_light');
    const acRef = ref(db, 'floor2/air_conditioner');

    const unsub1 = onValue(bedroomLightRef, snapshot => {
      setBedroomLight(snapshot.val() === true);
    });

    const unsub2 = onValue(acRef, snapshot => {
      setAcOn(snapshot.val() === true);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Toggle trạng thái và gửi về Firebase
  const toggleBedroomLight = () => {
    set(ref(db, 'floor2/bedroom_light'), !bedroomLight);
  };

  const toggleAC = () => {
    set(ref(db, 'floor2/air_conditioner'), !acOn);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6 md:p-10">
      <Link href="/home" className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Quay lại
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">Quản lý Tầng 2</h1>
        <p className="text-gray-700 mb-6">Giám sát và điều khiển các thiết bị ở tầng 2.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DeviceCard
            title="Đèn phòng ngủ"
            description="Bật/tắt đèn phòng ngủ"
            state={bedroomLight}
            onToggle={toggleBedroomLight}
          />
          <DeviceCard
            title="Máy lạnh"
            description="Bật/tắt điều hòa không khí"
            state={acOn}
            onToggle={toggleAC}
          />
        </div>
      </div>
    </div>
  );
}
