import DailyChart from '../ChartDisplay/DailyChart';
import MonthlyChart from '../ChartDisplay/MonthlyChart';
import TotalProductionCard from '../StatsCards/TotalProductionCard';
import SystemOverviewCard from '../StatsCards/SystemOverviewCard';
import ConsumptionStatsCard from '../StatsCards/ConsumptionStatsCard';

const MobileView = ({ cityName, chartData, activeTab, setActiveTab, equivalentHouseholds }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 shadow-lg min-h-screen px-4 py-6">
    <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl shadow-md mb-6 p-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Tiêu thụ điện
          </h1>
          <p className="mt-1 text-sm text-white opacity-90 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {cityName}
          </p>
        </div>
        <div className="bg-white/20 rounded-md px-2 py-1 text-white">
          {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>
    </div>

    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => setActiveTab('daily')}
        className={`flex-1 px-3 py-2 rounded-lg font-medium flex items-center justify-center text-sm ${
          activeTab === 'daily' 
            ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Ngày
      </button>
      <button
        onClick={() => setActiveTab('monthly')}
        className={`flex-1 px-3 py-2 rounded-lg font-medium flex items-center justify-center text-sm ${
          activeTab === 'monthly' 
            ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        Tháng
      </button>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {activeTab === 'daily' ? 'Tiêu thụ theo ngày' : 'Trung bình tháng'}
      </h2>
      <div className="relative" style={{ height: '300px' }}>
        {activeTab === 'daily' ? (
          <DailyChart dailyData={chartData.dailyData} />
        ) : (
          <MonthlyChart monthlySum={chartData.monthlySum} />
        )}
      </div>
    </div>

    <div className="space-y-4">
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
);

export default MobileView;