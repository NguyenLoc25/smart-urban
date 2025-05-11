"use client";

const TabControl = ({ activeTab, setActiveTab, mobile = false }) => {
  return (
    <div className={`flex ${mobile ? 'space-x-2' : 'space-x-2'}`}>
      <button
        onClick={() => setActiveTab('daily')}
        className={`${mobile ? 'flex-1 px-3 py-2 text-sm' : 'px-4 py-2'} rounded-lg font-medium flex items-center transition-all ${
          activeTab === 'daily' 
            ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 dark:border-gray-700'
        }`}
      >
        <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Ngày
      </button>
      <button
        onClick={() => setActiveTab('monthly')}
        className={`${mobile ? 'flex-1 px-3 py-2 text-sm' : 'px-4 py-2'} rounded-lg font-medium flex items-center transition-all ${
          activeTab === 'monthly' 
            ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 dark:border-gray-700'
        }`}
      >
        <svg className="w-4 h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        Tháng
      </button>
    </div>
  );
};

export default TabControl;