'use client';
import React from "react";
import TotalChart from "@/components/energy/total-chart";
import QuantityTable from "@/components/energy/tableDevide";
import ResultChart from "@/components/energy/resultChart";

export default function MobileView({ energyData, data }) {
  return (
    <div className="p-4 space-y-6">
      <div className="overflow-x-auto">
        <QuantityTable data={energyData} />
      </div>
      <TotalChart energyData={data} />
      <ResultChart />
    </div>
  );
}