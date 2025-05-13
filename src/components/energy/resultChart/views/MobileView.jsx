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
  loading: () => <div className="h-[300px] flex items-center justify-center">Đang tải biểu đồ...</div>
});

const MonthlyChart = dynamic(() => import('../charts/MonthlyChart'), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center">Đang tải biểu đồ...</div>
});

const MobileView = ({ chartData, cityName }) => {
  const [activeTab, setActiveTab] = useState('daily');

  // Calculate monthly data
  const monthlyData = calculateMonthlySum(chartData.dailyData);

  // Reverse month order: from oldest to newest
  const monthlyChartData = [...monthlyData].reverse().map(item => ({
    month: item.monthName,
    sum: item.sum
  }));

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900/90 shadow overflow-hidden">
      {/* Header - Stacked vertically for mobile */}
      
      {/* Main content - Single column for mobile */}
      <div className="space-y-4">
        {/* Stats panel comes first on mobile */}
        <div className="space-y-4">
          <SummaryCard 
            dailyData={chartData.dailyData} 
            monthlyData={monthlyData}
            isMobile={true}
          />
          <SystemOverview 
            dailyData={chartData.dailyData} 
            monthlyData={monthlyData}
            isMobile={true}
          />
          <ConsumptionStats 
            dailyData={chartData.dailyData}
            isMobile={true}
          />
        </div>

        {/* Chart panel */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-900/90">
          <div className="flex flex-col space-y-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {activeTab === 'daily' ? 'Biểu đồ tiêu thụ theo ngày' : 'Biểu đồ trung bình tháng'}
            </h2>
            <TabControl activeTab={activeTab} setActiveTab={setActiveTab} isMobile={true} />
          </div>
          
          {/* Chart container with reduced height */}
          <div className="relative" style={{ height: '300px' }}>
            {activeTab === 'daily' ? (
              <DailyChart data={chartData.dailyData} isMobile={true} />
            ) : (
              <MonthlyChart data={monthlyChartData} isMobile={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileView;