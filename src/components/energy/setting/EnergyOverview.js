import React from "react";
import EnergyTypeCard from "./EnergyTypeCard";
import { energyTypes } from "./constants";

const EnergyOverview = ({ summary, onCategorySelect }) => {
  const energyCategories = Object.entries(energyTypes)
    .filter(([type]) => type !== "all")
    .map(([type, config]) => ({
      type,
      stat: summary[type] || {},
      ...config
    }));

  return (
    <div className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Tổng quan năng lượng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {energyCategories.map(({ type, stat, ...config }) => (
            <EnergyTypeCard
              key={type}
              type={type}
              stat={stat}
              config={config}
              onClick={() => onCategorySelect(type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyOverview;