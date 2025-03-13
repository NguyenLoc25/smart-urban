import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area,
} from "recharts";
import DarkModeButton from "./DarkModeButton";

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
    <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Bảng số lượng */}
      <div>
        <h2 className="w-full font-bold">Số lượng Cối xoay gió</h2>
        <table className="w-full border">
          <thead><tr><th>Khu vực</th><th>Số lượng</th></tr></thead>
          <tbody>{windTurbineData.map((row, i) => <tr key={i}><td>{row.location}</td><td>{row.count}</td></tr>)}</tbody>
        </table>
      </div>
      <div>
        <h2 className="font-bold">Số lượng Pin mặt trời</h2>
        <table className="w-full border">
          <thead><tr><th>Khu vực</th><th>Số lượng</th></tr></thead>
          <tbody>{solarPanelData.map((row, i) => <tr key={i}><td>{row.location}</td><td>{row.count}</td></tr>)}</tbody>
        </table>
      </div>

      {/* Biểu đồ vùng sản lượng điện */}
      <div>
        <h2 className="font-bold">Điện gió trong ngày</h2>
        <AreaChart width={400} height={250} data={windData}><XAxis dataKey="time" /><YAxis /><Tooltip /><Area type="monotone" dataKey="power" stroke="#82ca9d" fill="#82ca9d" /></AreaChart>
      </div>
      <div>
        <h2 className="font-bold">Điện mặt trời trong ngày</h2>
        <AreaChart width={400} height={250} data={solarData}><XAxis dataKey="time" /><YAxis /><Tooltip /><Area type="monotone" dataKey="power" stroke="#ff7300" fill="#ff7300" /></AreaChart>
      </div>
      <div>
        <h2 className="font-bold">Thủy điện trong ngày</h2>
        <AreaChart width={400} height={250} data={hydroData}><XAxis dataKey="time" /><YAxis /><Tooltip /><Area type="monotone" dataKey="power" stroke="#0000ff" fill="#0000ff" /></AreaChart>
      </div>
      
      {/* Biểu đồ đường so sánh */}
      <div>
        <h2 className="font-bold">So sánh điện</h2>
        <LineChart width={400} height={250} data={totalEnergy}><XAxis dataKey="time" /><YAxis /><Tooltip /><Legend />
          <Line type="monotone" dataKey="wind" stroke="#82ca9d" name="Gió" />
          <Line type="monotone" dataKey="solar" stroke="#ff7300" name="Mặt trời" />
          <Line type="monotone" dataKey="hydro" stroke="#0000ff" name="Thủy điện" />
        </LineChart>
      </div>
      
      {/* Tổng điện thu được */}
      <div>
        <h2 className="font-bold">Tổng năng lượng</h2>
        <table className="w-full border">
          <thead><tr><th>Thời gian</th><th>Tổng điện</th></tr></thead>
          <tbody>{dailyTotal.map((row, i) => <tr key={i}><td>{row.time}</td><td>{row.total}</td></tr>)}</tbody>
        </table>
      </div>

      {/* So sánh với nhu cầu thành phố */}
      <div>
        <h2 className="font-bold">So sánh với nhu cầu</h2>
        <BarChart width={400} height={250} data={dailyTotal}><XAxis dataKey="time" /><YAxis /><Tooltip /><Legend />
          <Bar dataKey="total" fill="#82ca9d" name="Điện xanh" />
          <Bar dataKey="cityNeed" fill="#ff0000" name="Nhu cầu thành phố" />
        </BarChart>
      </div>

      {/* Thiếu hụt */}
      <div>
        <h2 className="font-bold">Thiếu hụt điện</h2>
        <BarChart width={400} height={250} data={deficit}><XAxis dataKey="time" /><YAxis /><Tooltip /><Legend />
          <Bar dataKey="deficit" fill={(d) => d.deficit >= 0 ? "#82ca9d" : "#ff0000"} name="Thiếu/Dư điện" />
        </BarChart>
      </div>

      {/* Dự đoán số lượng cần để đáp ứng nhu cầu */}
      <div>
        <h2 className="font-bold">Dự đoán số lượng cần</h2>
        <p>Cần tăng thêm {Math.ceil(Math.abs(deficit.reduce((sum, d) => sum + d.deficit, 0) / 3))} đơn vị năng lượng mỗi giờ để đáp ứng nhu cầu.</p>
      </div>
    </div>
  );
}
