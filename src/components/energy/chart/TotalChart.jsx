import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const TotalChart = ({ energyData }) => {
  const [viewMode, setViewMode] = useState("yearly");
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
    if (viewMode === "yearly") {
      data = Array.isArray(energyData?.yearly) ? energyData.yearly : [];
      if (isMobile) {
        setInitialRange([2020, 2023]);
      } else {
        setInitialRange(null);
      }
    } else if (viewMode === "monthly") {
      data = Array.isArray(energyData?.monthly) ? energyData.monthly.filter(item => item.year === selectedYear) : [];
      setInitialRange(null);
    } else if (viewMode === "hourly") {
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

  const getYAxisConfig = () => {
    switch(viewMode) {
      case "yearly":
        return {
          title: "Công suất (TWh)",
          tickformat: ",.f",
          hoverformat: ",.f"
        };
      case "monthly":
        return {
          title: "Công suất (GWh)",
          tickformat: ",..0f",
          hoverformat: ",..0f"
        };
      case "hourly":
        return {
          title: "Công suất (GWh)",
          tickformat: ",..0f",
          hoverformat: ",..0f"
        };
      default:
        return {
          title: "Công suất (MW)",
          tickformat: ",.0f",
          hoverformat: ",.0f"
        };
    }
  };

  const convertDataUnit = (value) => {
    switch(viewMode) {
      case "yearly": 
        return value;
      case "monthly":
        return value / 1000;
      case "hourly": 
        return value / 1000000;
      default:
        return value;
    }
  };

  const getDisplayUnit = () => {
    switch(viewMode) {
      case "yearly": return "TWh";
      case "monthly": return "GWh";
      case "hourly": return "GWh";
      default: return "MW";
    }
  };

  const yAxisConfig = getYAxisConfig();
  const displayUnit = getDisplayUnit();

  const renderChart = () => (
    <Plot
      data={[
        {
          x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
          y: selectedData.map((item) => convertDataUnit(item.wind)),
          type: "scatter",
          mode: "lines+markers",
          name: "Điện gió",
          line: { color: "#10b981", width: isMobile ? 2 : 3, shape: 'spline' },
          marker: { size: isMobile ? 6 : 10, color: "#10b981", symbol: 'circle' },
          hovertemplate: `<b>${viewMode === "yearly" ? "Năm %{x}" : viewMode === "monthly" ? "Tháng %{x}" : "Giờ %{x}"}</b><br>%{y:${yAxisConfig.hoverformat}} ${displayUnit}<extra></extra>`,
          fill: 'tozeroy',
          fillcolor: 'rgba(16, 185, 129, 0.15)'
        },
        {
          x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
          y: selectedData.map((item) => convertDataUnit(item.solar)),
          type: "scatter",
          mode: "lines+markers",
          name: "Điện mặt trời",
          line: { color: "#f59e0b", width: isMobile ? 2 : 3, shape: 'spline' },
          marker: { size: isMobile ? 6 : 10, color: "#f59e0b", symbol: 'diamond' },
          hovertemplate: `<b>${viewMode === "yearly" ? "Năm %{x}" : viewMode === "monthly" ? "Tháng %{x}" : "Giờ %{x}"}</b><br>%{y:${yAxisConfig.hoverformat}} ${displayUnit}<extra></extra>`,
          fill: 'tozeroy',
          fillcolor: 'rgba(245, 158, 11, 0.15)'
        },
        {
          x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
          y: selectedData.map((item) => convertDataUnit(item.hydro)),
          type: "scatter",
          mode: "lines+markers",
          name: "Thủy điện",
          line: { color: "#3b82f6", width: isMobile ? 2 : 3, shape: 'spline' },
          marker: { size: isMobile ? 6 : 10, color: "#3b82f6", symbol: 'square' },
          hovertemplate: `<b>${viewMode === "yearly" ? "Năm %{x}" : viewMode === "monthly" ? "Tháng %{x}" : "Giờ %{x}"}</b><br>%{y:${yAxisConfig.hoverformat}} ${displayUnit}<extra></extra>`,
          fill: 'tozeroy',
          fillcolor: 'rgba(59, 130, 246, 0.1)'
        },
      ]}
      layout={{
        xaxis: { 
          ...(isMobile && initialRange ? {
            range: initialRange,
            autorange: false
          } : {}),
          title: {
            text: viewMode === "yearly" ? "Năm" : viewMode === "monthly" ? `Tháng (Năm ${selectedYear})` : "Giờ",
            font: { 
              size: isMobile ? 12 : 14, 
              color: '#4b5563', 
              family: 'Inter, sans-serif' 
            }
          },
          gridcolor: '#e5e7eb',
          linecolor: '#e5e7eb',
          tickfont: { 
            size: isMobile ? 10 : 12,
            color: '#4b5563', 
            family: 'Inter, sans-serif' 
          },
          showgrid: true,
          zerolinecolor: '#e5e7eb'
        },
        yaxis: { 
          title: {
            text: yAxisConfig.title,
            font: { 
              size: isMobile ? 12 : 14, 
              color: '#4b5563', 
              family: 'Inter, sans-serif' 
            }
          },
          gridcolor: '#e5e7eb',
          linecolor: '#e5e7eb',
          tickformat: yAxisConfig.tickformat,
          tickfont: { 
            size: isMobile ? 10 : 12,
            color: '#4b5563', 
            family: 'Inter, sans-serif' 
          },
          rangemode: 'tozero',
          zerolinecolor: '#e5e7eb'
        },
        legend: { 
          orientation: "h",
          y: isMobile ? -0.3 : -0.25,
          x: 0.5,
          xanchor: 'center',
          font: { 
            size: isMobile ? 10 : 12, 
            family: 'Inter, sans-serif', 
            color: '#1f2937' 
          },
          bgcolor: 'rgba(255,255,255,0.9)',
          bordercolor: '#e5e7eb',
          borderwidth: 1
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: { 
          t: isMobile ? 20 : 30, 
          l: isMobile ? 50 : 60, 
          r: isMobile ? 20 : 30, 
          b: isMobile ? 70 : 80 
        },
        hoverlabel: {
          bgcolor: '#1f2937',
          font: { 
            color: 'white', 
            size: isMobile ? 10 : 12, 
            family: 'Inter, sans-serif' 
          },
          bordercolor: '#1f2937'
        },
        transition: {
          duration: 300,
          easing: 'cubic-in-out'
        },
        font: {
          family: 'Inter, sans-serif'
        }
      }}
      config={{ 
        responsive: true, 
        displayModeBar: true,
        scrollZoom: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
        modeBarButtonsToAdd: isMobile ? [] : [
          {
            name: 'Toggle Dark Mode',
            icon: {
              width: 1000,
              height: 1000,
              path: 'M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z',
              transform: 'matrix(1 0 0 -1 0 1000)'
            },
            click: function(gd) {
              // Function to toggle dark mode
            }
          }
        ]
      }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
    />
  );

  const renderControls = () => (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner flex-1">
        {["yearly", "monthly", "hourly"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 px-4 py-2 text-sm rounded-md transition-all duration-200 ${
              viewMode === mode
                ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm dark:bg-indigo-900 dark:text-indigo-100'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {mode === "yearly" ? "Năm" : mode === "monthly" ? "Tháng" : "Giờ"}
          </button>
        ))}
      </div>

      {viewMode === "monthly" && (
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner min-w-[150px]">
          <label htmlFor="year-select" className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
            Năm:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-0 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 flex-1"
          >
            {allYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl overflow-hidden mb-6">
      <div className="p-6 md:p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Phân tích sản lượng điện
            </h1>
            <div className="mt-2 flex flex-col md:flex-row md:items-center md:gap-4">
              <p className="text-base md:text-lg opacity-90 flex items-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dữ liệu theo {viewMode === "yearly" ? "năm" : viewMode === "monthly" ? "tháng" : "giờ"}
              </p>
              <p className="text-base md:text-lg opacity-90 flex items-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Cập nhật: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
      <div className="text-gray-400 dark:text-gray-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-500 dark:text-gray-300 font-medium">Không có dữ liệu để hiển thị</p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Vui lòng chọn khoảng thời gian khác</p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700 h-[500px] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-6 bg-white dark:bg-gray-900 shadow-lg ${isLoading ? 'opacity-75 transition-opacity duration-300' : ''}`}>
      {!isMobile && renderHeader()}
      
      {isMobile && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md overflow-hidden mb-4">
          <div className="p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">Phân tích sản lượng điện</h1>
                <p className="text-sm opacity-90 mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dữ liệu {viewMode === "yearly" ? "năm" : viewMode === "monthly" ? "tháng" : "giờ"}
                </p>
              </div>
              <div className="bg-white/20 rounded p-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderControls()}

      <div className="relative">
        {isLoading ? (
          renderLoadingState()
        ) : selectedData.length > 0 ? (
          <div className={`${isMobile ? 'h-[300px]' : 'h-[500px]'} min-h-[200px] w-full transition-all duration-300`}>
            {renderChart()}
          </div>
        ) : (
          renderEmptyState()
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
          Cập nhật lần cuối: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default TotalChart;