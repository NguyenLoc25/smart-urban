'use client';

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { EChartsOverview } from "@/components/waste/charts/EChartsOverview";
import { Truck, ActivitySquare, Trash2, Settings2 } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState({
    vehicles: 2,
    conveyors: 3,
    trashToday: 560,
    energy: 3.2,
    conveyorsStatus: {
      garden: true,
      energy: false,
      store: true,
    },
  });

  useEffect(() => {
    const db = getDatabase();
    const vehiclesRef = ref(db, "waste/vehicles/count");
    onValue(vehiclesRef, (snapshot) => {
      if (snapshot.exists()) {
        setData((prev) => ({ ...prev, vehicles: snapshot.val() }));
      }
    });
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Image src="/icons/dashboard.svg" alt="Dashboard Icon" width={50} height={50} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Smart Waste Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Theo dõi hệ thống xử lý rác thông minh
          </p>
        </div>
      </div>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ô 1: Xe */}
        <Card className="p-4 flex items-center gap-4 bg-green-100 dark:bg-green-900 shadow-md rounded-xl">
          <Truck size={32} className="text-green-600 dark:text-green-300" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-200">Xe</p>
            <p className="text-xl font-bold text-green-800 dark:text-green-100">{data.vehicles}</p>
          </div>
        </Card>

        {/* Ô 2: Băng chuyền */}
        <Card className="p-4 flex items-center gap-4 bg-blue-100 dark:bg-blue-900 shadow-md rounded-xl">
          <ActivitySquare size={32} className="text-blue-600 dark:text-blue-300" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-200">Băng chuyền</p>
            <p className="text-xl font-bold text-blue-800 dark:text-blue-100">{data.conveyors}</p>
          </div>
        </Card>

        {/* Ô 3: Rác hôm nay */}
        <Card className="p-4 flex items-center gap-4 bg-red-100 dark:bg-red-900 shadow-md rounded-xl">
          <Trash2 size={32} className="text-red-600 dark:text-red-300" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-200">Rác hôm nay (kg)</p>
            <p className="text-xl font-bold text-red-800 dark:text-red-100">{data.trashToday}</p>
          </div>
        </Card>

        {/* Ô 4: Năng lượng */}
        <Card className="p-4 flex items-center gap-4 bg-yellow-100 dark:bg-yellow-900 shadow-md rounded-xl">
          <Settings2 size={32} className="text-yellow-600 dark:text-yellow-300" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-200">Năng lượng tái tạo (kWh)</p>
            <p className="text-xl font-bold text-yellow-800 dark:text-yellow-100">{data.energy}</p>
          </div>
        </Card>
      </div>

      {/* Biểu đồ */}
      <Card className="p-6 rounded-xl shadow-xl bg-white dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          📊 Biểu đồ rác phân loại theo năm
        </h2>
        <EChartsOverview />
      </Card>
    </div>
  );
}
