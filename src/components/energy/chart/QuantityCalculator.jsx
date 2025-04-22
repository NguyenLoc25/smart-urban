import React, { useState } from "react";

export default function QuantityTable({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnergyType, setSelectedEnergyType] = useState(null);

  // Tính toán số liệu cho từng loại năng lượng
  const energyTypes = {
    hydro: {
      name: "Thủy điện",
      maxSlots: 2,
      used: data.hydroUsed,
      color: "blue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      models: data.question_header?.hydro_models || []
    },
    wind: {
      name: "Điện gió",
      maxSlots: 3,
      used: data.windUsed,
      color: "green",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      models: data.question_header?.wind_models || []
    },
    solar: {
      name: "Điện mặt trời",
      maxSlots: 4,
      used: data.solarUsed,
      color: "amber",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      models: data.question_header?.solar_models || []
    }
  };

  const countModels = (models) => {
    const countMap = {};
    models.forEach(model => {
      countMap[model] = (countMap[model] || 0) + 1;
    });
    return countMap;
  };

  const openModal = (energyType) => {
    setSelectedEnergyType(energyType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnergyType(null);
  };

  const renderDesktopView = () => (
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
            const totalSlots = energy.maxSlots * data[`${key}Count`];
            const availableSlots = totalSlots - energy.used;
            const usagePercentage = totalSlots > 0 ? Math.round((energy.used / totalSlots) * 100) : 0;

            const colorClasses = {
              blue: {
                bg: 'bg-blue-500',
                bgLight: 'bg-blue-100',
                text: 'text-blue-600',
                bgDark: 'dark:bg-blue-900/30',
                textDark: 'dark:text-blue-400'
              },
              green: {
                bg: 'bg-green-500',
                bgLight: 'bg-green-100',
                text: 'text-green-600',
                bgDark: 'dark:bg-green-900/30',
                textDark: 'dark:text-green-400'
              },
              amber: {
                bg: 'bg-amber-500',
                bgLight: 'bg-amber-100',
                text: 'text-amber-600',
                bgDark: 'dark:bg-amber-900/30',
                textDark: 'dark:text-amber-400'
              }
            };
            
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
                        {data[`${key}Count`]} thiết bị
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white font-medium">
                    {totalSlots}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {energy.used}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {availableSlots > 0 ? availableSlots : 0}
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
                    Xem mẫu thiết bị
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderMobileView = () => (
    <div className="space-y-4">
      {Object.entries(energyTypes).map(([key, energy]) => {
        const totalSlots = energy.maxSlots * data[`${key}Count`];
        const availableSlots = totalSlots - energy.used;
        const usagePercentage = totalSlots > 0 ? Math.round((energy.used / totalSlots) * 100) : 0;

        const colorClasses = {
          blue: {
            bg: 'bg-blue-500',
            bgLight: 'bg-blue-100',
            text: 'text-blue-600',
            bgDark: 'dark:bg-blue-900/30',
            textDark: 'dark:text-blue-400'
          },
          green: {
            bg: 'bg-green-500',
            bgLight: 'bg-green-100',
            text: 'text-green-600',
            bgDark: 'dark:bg-green-900/30',
            textDark: 'dark:text-green-400'
          },
          amber: {
            bg: 'bg-amber-500',
            bgLight: 'bg-amber-100',
            text: 'text-amber-600',
            bgDark: 'dark:bg-amber-900/30',
            textDark: 'dark:text-amber-400'
          }
        };
        
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
                    {data[`${key}Count`]} thiết bị
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
                  {energy.used}
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

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 shadow-lg">
      {/* Header */}
<div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-xl p-4 sm:p-6 md:p-10 text-white mb-4 sm:mb-6 shadow-lg">
  <div className="flex flex-col gap-2 sm:gap-3">
    {/* Phần tiêu đề và version - luôn hiển thị trên cùng */}
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold drop-shadow-md whitespace-nowrap">
          Quản lý thiết bị
        </h2>
        {data.version && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full">
            {data.version}
          </span>
        )}
      </div>
      
      {/* Nút thời gian chỉ hiển thị icon trên mobile */}
      <div className="sm:hidden flex items-center p-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-white/80" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
    </div>

    {/* Phần thời gian đầy đủ chỉ hiển thị trên tablet/desktop */}
    <div className="hidden sm:flex items-center justify-between">
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-white/80" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="text-xs font-medium">
          {new Date(data.updatedAt).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>

    {/* Mô tả ngắn chỉ hiển thị trên tablet/desktop */}
    <p className="hidden sm:block text-xs sm:text-sm text-white/80">
      Theo dõi và quản lý tất cả thiết bị đang hoạt động trong hệ thống
    </p>
  </div>
</div>

      {/* Responsive Table */}
      <div className="hidden md:block">
        {renderDesktopView()}
      </div>
      <div className="md:hidden">
        {renderMobileView()}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          title="Tổng vị trí"
          value={data.hydroCount * 2 + data.windCount * 3 + data.solarCount * 4}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          }
          color="purple"
        />
        <SummaryCard
          title="Tổng đã sử dụng"
          value={data.hydroUsed + data.windUsed + data.solarUsed}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="red"
        />
        <SummaryCard
          title="Tổng còn trống"
          value={
            (data.hydroCount * 2 - data.hydroUsed) + 
            (data.windCount * 3 - data.windUsed) + 
            (data.solarCount * 4 - data.solarUsed)
          }
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          color="green"
        />
      </div>

      {/* Device Models Modal */}
      {isModalOpen && selectedEnergyType && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Mẫu thiết bị {energyTypes[selectedEnergyType].name}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {energyTypes[selectedEnergyType].models.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(countModels(energyTypes[selectedEnergyType].models)).map(([model, count], index) => (
                      <li key={index} className="py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {model}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {count} thiết bị
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Không có thông tin mẫu thiết bị
                  </p>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for Summary Cards
function SummaryCard({ title, value, icon, color }) {
  const colorClasses = {
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400'
    }
  };

  return (
    <div className={`${colorClasses[color].bg} p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color].text}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color].bg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}