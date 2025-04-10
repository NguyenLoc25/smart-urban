import React from "react";
import Plot from "react-plotly.js";

const WindChart = ({ title, data }) => {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">{title}</h2>
      <Plot
        data={[
          {
            x: data.map((item) => item.time),
            y: data.map((item) => item.power),
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "#82ca9d" },
            line: { width: 2, shape: "spline", smoothing: 1.3 },
            fill: "tozeroy",
          },
        ]}
        layout={{
          title: title,
          xaxis: { title: "Thời gian" },
          yaxis: { title: "Công suất (MW)" },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        useResizeHandler
        style={{ width: "100%", height: "300px" }}
      />
    </div>
  );
};

export default WindChart;
