// src/app/garden/control/cablecar/page.jsx

"use client";

import React, { useState } from "react";
import { db, ref, set } from "@/lib/firebaseConfig"; // ✅ Dùng db trực tiếp từ firebaseConfig

// ✅ Kiểm tra đường dẫn, bạn đang thiếu "control" trong import
import { firebaseApp } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";

export default function DroneControl() {
  const [droneMode, setDroneMode] = useState("OFF");

  const toggleDrone = (mode) => {
    const modeRef = ref(db, "garden/drone/mode"); // ✅ Không cần gọi getDatabase nữa

    set(modeRef, mode)
      .then(() => {
        setDroneMode(mode);
        console.log(`Drone set to ${mode}`);
      })
      .catch((error) => {
        console.error("Error updating drone mode:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-700">Drone Control Panel</h1>
      <p className="text-xl">Current Mode: <span className="font-semibold">{droneMode}</span></p>
      <div className="flex gap-4">
        <Button onClick={() => toggleDrone("ON")} className="bg-green-500 hover:bg-green-600">
          Turn ON
        </Button>
        <Button onClick={() => toggleDrone("OFF")} className="bg-red-500 hover:bg-red-600">
          Turn OFF
        </Button>
      </div>
    </div>
  );
}
