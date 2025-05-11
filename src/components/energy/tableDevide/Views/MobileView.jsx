import { colorClasses } from "@/components/energy/tableDevide/types";

export default function MobileView({ energyTypes, quantityData, openModal }) {
  return (
    <div className="space-y-4">
      {Object.entries(energyTypes).map(([key, energy]) => {
        const totalSlots = energy.maxSlots;
        const availableSlots = totalSlots - quantityData[key];
        const usagePercentage = totalSlots > 0 ? Math.round((quantityData[key] / totalSlots) * 100) : 0;
        const currentColor = colorClasses[energy.color];

        return (
          <div key={key} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${currentColor.bgLight} ${currentColor.bgDark} flex items-center justify-center`}>
                  <div className={`${currentColor.text} ${currentColor.textDark}`}>
                    {energy.icon}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {energy.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {quantityData[`${key}Count`]} thiết bị
                  </div>
                </div>
              </div>
              <button
                onClick={() => openModal(key)}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Chi tiết
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tổng</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {totalSlots}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Đã dùng</div>
                <div className="text-sm font-medium text-red-600 dark:text-red-400">
                  {quantityData[key]}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Còn trống</div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  {availableSlots > 0 ? availableSlots : 0}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Tỷ lệ sử dụng</span>
                <span className="text-xs font-medium">{usagePercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${currentColor.bg}`}
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}