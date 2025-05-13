"use client";

const ConsumptionStats = ({ dailyData, mobile = false }) => {
  const maxProduction = Math.max(...dailyData.map(d => d.production));
  const minProduction = Math.min(...dailyData.map(d => d.production));

  const maxProductionData = dailyData.find(d => d.production === maxProduction);
  const minProductionData = dailyData.find(d => d.production === minProduction);

  const formatDate = (d) => `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 ${mobile ? '' : 'md:p-7'} border border-gray-200 dark:bg-gray-900/90 dark:border-gray-700`}>
      <div className="flex items-center mb-4 md:mb-6">
        <div className="p-2 mr-3 rounded-lg bg-red-50 dark:bg-red-900/30">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg md:text-xl text-gray-800 dark:text-gray-100">
          Thống kê tiêu thụ
        </h3>
      </div>
      
      <div className="space-y-4 md:space-y-5">
        {/* Max Consumption */}
        <div className="p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-1.5 mr-3 rounded-md bg-red-100 dark:bg-red-900/40">
                <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                Tiêu thụ cao nhất
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-baseline">
                <span className="font-semibold text-red-600 dark:text-red-400 text-lg md:text-xl mr-2">
                  {maxProduction.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">kWh</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                {maxProductionData && formatDate(maxProductionData)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Min Consumption */}
        <div className="p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-1.5 mr-3 rounded-md bg-green-100 dark:bg-green-900/40">
                <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                Tiêu thụ thấp nhất
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-baseline">
                <span className="font-semibold text-green-600 dark:text-green-400 text-lg md:text-xl mr-2">
                  {minProduction.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">kWh</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                {minProductionData && formatDate(minProductionData)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionStats;