
import ViewModeControl from '../controls/view-mode-control'
import YearSelector from '../controls/year-selector'
import YearlyChart from '../chart-display/yearly-chart'
import MonthlyChart from '../chart-display/monthly-chart'
import HourlyChart from '../chart-display/hourly-chart'
import EmptyState from '../states/empty-state'
import Header from '../components/header'
const DesktopView = ({ energyData, viewMode, selectedYear, onViewModeChange, onYearChange }) => {
  const hasData = energyData && 
    ((viewMode === 'yearly' && energyData.yearly?.length > 0) ||
     (viewMode === 'monthly' && energyData.monthly?.length > 0) ||
     (viewMode === 'hourly' && energyData.hourly?.length > 0))

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-lg">
      <Header viewMode={viewMode} isMobile={false} />
      
      <div className="flex flex-row gap-3 mb-4">
        <ViewModeControl viewMode={viewMode} onChange={onViewModeChange} />
        {viewMode === 'monthly' && (
          <YearSelector 
            selectedYear={selectedYear} 
            years={[...new Set(energyData?.monthly?.map(item => item.year))]} 
            onChange={onYearChange} 
          />
        )}
      </div>

      <div className="h-[500px] min-h-[200px] w-full">
        {!hasData ? <EmptyState /> : (
          <>
{viewMode === 'yearly' && <YearlyChart data={energyData.yearly} />}
{viewMode === 'monthly' && (
  <MonthlyChart 
    data={energyData.monthly} 
    selectedYear={selectedYear}

  />
)}
{viewMode === 'hourly' && <HourlyChart data={energyData.hourly} />}
          </>
        )}
      </div>
    </div>
  )
}

export default DesktopView