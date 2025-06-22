'use client';
import React from "react";
import useEnergyTypes from "./hooks/useEnergyTypes";

export default function EnergyProductionCards({ energyProduction }) {
  const energyTypes = useEnergyTypes();

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Sản lượng điện từ các nguồn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(energyProduction).map(([type, values]) => (
          <div 
            key={type} 
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-700 dark:text-gray-300">{energyTypes[type] || type}</h3>
            <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">{values.production} kWh</p>
            <div className="flex items-center mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full" 
                  style={{ width: `${values.percentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{values.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}