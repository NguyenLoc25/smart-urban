'use client';
import { useState } from 'react';
import ToggleCard from './ToggleCard';
import SensorCard from './SensorCard';
import { DropletIcon, LeafIcon, CloudRainIcon, SunIcon } from 'lucide-react';

export default function ControlPanel() {
  const [light, setLight] = useState(false);
  const [water, setWater] = useState(false);
  const [hydro, setHydro] = useState(false);
  const [spray, setSpray] = useState(false);
  const [feed, setFeed] = useState(false);
  const [manualMode, setManualMode] = useState(true);

  return (
    <>
      <h1 className="text-3xl font-bold text-green-800 mb-6">Điều khiển thiết bị</h1>
      <div className="flex items-center gap-3 mb-6">
        <label className="font-semibold">{manualMode ? 'Thủ công' : 'Tự động'}</label>
        <button
          onClick={() => setManualMode(!manualMode)}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
            manualMode ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full absolute top-0.5 transition-all duration-300 ${
              manualMode ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ToggleCard label="Đèn" Icon={SunIcon} isOn={light} onToggle={() => setLight(!light)} disabled={!manualMode} />
        <ToggleCard label="Tưới nước" Icon={DropletIcon} isOn={water} onToggle={() => setWater(!water)} disabled={!manualMode} />
        <ToggleCard label="Nước thuỷ sinh" Icon={LeafIcon} isOn={hydro} onToggle={() => setHydro(!hydro)} disabled={!manualMode} />
        <ToggleCard label="Phun sương" Icon={CloudRainIcon} isOn={spray} onToggle={() => setSpray(!spray)} disabled={!manualMode} />
        <ToggleCard label="Cho ăn" Icon={LeafIcon} isOn={feed} onToggle={() => setFeed(!feed)} disabled={!manualMode} />
        <SensorCard temperature={25} humidity={65} />
      </div>
    </>
  );
}
