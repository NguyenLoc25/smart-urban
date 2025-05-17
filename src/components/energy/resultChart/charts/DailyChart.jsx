"use client";

import dynamic from 'next/dynamic';
import { chartLayout, chartConfig } from '../constants/chartConstants';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const DailyChart = ({ data }) => {
  if (!data || !data.length) return null;

  // Số lượng điểm dữ liệu hiển thị ban đầu
  const initialDisplayCount = 3;
  const allDates = data.map(entry => `${entry.day}/${entry.month}`);
  
  return (
    <Plot
      data={[{
        x: allDates,
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
        uirevision: true, // giữ trạng thái tương tác
        xaxis: { 
          ...chartLayout.xaxis,
          range: [allDates.length - initialDisplayCount, allDates.length - 1],
          autorange: false,
          title: { text: 'Ngày', font: { size: 12 } },
          showline: false,       // Hiển thị đường viền trục x
          showgrid: true,     // Ẩn đường lưới theo trục x
          linecolor: '#e5e7eb', // Màu đường viền trục x
          linewidth: 1,         // Độ dày đường viền
          mirror: true,        // Hiển thị đường viền ở cả phía trên
        },
        yaxis: { 
          ...chartLayout.yaxis,
          title: { text: 'Sản lượng (GWh)', font: { size: 12 } },
          showline: true,       // Hiển thị đường viền trục y
          linecolor: '#e5e7eb', // Màu đường viền trục y
          linewidth: 1,         // Độ dày đường viền
          mirror: true,        // Hiển thị đường viền ở cả phía phải
        },
        margin: { l: 50, r: 20, b: 60, t: 30, pad: 5 },
      }}
      config={{
        ...chartConfig,
        responsive: true,
        scrollZoom: true
      }}
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '300px'
      }}
      useResizeHandler={true}
    />
  );
};

export default DailyChart;