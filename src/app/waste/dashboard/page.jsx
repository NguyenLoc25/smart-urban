'use client';

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { EChartsOverview } from "@/components/waste/charts/EChartsOverview";
import { Truck, ActivitySquare, Trash2, Zap, TrendingUp, Eye } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState({
    vehicles: 2,
    conveyors: 3,
    trashToday: 560,
    energy: 3.2,
    conveyorsStatus: {
      garden: true,
      energy: false,
      store: true,
    },
  });

  useEffect(() => {
    const db = getDatabase();
    const vehiclesRef = ref(db, "waste/vehicles/count");
    onValue(vehiclesRef, (snapshot) => {
      if (snapshot.exists()) {
        setData((prev) => ({ ...prev, vehicles: snapshot.val() }));
      }
    });
  }, []);

  const statsCards = [
    {
      title: "Số xe hoạt động",
      value: data.vehicles,
      icon: <Truck size={26} />,
      bgColor: "bg-slate-50 dark:bg-slate-800/50",
      iconBg: "bg-slate-100 dark:bg-slate-700",
      iconColor: "text-slate-700 dark:text-slate-300",
      textColor: "text-slate-900 dark:text-slate-100",
      accentColor: "text-slate-600 dark:text-slate-400",
      unit: "chiếc"
    },
    {
      title: "Băng chuyền",
      value: data.conveyors,
      icon: <ActivitySquare size={26} />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-800/50",
      iconColor: "text-blue-700 dark:text-blue-300",
      textColor: "text-blue-900 dark:text-blue-100",
      accentColor: "text-blue-600 dark:text-blue-400",
      unit: "dây"
    },
    {
      title: "Rác xử lý hôm nay",
      value: data.trashToday,
      icon: <Trash2 size={26} />,
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-100 dark:bg-emerald-800/50",
      iconColor: "text-emerald-700 dark:text-emerald-300",
      textColor: "text-emerald-900 dark:text-emerald-100",
      accentColor: "text-emerald-600 dark:text-emerald-400",
      unit: "kg"
    },
    {
      title: "Năng lượng tái tạo",
      value: data.energy,
      icon: <Zap size={26} />,
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconBg: "bg-amber-100 dark:bg-amber-800/50",
      iconColor: "text-amber-700 dark:text-amber-300",
      textColor: "text-amber-900 dark:text-amber-100",
      accentColor: "text-amber-600 dark:text-amber-400",
      unit: "kWh"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header với thiết kế tối giản */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 rounded-2xl shadow-lg">
              <Image 
                src="/icons/dashboard.svg" 
                alt="Biểu tượng Bảng điều khiển" 
                width={32} 
                height={32}
                className="filter brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                Bảng Điều Khiển Xử Lý Rác Thông Minh
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                <Eye size={16} />
                Theo dõi và giám sát hệ thống xử lý rác thông minh
              </p>
            </div>
          </div>
        </div>

        {/* Thống kê với màu sắc nhẹ nhàng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] rounded-2xl backdrop-blur-sm`}>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-2xl font-bold ${stat.textColor}`}>
                        {stat.value.toLocaleString()}
                      </p>
                      <span className={`text-sm ${stat.accentColor}`}>
                        {stat.unit}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.iconColor} shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <TrendingUp size={12} className="text-emerald-500" />
                  <span>Hoạt động bình thường</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Biểu đồ với thiết kế tinh tế */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-sm rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                📊
              </div>
              Biểu Đồ Phân Loại Rác Theo Năm
            </h2>
            <p className="text-slate-200 mt-2 text-sm md:text-base">
              Thống kê và phân tích dữ liệu xử lý rác theo thời gian
            </p>
          </div>
          
          <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50">
            <EChartsOverview />
          </div>
        </Card>

        {/* Trạng thái băng chuyền */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-sm rounded-3xl p-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <ActivitySquare size={20} className="text-slate-600 dark:text-slate-400" />
            Trạng Thái Băng Chuyền
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Vườn", status: data.conveyorsStatus.garden },
              { name: "Năng lượng", status: data.conveyorsStatus.energy },
              { name: "Cửa hàng", status: data.conveyorsStatus.store }
            ].map((conveyor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50/70 dark:bg-slate-700/50 rounded-xl backdrop-blur-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {conveyor.name}
                </span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${conveyor.status ? 'bg-emerald-500' : 'bg-slate-400'} shadow-sm`}></div>
                  <span className={`text-xs font-medium ${conveyor.status ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {conveyor.status ? 'Hoạt động' : 'Dừng'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}