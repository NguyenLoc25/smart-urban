"use client";

import React from "react";
import FishChart from "./fish/page";
import ChickenChart from "./chicken/page";
import MushroomChart from "./mushroom/page";
import VegetableChart from "./vegetable/page";

export default function SmartGardenDashboard() {
  return (
    <div className="min-h-screen p-6 grid grid-cols-1 gap-6
      bg-gradient-to-br from-green-100 via-white to-lime-100
      dark:from-gray-900  dark:to-black
      transition-colors duration-500"
    >
      <h1 className="text-3xl font-bold text-center text-emerald-800 dark:text-lime-300 mb-4">
        📊 Biểu đồ Khu Vườn Thông Minh
      </h1>
      <FishChart />
      <ChickenChart />
      <MushroomChart />
      <VegetableChart />
    </div>
  );
}
