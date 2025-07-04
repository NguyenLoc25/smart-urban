'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Thermometer, Droplet, Fish } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useGardenData from "@/app/garden/useGardenData";

export default function NotificationPage() {
  const data = useGardenData();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const now = new Date().toLocaleTimeString('vi-VN');
    const notiList = [];

    if (data.soilHumidity !== null && data.soilHumidity < 30) {
      notiList.push({
        id: 'soil',
        title: "Cảnh báo độ ẩm đất",
        message: `Độ ẩm đất thấp: ${data.soilHumidity}%`,
        time: now,
        type: "Cảnh báo",
        icon: <Droplet className="text-orange-500 w-6 h-6" />,
        redirectTo: '/garden/control/vegetable/GardenControl',
      });
    }

    if (data.fishWaterLevel !== null && data.fishWaterLevel < 10) {
      notiList.push({
        id: 'fish',
        title: "Cảnh báo mực nước hồ cá",
        message: `Mực nước quá thấp: ${data.fishWaterLevel}`,
        time: now,
        type: "Cảnh báo",
        icon: <Fish className="text-blue-500 w-6 h-6" />,
        redirectTo: '/garden/control/animal/FishControl',
      });
    }

    if (data.chickenTemperature !== null && data.chickenTemperature > 35) {
      notiList.push({
        id: 'chicken-temp',
        title: "Cảnh báo nhiệt độ chuồng gà",
        message: `Nhiệt độ vượt ngưỡng: ${data.chickenTemperature}°C`,
        time: now,
        type: "Cảnh báo",
        icon: <Thermometer className="text-red-500 w-6 h-6" />,
        redirectTo: '/garden/control/animal/ChickenControl',
      });
    }

    if (data.mushroomHumidity !== null && data.mushroomHumidity < 60) {
      notiList.push({
        id: 'mushroom-humid',
        title: "Cảnh báo độ ẩm nấm",
        message: `Độ ẩm thấp: ${data.mushroomHumidity}%`,
        time: now,
        type: "Cảnh báo",
        icon: <Droplet className="text-purple-500 w-6 h-6" />,
        redirectTo: '/garden/control/vegetable/MushroomControl',
      });
    }

    if (data.hydroWaterTemp !== null && data.hydroWaterTemp > 30) {
      notiList.push({
        id: 'hydro-temp',
        title: "Cảnh báo nhiệt độ nước thủy canh",
        message: `Nhiệt độ quá cao: ${data.hydroWaterTemp}°C`,
        time: now,
        type: "Cảnh báo",
        icon: <Droplet className="text-cyan-500 w-6 h-6" />,
        redirectTo: '/garden/control/vegetable/HydroponicControl',
      });
    }

    setNotifications(notiList);
  }, [data]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-green-50 min-h-screen">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-green-700 flex items-center justify-center gap-3">
          <Bell className="w-8 h-8" />
          Thông báo vườn thông minh
        </h1>
        <p className="text-gray-600 mt-2">Cập nhật trạng thái và hoạt động mới nhất</p>
      </div>

      <div className="h-[500px] overflow-y-auto rounded-xl border shadow-lg bg-white">
        <div className="flex flex-col gap-4 p-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500">✅ Không có cảnh báo nào</div>
          ) : (
            notifications.map((n) => (
              <Card
                key={n.id}
                onClick={() => n.redirectTo && router.push(n.redirectTo)}
                className="relative bg-white border-l-4 border-green-500 hover:border-green-600 hover:shadow-xl transition-all cursor-pointer"
              >
                <CardContent className="p-5">
                  <div className="flex gap-4 items-start">
                    <div className="mt-1">{n.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-green-800">
                          {n.title}
                        </h2>
                        <Badge className="text-xs bg-green-100 text-green-700 border border-green-300">
                          {n.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 italic">{n.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
   <div className="" />     </div>
      </div>
    </div>
  );
}