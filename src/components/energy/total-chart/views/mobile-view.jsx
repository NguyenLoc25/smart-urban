
import ViewModeControl from '../controls/view-mode-control'
import YearSelector from '../controls/year-selector'
import YearlyChart from '../chart-display/yearly-chart'
import MonthlyChart from '../chart-display/monthly-chart'
import HourlyChart from '../chart-display/hourly-chart'
import EmptyState from '../states/empty-state'
import Footer from '../components/footer'
import { getAvailableYears } from '../helpers/chart-helpers'

const MobileView = ({ 
  energyData, 
  viewMode, 
  selectedYear, 
  onViewModeChange, 
  onYearChange 
}) => {
  const hasData = energyData && 
    ((viewMode === 'yearly' && energyData.yearly?.length > 0) ||
     (viewMode === 'monthly' && energyData.monthly?.length > 0) ||
     (viewMode === 'hourly' && energyData.hourly?.length > 0))

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-md">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Sản lượng điện</h1>
              <p className="text-xs opacity-90 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dữ liệu {viewMode === 'yearly' ? 'năm' : viewMode === 'monthly' ? 'tháng' : 'giờ'}
              </p>
            </div>
            <div className="bg-white/20 rounded p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Controls - Stacked vertically for mobile */}
      <div className="flex flex-col gap-2 mb-3">
        <ViewModeControl viewMode={viewMode} onChange={onViewModeChange} />
        
        {viewMode === 'monthly' && (
          <YearSelector 
            selectedYear={selectedYear} 
            years={getAvailableYears(energyData?.monthly)} 
            onChange={onYearChange}
            mobile
          />
        )}
      </div>

      {/* Chart Container */}
      <div className="relative">
        {!hasData ? (
          <EmptyState mobile />
        ) : (
          <div className="h-[300px] min-h-[200px] w-full">
            {viewMode === 'yearly' && <YearlyChart data={energyData.yearly} mobile />}
            {viewMode === 'monthly' && (
              <MonthlyChart 
                data={energyData.monthly.filter(item => item.year === selectedYear)} 
                mobile
              />
            )}
            {viewMode === 'hourly' && <HourlyChart data={energyData.hourly} mobile />}
          </div>
        )}
      </div>

      {/* Mobile Footer */}
      <Footer mobile />
    </div>
  )
}

export default MobileView