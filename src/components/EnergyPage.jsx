import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { BarChart, Bar } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

const energyData = [
  { time: "00:00", consumption: 500, solar: 100, wind: 50, hydro: 150 },
  { time: "06:00", consumption: 600, solar: 200, wind: 80, hydro: 170 },
  { time: "12:00", consumption: 800, solar: 400, wind: 100, hydro: 180 },
  { time: "18:00", consumption: 900, solar: 300, wind: 120, hydro: 190 },
  { time: "24:00", consumption: 700, solar: 150, wind: 90, hydro: 160 },
];

const pieData = [
  { name: "Solar", value: 1150 },
  { name: "Wind", value: 440 },
  { name: "Hydro", value: 850 },
  { name: "Non-Renewable", value: 3060 },
];

const COLORS = ["#FFBB28", "#0088FE", "#00C49F", "#FF8042"];

const EnergyReportCharts = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Biểu đồ tiêu thụ điện theo thời gian</h2>
        <LineChart width={500} height={300} data={energyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="consumption" stroke="#FF8042" name="Tiêu thụ" />
          <Line type="monotone" dataKey="solar" stroke="#FFBB28" name="Mặt trời" />
          <Line type="monotone" dataKey="wind" stroke="#0088FE" name="Gió" />
          <Line type="monotone" dataKey="hydro" stroke="#00C49F" name="Thủy điện" />
        </LineChart>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Phân bổ nguồn điện</h2>
        <BarChart width={500} height={300} data={energyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="solar" stackId="a" fill="#FFBB28" name="Mặt trời" />
          <Bar dataKey="wind" stackId="a" fill="#0088FE" name="Gió" />
          <Bar dataKey="hydro" stackId="a" fill="#00C49F" name="Thủy điện" />
          <Bar dataKey="consumption" stackId="b" fill="#FF8042" name="Tiêu thụ" />
        </BarChart>
      </div>

      <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-2xl shadow-lg flex justify-center">
        <h2 className="text-xl font-bold mb-4 text-center">Tỷ lệ năng lượng tiêu thụ</h2>
        <PieChart width={400} height={400}>
          <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" dataKey="value" label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default EnergyReportCharts;