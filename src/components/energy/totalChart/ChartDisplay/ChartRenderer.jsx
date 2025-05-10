// TotalChart/components/ChartDisplay/ChartRenderer.jsx
import React from 'react';
import dynamic from 'next/dynamic';
import { getYAxisConfig, convertDataUnit, getDisplayUnit, getXAxisKey } from '../helpers';
import { ENERGY_TYPES, CHART_COLORS } from '../types';

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const ChartRenderer = ({ viewMode, selectedData, isMobile, initialRange, selectedYear }) => {
  const yAxisConfig = getYAxisConfig(viewMode);
  const displayUnit = getDisplayUnit(viewMode);
  const xAxisKey = getXAxisKey(viewMode);

  const energyTraces = Object.values(ENERGY_TYPES).map(type => ({
    x: selectedData.map(item => item[xAxisKey]),
    y: selectedData.map(item => convertDataUnit(item[type], viewMode)),
    type: "scatter",
    mode: "lines+markers",
    name: type === ENERGY_TYPES.WIND ? "Điện gió" : 
          type === ENERGY_TYPES.SOLAR ? "Điện mặt trời" : "Thủy điện",
    line: { 
      color: CHART_COLORS[type.toUpperCase()], 
      width: isMobile ? 2 : 3, 
      shape: 'spline' 
    },
    marker: { 
      size: isMobile ? 6 : 10, 
      color: CHART_COLORS[type.toUpperCase()], 
      symbol: type === ENERGY_TYPES.WIND ? 'circle' : 
              type === ENERGY_TYPES.SOLAR ? 'diamond' : 'square' 
    },
    hovertemplate: `<b>${viewMode === "yearly" ? "Năm %{x}" : viewMode === "monthly" ? "Tháng %{x}" : "Giờ %{x}"}</b><br>%{y:${yAxisConfig.hoverformat}} ${displayUnit}<extra></extra>`,
    fill: 'tozeroy',
    fillcolor: `rgba(${parseInt(CHART_COLORS[type.toUpperCase()].slice(1, 3), 16)}, ${parseInt(CHART_COLORS[type.toUpperCase()].slice(3, 5), 16)}, ${parseInt(CHART_COLORS[type.toUpperCase()].slice(5, 7), 16)}, ${type === ENERGY_TYPES.HYDRO ? '0.1' : '0.15'})`
  }));

  return (
    <Plot
      data={energyTraces}
      layout={{
        xaxis: { 
          ...(isMobile && initialRange ? {
            range: initialRange,
            autorange: false
          } : {}),
          title: {
            text: viewMode === "yearly" ? "Năm" : viewMode === "monthly" ? `Tháng (Năm ${selectedYear})` : "Giờ",
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
          orientation: "h",
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
      }}
      config={{ 
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
      }}
      style={{ width: '100%', height: '100%' }}
      useResizeHandler={true}
    />
  );
};

export default ChartRenderer;