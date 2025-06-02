"use client";

const ConsumptionStats = ({ dailyData, isMobile = false }) => {
  const maxProduction = Math.max(...dailyData.map(d => d.production));
  const minProduction = Math.min(...dailyData.map(d => d.production));

  const maxProductionData = dailyData.find(d => d.production === maxProduction);
  const minProductionData = dailyData.find(d => d.production === minProduction);

  const formatDate = (d) => `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`;

  const cardClasses = "p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50";
  const iconContainerClasses = "p-1.5 rounded-md";
  const valueClasses = "font-semibold text-base mr-1";
  const unitClasses = "text-xs text-gray-500 dark:text-gray-400";

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${!isMobile && 'p-6'} border border-gray-200 dark:bg-gray-900/90 dark:border-gray-700`}>
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="p-2 mr-3 rounded-lg bg-red-50 dark:bg-red-900/30">
          <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-lg'} text-gray-800 dark:text-gray-100`}>
          Thống kê tiêu thụ
        </h3>
      </div>
      
      {/* Stats Cards */}
      <div className={`space-y-3 ${!isMobile && 'md:space-y-4'}`}>
        {/* Max Consumption */}
        <div className={cardClasses}>
        <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-2`}>
            <div className="flex items-center">
            <div className={`${iconContainerClasses} bg-red-100 dark:bg-red-900/40 mr-3`}>
                <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tiêu thụ cao nhất
              </span>
            </div>
            
            {isMobile ? (
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline">
                  <span className={`${valueClasses} text-red-600 dark:text-red-400`}>
                    {maxProduction.toLocaleString()}
                  </span>
                  <span className={unitClasses}>kWh</span>
                </div>
                <span className={unitClasses}>
                  {maxProductionData && formatDate(maxProductionData)}
                </span>
              </div>
            ) : (
              <div className="text-right sm:text-left">
              <div className="flex items-baseline justify-end sm:justify-start">
                <span className="font-semibold text-red-600 dark:text-red-400 text-base sm:text-lg md:text-xl mr-1 sm:mr-2">
                  {maxProduction.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">kWh</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">
                {maxProductionData && formatDate(maxProductionData)}
              </span>
            </div> )}
          </div>
        </div>
        
        {/* Min Consumption */}
        <div className={cardClasses}>
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-2`}>
            <div className="flex items-center">
              <div className={`${iconContainerClasses} bg-green-100 dark:bg-green-900/40 mr-3`}>
                <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tiêu thụ thấp nhất
              </span>
            </div>
            {isMobile ? (
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline">
                  <span className={`${valueClasses} text-green-600 dark:text-green-400`}>
                    {minProduction.toLocaleString()}
                  </span>
                  <span className={unitClasses}>kWh</span>
                </div>
                <span className={unitClasses}>
                  {minProductionData && formatDate(minProductionData)}
                </span>
              </div>
            ) : (
              <div className="text-right sm:text-left">
              <div className="flex items-baseline justify-end sm:justify-start">
                <span className="font-semibold text-green-600 dark:text-green-400 text-base sm:text-lg md:text-xl mr-1 sm:mr-2">
                  {minProduction.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">kWh</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">
                {minProductionData && formatDate(minProductionData)}
              </span>
              </div> )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionStats;