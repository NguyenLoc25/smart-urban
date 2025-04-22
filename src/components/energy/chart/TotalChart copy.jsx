import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useHourlyEnergyProduction } from "@/components/energy/ProductCalculator";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const TotalChart = ({ energyData }) => {
  const [viewMode, setViewMode] = useState("yearly");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Xử lý dữ liệu khi viewMode hoặc energyData thay đổi
    let data = [];
    if (viewMode === "yearly") {
      data = Array.isArray(energyData?.yearly) ? energyData.yearly : [];
    } else if (viewMode === "monthly") {
      data = Array.isArray(energyData?.monthly) ? energyData.monthly : [];
    } else if (viewMode === "hourly") {
      data = Array.isArray(energyData?.hourly) ? energyData.hourly : [];
    }
    setSelectedData(data);
  }, [viewMode, energyData]);

  const renderDesktopView = () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 shadow-lg">

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

  {/* Content Section with Contrast Colors */}

      {/* Mode selector with dark mode support */}
      <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-inner dark:bg-gray-800 dark:border-gray-700">
        {["yearly", "monthly", "hourly"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
              viewMode === mode
                ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {mode === "yearly" ? "Năm" : mode === "monthly" ? "Tháng" : "Giờ"}
          </button>
        ))}
      </div>
        {/* Chart container with improved layout */}
        {selectedData.length > 0 ? (
          <div className="relative">
            {/* Chart with better spacing and responsive height */}
            <div className="h-[500px] min-h-[300px] w-full">
              <Plot
                data={[
                  {
                    x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
                    y: selectedData.map((item) => item.wind),
                    type: "scatter",
                    mode: "lines+markers",
                    name: "Điện gió",
                    line: { color: "#3b82f6", width: 3, shape: 'spline' },
                    marker: { size: 10, color: "#3b82f6", symbol: 'circle' },
                    hovertemplate: "<b>%{x}</b><br>%{y:,.0f} MW<extra></extra>",
                    fill: 'tozeroy',
                    fillcolor: 'rgba(59, 130, 246, 0.15)'
                  },
                  {
                    x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
                    y: selectedData.map((item) => item.solar),
                    type: "scatter",
                    mode: "lines+markers",
                    name: "Điện mặt trời",
                    line: { color: "#f59e0b", width: 3, shape: 'spline' },
                    marker: { size: 10, color: "#f59e0b", symbol: 'diamond' },
                    hovertemplate: "<b>%{x}</b><br>%{y:,.0f} MW<extra></extra>",
                    fill: 'tozeroy',
                    fillcolor: 'rgba(245, 158, 11, 0.15)'
                  },
                  {
                    x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
                    y: selectedData.map((item) => item.hydro),
                    type: "scatter",
                    mode: "lines+markers",
                    name: "Thủy điện",
                    line: { color: "#10b981", width: 3, shape: 'spline' },
                    marker: { size: 10, color: "#10b981", symbol: 'square' },
                    hovertemplate: "<b>%{x}</b><br>%{y:,.0f} MW<extra></extra>",
                    fill: 'tozeroy',
                    fillcolor: 'rgba(16, 185, 129, 0.15)'
                  },
                ]}
                layout={{
                  xaxis: { 
                    title: {
                      text: viewMode === "yearly" ? "Năm" : viewMode === "monthly" ? "Tháng" : "Giờ",
                      font: { size: 14, color: '#4b5563' }
                    },
                    gridcolor: '#f3f4f6',
                    linecolor: '#e5e7eb',
                    tickfont: { color: '#6b7280' },
                    showgrid: true
                  },
                  yaxis: { 
                    title: {
                      text: "Công suất (MW)",
                      font: { size: 14, color: '#4b5563' }
                    },
                    gridcolor: '#f3f4f6',
                    linecolor: '#e5e7eb',
                    tickformat: ',.0f',
                    tickfont: { color: '#6b7280' },
                    rangemode: 'tozero'
                  },
                  legend: { 
                    orientation: "h",
                    y: -0.25,
                    x: 0.5,
                    xanchor: 'center',
                    font: { size: 12 },
                    bgcolor: 'rgba(255,255,255,0.8)',
                    bordercolor: '#e5e7eb',
                    borderwidth: 1
                  },
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  margin: { t: 30, l: 60, r: 30, b: 80 }, // More space for labels
                  hoverlabel: {
                    bgcolor: '#1f2937',
                    font: { color: 'white', size: 12 },
                    bordercolor: '#1f2937'
                  },
                  transition: {
                    duration: 300,
                    easing: 'cubic-in-out'
                  }
                }}
                config={{ 
                  responsive: true, 
                  displayModeBar: true,
                  scrollZoom: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud']
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            
            {/* Data source footnote */}
            <p className="text-xs text-gray-400 mt-2 text-right">
              Cập nhật lần cuối: {new Date().toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Không có dữ liệu để hiển thị</p>
            <p className="text-gray-400 text-sm mt-1">Vui lòng chọn khoảng thời gian khác</p>
          </div>
        )}
      </div>
  );

  // border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 shadow-lg
  const renderMobileView = () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 shadow-lg mx-2 my-3">
      
        {/* Gradient Header - Responsive */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md mb-6 p-5">
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-xl font-bold text-white flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Sản lượng điện
      </h1>
      
      <div className="mt-2 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4">
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

        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-inner dark:bg-gray-800 dark:border-gray-700">
        {["yearly", "monthly", "hourly"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
              viewMode === mode
                ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {mode === "yearly" ? "Năm" : mode === "monthly" ? "Tháng" : "Giờ"}
          </button>
        ))}
      </div>
  
        {/* Chart container optimized for mobile */}
        {selectedData.length > 0 ? (
  <div className="relative">
    <div className="h-[350px] w-full -ml-4 -mr-2">
      <Plot
        data={[
          {
            x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
            y: selectedData.map((item) => item.wind),
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
              font: { size: 12 } 
            },
            gridcolor: '#f3f4f6',
            tickfont: { size: 10 },
            range: viewMode === "yearly" 
              ? [2019.5, 2023.5] // Hiển thị từ 2020-2023 ban đầu
              : viewMode === "monthly" 
                ? [6.5, 12.5] // Hiển thị từ tháng 7-12 ban đầu
                : [selectedData.length - 24, selectedData.length - 1], // Hiển thị 24 giờ gần nhất
            fixedrange: false, // Cho phép kéo trục x
            tickmode: 'array',
            tickvals: viewMode === "yearly" 
              ? selectedData.map((item) => item.year) // Hiển thị tất cả các năm
              : viewMode === "monthly" 
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // Hiển thị tất cả các tháng
                : selectedData.map((item, idx) => idx % 3 === 0 ? item.hour : null).filter(Boolean), // Mỗi 3 giờ
            ticktext: viewMode === "yearly" 
              ? selectedData.map((item) => item.year) // Nhãn năm đầy đủ
              : viewMode === "monthly" 
                ? ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"] // Nhãn tháng
              : selectedData.map((item, idx) => idx % 3 === 0 ? `${item.hour}h` : null).filter(Boolean), // Nhãn giờ
            tickangle: viewMode === "monthly" ? 0 : 0, // Xoay nhãn tháng 45 độ nếu cần
            tickformat: viewMode === "yearly" ? null : undefined, // Định dạng mặc định cho năm
            showticklabels: true // Luôn hiển thị nhãn
          },
          yaxis: { 
            title: { text: "Công suất (MW)", font: { size: 12 } },
            tickformat: ',.0f',
            gridcolor: '#f3f4f6',
            tickfont: { size: 10 },
            fixedrange: false
          },
          legend: { 
            orientation: "h",
            y: -0.3,
            x: 0.5,
            xanchor: 'center',
            font: { size: 10 },
            bgcolor: 'rgba(255,255,255,0.9)'
          },
          margin: { t: 20, l: 50, r: 20, b: 70 },
          plot_bgcolor: 'rgba(0,0,0,0)',
          paper_bgcolor: 'rgba(0,0,0,0)',
          hoverlabel: { font: { size: 10 } },
          dragmode: 'pan'
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
  </div>
)  : (
          <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-sm">Không có dữ liệu để hiển thị</p>
          </div>
        )}
      
  
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default TotalChart;