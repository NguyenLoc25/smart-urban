"use client";

import { useEffect, useState } from "react";

const useEnergyData = () => {
  const [energyData, setEnergyData] = useState({
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
    yearly: []
  });

  useEffect(() => {
    const fetchYearlyData = async () => {
      try {
        const energyTypes = ["solar", "wind", "hydro"];
        const yearlyData = [];

        for (const type of energyTypes) {
          const response = await fetch(`/api/energy_use_data/year/${type}`);
          
          if (!response.ok) {
            console.warn(`⚠️ Không thể lấy dữ liệu năm cho ${type}`);
            continue;
          }

          const data = await response.json();
          console.log(`📊 Data từ API (${type}):`, data); // Debug dữ liệu từ API

          if (!Array.isArray(data)) {
            console.error(`❌ Dữ liệu không hợp lệ cho ${type}:`, data);
            continue;
          }

          yearlyData.push(
            ...data.map((item) => ({
              year: item.year,
              [type]: item.energy,
            }))
          );
        }

        // Gộp dữ liệu theo năm
        const mergedYearlyData = yearlyData.reduce((acc, item) => {
          let existingEntry = acc.find((entry) => entry.year === item.year);
          if (!existingEntry) {
            existingEntry = { year: item.year, solar: 0, wind: 0, hydro: 0 };
            acc.push(existingEntry);
          }
          Object.assign(existingEntry, item);
          return acc;
        }, []);

        setEnergyData((prevData) => ({
          ...prevData,
          yearly: mergedYearlyData,
        }));
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu năm:", error);
      }
    };

    fetchYearlyData();
  }, []);

  return energyData;
};

export default useEnergyData;
