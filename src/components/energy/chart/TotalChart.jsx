import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const TotalChart = ({ energyData }) => {
  const [viewMode, setViewMode] = useState("yearly");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2023); // Năm mặc định

  const allYears = [...new Set(
    energyData?.monthly?.map(item => item.year) || []
  )].sort((a, b) => a - b);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

// In the TotalChart component, update the useEffect for selectedData:
useEffect(() => {
  let data = [];
  if (viewMode === "yearly") {
    data = Array.isArray(energyData?.yearly) ? energyData.yearly : [];
  } else if (viewMode === "monthly") {
    const monthlyData = Array.isArray(energyData?.monthly) ? energyData.monthly : [];
    data = monthlyData.filter(item => item.year === selectedYear);
  } else if (viewMode === "hourly") {
    data = Array.isArray(energyData?.hourly) ? energyData.hourly : [];
  }
  setSelectedData(data);
}, [viewMode, energyData, selectedYear]);

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

    // Hàm chuyển đổi đơn vị dữ liệu theo viewMode
    const convertDataUnit = (value) => {
      switch(viewMode) {
        case "yearly": // Chuyển từ MW sang TWh (1 TWh = 1,000,000 MWh)
          return value;
        case "monthly": // Chuyển từ MW sang GWh (1 GWh = 1,000 MWh)
          return value / 1000;
        case "hourly": // Giữ nguyên đơn vị MWh (vì đã là công suất theo giờ)
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
    // Lọc dữ liệu theo năm khi ở chế độ xem tháng
// const filteredData = viewMode === "monthly" 
// ? rawData.filter(item => item.year === selectedYear)
// : rawData;

  const renderDesktopView = () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-lg">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl overflow-hidden mb-6">
        <div className="p-6 md:p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Phân tích sản lượng điện
              </h1>
              <div className="mt-2 flex flex-col md:flex-row md:items-center md:gap-4">
                <p className="text-base md:text-lg opacity-90 flex items-center">
                  <svg 
                    className="w-4 h-4 md:w-5 md:h-5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                  </svg>
                  Dữ liệu theo {viewMode === "yearly" ? "năm" : viewMode === "monthly" ? "tháng" : "giờ"}
                </p>
                <p className="text-base md:text-lg opacity-90 flex items-center">
                  <svg 
                    className="w-4 h-4 md:w-5 md:h-5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  Cập nhật: {new Date().toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <svg 
                className="w-5 h-5 md:w-6 md:h-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
  {/* Mode selector with dark mode support */}
  <div className="flex flex-col sm:flex-row gap-4">
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

    {/* Year selector - only visible in monthly view */}
    {viewMode === "monthly" && (
  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
    <label htmlFor="year-select" className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
      Năm:
    </label>
    <select
      id="year-select"
      value={selectedYear}
      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
      className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-0 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
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

  {/* Chart container */}
  {selectedData.length > 0 ? (
    <div className="relative">
      <div className="h-[500px] min-h-[300px] w-full">
        <Plot
          data={[
            {
              x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
              y: selectedData.map((item) => convertDataUnit(item.wind)),
              type: "scatter",
              mode: "lines+markers",
              name: "Điện gió",
              line: { color: "#3b82f6", width: 3, shape: 'spline' },
              marker: { size: 10, color: "#3b82f6", symbol: 'circle' },
              hovertemplate: `<b>${viewMode === "yearly" ? "Năm %{x}" : viewMode === "monthly" ? "Tháng %{x}" : "Giờ %{x}"}</b><br>%{y:${yAxisConfig.hoverformat}} ${displayUnit}<extra></extra>`,
              fill: 'tozeroy',
              fillcolor: 'rgba(59, 130, 246, 0.15)'
            },
            {
              x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
              y: selectedData.map((item) => convertDataUnit(item.solar)),
              type: "scatter",
              mode: "lines+markers",
              name: "Điện mặt trời",
              line: { color: "#f59e0b", width: 3, shape: 'spline' },
              marker: { size: 10, color: "#f59e0b", symbol: 'diamond' },
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
              line: { color: "#10b981", width: 3, shape: 'spline' },
              marker: { size: 10, color: "#10b981", symbol: 'square' },
              hovertemplate: `<b>${viewMode === "yearly" ? "Năm %{x}" : viewMode === "monthly" ? "Tháng %{x}" : "Giờ %{x}"}</b><br>%{y:${yAxisConfig.hoverformat}} ${displayUnit}<extra></extra>`,
              fill: 'tozeroy',
              fillcolor: 'rgba(16, 185, 129, 0.15)'
            },
          ]}
          layout={{
            xaxis: { 
              title: {
                text: viewMode === "yearly" ? "Năm" : viewMode === "monthly" ? `Tháng (Năm ${selectedYear})` : "Giờ",
                font: { size: 14, color: '#4b5563', family: 'Inter' }
              },
              gridcolor: '#e5e7eb',
              linecolor: '#e5e7eb',
              tickfont: { color: '#4b5563', family: 'Inter' },
              showgrid: true,
              zerolinecolor: '#e5e7eb',
              color: '#1f2937'
            },
            yaxis: { 
              title: {
                text: yAxisConfig.title,
                font: { size: 14, color: '#4b5563', family: 'Inter' }
              },
              gridcolor: '#e5e7eb',
              linecolor: '#e5e7eb',
              tickformat: yAxisConfig.tickformat,
              tickfont: { color: '#4b5563', family: 'Inter' },
              rangemode: 'tozero',
              zerolinecolor: '#e5e7eb'
            },
            legend: { 
              orientation: "h",
              y: -0.25,
              x: 0.5,
              xanchor: 'center',
              font: { size: 12, family: 'Inter', color: '#1f2937' },
              bgcolor: 'rgba(255,255,255,0.9)',
              bordercolor: '#e5e7eb',
              borderwidth: 1
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 30, l: 60, r: 30, b: 80 },
            hoverlabel: {
              bgcolor: '#1f2937',
              font: { color: 'white', size: 12, family: 'Inter' },
              bordercolor: '#1f2937'
            },
            transition: {
              duration: 300,
              easing: 'cubic-in-out'
            },
            font: {
              family: 'Inter'
            }
          }}
          config={{ 
            responsive: true, 
            displayModeBar: true,
            scrollZoom: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
            modeBarButtonsToAdd: [
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
        />
      </div>
      
      {/* Data source footnote */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
        Cập nhật lần cuối: {new Date().toLocaleDateString()}
      </p>
    </div>
  ) : (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
      <div className="text-gray-400 dark:text-gray-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-500 dark:text-gray-300 font-medium">Không có dữ liệu để hiển thị</p>
      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Vui lòng chọn khoảng thời gian khác</p>
    </div>
  )}
</div>
    </div>
  );

  const renderMobileView = () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-900 shadow-lg mx-2 my-3">
      {/* Gradient Header - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md mb-4 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Sản lượng điện
            </h1>
            
            <div className="mt-2 flex flex-col space-y-1">
              <p className="text-sm text-white opacity-90 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Dữ liệu theo {viewMode === "yearly" ? "năm" : viewMode === "monthly" ? "tháng" : "giờ"}
              </p>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-md px-2 py-1 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
        {["yearly", "monthly", "hourly"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 px-3 py-2 text-xs rounded-md transition-all duration-200 ${
              viewMode === mode
                ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm dark:bg-indigo-900 dark:text-indigo-100'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {mode === "yearly" ? "Năm" : mode === "monthly" ? "Tháng" : "Giờ"}
          </button>
        ))}
      </div>

      {/* Chart container optimized for mobile */}
      {selectedData.length > 0 ? (
        <div className="relative">
          <div className="h-[300px] w-full -ml-2 -mr-2">
            <Plot
              data={[
                {
                  x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
                  y: selectedData.map((item) => convertDataUnit(item.wind)),
                  type: "scatter",
                  mode: "lines+markers",
                  name: "Điện gió",
                  line: { color: "#3b82f6", width: 2, shape: 'spline' },
                  marker: { size: 8, color: "#3b82f6" },
                  hovertemplate: "<b>Năm %{x}</b><br>%{y:,.0f} MW<extra></extra>",
                  fill: 'tozeroy',
                  fillcolor: 'rgba(59, 130, 246, 0.1)'
                },
                {
                  x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
                  y: selectedData.map((item) => item.solar),
                  type: "scatter",
                  mode: "lines+markers",
                  name: "Điện mặt trời",
                  line: { color: "#f59e0b", width: 2, shape: 'spline' },
                  marker: { size: 8, color: "#f59e0b" },
                  hovertemplate: "<b>Năm %{x}</b><br>%{y:,.0f} MW<extra></extra>",
                  fill: 'tozeroy',
                  fillcolor: 'rgba(245, 158, 11, 0.1)'
                },
                {
                  x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
                  y: selectedData.map((item) => item.hydro),
                  type: "scatter",
                  mode: "lines+markers",
                  name: "Thủy điện",
                  line: { color: "#10b981", width: 2, shape: 'spline' },
                  marker: { size: 8, color: "#10b981" },
                  hovertemplate: "<b>Năm %{x}</b><br>%{y:,.0f} MW<extra></extra>",
                  fill: 'tozeroy',
                  fillcolor: 'rgba(16, 185, 129, 0.1)'
                },
              ]}
              layout={{
                xaxis: { 
                  title: { 
                    text: viewMode === "yearly" ? "Năm" : viewMode === "monthly" ? "Tháng" : "Giờ", 
                    font: { size: 12, color: '#1f2937', family: 'Inter' } 
                  },
                  gridcolor: '#e5e7eb',
                  tickfont: { size: 10, color: '#1f2937', family: 'Inter' },
                  range: viewMode === "yearly" 
                    ? [2019.5, 2023.5]
                    : viewMode === "monthly" 
                      ? [6.5, 12.5]
                      : [selectedData.length - 24, selectedData.length - 1],
                  fixedrange: false,
                  tickmode: 'array',
                  tickvals: viewMode === "yearly" 
                    ? selectedData.map((item) => item.year)
                    : viewMode === "monthly" 
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                      : selectedData.map((item, idx) => idx % 3 === 0 ? item.hour : null).filter(Boolean),
                  ticktext: viewMode === "yearly" 
                    ? selectedData.map((item) => item.year)
                    : viewMode === "monthly" 
                      ? ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"]
                    : selectedData.map((item, idx) => idx % 3 === 0 ? `${item.hour}h` : null).filter(Boolean),
                  tickangle: viewMode === "monthly" ? 0 : 0,
                  tickformat: viewMode === "yearly" ? null : undefined,
                  showticklabels: true,
                  color: '#1f2937'
                },
                yaxis: { 
                  title: { 
                    text: yAxisConfig.title,
                    font: { size: 12, color: '#1f2937', family: 'Inter' } 
                  },
                  tickformat: yAxisConfig.tickformat,
                  gridcolor: '#e5e7eb',
                  tickfont: { size: 10, color: '#1f2937', family: 'Inter' },
                  fixedrange: false,
                  color: '#1f2937'
                },
                legend: { 
                  orientation: "h",
                  y: -0.3,
                  x: 0.5,
                  xanchor: 'center',
                  font: { size: 10, color: '#1f2937', family: 'Inter' },
                  bgcolor: 'rgba(255,255,255,0.9)'
                },
                margin: { t: 20, l: 50, r: 20, b: 70 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                hoverlabel: { 
                  font: { size: 10, family: 'Inter' } 
                },
                dragmode: 'pan',
                font: {
                  family: 'Inter'
                }
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                scrollZoom: true,
                modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d']
              }}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
            Cập nhật lần cuối: {new Date().toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Không có dữ liệu để hiển thị</p>
        </div>
      )}
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default TotalChart;