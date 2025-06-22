'use client';
import React from "react";
import TotalChart from "@/components/energy/total-chart";
import QuantityTable from "@/components/energy/tableDevide";
import ResultChart from "@/components/energy/resultChart";
import EnergyProductionCards from "./EnergyProductionCards";
import AdviceChart from "@/components/energy/adviceChart/adviceChart";

export default function DesktopView({ energyData, data, renewableEnergy, consumption, error, loading,  energyProduction }) {
  return (
    <div className="p-6 space-y-6">
      <AdviceChart renewableEnergy={renewableEnergy} consumption={consumption} error={error} loading={loading}/>
      <QuantityTable data={energyData} />
      <TotalChart energyData={data} />
      <ResultChart />
      <EnergyProductionCards energyProduction={energyProduction} />
    </div>
  );
}