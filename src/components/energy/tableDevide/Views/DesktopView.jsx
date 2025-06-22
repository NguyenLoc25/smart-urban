import { colorClasses } from "@/components/energy/tableDevide/types";

export default function DesktopView({ energyTypes, quantityData, openModal }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Loại năng lượng
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tổng vị trí
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Đã sử dụng
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Còn trống
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tỷ lệ sử dụng
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Chi tiết
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(energyTypes).map(([key, energy]) => {
            const totalSlot = energy.maxSlots.toLocaleString();
            const totalSlots = energy.maxSlots;
            const availableSlot = (totalSlots - quantityData[key]).toLocaleString();
            const availableSlots = totalSlots - quantityData[key];
            const usagePercentage = totalSlots > 0 ? Math.round((quantityData[key] / totalSlots) * 100) : 0;
            const currentColor = colorClasses[energy.color];

            return (
              <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full ${currentColor.bgLight} ${currentColor.bgDark} flex items-center justify-center`}>
                      <div className={`${currentColor.text} ${currentColor.textDark}`}>
                        {energy.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {energy.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {quantityData[`${key}Count`]} loại
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white font-medium">
                    {totalSlot}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {(quantityData[key].toLocaleString())}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {availableSlot}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-20 mr-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${currentColor.bg}`}
                          style={{ width: `${usagePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {usagePercentage}%
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openModal(key)}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Xem mẫu các loại thiết bị
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}