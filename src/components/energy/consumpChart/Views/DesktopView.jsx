import DailyChart from '../ChartDisplay/DailyChart';
import MonthlyChart from '../ChartDisplay/MonthlyChart';
import TotalProductionCard from '../StatsCards/TotalProductionCard';
import SystemOverviewCard from '../StatsCards/SystemOverviewCard';
import ConsumptionStatsCard from '../StatsCards/ConsumptionStatsCard';

const DesktopView = ({ cityName, chartData, activeTab, setActiveTab, equivalentHouseholds }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 shadow-lg overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-2xl shadow-xl overflow-hidden mb-6">
      <div className="p-6 md:p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <svg className="w-6 h-6 md:w-7 md:h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Phân tích tiêu thụ điện
            </h1>
            <p className="mt-2 text-base md:text-lg opacity-90 flex items-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Thành phố {cityName}
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1.5 text-sm md:text-base">
            Cập nhật: {new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:col-span-2 dark:border-gray-700 dark:bg-gray-900/90">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {activeTab === 'daily' ? 'Biểu đồ tiêu thụ theo ngày' : 'Biểu đồ trung bình tháng'}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all ${
                activeTab === 'daily' 
                  ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ngày
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all ${
                activeTab === 'monthly' 
                  ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Tháng
            </button>
          </div>
        </div>
        
        <div className="relative" style={{ height: '500px' }}>
          {activeTab === 'daily' ? (
            <DailyChart dailyData={chartData.dailyData} />
          ) : (
            <MonthlyChart monthlySum={chartData.monthlySum} />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <TotalProductionCard 
          dailyData={chartData.dailyData} 
          equivalentHouseholds={equivalentHouseholds} 
        />
        <SystemOverviewCard 
          dailyData={chartData.dailyData} 
          monthlySum={chartData.monthlySum} 
        />
        <ConsumptionStatsCard dailyData={chartData.dailyData} />
      </div>
    </div>
  </div>
);

export default DesktopView;