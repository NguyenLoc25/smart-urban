"use client";

const ConsumptionStats = ({ dailyData, mobile = false }) => {
  const maxProduction = Math.max(...dailyData.map(d => d.production));
  const minProduction = Math.min(...dailyData.map(d => d.production));

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${mobile ? '' : 'md:p-6'} border border-gray-200 dark:bg-gray-900/90 dark:border-gray-700`}>
      <h3 className="font-semibold text-base md:text-lg text-gray-800 dark:text-gray-100 mb-3 md:mb-5 flex items-center">
        <svg className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-red-500 dark:text-red-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Thống kê tiêu thụ
      </h3>
      <div className="space-y-3 md:space-y-4">
        <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-sm md:text-base text-gray-600 dark:text-gray-300 flex items-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Sản lượng cao nhất
          </span>
          <div className="flex items-center">
            <span className="font-medium text-red-600 dark:text-red-400 text-base md:text-lg mr-1 md:mr-2">
              {maxProduction.toLocaleString()}
            </span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">kWh</span>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 md:py-3">
          <span className="text-sm md:text-base text-gray-600 dark:text-gray-300 flex items-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-green-400 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Sản lượng thấp nhất
          </span>
          <div className="flex items-center">
            <span className="font-medium text-green-600 dark:text-green-400 text-base md:text-lg mr-1 md:mr-2">
              {minProduction.toLocaleString()}
            </span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">kWh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionStats;