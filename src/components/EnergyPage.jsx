import React, { useMemo, useState } from "react";
import QuantityTable from "./QuantityTable";
import SunChart from "./SunChart";
import WaterChart from "./WaterChart";
import WindChart from "./WindChart";
import TotalChart from "./TotalChart";
import DetailButton from "./DetailButton";
import { motion, AnimatePresence } from "framer-motion";
import ResultChart from "./ResultChart";

const energyData = {
  hourly: [
    { time: "00:00", wind: 50, solar: 0, hydro: 60, cityNeed: 120 },
    { time: "06:00", wind: 90, solar: 40, hydro: 70, cityNeed: 200 },
    { time: "12:00", wind: 120, solar: 100, hydro: 100, cityNeed: 200 },
    { time: "18:00", wind: 70, solar: 30, hydro: 80, cityNeed: 200 },
    { time: "24:00", wind: 50, solar: 0, hydro: 90, cityNeed: 200 }
  ],
  daily: [
    { day: "2024-03-01", wind: 1800, solar: 1500, hydro: 2200, cityNeed: 5500 },
    { day: "2024-03-02", wind: 1700, solar: 1400, hydro: 2300, cityNeed: 5400 },
    { day: "2024-03-03", wind: 1600, solar: 1300, hydro: 2100, cityNeed: 5300 }
  ],
  monthly: [
    { month: "Jan", wind: 1500, solar: 1100, hydro: 2200, cityNeed: 5000 },
    { month: "Feb", wind: 1400, solar: 1200, hydro: 2300, cityNeed: 4900 },
    { month: "Mar", wind: 1600, solar: 1300, hydro: 2100, cityNeed: 5200 }
  ],
  yearly: [
    { year: "2023", wind: 18000, solar: 15000, hydro: 25000, cityNeed: 60000 },
    { year: "2024", wind: 19000, solar: 16000, hydro: 26000, cityNeed: 62000 }
  ]
};

// Tính tổng công suất từ dữ liệu
const windData = energyData.hourly.map((d) => ({ time: d.time, power: d.wind }));
const solarData = energyData.hourly.map((d) => ({ time: d.time, power: d.solar }));
const hydroData = energyData.hourly.map((d) => ({ time: d.time, power: d.hydro }));
const cityData = energyData.hourly.map((d) => ({ time: d.time, consumption: d.cityNeed }));

export default function EnergyPage() {
  const totalEnergy = useMemo(
    () => windData.map((d, i) => ({
      time: d.time,
      wind: d.power,
      solar: solarData[i].power,
      hydro: hydroData[i].power
    })),
    [windData, solarData, hydroData]
  );
  

  const dailyTotal = useMemo(
    () => totalEnergy.map((d, i) => ({
      time: d.time,
      total: d.wind + d.solar + d.hydro,
      cityNeed: cityData[i].consumption // Use cityData here
    })),
    [totalEnergy]
  );

  const deficit = useMemo(
    () => dailyTotal.map((d) => ({
      time: d.time,
      deficit: d.total - d.cityNeed
    })),
    [dailyTotal]
  );

  const colors = {
    text: "#333333",
    border: "#CBD5E0",
    bg: "#ffffff",
    wind: "#82ca9d",
    solar: "#ff7300",
    hydro: "#0000ff",
    deficit: "#ff0000"
  };

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-2">Số lượng sản xuất</h2>
        <QuantityTable
  title={
    <span className="text-black dark:text-white">Tổng hợp sản lượng điện</span>
  }
  data={[
    {
      location: "Điện gió",
      count: (
        <span className="text-black dark:text-white">
          {energyData.daily.reduce((sum, item) => sum + item.wind, 0)}
        </span>
      ),
    },
    {
      location: "Điện mặt trời",
      count: (
        <span className="text-black dark:text-white">
          {energyData.daily.reduce((sum, item) => sum + item.solar, 0)}
        </span>
      ),
    },
    {
      location: "Thủy điện",
      count: (
        <span className="text-black dark:text-white">
          {energyData.daily.reduce((sum, item) => sum + item.hydro, 0)}
        </span>
      ),
    },
  ]}
/>


      
      </div>

      <div className="border rounded-lg p-4 md:p-6 bg-gray-50 dark:bg-gray-800 md:col-span-2">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Tổng hợp sản lượng điện</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-900 text-center rounded-lg">
            <h3 className="font-semibold text-base md:text-lg">🌬️ Điện gió</h3>
            <p className="text-lg md:text-xl font-bold">{totalEnergy.reduce((sum, d) => sum + d.wind, 0)} MW</p>
          </div>

          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-center rounded-lg">
            <h3 className="font-semibold text-base md:text-lg">☀️ Điện mặt trời</h3>
            <p className="text-lg md:text-xl font-bold">{totalEnergy.reduce((sum, d) => sum + d.solar, 0)} MW</p>
          </div>

          <div className="p-4 bg-blue-100 dark:bg-blue-900 text-center rounded-lg">
            <h3 className="font-semibold text-base md:text-lg">💧 Thủy điện</h3>
            <p className="text-lg md:text-xl font-bold">{totalEnergy.reduce((sum, d) => sum + d.hydro, 0)} MW</p>
          </div>
        </div>
      </div>

      <div className="relative col-span-1 md:col-span-3 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:text-white">
        <AnimatePresence mode="wait">
          {!showDetails && (
            <motion.div
              key="total"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <TotalChart totalEnergy={totalEnergy} energyData={energyData} />

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:text-white">
        <h3 className="font-semibold text-base md:text-lg">Tổng hợp</h3>
        <ResultChart data={deficit} colors={colors} totalEnergy={totalEnergy} cityData={cityData} />
      </div>
    </div>
  );
}
