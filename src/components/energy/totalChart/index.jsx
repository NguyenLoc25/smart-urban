// TotalChart/index.jsx
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { VIEW_MODES } from "./types";
import ChartRenderer from "@/components/energy/totalChart/ChartDisplay/ChartRenderer";
import ViewModeSelector from "@/components/energy/totalChart/Controls/ViewModeSelector";
import YearSelector from "@/components/energy/totalChart/Controls/YearSelector";
import DesktopHeader from "@/components/energy/totalChart/Header/DesktopHeader";
import MobileHeader from "@/components/energy/totalChart/Header/MobileHeader";
import LoadingState from "@/components/energy/States/LoadingState";
import EmptyState from "@/components/energy/States/EmptyState";

const TotalChart = ({ energyData }) => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.YEARLY);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRange, setInitialRange] = useState(null);

  const allYears = [...new Set(
    energyData?.monthly?.map(item => item.year) || []
  )].sort((a, b) => a - b);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let data = [];
    if (viewMode === VIEW_MODES.YEARLY) {
      data = Array.isArray(energyData?.yearly) ? energyData.yearly : [];
      if (isMobile) {
        setInitialRange([2020, 2023]);
      } else {
        setInitialRange(null);
      }
    } else if (viewMode === VIEW_MODES.MONTHLY) {
      data = Array.isArray(energyData?.monthly) ? 
        energyData.monthly.filter(item => item.year === selectedYear) : [];
      setInitialRange(null);
    } else if (viewMode === VIEW_MODES.HOURLY) {
      data = Array.isArray(energyData?.hourly) ? energyData.hourly : [];
      if (isMobile) {
        setInitialRange([0, 3]);
      } else {
        setInitialRange(null);
      }
    }
    setSelectedData(data);
    setTimeout(() => setIsLoading(false), 300);
  }, [viewMode, energyData, selectedYear, isMobile]);

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-6 bg-white dark:bg-gray-900 shadow-lg ${isLoading ? 'opacity-75 transition-opacity duration-300' : ''}`}>
      {!isMobile && <DesktopHeader viewMode={viewMode} />}
      {isMobile && <MobileHeader viewMode={viewMode} />}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <ViewModeSelector viewMode={viewMode} setViewMode={setViewMode} />
        {viewMode === VIEW_MODES.MONTHLY && (
          <YearSelector 
            selectedYear={selectedYear} 
            setSelectedYear={setSelectedYear} 
            allYears={allYears} 
          />
        )}
      </div>

      <div className="relative">
        {isLoading ? (
          <LoadingState />
        ) : selectedData.length > 0 ? (
          <div className={`${isMobile ? 'h-[300px]' : 'h-[500px]'} min-h-[200px] w-full transition-all duration-300`}>
            <ChartRenderer 
              viewMode={viewMode} 
              selectedData={selectedData} 
              isMobile={isMobile} 
              initialRange={initialRange} 
              selectedYear={selectedYear} 
            />
          </div>
        ) : (
          <EmptyState />
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
          Cập nhật lần cuối: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default TotalChart;