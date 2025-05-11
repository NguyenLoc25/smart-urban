"use client";

import dynamic from 'next/dynamic';
import { chartLayout, chartConfig } from '../constants/chartConstants';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const MonthlyChart = ({ data }) => {
  if (!data || !data.length) return null;

  return (
    <Plot
      data={[{
        x: data.map(item => item.month),
        y: data.map(item => item.sum / 1000000),
        type: 'bar',
        marker: { 
          color: data.map(item => 
            item.sum > 1000000 ? '#ef4444' : '#f97316'
          ),
          line: { width: 1, color: 'rgba(0,0,0,0.1)' }
        },
        hovertemplate: '<b>Tháng %{x}</b><br>TB: %{y:,.3f} GWh<extra></extra>',
        text: data.map(item => (item.sum/1000000).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' GWh'),
        textposition: 'auto'
      }]}
      layout={{
        ...chartLayout,
        xaxis: { 
          ...chartLayout.xaxis,
          title: {
            text: 'Tháng',
            font: { size: 12 }
          }
        },
        yaxis: { 
          ...chartLayout.yaxis,
          title: {
            text: 'Sản lượng trung bình (GWh)',
            font: { size: 12 }
          }
        },
        uniformtext: {
          minsize: 10,
          mode: 'hide'
        }
      }}
      config={chartConfig}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default MonthlyChart;