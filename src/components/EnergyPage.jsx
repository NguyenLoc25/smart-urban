import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area,
} from "recharts";

// Dữ liệu số lượng
const windTurbineData = [{ location: "Khu A", count: 10 }, { location: "Khu B", count: 15 }];
const solarPanelData = [{ location: "Khu A", count: 200 }, { location: "Khu B", count: 300 }];

// Dữ liệu điện thu được trong ngày
const windData = [
  { time: "06:00", power: 30 }, { time: "12:00", power: 90 }, { time: "18:00", power: 60 }
];
const solarData = [
  { time: "06:00", power: 10 }, { time: "12:00", power: 80 }, { time: "18:00", power: 20 }
];
const hydroData = [
  { time: "06:00", power: 70 }, { time: "12:00", power: 90 }, { time: "18:00", power: 80 }
];

// Dữ liệu so sánh tổng
const totalEnergy = windData.map((d, i) => ({
  time: d.time,
  wind: d.power,
  solar: solarData[i].power,
  hydro: hydroData[i].power
}));

const cityConsumption = 250;
const dailyTotal = totalEnergy.map(d => ({
  time: d.time,
  total: d.wind + d.solar + d.hydro,
  cityNeed: cityConsumption
}));
const deficit = dailyTotal.map(d => ({ time: d.time, deficit: d.total - d.cityNeed }));

export default function EnergyReport() {
  return (
    <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Bảng số lượng */}
      <div className="col-span-1 md:col-span-2 lg:col-span-1 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Số lượng Cối xoay gió</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border text-center">Khu vực</th>
              <th className="p-2 border text-center">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {windTurbineData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="p-2 border text-center">{row.location}</td>
                <td className="p-2 border text-center">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-1 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Số lượng Pin mặt trời</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border text-center">Khu vực</th>
              <th className="p-2 border text-center">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {solarPanelData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="p-2 border text-center">{row.location}</td>
                <td className="p-2 border text-center">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Biểu đồ sản lượng điện */}
      <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Điện gió</h2>
          <AreaChart width={250} height={200} data={windData}>
            <XAxis dataKey="time" /><YAxis /><Tooltip />
            <Area type="monotone" dataKey="power" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Điện mặt trời</h2>
          <AreaChart width={250} height={200} data={solarData}>
            <XAxis dataKey="time" /><YAxis /><Tooltip />
            <Area type="monotone" dataKey="power" stroke="#ff7300" fill="#ff7300" />
          </AreaChart>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Thủy điện</h2>
          <AreaChart width={250} height={200} data={hydroData}>
            <XAxis dataKey="time" /><YAxis /><Tooltip />
            <Area type="monotone" dataKey="power" stroke="#0000ff" fill="#0000ff" />
          </AreaChart>
        </div>
      </div>
      {/* So sánh điện */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">So sánh điện</h2>
        <LineChart width={600} height={250} data={totalEnergy}>
          <XAxis dataKey="time" /><YAxis /><Tooltip /><Legend />
          <Line type="monotone" dataKey="wind" stroke="#82ca9d" name="Gió" />
          <Line type="monotone" dataKey="solar" stroke="#ff7300" name="Mặt trời" />
          <Line type="monotone" dataKey="hydro" stroke="#0000ff" name="Thủy điện" />
        </LineChart>
      </div>
      {/* Thiếu hụt điện */}
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Thiếu hụt điện</h2>
        <BarChart width={400} height={200} data={deficit}>
          <XAxis dataKey="time" /><YAxis /><Tooltip /><Legend />
          <Bar dataKey="deficit" fill={(d) => d.deficit >= 0 ? "#82ca9d" : "#ff0000"} name="Thiếu/Dư điện" />
        </BarChart>
      </div>
    </div>
  );
}
