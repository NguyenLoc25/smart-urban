const SystemOverview = ({ dailyData, monthlyData, isMobile = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${isMobile ? 'p-3' : 'p-6'} border border-gray-200 dark:bg-gray-900/90 dark:border-gray-700`}>
    <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-lg'} text-gray-800 dark:text-gray-100 ${isMobile ? 'mb-2' : 'mb-4'} flex items-center`}>
      <svg className={`${isMobile ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {isMobile ? 'Tổng quan hệ thống' : 'Tổng quan hệ thống'}
      </h3>
      <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
        <div className={`flex justify-between items-center ${isMobile ? 'py-2' : 'py-3'} border-b border-gray-100 dark:border-gray-700`}>
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300 flex items-center`}>
            <svg className={`${isMobile ? 'w-3 h-3 mr-2' : 'w-4 h-4 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isMobile ? 'Số ngày có dữ liệu' : 'Số ngày có dữ liệu'}
          </span>
          <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'} text-gray-900 dark:text-gray-100`}>
            {dailyData.length}
          </span>
        </div>
        <div className={`flex justify-between items-center ${isMobile ? 'py-2' : 'py-3'}`}>
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300 flex items-center`}>
            <svg className={`${isMobile ? 'w-3 h-3 mr-2' : 'w-4 h-4 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isMobile ? 'Số tháng có dữ liệu' : 'Số tháng có dữ liệu'}
          </span>
          <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'} text-gray-900 dark:text-gray-100`}>
            {monthlyData[monthlyData.length - 1]?.month || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;