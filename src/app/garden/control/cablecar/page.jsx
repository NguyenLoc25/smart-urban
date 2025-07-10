// src/app/garden/control/cablecar/page.jsx

"use client";

import React, { useState } from "react";
import { db, ref, set } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Rocket, PowerOff } from "lucide-react"; // Icon hiện đại

export default function DroneControl() {
  const [droneMode, setDroneMode] = useState("OFF");

  const toggleDrone = (mode) => {
    const modeRef = ref(db, "garden/drone/mode");

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
    <section className="flex items-center justify-center min-h-screen ">
      <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 max-w-sm w-full space-y-4 mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-900 dark:text-green-300">🚡 Thiết bị phun thuốc</h1>

        <div className="text-center">
          <p className="text-lg text-gray-700 dark:text-gray-200">Chế Độ:</p>
          <span
            className={`text-2xl font-bold ${
              droneMode === "ON" ? "text-green-600" : "text-red-500"
            }`}
          >
            {droneMode}
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => toggleDrone("ON")}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-5 py-2 text-lg rounded-xl"
          >
            <Rocket size={20} />
            ON
          </Button>
          <Button
            onClick={() => toggleDrone("OFF")}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-5 py-2 text-lg rounded-xl"
          >
            <PowerOff size={20} />
            OFF
          </Button>
        </div>
      </div>
    </section>
  );
}
