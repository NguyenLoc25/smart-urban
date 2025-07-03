"use client";

import React, { useState, useEffect } from "react";
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
import useGardenData from "../../useGardenData";

export default function FishChart() {
  const { fishWaterLevel } = useGardenData();
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Tải dữ liệu từ localStorage khi component được mount
  useEffect(() => {
    const stored = localStorage.getItem("fishChartData");
    if (stored) {
      setChartData(JSON.parse(stored));
    }
  }, []);

  // Cập nhật dữ liệu mới
  useEffect(() => {
    if (fishWaterLevel !== null && fishWaterLevel !== undefined) {
      const now = new Date();
      const newPoint = {
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        fishWater: Number(fishWaterLevel)
      };

      setChartData((prev) => {
        const updated = [...prev, newPoint];
        const trimmed = updated.slice(-15); // giữ lại 15 điểm gần nhất
        localStorage.setItem("fishChartData", JSON.stringify(trimmed)); // lưu vào localStorage
        return trimmed;
      });
    }
  }, [fishWaterLevel]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-green-200 transition duration-300"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <Sparkles className="text-yellow-500 w-5 h-5" />
          Mực nước hồ cá
        </h2>
        <Button
          onClick={() => setShowChart(!showChart)}
          className="bg-green-500 hover:bg-green-600 text-white"
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
                    value: "Mực nước",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#34d399"
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="fishWater"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Mực nước (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
