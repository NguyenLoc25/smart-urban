"use client";

import dynamic from 'next/dynamic';
import ChartContainer from './ChartContainer';
import LoadingState from './states/LoadingState';
import ErrorState from './states/ErrorState';
import EmptyState from './states/EmptyState';

const ResultChart = ({ cityName = "Hồ Chí Minh" }) => {
  return (
    <ChartContainer cityName={cityName}>
      {({ loading, error, chartData, isMobile }) => {
        if (loading) return <LoadingState />;
        if (error) return <ErrorState error={error} />;
        if (!chartData.dailyData.length) return <EmptyState />;
        
        const ViewComponent = dynamic(() => 
          import(`./views/${isMobile ? 'MobileView' : 'DesktopView'}`), 
          { 
            loading: () => <LoadingState />,
            ssr: false
          }
        );
        
        return (
          <ViewComponent 
            isMobile={isMobile} // Đảm bảo truyền prop isMobile xuống
            chartData={chartData}
            cityName={cityName}
          />
        );
      }}
    </ChartContainer>
  );
};

export default ResultChart;