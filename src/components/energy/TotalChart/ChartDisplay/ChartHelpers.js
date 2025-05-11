import { useState, useEffect, useCallback } from 'react';
import { getYAxisConfig, getDisplayUnit, convertDataUnit } from './ChartConfig';

export const useChartData = (energyData, isMobile, Plot) => {
  const [viewMode, setViewMode] = useState('yearly');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
  const [initialRange, setInitialRange] = useState(null);

  const allYears = [...new Set(
    energyData?.monthly?.map(item => item.year) || []
  )].sort((a, b) => a - b);

  useEffect(() => {
    setIsLoading(true);
    let data = [];
    
    if (viewMode === 'yearly') {
      data = Array.isArray(energyData?.yearly) ? energyData.yearly : [];
      setInitialRange(isMobile ? [2020, 2023] : null);
    } else if (viewMode === 'monthly') {
      data = Array.isArray(energyData?.monthly) 
        ? energyData.monthly.filter(item => item.year === selectedYear) 
        : [];
      setInitialRange(null);
    } else if (viewMode === 'hourly') {
      data = Array.isArray(energyData?.hourly) ? energyData.hourly : [];
      setInitialRange(isMobile ? [0, 3] : null);
    }
    
    setSelectedData(data);
    setTimeout(() => setIsLoading(false), 300);
  }, [viewMode, energyData, selectedYear, isMobile]);

  const renderChart = useCallback(() => {
    if (!Plot || !selectedData.length) return null;
    
    const yAxisConfig = getYAxisConfig(viewMode);
    const displayUnit = getDisplayUnit(viewMode);
    
    return (
      <Plot
        data={[
          // Wind energy trace
          {
            x: selectedData.map(item => item[viewMode === 'yearly' ? 'year' : viewMode === 'monthly' ? 'month' : 'hour']),
            y: selectedData.map(item => convertDataUnit(item.wind, viewMode)),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Điện gió',
            line: { color: '#10b981', width: isMobile ? 2 : 3, shape: 'spline' },
            marker: { size: isMobile ? 6 : 10, color: '#10b981', symbol: 'circle' },
            hovertemplate: getHoverTemplate(viewMode, yAxisConfig.hoverformat, displayUnit),
            fill: 'tozeroy',
            fillcolor: 'rgba(16, 185, 129, 0.15)'
          },
          // Solar energy trace
          {
            x: selectedData.map(item => item[viewMode === 'yearly' ? 'year' : viewMode === 'monthly' ? 'month' : 'hour']),
            y: selectedData.map(item => convertDataUnit(item.solar, viewMode)),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Điện mặt trời',
            line: { color: '#f59e0b', width: isMobile ? 2 : 3, shape: 'spline' },
            marker: { size: isMobile ? 6 : 10, color: '#f59e0b', symbol: 'diamond' },
            hovertemplate: getHoverTemplate(viewMode, yAxisConfig.hoverformat, displayUnit),
            fill: 'tozeroy',
            fillcolor: 'rgba(245, 158, 11, 0.15)'
          },
          // Hydro energy trace
          {
            x: selectedData.map(item => item[viewMode === 'yearly' ? 'year' : viewMode === 'monthly' ? 'month' : 'hour']),
            y: selectedData.map(item => convertDataUnit(item.hydro, viewMode)),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Thủy điện',
            line: { color: '#3b82f6', width: isMobile ? 2 : 3, shape: 'spline' },
            marker: { size: isMobile ? 6 : 10, color: '#3b82f6', symbol: 'square' },
            hovertemplate: getHoverTemplate(viewMode, yAxisConfig.hoverformat, displayUnit),
            fill: 'tozeroy',
            fillcolor: 'rgba(59, 130, 246, 0.1)'
          }
        ]}
        layout={getLayoutConfig(viewMode, isMobile, initialRange, selectedYear, yAxisConfig)}
        config={getPlotConfig(isMobile)}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    );
  }, [Plot, selectedData, viewMode, isMobile, initialRange, selectedYear]);

  return {
    viewMode,
    setViewMode,
    selectedYear,
    setSelectedYear,
    isLoading,
    selectedData,
    allYears,
    renderChart
  };
};

// Helper functions
const getHoverTemplate = (viewMode, format, unit) => 
  `<b>${viewMode === 'yearly' ? 'Năm %{x}' : viewMode === 'monthly' ? 'Tháng %{x}' : 'Giờ %{x}'}</b><br>%{y:${format}} ${unit}<extra></extra>`;

const getLayoutConfig = (viewMode, isMobile, initialRange, selectedYear, yAxisConfig) => ({
  xaxis: { 
    ...(isMobile && initialRange ? { range: initialRange, autorange: false } : {}),
    title: {
      text: viewMode === 'yearly' ? 'Năm' : viewMode === 'monthly' ? `Tháng (Năm ${selectedYear})` : 'Giờ',
      font: { 
        size: isMobile ? 12 : 14, 
        color: '#4b5563', 
        family: 'Inter, sans-serif' 
      }
    },
    gridcolor: '#e5e7eb',
    linecolor: '#e5e7eb',
    tickfont: { 
      size: isMobile ? 10 : 12,
      color: '#4b5563', 
      family: 'Inter, sans-serif' 
    },
    showgrid: true,
    zerolinecolor: '#e5e7eb'
  },
  yaxis: { 
    title: {
      text: yAxisConfig.title,
      font: { 
        size: isMobile ? 12 : 14, 
        color: '#4b5563', 
        family: 'Inter, sans-serif' 
      }
    },
    gridcolor: '#e5e7eb',
    linecolor: '#e5e7eb',
    tickformat: yAxisConfig.tickformat,
    tickfont: { 
      size: isMobile ? 10 : 12,
      color: '#4b5563', 
      family: 'Inter, sans-serif' 
    },
    rangemode: 'tozero',
    zerolinecolor: '#e5e7eb'
  },
  legend: { 
    orientation: 'h',
    y: isMobile ? -0.3 : -0.25,
    x: 0.5,
    xanchor: 'center',
    font: { 
      size: isMobile ? 10 : 12, 
      family: 'Inter, sans-serif', 
      color: '#1f2937' 
    },
    bgcolor: 'rgba(255,255,255,0.9)',
    bordercolor: '#e5e7eb',
    borderwidth: 1
  },
  plot_bgcolor: 'rgba(0,0,0,0)',
  paper_bgcolor: 'rgba(0,0,0,0)',
  margin: { 
    t: isMobile ? 20 : 30, 
    l: isMobile ? 50 : 60, 
    r: isMobile ? 20 : 30, 
    b: isMobile ? 70 : 80 
  },
  hoverlabel: {
    bgcolor: '#1f2937',
    font: { 
      color: 'white', 
      size: isMobile ? 10 : 12, 
      family: 'Inter, sans-serif' 
    },
    bordercolor: '#1f2937'
  },
  transition: {
    duration: 300,
    easing: 'cubic-in-out'
  },
  font: {
    family: 'Inter, sans-serif'
  }
});

const getPlotConfig = (isMobile) => ({
  responsive: true, 
  displayModeBar: true,
  scrollZoom: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
  modeBarButtonsToAdd: isMobile ? [] : [
    {
      name: 'Toggle Dark Mode',
      icon: {
        width: 1000,
        height: 1000,
        path: 'M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z',
        transform: 'matrix(1 0 0 -1 0 1000)'
      },
      click: function(gd) {
        // Function to toggle dark mode
      }
    }
  ]
});