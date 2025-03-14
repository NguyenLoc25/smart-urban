import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TotalChart = ({ totalEnergy }) => {
  const colors = {
    wind: "#32CD32",  // 🌿 Xanh lá cây - điện gió
    solar: "#FF8C00", // ☀️ Cam - điện mặt trời
    hydro: "#1E90FF", // 🌊 Xanh nước - thủy điện
  };

  return (
    <div className="border rounded-lg p-4 md:p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-4">
        Biểu đồ so sánh sản lượng điện
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={totalEnergy} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <XAxis dataKey="time" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="wind" stroke={colors.wind} strokeWidth={2} />
          <Line type="monotone" dataKey="solar" stroke={colors.solar} strokeWidth={2} />
          <Line type="monotone" dataKey="hydro" stroke={colors.hydro} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalChart;
