import ViewModeSelector from '../controls/ViewModeSelector';
import YearSelector from '../controls/YearSelector';
import LoadingState from '@/components/energy/States/LoadingState';
import EmptyState from '@/components/energy/States/EmptyState';

const DesktopView = ({
  viewMode,
  setViewMode,
  selectedYear,
  setSelectedYear,
  isLoading,
  selectedData,
  allYears,
  renderChart
}) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-lg">
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl overflow-hidden mb-6">
      <div className="p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Phân tích sản lượng điện</h1>
            <div className="mt-2 flex items-center gap-4">
              <p className="text-lg opacity-90 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dữ liệu theo {viewMode === 'yearly' ? 'năm' : viewMode === 'monthly' ? 'tháng' : 'giờ'}
              </p>
              <p className="text-lg opacity-90 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Cập nhật: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div className="flex gap-3 mb-4">
      <ViewModeSelector viewMode={viewMode} setViewMode={setViewMode} />
      {viewMode === 'monthly' && (
        <YearSelector 
          selectedYear={selectedYear} 
          setSelectedYear={setSelectedYear} 
          allYears={allYears} 
        />
      )}
    </div>

    <div className="relative">
      {isLoading ? (
        <LoadingState />
      ) : selectedData.length > 0 ? (
        <div className="h-[500px] min-h-[200px] w-full transition-all duration-300">
          {renderChart()}
        </div>
      ) : (
        <EmptyState />
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
        Cập nhật lần cuối: {new Date().toLocaleDateString()}
      </p>
    </div>
  </div>
);

export default DesktopView;