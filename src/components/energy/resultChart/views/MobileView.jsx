'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import SummaryCard from '../stats/SummaryCard';
import SystemOverview from '../stats/SystemOverview';
import ConsumptionStats from '../stats/ConsumptionStats';
import TabControl from '../controls/TabControl';

const DailyChart = dynamic(() => import('../charts/DailyChart'), { 
  ssr: false,
  loading: () => <ChartLoading />
});

const MonthlyChart = dynamic(() => import('../charts/MonthlyChart'), {
  ssr: false,
  loading: () => <ChartLoading />
});

const ChartLoading = () => (
  <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Đang tải biểu đồ...
  </div>
);

const Header = ({ cityName }) => (
  <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl shadow-md mb-6 p-4 sm:p-5">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Tiêu thụ điện
        </h1>
        <p className="mt-1 text-sm sm:text-base text-white/95 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {cityName}
        </p>
      </div>
      <div className="bg-white/20 rounded-lg px-3 py-1.5 text-sm sm:text-base text-white font-medium">
        {new Date().toLocaleDateString('vi-VN')}
      </div>
    </div>
  </div>
);

const ChartContainer = ({ activeTab, chartData }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
      <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
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
);

const MobileView = ({ chartData, cityName }) => {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Header cityName={cityName} />
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <TabControl activeTab={activeTab} setActiveTab={setActiveTab} mobile />
          <ChartContainer activeTab={activeTab} chartData={chartData} />
        </div>
        
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <SummaryCard 
              dailyData={chartData.dailyData} 
              monthlySum={chartData.monthlySum}
              mobile
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <SystemOverview 
              dailyData={chartData.dailyData} 
              monthlySum={chartData.monthlySum}
              mobile
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <ConsumptionStats 
              dailyData={chartData.dailyData}
              mobile
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileView;