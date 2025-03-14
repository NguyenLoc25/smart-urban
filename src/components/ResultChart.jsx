import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const ResultChart = ({ data, colors, totalEnergy, cityData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
        <Legend wrapperStyle={{ color: "#fff" }} />
        {/* Thay đổi màu sắc của các cột */}
        <Bar 
          dataKey="deficit" 
          fill={colors.deficit} 
          name="Chênh lệch (MW)" 
          stroke="#fff" 
          strokeWidth={1.5} 
          fillOpacity={0.7} // Thêm hiệu ứng mờ cho cột
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResultChart;
