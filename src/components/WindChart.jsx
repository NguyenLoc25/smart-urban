import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const WindChart = ({ title, data }) => {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">{title}</h2>
      <AreaChart width={250} height={200} data={data}>
        <XAxis dataKey="time" stroke="currentColor" />
        <YAxis stroke="currentColor" />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.2} />
        <Area type="monotone" dataKey="power" stroke="#82ca9d" fill="rgba(130, 202, 157, 0.5)" />
      </AreaChart>
    </div>
  );
};

export default WindChart;
