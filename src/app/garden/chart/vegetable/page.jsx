"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import useGardenData from "@/app/garden/useGardenData";

const STORAGE_KEY = "vegetableSoilData";

export default function VegetableChart() {
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);

  const { soilHumidity } = useGardenData();

  // Load từ localStorage khi khởi động
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setChartData(JSON.parse(stored));
      } catch (error) {
        console.error("Lỗi khi parse localStorage:", error);
      }
    }
  }, []);

  // Khi có dữ liệu mới từ Firebase
  useEffect(() => {
    if (soilHumidity !== null) {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      const newEntry = {
        time: formattedTime,
        soilHum: soilHumidity
      };

      setChartData((prev) => {
        const updated = [...prev, newEntry].slice(-20); // giữ tối đa 20 điểm
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); // lưu lại
        return updated;
      });
    }
  }, [soilHumidity]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-gray-600 transition duration-300"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-700 dark:text-lime-300 flex items-center gap-2">
          <Sparkles className="text-yellow-500 w-5 h-5" />
          Độ ẩm đất rau sạch
        </h2>
        <Button
          onClick={() => setShowChart(!showChart)}
          className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
        >
          {showChart ? "Ẩn biểu đồ" : "Hiện biểu đồ"}
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
                  tick={{ fill: "#666" }}
                  label={{
                    value: "Độ ẩm đất (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#4ade80"
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="soilHum"
                  stroke="#4ade80"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Độ ẩm đất (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
