import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const SunChart = ({ title, data }) => {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">{title}</h2>
      <AreaChart width={250} height={200} data={data}>
        <XAxis dataKey="time" stroke="currentColor" />
        <YAxis stroke="currentColor" />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Area type="monotone" dataKey="power" stroke="#FFA500" fill="#FFD580" />
      </AreaChart>
    </div>
  );
};

export default SunChart;
