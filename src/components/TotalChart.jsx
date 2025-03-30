import React, { useState } from "react";
import Plot from "react-plotly.js";

const TotalChart = ({ energyData }) => {
  const [viewMode, setViewMode] = useState("yearly"); // Chỉ hiển thị theo năm

  const selectedData = energyData.yearly || [];

  return (
    <div className="border rounded-lg p-4 md:p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-4">
        Biểu đồ sản lượng điện theo năm
      </h2>

      <Plot
        data={[
          {
            x: selectedData.map((item) => item.year),
            y: selectedData.map((item) => item.wind),
            type: "scatter",
            mode: "lines+markers",
            name: "Điện gió",
            line: { color: "#1f77b4" },
          },
          {
            x: selectedData.map((item) => item.year),
            y: selectedData.map((item) => item.solar),
            type: "scatter",
            mode: "lines+markers",
            name: "Điện mặt trời",
            line: { color: "#ff7f0e" },
          },
          {
            x: selectedData.map((item) => item.year),
            y: selectedData.map((item) => item.hydro),
            type: "scatter",
            mode: "lines+markers",
            name: "Thủy điện",
            line: { color: "#2ca02c" },
          },
        ]}
        layout={{
          xaxis: { title: "Năm", color: "currentColor" },
          yaxis: { title: "Công suất (MW)", color: "currentColor" },
          legend: { orientation: "h", y: -0.2 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          margin: { t: 10, l: 40, r: 10, b: 40 },
        }}
        useResizeHandler
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
};

export default TotalChart;
