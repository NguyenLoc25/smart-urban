import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import DesktopView from '@components/energy/totalChart/views/DesktopView';
import MobileView from '@components/energy/totalChart/views/MobileView';
import { useChartData } from '@components/energy/totalChart/ChartDisplay/ChartHelpers';

// Dynamic import for Plotly with SSR disabled
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const TotalChart = ({ energyData }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    viewMode,
    setViewMode,
    selectedYear,
    setSelectedYear,
    isLoading,
    selectedData,
    allYears,
    renderChart
  } = useChartData(energyData, isMobile, Plot);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? (
    <MobileView
      viewMode={viewMode}
      setViewMode={setViewMode}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      isLoading={isLoading}
      selectedData={selectedData}
      allYears={allYears}
      renderChart={renderChart}
    />
  ) : (
    <DesktopView
      viewMode={viewMode}
      setViewMode={setViewMode}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      isLoading={isLoading}
      selectedData={selectedData}
      allYears={allYears}
      renderChart={renderChart}
    />
  );
};

export default TotalChart;