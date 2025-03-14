import React, { useMemo, useState } from "react";
import QuantityTable from "./QuantityTable";
import SunChart from "./SunChart";
import WaterChart from "./WaterChart";
import WindChart from "./WindChart";
import TotalChart from "./TotalChart";
import DetailButton from "./DetailButton";
import { motion, AnimatePresence } from "framer-motion";
import ResultChart from "./ResultChart";

const windData = [
  { time: "00:00", power: 50 },
  { time: "06:00", power: 90 },
  { time: "12:00", power: 120 },
  { time: "18:00", power: 70 },
  { time: "24:00", power: 50 }
];

const solarData = [
  { time: "00:00", power: 0 },
  { time: "06:00", power: 40 },
  { time: "12:00", power: 100 },
  { time: "18:00", power: 30 },
  { time: "24:00", power: 0 }
];

const hydroData = [
  { time: "00:00", power: 60 },
  { time: "06:00", power: 70 },
  { time: "12:00", power: 100 },
  { time: "18:00", power: 80 },
  { time: "24:00", power: 90 }
];

const cityData = [
  { time: "00:00", consumption: 120 },
  { time: "06:00", consumption: 200 },
  { time: "12:00", consumption: 200 },
  { time: "18:00", consumption: 200 },
  { time: "24:00", consumption: 200 }
];

export default function EnergyPage() {
  const totalEnergy = useMemo(
    () => windData.map((d, i) => ({
      time: d.time,
      wind: d.power,
      solar: solarData[i].power,
      hydro: hydroData[i].power
    })),
    []
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
      </div>

      <div className="border rounded-lg p-4 md:p-6 bg-gray-50 dark:bg-gray-800 md:col-span-2">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Tổng hợp sản lượng điện</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-900 text-center rounded-lg">
            <h3 className="font-semibold text-base md:text-lg">Điện gió</h3>
            <p className="text-lg md:text-xl font-bold">{totalEnergy.reduce((sum, d) => sum + d.wind, 0)} MW</p>
          </div>

          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-center rounded-lg">
            <h3 className="font-semibold text-base md:text-lg">Điện mặt trời</h3>
            <p className="text-lg md:text-xl font-bold">{totalEnergy.reduce((sum, d) => sum + d.solar, 0)} MW</p>
          </div>

          <div className="p-4 bg-blue-100 dark:bg-blue-900 text-center rounded-lg">
            <h3 className="font-semibold text-base md:text-lg">Thủy điện</h3>
            <p className="text-lg md:text-xl font-bold">{totalEnergy.reduce((sum, d) => sum + d.hydro, 0)} MW</p>
          </div>
        </div>
      </div>

      <div className="relative col-span-1 md:col-span-3 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 dark:text-white">
        <DetailButton onClick={() => setShowDetails(!showDetails)} isDetailVisible={showDetails} />
        <AnimatePresence mode="wait">
          {!showDetails && (
            <motion.div
              key="total"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <TotalChart totalEnergy={totalEnergy} />
            </motion.div>
          )}
        </AnimatePresence>
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
              <SunChart title="Sản lượng điện mặt trời" data={solarData} />
              <WaterChart title="Sản lượng thủy điện" data={hydroData} />
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
