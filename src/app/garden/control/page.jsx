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

      {/* Tiêu đề */}
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">🌿 Điều khiển thiết bị</h1>
        <p className="text-sm text-gray-500">Điều khiển mọi thành phần trong vườn thông minh</p>
      </div>

      {/* Các khối điều khiển */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Animal Control */}
        <Link href="/garden/control/animal" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-100 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">🐔</div>
            </div>
            <PawPrint className="z-10 text-green-600 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Vật nuôi</span>
          </div>
        </Link>

        {/* Vegetable Control */}
        <Link href="/garden/control/vegetable" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-100 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">🥬</div>
            </div>
            <Leaf className="z-10 text-green-600 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Vườn rau</span>
          </div>
        </Link>

        {/* Cable Car Control */}
        <Link href="/garden/control/cablecar" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-100 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">🚜</div>
            </div>
            <Tractor className="z-10 text-green-600 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Hệ thống phun thuốc</span>
          </div>
        </Link>

        {/* Light Control */}
        <Link href="/garden/control/light" className="group relative">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:bg-green-50 transition-all h-52 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-green-100 pointer-events-none">
              <div className="text-[20vw] md:text-[8rem] lg:text-[10rem] leading-none">💡</div>
            </div>
            <Lightbulb className="z-10 text-green-600 w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="z-10 mt-4 text-xl font-medium text-center">Hệ thống chiếu sáng</span>
          </div>
        </Link>
        
      </div>

      <p className="text-center text-xs text-gray-400 italic">
        Hệ thống hoạt động ổn định • Cập nhật thời gian thực
      </p>
    </section>
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
