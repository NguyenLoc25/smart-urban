'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EChartsOverview } from "@/components/waste/charts/EChartsOverview"

import { Truck, ActivitySquare, Trash2, Settings2 } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Header đẹp */}
      <div className="flex items-center gap-4">
        <Image src="/icons/dashboard.svg" alt="Dashboard Icon" width={50} height={50} />
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Smart Waste Monitoring
          </h1>
          <p className="text-gray-500 text-sm">Tối ưu thu gom – phân loại – tái chế</p>
        </div>
      </div>

      {/* Cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-100 to-white flex gap-4 items-center">
          <Truck className="text-green-600" size={40} />
          <div>
            <p className="text-sm text-gray-600">Xe đang chạy</p>
            <h2 className="text-4xl font-bold text-green-800">2</h2>
            <Badge className="bg-green-200 text-green-800 mt-1">Hoạt động</Badge>
          </div>
        </Card>
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-100 to-white flex gap-4 items-center">
          <ActivitySquare className="text-blue-600" size={40} />
          <div>
            <p className="text-sm text-gray-600">Băng chuyền hoạt động</p>
            <h2 className="text-4xl font-bold text-blue-800">3</h2>
            <Badge className="bg-blue-200 text-blue-800 mt-1">Đang xử lý</Badge>
          </div>
        </Card>
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-orange-100 to-white flex gap-4 items-center">
          <Trash2 className="text-orange-600" size={40} />
          <div>
            <p className="text-sm text-gray-600">Khối lượng rác hôm nay</p>
            <h2 className="text-4xl font-bold text-orange-800">560kg</h2>
          </div>
        </Card>
        <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-100 to-white flex gap-4 items-center">
          <Settings2 className="text-purple-600" size={40} />
          <div>
            <p className="text-sm text-gray-600">Năng lượng tái tạo</p>
            <h2 className="text-4xl font-bold text-purple-800">3.2 kWh</h2>
          </div>
        </Card>
      </div>

      {/* Biểu đồ */}
      <Card className="p-6 rounded-xl shadow-xl bg-white">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📈 Biểu đồ rác phân loại theo tháng
        </h2>
        <EChartsOverview />
      </Card>
    </div>
  )
}
