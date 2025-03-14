import React, { useMemo, useState, useEffect } from "react";
import QuantityTable from "./QuantityTable";
import SunChart from "./SunChart";
import WaterChart from "./WaterChart";
import WindChart from "./WindChart";
import TotalChart from "./TotalChart"; 
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import DetailButton from "./DetailButton";
import { motion, AnimatePresence } from "framer-motion";

const windData = [
  { time: "06:00", power: 30 },
  { time: "12:00", power: 90 },
  { time: "18:00", power: 60 }
];

const solarData = [
  { time: "06:00", power: 10 },
  { time: "12:00", power: 80 },
  { time: "18:00", power: 20 }
];

const hydroData = [
  { time: "06:00", power: 70 },
  { time: "12:00", power: 90 },
  { time: "18:00", power: 80 }
];


const cityConsumption = 200;

export default function EnergyPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [theme, setTheme] = useState(() => {
    return typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light";
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const totalEnergy = useMemo(
    () =>
      windData.map((d, i) => ({
        time: d.time,
        wind: d.power,
        solar: solarData[i].power,
        hydro: hydroData[i].power
      })),
    []
  );

  const dailyTotal = useMemo(
    () =>
      totalEnergy.map((d) => ({
        time: d.time,
        total: d.wind + d.solar + d.hydro,
        cityNeed: cityConsumption
      })),
    [totalEnergy]
  );

  const deficit = useMemo(
    () =>
      dailyTotal.map((d) => ({
        time: d.time,
        deficit: d.total - d.cityNeed
      })),
    [dailyTotal]
  );

  // Định nghĩa màu dựa trên theme
  const colors = {
    text: theme === "dark" ? "#ffffff" : "#333333",
    border: theme === "dark" ? "#4A5568" : "#CBD5E0",
    bg: theme === "dark" ? "#1A202C" : "#ffffff",
    wind: theme === "dark" ? "#5A67D8" : "#82ca9d",
    solar: theme === "dark" ? "#F6E05E" : "#ff7300",
    hydro: theme === "dark" ? "#63B3ED" : "#0000ff",
    deficit: theme === "dark" ? "#F56565" : "#ff0000"
  };

  return (
    <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <QuantityTable
  title={
    <span className="text-black dark:text-white">Tổng hợp sản lượng điện</span>
  }
  data={[
    {
      location: "Điện gió",
      count: (
        <span className="text-black dark:text-white">
          {windData.reduce((sum, item) => sum + item.power, 0)}
        </span>
      ),
    },
    {
      location: "Điện mặt trời",
      count: (
        <span className="text-black dark:text-white">
          {solarData.reduce((sum, item) => sum + item.power, 0)}
        </span>
      ),
    },
    {
      location: "Thủy điện",
      count: (
        <span className="text-black dark:text-white">
          {hydroData.reduce((sum, item) => sum + item.power, 0)}
        </span>
      ),
    },
  ]}
/>

<div className="relative col-span-1 md:col-span-2 lg:col-span-3 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {/* Nút Detail ở góc phải */}
      <DetailButton onClick={() => setShowDetails(!showDetails)} isDetailVisible={showDetails} />

      {/* Hiển thị TotalChart nếu chưa bấm nút */}
      <AnimatePresence mode="wait">
        {!showDetails && (
          <motion.div
            key="total"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-2">Tổng hợp sản lượng điện</h2>
            <TotalChart totalEnergy={totalEnergy} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hiển thị 3 biểu đồ khi bấm nút */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            <WindChart title="Sản lượng điện gió" data={windData} />
            <SunChart title="Sản lượng điện mặt trời" data={solarData} strokeColor="#ff8c00" fillColor="rgba(255, 140, 0, 0.5)" />
            <WaterChart title="Sản lượng thủy điện" data={hydroData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>


      <div className="col-span-1 md:col-span-2 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <h2 className="text-lg font-semibold mb-2">Thiếu hụt điện</h2>
        <BarChart width={400} height={200} data={deficit}>
          <XAxis dataKey="time" stroke={colors.text} />
          <YAxis stroke={colors.text} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="deficit"
            fill={(entry) => (entry.deficit >= 0 ? colors.wind : colors.deficit)}
            name="Thiếu/Dư điện"
          />
        </BarChart>
      </div>
    </div>
  );
}
