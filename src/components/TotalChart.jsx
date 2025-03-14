import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const TotalChart = ({ totalEnergy }) => {
  const colors = {
    wind: "#32CD32",  // 🌿 Xanh lá cây - điện gió
    solar: "#FF8C00", // ☀️ Cam - điện mặt trời
    hydro: "#1E90FF", // 🌊 Xanh dương - thủy điện
  };

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 border rounded-lg p-4 bg-white dark:bg-gray-800 text-black dark:text-white">
      <h2 className="text-lg font-semibold mb-2">So sánh điện</h2>
      <LineChart width={600} height={250} data={totalEnergy}>
        <XAxis dataKey="time" stroke="currentColor" />
        <YAxis stroke="currentColor" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="wind" stroke={colors.wind} name="Gió" />
        <Line type="monotone" dataKey="solar" stroke={colors.solar} name="Mặt trời" />
        <Line type="monotone" dataKey="hydro" stroke={colors.hydro} name="Thủy điện" />
      </LineChart>
    </div>
  );
};

export default TotalChart;
