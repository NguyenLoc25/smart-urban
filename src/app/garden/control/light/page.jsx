//src/app/garden/home/page.jsx

"use client";

import { useEffect, useState } from "react";
import { db, ref, onValue, set } from "@/lib/firebaseConfig";
import { Switch } from "@/components/ui/switch"; // Dùng switch UI có sẵn

export default function HomePage() {
  const [lightStatus, setLightStatus] = useState("off");
  const [mode, setMode] = useState("manual"); // "manual" | "auto"
        const [sensorValue, setSensorValue] = useState("Tối"); // hoặc "Sáng"

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
    // Không cần parseInt, chỉ cần gán chuỗi "Sáng" / "Tối"
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
  <div style={{ padding: "24px", display: "flex", justifyContent: "center" }}>
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "24px",
        width: "100%",
        maxWidth: "500px"
      }}
    >
      {/* Tiêu đề + Switch chế độ auto */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
      <h2 className="text-2xl font-bold">💡Light Control</h2>

        <Switch checked={mode === "auto"} onCheckedChange={toggleMode} />
      </div>

      {/* Khung chung: cảm biến + trạng thái đèn */}
<div
  style={{
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}
>
  {/* Cảm biến ánh sáng */}
      <div style={{ fontSize: "16px" }}>
        🌞 Cảm biến ánh sáng: <b>{sensorValue}</b>
      </div>

      {/* Trạng thái đèn */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 0"
        }}
      >
        <span style={{ fontSize: "16px" }}>Đèn:</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontWeight: "bold",
              color: lightStatus === "on" ? "#4CAF50" : "#F44336",
              minWidth: "40px"
            }}
          >
            {lightStatus === "on" ? "BẬT" : "TẮT"}
          </span>
          <Switch
            checked={lightStatus === "on"}
            onCheckedChange={toggleLight}
            disabled={mode === "auto"}
          />
        </div>
      </div>
    </div>
  </div>
  </div>
);

}
