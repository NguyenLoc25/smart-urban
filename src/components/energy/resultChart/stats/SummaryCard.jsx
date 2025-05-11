"use client";

import { calculateEquivalent } from '../utils/dataUtils';

const SummaryCard = ({ dailyData, monthlySum, mobile = false }) => {
  const totalProduction = dailyData.reduce((sum, day) => sum + day.production, 0);
  const equivalent = calculateEquivalent(dailyData, monthlySum);

  return (
    <div className={`bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-md p-5 text-white ${mobile ? '' : 'dark:from-red-600 dark:to-orange-600'}`}>
      <h3 className={`font-medium ${mobile ? 'text-base' : 'text-lg'} mb-3 flex items-center`}>
        <svg className={`${mobile ? 'w-5 h-5 mr-2' : 'w-6 h-6 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Tổng sản lượng
      </h3>
      <div className={`${mobile ? 'text-2xl' : 'text-3xl'} font-bold mb-1`}>
        {(totalProduction / 1000000).toFixed(2)} GWh
      </div>
      <div className={`${mobile ? 'text-xs' : 'text-sm'} opacity-90 flex items-center`}>
        {!mobile && (
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )}
        <span>Tương đương {equivalent.toLocaleString()} hộ gia đình</span>
      </div>
    </div>
  );
};

export default SummaryCard;