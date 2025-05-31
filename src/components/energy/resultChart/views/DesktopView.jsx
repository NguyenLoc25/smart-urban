"use client";

import dynamic from 'next/dynamic';
import SummaryCard from '../stats/SummaryCard';
import SystemOverview from '../stats/SystemOverview';
import ConsumptionStats from '../stats/ConsumptionStats';

import TabControl from '../controls/TabControl';
import { calculateMonthlySum } from '../utils/dataUtils';
import { useState } from 'react';

const DailyChart = dynamic(() => import('../charts/DailyChart'), { 
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center">Đang tải biểu đồ...</div>
});

const MonthlyChart = dynamic(() => import('../charts/MonthlyChart'), {
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center">Đang tải biểu đồ...</div>
});

const DesktopView = ({ chartData, cityName }) => {
  const [activeTab, setActiveTab] = useState('daily');

  // Tính toán dữ liệu tháng
  const monthlyData = calculateMonthlySum(chartData.dailyData);

  // Đảo ngược thứ tự tháng: từ tháng xa nhất đến gần nhất
  const monthlyChartData = [...monthlyData].reverse().map(item => ({
    month: item.monthName,
    sum: item.sum
  }));

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-lg w-full">
      {/* Header */}
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
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:col-span-2 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {activeTab === 'daily' ? 'Biểu đồ tiêu thụ theo ngày' : 'Biểu đồ trung bình tháng'}
            </h2>
            <TabControl activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          {/* Chart container */}
          <div className="h-[500px] min-h-[200px] w-full">
            {activeTab === 'daily' ? (
              <DailyChart data={chartData.dailyData} />
            ) : (
              <MonthlyChart data={monthlyChartData} />
            )}
          </div>
        </div>

        {/* Stats panel */}
        <div className="space-y-6">
          <SummaryCard 
            dailyData={chartData.dailyData} 
            monthlyData={monthlyData}
          />
          <SystemOverview 
            dailyData={chartData.dailyData} 
            monthlyData={monthlyData}
          />
          <ConsumptionStats 
            dailyData={chartData.dailyData}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopView;