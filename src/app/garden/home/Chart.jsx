'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import useGardenData from '@/app/garden/useGardenData';
import { useRouter } from 'next/navigation';

const chartConfigs = [
  {
    title: 'Nhiệt độ & Độ ẩm gà',
    lines: [
      { key: 'chickenTemp', name: 'Nhiệt độ gà (°C)', color: '#f97316', yAxisId: 'left' },
      { key: 'chickenHum', name: 'Độ ẩm gà (%)', color: '#60a5fa', yAxisId: 'right' }
    ]
  },
  {
    title: 'Nhiệt độ & Độ ẩm nhà nấm',
    lines: [
      { key: 'mushroomTemp', name: 'Nhiệt độ nấm (°C)', color: '#facc15', yAxisId: 'left' },
      { key: 'mushroomHum', name: 'Độ ẩm nấm (%)', color: '#34d399', yAxisId: 'right' }
    ]
  },
  {
    title: 'Độ ẩm đất',
    lines: [
      { key: 'soilHum', name: 'Độ ẩm đất (%)', color: '#10b981', yAxisId: 'left' }
    ]
  },
  {
    title: 'Mực nước',
    lines: [
      { key: 'waterLevel', name: 'Mực nước (%)', color: '#06b6d4', yAxisId: 'left' }
    ]
  },
  {
    title: 'Nhiệt độ nước',
    lines: [
      { key: 'waterTemp', name: 'Nhiệt độ nước (°C)', color: '#f87171', yAxisId: 'left' }
    ]
  }
];

export default function Chart() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState([]);
  const {
    chickenTemperature,
    chickenHumidity,
    mushroomTemperature,
    mushroomHumidity,
    soilHumidity,
    fishWaterLevel,
    hydroWaterTemp
  } = useGardenData();
  const router = useRouter();

  // Load từ localStorage khi mount
  useEffect(() => {
    const stored = localStorage.getItem('chartData');
    if (stored) setData(JSON.parse(stored));
  }, []);

  // Cập nhật dữ liệu mới
  useEffect(() => {
    if (
      chickenTemperature !== null &&
      chickenHumidity !== null &&
      mushroomTemperature !== null &&
      mushroomHumidity !== null &&
      soilHumidity !== null &&
      fishWaterLevel !== null &&
      hydroWaterTemp !== null
    ) {
      const now = new Date();
      const time = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setData((prev) => {
        const newData = [
          ...prev,
          {
            time,
            chickenTemp: chickenTemperature,
            chickenHum: chickenHumidity,
            mushroomTemp: mushroomTemperature,
            mushroomHum: mushroomHumidity,
            soilHum: soilHumidity,
            waterLevel: fishWaterLevel,
            waterTemp: hydroWaterTemp
          }
        ];
        const trimmed = newData.slice(-15); // Giữ 15 điểm gần nhất
        localStorage.setItem('chartData', JSON.stringify(trimmed));
        return trimmed;
      });
    }
  }, [
    chickenTemperature,
    chickenHumidity,
    mushroomTemperature,
    mushroomHumidity,
    soilHumidity,
    fishWaterLevel,
    hydroWaterTemp
  ]);

  // Tự động chuyển biểu đồ sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % chartConfigs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const chart = chartConfigs[index];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIndex((prev) => (prev - 1 + chartConfigs.length) % chartConfigs.length)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{chart.title}</h2>
          <p className="text-sm text-gray-500">
            {index + 1} / {chartConfigs.length}
          </p>
        </div>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % chartConfigs.length)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowRight />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          {chart.lines.some((line) => line.yAxisId === 'right') && (
            <YAxis yAxisId="right" orientation="right" />
          )}
          <Tooltip />
          <Legend />
          {chart.lines.map((line) => (
            <Line
              key={line.key}
              yAxisId={line.yAxisId}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={3}
              dot={{ r: 4 }}
              name={line.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
