"use client";

import { useEffect, useState } from "react";
import { db, ref, onValue, set } from "@/lib/firebaseConfig";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, SunMoon, Sun, Moon } from "lucide-react";

export default function LightControl() {
  const [lightStatus, setLightStatus] = useState("off");
  const [mode, setMode] = useState("manual");
  const [sensorValue, setSensorValue] = useState("Tối");

  useEffect(() => {
    const statusRef = ref(db, "garden/light/status");
    const modeRef = ref(db, "garden/light/mode");
    const sensorRef = ref(db, "garden/light/sensor");

    const unsubStatus = onValue(statusRef, (snapshot) => {
      const value = snapshot.val();
      if (value === "on" || value === "off") setLightStatus(value);
    });

    const unsubMode = onValue(modeRef, (snapshot) => {
      const value = snapshot.val();
      if (value === "manual" || value === "auto") setMode(value);
    });

    const unsubSensor = onValue(sensorRef, (snapshot) => {
      const value = snapshot.val();
      if (value === "Sáng" || value === "Tối") setSensorValue(value);
    });

    return () => {
      unsubStatus();
      unsubMode();
      unsubSensor();
    };
  }, []);

  const toggleLight = () => {
    if (mode === "manual") {
      const newStatus = lightStatus === "on" ? "off" : "on";
      set(ref(db, "garden/light/status"), newStatus);
    }
  };

  const toggleMode = () => {
    const newMode = mode === "manual" ? "auto" : "manual";
    set(ref(db, "garden/light/mode"), newMode);
  };

  return (
    <section className="relative flex flex-col items-center">
      {/* Card */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-700 shadow-lg rounded-2xl border border-green-200 p-8 w-full max-w-md space-y-6 z-10 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
            <Lightbulb className="text-green-900 dark:text-green-300" />
            Điều khiển đèn
          </h1>
          <div className="flex items-center gap-2">
            <SunMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <Switch
              checked={mode === "auto"}
              onCheckedChange={toggleMode}
              className="bg-white data-[state=checked]:bg-white dark:bg-white dark:data-[state=checked]:bg-white"
            />
          </div>
        </div>

        {/* Sensor info */}
        <div className="text-lg text-gray-700 dark:text-gray-300 flex items-center gap-2">
          {sensorValue === "Sáng" ? (
            <>
              <Sun className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">Sáng</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">Tối</span>
            </>
          )}
        </div>

        {/* Light control */}
        <div className="flex justify-between items-center">
          <span className="text-lg text-gray-700 dark:text-gray-300">Đèn:</span>
          <div className="flex items-center gap-3">
            <span
              className={`font-bold text-lg ${
                lightStatus === "on" ? "text-green-600" : "text-red-500"
              }`}
            >
              {lightStatus === "on" ? "BẬT" : "TẮT"}
            </span>
            <Switch
              checked={lightStatus === "on"}
              onCheckedChange={toggleLight}
              disabled={mode === "auto"}
              className="bg-white data-[state=checked]:bg-white dark:bg-white dark:data-[state=checked]:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Multiple lamp images */}
      <div className="mt-10 flex justify-center gap-4 flex-wrap z-0">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="relative">
            <img
              src="/garden/lamp.png"
              alt={`Lamp ${index + 1}`}
              className={`h-40 transition-all duration-500 ${
                lightStatus === "on"
                  ? "brightness-110 drop-shadow-[0_0_12px_#facc15]"
                  : "brightness-75"
              }`}
            />
            {lightStatus === "on" && (
              <div className="absolute top-[60%] left-[65%] w-3 h-3 bg-yellow-400 rounded-full blur-md animate-ping" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
