'use client'; // Add this at the top to ensure this is a client component

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { parseFirebaseNumber } from "@/components/energy/tableDevide/utils/parsers";
import DesktopView from "@/components/energy/tableDevide/Views/DesktopView";
import MobileView from "@/components/energy/tableDevide/Views/MobileView";
import ModalState from "@/components/energy/states/ModalState";
import SummaryCard from "@/components/energy/tableDevide/components/SummaryCard";
import { energyTypes } from "@/components/energy/tableDevide/types";

// Dynamically import Plotly with SSR disabled
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => <div>Loading chart...</div>
});

export default function QuantityTable({ data = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnergyType, setSelectedEnergyType] = useState(null);

  const calculateQuantityData = (devices) => {
    const quantityData = {
      hydro: 0,
      wind: 0,
      solar: 0,
      total: 0,
      hydroCount: 0,
      windCount: 0,
      solarCount: 0,
      hydroModels: [],
      windModels: [],
      solarModels: []
    };
  
    if (devices && Array.isArray(devices)) {
      devices.forEach((deviceGroup) => {
        const devicesToProcess = 
          typeof deviceGroup === "object" && !Array.isArray(deviceGroup)
            ? Object.values(deviceGroup)
            : [deviceGroup];
  
        devicesToProcess.forEach((device) => {
          if (!device) return;
  
          const model = device.model || 
                     device.info?.model || 
                     device.device_name || 
                     'Unknown model';
  
          const quantity = parseFirebaseNumber(device.quantity || device.used || 0);
  
          switch (device.energy_type) {
            case "Hydro":
              quantityData.hydro += quantity;
              quantityData.hydroCount += 1;
              if (model) quantityData.hydroModels.push(model);
              break;
            case "Wind":
              quantityData.wind += quantity;
              quantityData.windCount += 1;
              if (model) quantityData.windModels.push(model);
              break;
            case "Solar":
              quantityData.solar += quantity;
              quantityData.solarCount += 1;
              if (model) quantityData.solarModels.push(model);
              break;
            default:
              break;
          }
  
          quantityData.total += quantity;
        });
      });
    }
  
    return quantityData;
  };

  const quantityData = calculateQuantityData(data);

  const openModal = (energyType) => {
    setSelectedEnergyType(energyType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnergyType(null);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 shadow-lg">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-xl p-4 sm:p-6 md:p-10 text-white mb-4 sm:mb-6 shadow-lg">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold drop-shadow-md whitespace-nowrap">
                Quản lý thiết bị
              </h2>
              {quantityData.version && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full">
                  {quantityData.version}
                </span>
              )}
            </div>
            <div className="sm:hidden flex items-center p-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-medium">
                {new Date().toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
          </div>

          <p className="hidden sm:block text-xs sm:text-sm text-white/80">
            Theo dõi và quản lý tất cả thiết bị đang hoạt động trong hệ thống
          </p>
        </div>
      </div>

      <div className="hidden md:block">
        <DesktopView 
          energyTypes={energyTypes} 
          quantityData={quantityData} 
          openModal={openModal} 
        />
      </div>
      <div className="md:hidden">
        <MobileView 
          energyTypes={energyTypes} 
          quantityData={quantityData} 
          openModal={openModal} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          title="Tổng vị trí"
          value={energyTypes.hydro.maxSlots + energyTypes.wind.maxSlots + energyTypes.solar.maxSlots}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          }
          color="purple"
        />
        <SummaryCard
          title="Tổng đã sử dụng"
          value={quantityData.hydro + quantityData.wind + quantityData.solar}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          color="red"
        />
        <SummaryCard
          title="Tổng còn trống"
          value={
            energyTypes.hydro.maxSlots + energyTypes.wind.maxSlots + energyTypes.solar.maxSlots -
            (quantityData.hydro + quantityData.wind + quantityData.solar)
          }
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
          color="green"
        />
      </div>

      {isModalOpen && selectedEnergyType && (
        <ModalState 
          energyTypes={{
            hydro: {
              ...energyTypes.hydro,
              models: quantityData.hydroModels
            },
            wind: {
              ...energyTypes.wind,
              models: quantityData.windModels
            },
            solar: {
              ...energyTypes.solar,
              models: quantityData.solarModels
            }
          }} 
          selectedEnergyType={selectedEnergyType} 
          closeModal={closeModal} 
        />
      )}
    </div>
  );
}