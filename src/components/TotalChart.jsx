import React, { useState } from "react";
import Plot from "react-plotly.js";

const TotalChart = ({ energyData }) => {
  const [viewMode, setViewMode] = useState("hourly"); // Chế độ hiển thị: hourly, daily, monthly, yearly

  const selectedData = energyData[viewMode]; // Chọn dữ liệu theo chế độ

  return (
    <div className="border rounded-lg p-4 md:p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-4">
        Biểu đồ so sánh sản lượng điện ({viewMode})
      </h2>

      {/* Dropdown chọn chế độ */}
      <div className="mb-4 flex justify-center">
        <select
          className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <option value="hourly">Theo giờ</option>
          <option value="daily">Theo ngày</option>
          <option value="monthly">Theo tháng</option>
          <option value="yearly">Theo năm</option>
        </select>
      </div>

      {/* Biểu đồ */}
      <Plot
        data={[
          {
            x: selectedData.map((item) => item.time || item.date || item.month || item.year),
            y: selectedData.map((item) => item.wind),
            type: "scatter",
            mode: "lines",
            fill: "tozeroy",
            name: "Điện gió",
          },
          {
            x: selectedData.map((item) => item.time || item.date || item.month || item.year),
            y: selectedData.map((item) => item.solar),
            type: "scatter",
            mode: "lines",
            fill: "tozeroy",
            name: "Điện mặt trời",
          },
          {
            x: selectedData.map((item) => item.time || item.date || item.month || item.year),
            y: selectedData.map((item) => item.hydro),
            type: "scatter",
            mode: "lines",
            fill: "tozeroy",
            name: "Thủy điện",
          },
          {
            x: selectedData.map((item) => item.time || item.date || item.month || item.year),
            y: selectedData.map((item) => item.cityNeed),
            type: "scatter",
            mode: "lines",
            name: "Nhu cầu thành phố",
          },
        ]}
        layout={{
          xaxis: { title: "Thời gian", color: "currentColor" },
          yaxis: { title: "Công suất (MW)", color: "currentColor" },
          legend: { orientation: "h", y: -0.2 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { t: 10, l: 40, r: 10, b: 40 },
        }}
        useResizeHandler
        style={{ width: "100%", height: "300px" }}
      />
    </div>
  );
};

export default TotalChart;
