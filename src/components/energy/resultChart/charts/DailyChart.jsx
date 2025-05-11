"use client";

import dynamic from 'next/dynamic';
import { chartLayout, chartConfig } from '../constants/chartConstants';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const DailyChart = ({ data }) => {
  if (!data || !data.length) return null;

  return (
    <Plot
      data={[{
        x: data.map(entry => `${entry.day}/${entry.month}`),
        y: data.map(entry => entry.production / 1000000),
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#ef4444', width: 3, shape: 'spline' },
        marker: { size: 8, color: '#ef4444' },
        hovertemplate: '<b>Ngày %{x}</b><br>%{y:,.3f} GWh<extra></extra>',
        fill: 'tozeroy',
        fillcolor: 'rgba(239, 68, 68, 0.1)'
      }]}
      layout={{
        ...chartLayout,
        xaxis: { 
          ...chartLayout.xaxis,
          range: [data.length - 7.5, data.length - 0.5],
          title: {
            text: 'Ngày',
            font: { size: 12 }
          },
        },
        yaxis: { 
          ...chartLayout.yaxis,
          title: {
            text: 'Sản lượng (GWh)',
            font: { size: 12 }
          }
        }
      }}
      config={chartConfig}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default DailyChart;