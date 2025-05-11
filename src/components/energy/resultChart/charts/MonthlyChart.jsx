"use client";

import dynamic from 'next/dynamic';
import { chartLayout, chartConfig } from '../constants/chartConstants';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const MonthlyChart = ({ data }) => {
  if (!data || !data.length) return null;

  // Chỉ lấy 12 tháng gần nhất để đơn giản
  const recentData = data.slice(-12);
  const months = recentData.map(item => `T${item.month}`);
  const values = recentData.map(item => (item.sum / 1000000).toFixed(1));

  return (
    <div className="overflow-x-auto">
      <Plot
        data={[{
          x: months,
          y: values,
          type: 'bar',
          marker: { 
            color: data.map(item => 
              item.sum > 1000000 ? '#ef4444' : '#f97316'
            ),
            line: { width: 0 } // Bỏ viền cột
          },
          text: values.map(v => `${v}GWh`),
          textposition: 'auto',
          textfont: { size: 10, color: '#fff' }
        }]}
        layout={{
          ...chartLayout,
          xaxis: {
            ...chartLayout.xaxis,
            fixedrange: false, // Cho phép cuộn ngang
            tickangle: -45 // Nghiêng nhãn trục x cho dễ đọc
          },
          yaxis: {
            ...chartLayout.yaxis,
            fixedrange: true, // Cố định trục y
            title: { text: 'GWh' }
          },
          margin: { l: 50, r: 20, b: 80, t: 20 }, // Điều chỉnh lề
          bargap: 0.2 // Khoảng cách giữa các cột
        }}
        config={{
          ...chartConfig,
          displayModeBar: false, // Ẩn thanh công cụ
          responsive: true
        }}
        style={{ 
          width: `${months.length * 50}px`, // Chiều rộng dựa trên số lượng cột
          minWidth: '100%',
          height: '300px'
        }}
      />
    </div>
  );
};

export default MonthlyChart;