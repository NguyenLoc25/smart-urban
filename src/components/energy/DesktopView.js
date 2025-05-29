'use client';
import React from "react";
import TotalChart from "@/components/energy/total-chart";
import QuantityTable from "@/components/energy/tableDevide";
import ResultChart from "@/components/energy/resultChart";
import EnergyProductionCards from "./EnergyProductionCards";

export default function DesktopView({ energyData, data, energyProduction }) {
  return (
    <div className="p-6 space-y-6">
      <QuantityTable data={energyData} />
      <TotalChart energyData={data} />
      <ResultChart />
      <EnergyProductionCards energyProduction={energyProduction} />
    </div>
  );
}