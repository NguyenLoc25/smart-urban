import { ThermometerIcon } from 'lucide-react';

export default function SensorCard({ temperature, humidity }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center w-40">
      <ThermometerIcon className="text-green-600 mb-2" size={32} />
      <p className="font-semibold mb-1">Nhiệt độ / Độ ẩm</p>
      <div className="text-sm text-pink-600">{temperature}°C</div>
      <div className="text-sm text-blue-600">{humidity}%</div>
    </div>
  );
}
