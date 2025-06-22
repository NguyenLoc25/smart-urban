"use client";

import dynamic from 'next/dynamic';
import { chartLayout, chartConfig } from '../constants/chartConstants';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const MonthlyChart = ({ data }) => {
  if (!data || !data.length) return null;

  // Chỉ lấy 12 tháng gần nhất
  const recentData = data.slice(-12);
  
  // Chỉ lấy số tháng (bỏ năm nếu có)
  const months = recentData.map(item => {
    // Giả sử item.month có dạng "MM/YYYY" hoặc "Tháng X"
    const monthOnly = item.month.split('/')[0]; // Lấy phần trước dấu /
    return monthOnly.replace('thg', 'Tháng'); // Chuyển "tthg1" thành "Tháng 1"
  });
  
  const values = recentData.map(item => (item.sum / 1000000).toFixed(1));

  return (
    <div className="overflow-x-auto">
      <Plot
        data={[{
          x: months,
          y: values,
          type: 'bar',
          marker: { 
            color: recentData.map(item => 
              item.sum > 1000000 ? '#ef4444' : '#f97316'
            ),
            line: { width: 0 }
          },
          text: values.map(v => `${v}GWh`),
          textposition: 'auto',
          textfont: { size: 10, color: '#fff' },
          hovertemplate: '<b>%{x}</b><br>Sản lượng: %{y} GWh<extra></extra>'
        }]}
        layout={{
          ...chartLayout,
          xaxis: {
            ...chartLayout.xaxis,
            fixedrange: false,
            // Thêm cấu hình để đảm bảo chỉ hiển thị tháng
            tickformat: '%B', // Định dạng chỉ hiển thị tên tháng
            type: 'category' // Xác định đây là dữ liệu phân loại
          },
          yaxis: {
            ...chartLayout.yaxis,
            fixedrange: true,
            title: { text: 'GWh' }
          },
          margin: { l: 50, r: 20, b: 80, t: 20 },
          bargap: 0.2
        }}
        config={{
          ...chartConfig,
          responsive: true
        }}
        style={{ 
          width: `${months.length * 50}px`,
          minWidth: '100%',
          height: '300px'
        }}
      />
    </div>
  );
};

export default MonthlyChart;