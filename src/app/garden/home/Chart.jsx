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

  // Load từ localStorage khi mount
  useEffect(() => {
    const stored = localStorage.getItem('chartData');
    if (stored) setData(JSON.parse(stored));
  }, []);

  // Cập nhật khi có dữ liệu mới
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
        const trimmed = newData.slice(-5);
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

  const chart = chartConfigs[index];

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 w-full">
      {/* Tiêu đề ở giữa trên */}
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {chart.title}
      </h2>

      {/* Nút mũi tên trái */}
      <button
        onClick={() => setIndex((prev) => (prev - 1 + chartConfigs.length) % chartConfigs.length)}
        className="absolute top-1/2 left-0 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-10"
      >
        <ArrowLeft className="text-gray-800 dark:text-white" />
      </button>

      {/* Nút mũi tên phải */}
      <button
        onClick={() => setIndex((prev) => (prev + 1) % chartConfigs.length)}
        className="absolute top-1/2 right-0 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-10"
      >
        <ArrowRight className="text-gray-800 dark:text-white" />
      </button>

      {/* Biểu đồ */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fill: 'currentColor' }} />
          <YAxis yAxisId="left" tick={{ fill: 'currentColor' }} />
          {chart.lines.some((line) => line.yAxisId === 'right') && (
            <YAxis yAxisId="right" orientation="right" tick={{ fill: 'currentColor' }} />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              color: 'white'
            }}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: 'white' }}
          />
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