'use client';

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { EChartsOverview } from "@/components/waste/charts/EChartsOverview";
import { Truck, ActivitySquare, Trash2, Wind, TrendingUp, Eye } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState({
    vehicles: 2,
    conveyors: 3,
    trashToday: 0,
    gasGenerated: 0,
    lastUpdated: null,
  });

  useEffect(() => {
    const db = getDatabase();
    
    // Lấy dữ liệu rác gần nhất từ Firebase
    const wasteRef = ref(db, "waste/report/simulateSessions");
    const latestWasteQuery = query(wasteRef, orderByChild("timestamp"), limitToLast(1));
    
    onValue(latestWasteQuery, (snapshot) => {
      if (snapshot.exists()) {
        const latestData = Object.values(snapshot.val())[0];
        if (latestData && latestData.tong_all) {
          // Lấy tổng rác từ Firebase
          const totalWaste = latestData.tong_all.tong || 0;
          
          // Lấy khí được tạo ra trực tiếp từ Firebase
          const gasFromWaste = latestData.tong_all.khi_vo_co || 
                              latestData.khi_vo_co || 
                              0; // Fallback nếu không có dữ liệu
          
          // Chuyển đổi timestamp thành ngày
          const lastUpdated = latestData.timestamp ? new Date(latestData.timestamp * 1000) : null;
          
          setData((prev) => ({ 
            ...prev, 
            trashToday: totalWaste,
            gasGenerated: gasFromWaste,
            lastUpdated: lastUpdated
          }));
        }
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
      title: "Rác xử lý",
      value: data.trashToday,
      icon: <Trash2 size={26} />,
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-100 dark:bg-emerald-800/50",
      iconColor: "text-emerald-700 dark:text-emerald-300",
      textColor: "text-emerald-900 dark:text-emerald-100",
      accentColor: "text-emerald-600 dark:text-emerald-400",
      unit: "tấn"
    },
    {
      title: "Khí sinh rác",
      value: data.gasGenerated,
      icon: <Wind size={26} />,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-100 dark:bg-orange-800/50",
      iconColor: "text-orange-700 dark:text-orange-300",
      textColor: "text-orange-900 dark:text-orange-100",
      accentColor: "text-orange-600 dark:text-orange-400",
      unit: "m³"
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
                        {stat.value}
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

        {/* Thông tin cập nhật dữ liệu */}
        {data.lastUpdated && (
          <Card className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-4">
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Dữ liệu được cập nhật từ ngày: {data.lastUpdated.toLocaleDateString('vi-VN')} lúc {data.lastUpdated.toLocaleTimeString('vi-VN')}
              </span>
            </div>
          </Card>
        )}

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
      </div>
    </div>
  );
}