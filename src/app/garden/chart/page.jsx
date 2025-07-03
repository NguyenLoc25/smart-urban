// File: src/app/garden/chart/page.jsx
import React from "react";
import "./style.css";
import FishChart from "./fish/page";
import ChickenChart from "./chicken/page";
import MushroomChart from "./mushroom/page";
import VegetableChart from "./vegetable/page";

export default function SmartGardenDashboard() {
  return (
    <div className="smart-garden-dashboard">
      <h1 className="dashboard-title">📊 Biểu đồ Khu Vườn Thông Minh</h1>
      <FishChart />
      <ChickenChart />
      <MushroomChart />
      <VegetableChart />
    </div>
  );
} 