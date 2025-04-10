import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dùng dynamic để tránh lỗi 'self is not defined'
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });


const TotalChart = ({ energyData }) => {
  const [viewMode, setViewMode] = useState("yearly"); // Chế độ xem mặc định theo năm

  // Lấy dữ liệu phù hợp với chế độ xem hiện tại
  let selectedData = [];
  if (viewMode === "yearly") {
    selectedData = Array.isArray(energyData?.yearly) ? energyData.yearly : [];
  } else if (viewMode === "monthly") {
    selectedData = Array.isArray(energyData?.monthly) ? energyData.monthly : [];
  } else if (viewMode === "hourly") {
    selectedData = Array.isArray(energyData?.hourly) ? energyData.hourly : [];
  }

  return (
    <div className="border rounded-lg p-4 md:p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-4">
        Biểu đồ sản lượng điện theo {viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "giờ"}
      </h2>
      
      {/* Dropdown chọn chế độ xem */}
      <div className="flex justify-center mb-4">
        <select
          onChange={(e) => setViewMode(e.target.value)}
          value={viewMode}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white border"
        >
          <option value="yearly">Năm</option>
          <option value="monthly">Tháng</option>
          <option value="hourly">Giờ</option>
        </select>
      </div>
      
      {/* Biểu đồ */}
      {selectedData.length > 0 ? (
        <Plot
          data={[
            {
              x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
              y: selectedData.map((item) => item.wind),
              type: "scatter",
              mode: "lines+markers",
              name: "Điện gió",
              line: { color: "#1f77b4" },
            },
            {
              x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
              y: selectedData.map((item) => item.solar),
              type: "scatter",
              mode: "lines+markers",
              name: "Điện mặt trời",
              line: { color: "#ff7f0e" },
            },
            {
              x: selectedData.map((item) => item[viewMode === "yearly" ? "year" : viewMode === "monthly" ? "month" : "hour"]),
              y: selectedData.map((item) => item.hydro),
              type: "scatter",
              mode: "lines+markers",
              name: "Thủy điện",
              line: { color: "#2ca02c" },
            },
          ]}
          layout={{
            xaxis: { title: viewMode === "yearly" ? "Năm" : viewMode === "monthly" ? "Tháng" : "Giờ", color: "currentColor" },
            yaxis: { title: "Công suất (MW)", color: "currentColor" },
            legend: { orientation: "h", y: -0.2 },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            margin: { t: 10, l: 40, r: 10, b: 40 },
          }}
          useResizeHandler
          style={{ width: "100%", height: "400px" }}
        />
      ) : (
        <p className="text-center">Không có dữ liệu để hiển thị.</p>
      )}
    </div>
  );
};

export default TotalChart;