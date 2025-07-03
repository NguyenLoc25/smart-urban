'use client';

import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import useGardenData from '@/app/garden/useGardenData';

export default function ChickenChart() {
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const { chickenTemperature, chickenHumidity } = useGardenData();

  // Load từ localStorage khi mount
  useEffect(() => {
    const storedData = localStorage.getItem('chickenChartData');
    if (storedData) {
      setChartData(JSON.parse(storedData));
    }
  }, []);

  // Cập nhật dữ liệu mới
  useEffect(() => {
    if (chickenTemperature !== null && chickenHumidity !== null) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });

      setChartData((prev) => {
        const newData = [...prev, {
          time: timeStr,
          chickenTemp: chickenTemperature,
          chickenHum: chickenHumidity
        }];

        const trimmedData = newData.slice(-15); // chỉ giữ 15 điểm gần nhất
        localStorage.setItem('chickenChartData', JSON.stringify(trimmedData));
        return trimmedData;
      });
    }
  }, [chickenTemperature, chickenHumidity]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-green-200 transition duration-300"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <Sparkles className="text-yellow-500 w-5 h-5" />
          Nhiệt độ & Độ ẩm chuồng gà
        </h2>
        <Button
          onClick={() => setShowChart(!showChart)}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {showChart ? 'Ẩn biểu đồ' : 'Hiện biểu đồ'}
        </Button>
      </div>
      <AnimatePresence>
        {showChart && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-4"
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#ccc" />
                <XAxis dataKey="time" tick={{ fill: "#666" }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#666" }}
                  label={{
                    value: "Nhiệt độ (°C)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#fbbf24" // vàng cam
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#666" }}
                  label={{
                    value: "Độ ẩm (%)",
                    angle: 90,
                    position: "insideRight",
                    fill: "#34d399" // xanh ngọc
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="chickenTemp"
                  stroke="#fbbf24" // vàng cam
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Nhiệt độ (°C)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="chickenHum"
                  stroke="#34d399" // xanh ngọc
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Độ ẩm (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
