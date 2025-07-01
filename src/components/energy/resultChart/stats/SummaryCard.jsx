"use client";

import { calculateEquivalent } from '../utils/dataUtils';
import { getMonthlyConsumption } from "../utils/consumpYearly";

const SummaryCard = ({ dailyData, monthlyData, isMobile = false, inputMonth = 5 }) => {
  const currentYear = new Date().getFullYear();
  const cityCapacity = getMonthlyConsumption(currentYear, inputMonth);
  const currentMonthData = monthlyData[0] || { sum: 0, monthName: 'N/A' };
  const currentConsumption = currentMonthData.sum / 1000000; // GWh

  const previousMonthData = monthlyData[1] || { sum: 0, monthName: 'N/A' };
  const previousConsumption = previousMonthData.sum / 1000000;

  const percentageChange = previousConsumption !== 0
    ? ((currentConsumption - previousConsumption) / previousConsumption) * 100
    : currentConsumption !== 0 ? 100 : 0;

  const isOverConsumption = currentConsumption > cityCapacity;
  const usagePercentage = (currentConsumption / cityCapacity) * 100;

  const getColorScheme = () => {
    if (usagePercentage > 120) {
      return {
        bgGradient: 'bg-gradient-to-br from-red-700 via-red-600 to-red-500',
        progressGradient: 'bg-gradient-to-r from-red-400 to-red-500',
        statusColor: 'text-red-100',
        statusText: 'Vượt mức'
      };
    } else if (usagePercentage > 100) {
      return {
        bgGradient: 'bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500',
        progressGradient: 'bg-gradient-to-r from-orange-400 to-amber-400',
        statusColor: 'text-amber-100',
        statusText: 'Vượt mức'
      };
    } else if (usagePercentage > 80) {
      return {
        bgGradient: 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500',
        progressGradient: 'bg-gradient-to-r from-blue-400 to-blue-500',
        statusColor: 'text-blue-100',
        statusText: 'Đạt mức'
      };
    } else {
      return {
        bgGradient: 'bg-gradient-to-br from-green-700 via-green-600 to-emerald-500',
        progressGradient: 'bg-gradient-to-r from-green-400 to-emerald-500',
        statusColor: 'text-green-100',
        statusText: 'Đạt mức'
      };
    }
  };

  const colorScheme = getColorScheme();
  const warnings = [];
  if (usagePercentage > 120) {
    warnings.push(`Vượt ${usagePercentage.toFixed(0)}% công suất`);
  }

  return (
    <div className={`
      ${colorScheme.bgGradient}
      text-white
      rounded-xl shadow-lg p-4
      ${isMobile ? 'w-full' : 'border border-gray-200/30'}
      backdrop-blur-sm
    `}>
      {/* Compact Header Row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h3 className={`font-medium ${isMobile ? 'text-sm' : 'text-lg'}`}>
            Tiêu thụ {currentMonthData.monthName}
          </h3>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${colorScheme.statusColor} bg-white/10`}>
          {colorScheme.statusText}
        </div>
      </div>

      {/* Main Value with Change Indicator */}
      <div className="flex items-end justify-between mb-3">
        <div className="text-2xl font-bold">{currentConsumption.toFixed(2)} GWh</div>
        <div className={`text-xs ${percentageChange >= 0 ? 'text-red-100' : 'text-green-100'}`}>
          {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}{isMobile ? '%' : '% so với tháng trước'}
        </div>
      </div>

      {/* Compact Progress Bar */}
      <div className="mb-2">
        <div className="w-full bg-white/20 rounded-full h-2 mb-1">
          <div 
             className={`h-2 rounded-full ${colorScheme.progressGradient}`}
            style={{ width: `${Math.min(usagePercentage, 120)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs">
          <span>{usagePercentage.toFixed(0)}% công suất</span>
          <span>{cityCapacity} GWh</span>
        </div>
      </div>

      {/* Warning Banner (only when needed) */}
      {warnings.length > 0 && isMobile && (
        <div className="mt-2 text-xs bg-red-500/90 text-white px-2 py-1 rounded flex items-center">
          <span className="mr-1">⚠️</span>
          <span>{warnings[0]}</span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;