"use client";

import { calculateEquivalent } from '../utils/dataUtils';
import { getMonthlyConsumption } from "../utils/consumpYearly";

const SummaryCard = ({ dailyData, monthlyData, mobile = false, inputMonth = 5 }) => {
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

  const getBackgroundGradient = () => {
    if (usagePercentage > 120) {
      return 'bg-gradient-to-br from-red-700 via-red-600 to-red-500';
    } else if (usagePercentage > 100) {
      return 'bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500';
    } else if (usagePercentage > 80) {
      return 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500';
    } else {
      return 'bg-gradient-to-br from-green-700 via-green-600 to-emerald-500';
    }
  };

  const statusColor = isOverConsumption ? 'text-red-100' : 'text-green-100';
  const statusText = isOverConsumption ? 'Vượt mức' : 'Trong mức';

  const progressBarColor = isOverConsumption 
    ? 'bg-gradient-to-r from-red-400 to-red-500' 
    : 'bg-gradient-to-r from-green-400 to-emerald-500';

  // Only show critical warnings on mobile
  const warnings = [];
  if (usagePercentage > 120) {
    warnings.push(`Cảnh báo: Vượt ${usagePercentage.toFixed(0)}% mức cung cấp`);
  }

  return (
    <div className={`
      ${getBackgroundGradient()}
      text-white
      rounded-xl shadow-lg p-4
      ${mobile ? '' : 'border border-gray-200/30'}
      backdrop-blur-sm
    `}>
      <h3 className="text-sm font-semibold mb-3 flex items-center text-white/90">
        <svg 
          className="w-4 h-4 mr-1.5 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
          />
        </svg>
        Tiêu thụ - {currentMonthData.monthName}
      </h3>
      
      <div className="flex items-end justify-between mb-3">
        <div className="text-2xl font-bold text-white drop-shadow-md">
          {currentConsumption.toFixed(2)} GWh
        </div>
      </div>
      
      <div className="mb-2 mt-4 relative">
        <div className="w-full bg-white/20 rounded-full h-2.5 mb-1">
          <div 
            className={`h-2.5 rounded-full ${progressBarColor} shadow-md`}
            style={{ width: `${Math.min(usagePercentage, 120)}%` }}
          ></div>
          <span 
            className={`absolute text-xs font-medium px-1 rounded ${statusColor}`}
            style={{ 
              left: `${Math.min(usagePercentage, 100)}%`, 
              top: '-20px',
              transform: 'translateX(-50%)' 
            }}
          >
            {statusText}
          </span>
        </div>
        <div className="text-xs text-white/90 flex justify-between">
          <span>{usagePercentage.toFixed(0)}%</span>
          <span>Tổng: {cityCapacity} GWh</span>
        </div>
      </div>
      
      <div className="text-xs text-white/80 mb-1 flex items-center">
        <span className={`inline-block mr-1 ${percentageChange >= 0 ? 'text-red-100' : 'text-green-100'}`}>
          {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}%
        </span>
        <span>vs tháng trước</span>
      </div>
      
      {warnings.length > 0 && mobile && (
        <div className="mt-3">
          <div className="text-xs p-2 rounded-md bg-red-500/90 text-white flex items-start shadow-sm">
            <span className="mr-1">⚠️</span>
            <span>{warnings[0]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;