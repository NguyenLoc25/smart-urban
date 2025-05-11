"use client";

import dynamic from 'next/dynamic';
import { SummaryCard } from '../stats/SummaryCard';
import { SystemOverview } from '../stats/SystemOverview';
import { ConsumptionStats } from '../stats/ConsumptionStats';
import TabControl from '../controls/TabControl';
import { calculateEquivalent } from '../utils/dataUtils';

const DailyChart = dynamic(() => import('../charts/DailyChart'), { 
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center">Đang tải biểu đồ...</div>
});

const MonthlyChart = dynamic(() => import('../charts/MonthlyChart'), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center">Đang tải biểu đồ...</div>
});

const MobileView = ({ chartData, cityName }) => {
  const [activeTab, setActiveTab] = useState('daily');
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900/90 shadow-lg min-h-screen px-4 py-6">
      {/* Compact header */}
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

      {/* Tab controls */}
      <TabControl activeTab={activeTab} setActiveTab={setActiveTab} mobile />

      {/* Chart container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {activeTab === 'daily' ? 'Tiêu thụ theo ngày' : 'Trung bình tháng'}
        </h2>
        <div className="relative" style={{ height: '300px' }}>
          {activeTab === 'daily' ? (
            <DailyChart data={chartData.dailyData} />
          ) : (
            <MonthlyChart data={chartData.monthlySum} />
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="space-y-4">
        <SummaryCard 
          dailyData={chartData.dailyData} 
          monthlySum={chartData.monthlySum}
          mobile
        />
        <SystemOverview 
          dailyData={chartData.dailyData} 
          monthlySum={chartData.monthlySum}
          mobile
        />
        <ConsumptionStats 
          dailyData={chartData.dailyData}
          mobile
        />
      </div>
    </div>
  );
};

export default MobileView;