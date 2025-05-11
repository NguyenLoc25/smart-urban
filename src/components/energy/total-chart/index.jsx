import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useResponsive } from './helpers/responsive-helpers'
import DesktopView from './views/desktop-view'
import MobileView from './views/mobile-view'
import LoadingState from './states/loading-state'

const TotalChart = ({ energyData }) => {
  const [viewMode, setViewMode] = useState('yearly')
  const [selectedYear, setSelectedYear] = useState(2023)
  const [isLoading, setIsLoading] = useState(true)
  const { isMobile } = useResponsive()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingState />
  }

  return isMobile ? (
    <MobileView
      energyData={energyData}
      viewMode={viewMode}
      selectedYear={selectedYear}
      onViewModeChange={setViewMode}
      onYearChange={setSelectedYear}
    />
  ) : (
    <DesktopView
      energyData={energyData}
      viewMode={viewMode}
      selectedYear={selectedYear}
      onViewModeChange={setViewMode}
      onYearChange={setSelectedYear}
    />
  )
}

export default TotalChart