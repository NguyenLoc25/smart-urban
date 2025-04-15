"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const ResultChart = ({ cityName = "Hồ Chí Minh" }) => {
  const [chartData, setChartData] = useState({
    dailyData: [],
    monthlySum: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    // Kiểm tra kích thước màn hình
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/energy/city');
        
        if (!response.ok) {
          throw new Error(`Lỗi khi tải dữ liệu: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success || !result.data) {
          throw new Error('Dữ liệu từ API không hợp lệ');
        }

        const firebaseData = result.data;
        const entries = Object.keys(firebaseData).map(uuid => {
          const entry = firebaseData[uuid];
          return {
            uuid,
            day: entry.day,
            month: entry.month,
            year: entry.year,
            production: entry.production,
            date: new Date(entry.year, entry.month - 1, entry.day)
          };
        });

        const validEntries = entries.filter(entry => 
          !isNaN(entry.date.getTime()) && 
          typeof entry.production === 'number' &&
          entry.production > 0
        ).sort((a, b) => a.date - b.date);

        if (validEntries.length === 0) {
          throw new Error('Không có dữ liệu hợp lệ');
        }

        setChartData({
          dailyData: validEntries,
          monthlySum: calculateMonthlySum(validEntries)
        });

      } catch (err) {
        console.error('Lỗi khi xử lý dữ liệu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMonthlySum = (entries) => {
    const monthlyGroups = {};
    
    entries.forEach(entry => {
      const monthKey = `${entry.year}-${entry.month}`;
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = {
          sum: 0,
          count: 0,
          monthName: new Date(entry.year, entry.month - 1).toLocaleString('vi-VN', { 
            month: 'short', 
            year: 'numeric' 
          })
        };
      }
      
      monthlyGroups[monthKey].sum += entry.production;
      monthlyGroups[monthKey].count += 1;
    });

    return Object.values(monthlyGroups).map(group => ({
      month: group.monthName,
      sum: group.sum
    }));
  };


  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-600">Đang tải dữ liệu...</p>
    </div>
  );

  const renderError = () => (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl shadow-sm border border-red-100">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-red-500 mt-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-red-800">Đã xảy ra lỗi</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
            <p className="mt-2">Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNoData = () => (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl shadow-sm border border-blue-100">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-blue-500 mt-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-blue-800">Không có dữ liệu</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Không tìm thấy dữ liệu tiêu thụ điện để hiển thị.</p>
            <p className="mt-2">Vui lòng kiểm tra lại sau hoặc thêm dữ liệu mới.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="bg-white min-h-screen px-4 py-6">
      {/* Compact header for mobile */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl shadow-md mb-6 p-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Phân tích điện
            </h1>
            <p className="mt-1 text-sm text-white opacity-90 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {cityName}
            </p>
          </div>
          <div className="bg-white/20 rounded-md px-2 py-1 text-white">
            {new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>
  
      {/* Tab buttons - full width on mobile */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 px-3 py-2 rounded-lg font-medium flex items-center justify-center text-sm ${
            activeTab === 'daily' 
              ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Ngày
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 px-3 py-2 rounded-lg font-medium flex items-center justify-center text-sm ${
            activeTab === 'monthly' 
              ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Tháng
        </button>
      </div>
  
      {/* Chart container with responsive height */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {activeTab === 'daily' ? 'Tiêu thụ theo ngày' : 'Trung bình tháng'}
        </h2>
        <div className="relative" style={{ height: '300px' }}>
          {activeTab === 'daily' ? (
            <Plot
              data={[{
                x: chartData.dailyData.map(entry => `${entry.day}/${entry.month}`),
                y: chartData.dailyData.map(entry => entry.production / 1000000),
                type: 'scatter',
                mode: 'lines+markers',
                line: { color: '#ef4444', width: 2, shape: 'spline' },
                marker: { size: 6, color: '#ef4444' },
                hovertemplate: '<b>Ngày %{x}</b><br>%{y:,.3f} GWh<extra></extra>',
                fill: 'tozeroy',
                fillcolor: 'rgba(239, 68, 68, 0.1)'
              }]}
              layout={{
                margin: { t: 10, b: 60, l: 50, r: 20 },
                xaxis: { 
                  tickangle: 0,
                  tickfont: { size: 10 },
                  automargin: true,
                  gridcolor: '#f3f4f6'
                },
                yaxis: { 
                  tickfont: { size: 10 },
                  gridcolor: '#f3f4f6'
                },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                hoverlabel: {
                  bgcolor: '#000000',
                  font: { 
                    size: 11,
                    color: '#ffffff'
                  }
                }
              }}
              config={{ 
                responsive: true,
                displayModeBar: false
              }}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Plot
              data={[{
                x: chartData.monthlySum.map(item => item.month),
                y: chartData.monthlySum.map(item => item.sum / 1000000),
                type: 'bar',
                marker: { 
                  color: chartData.monthlySum.map(item => 
                    item.sum > 1000000 ? '#ef4444' : '#f97316'
                  ),
                  line: { width: 1, color: 'rgba(0,0,0,0.1)' }
                },
                hovertemplate: '<b>Tháng %{x}</b><br>TB: %{y:,.3f} GWh<extra></extra>'
              }]}
              layout={{
                margin: { t: 10, b: 60, l: 50, r: 20 },
                xaxis: { 
                  tickangle: 0,
                  tickfont: { size: 10 },
                  automargin: true,
                  gridcolor: '#f3f4f6'
                },
                yaxis: { 
                  tickfont: { size: 10 },
                  gridcolor: '#f3f4f6'
                },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                hoverlabel: {
                  bgcolor: '#000000',
                  font: { 
                    size: 11,
                    color: '#ffffff'
                  }
                }
              }}
              config={{ 
                responsive: true,
                displayModeBar: false
              }}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </div>
      </div>
  
      {/* Stats cards in vertical layout */}
      <div className="space-y-4">
        {/* Total production card */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-md p-5 text-white">
          <h3 className="font-medium text-base mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Tổng sản lượng
          </h3>
          <div className="text-2xl font-bold mb-1">
            {(chartData.dailyData.reduce((sum, day) => sum + day.production, 0) / 1000000).toFixed(2)} GWh
          </div>
          <div className="text-xs opacity-90">
            Tương đương {calculateEquivalent()} hộ gia đình
          </div>
        </div>
  
        {/* System overview card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <h3 className="font-medium text-base text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Tổng quan hệ thống
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">
                Số ngày có dữ liệu
              </span>
              <span className="font-medium text-gray-900">
                {chartData.dailyData.length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">
                Tháng gần nhất
              </span>
              <span className="font-medium text-gray-900">
                {chartData.monthlySum[chartData.monthlySum.length - 1]?.month || 'N/A'}
              </span>
            </div>
          </div>
        </div>
  
        {/* Consumption stats card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
          <h3 className="font-medium text-base text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Thống kê tiêu thụ
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">
                Cao nhất
              </span>
              <div className="flex items-center">
                <span className="font-medium text-green-600 mr-1">
                  {(Math.max(...chartData.dailyData.map(d => d.production)) / 1000)}
                </span>
                <span className="text-xs text-gray-500">kWh</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">
                Thấp nhất
              </span>
              <div className="flex items-center">
                <span className="font-medium text-red-600 mr-1">
                  {(Math.min(...chartData.dailyData.map(d => d.production)) / 1000)}
                </span>
                <span className="text-xs text-gray-500">kWh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesktopView = () => (
    //bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced header with better spacing and icon */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Phân tích tiêu thụ điện
              </h1>
              <p className="mt-2 text-lg opacity-90 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Thành phố {cityName}
              </p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2 text-sm">
              Cập nhật: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </div>
  
      {/* Main content grid with better spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart panel - wider on desktop */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'daily' ? 'Biểu đồ tiêu thụ theo ngày' : 'Biểu đồ trung bình tháng'}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all ${
                  activeTab === 'daily' 
                    ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Ngày
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all ${
                  activeTab === 'monthly' 
                    ? 'bg-blue-50 text-blue-600 shadow-inner border border-blue-100' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Tháng
              </button>
            </div>
          </div>
          
          {/* Chart container with responsive height */}
          <div className="relative" style={{ height: '500px' }}>
  {activeTab === 'daily' ? (
    <Plot
      data={[{
        // Giữ nguyên toàn bộ dữ liệu nhưng chỉ hiển thị 7 ngày cuối
        x: chartData.dailyData.map(entry => `${entry.day}/${entry.month}`),
        y: chartData.dailyData.map(entry => entry.production / 1000000),
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#ef4444', width: 3, shape: 'spline' },
        marker: { size: 8, color: '#ef4444' },
        hovertemplate: '<b>Ngày %{x}</b><br>%{y:,.3f} GWh<extra></extra>',
        fill: 'tozeroy',
        fillcolor: 'rgba(239, 68, 68, 0.1)'
      }]}
      layout={{
        margin: { t: 20, b: 80, l: 60, r: 40 },
        xaxis: { 
          tickangle: 0,
          tickfont: { size: 11 },
          automargin: true,
          gridcolor: '#f3f4f6',
          title: {
            text: 'Ngày',
            font: { size: 12 }
          },
          // Chỉ hiển thị 7 ngày cuối cùng
          range: [chartData.dailyData.length - 7.5, chartData.dailyData.length - 0.5],
          // Nhưng vẫn giữ toàn bộ dữ liệu để có thể hover xem
          autorange: false,
          fixedrange: false
        },
        yaxis: { 
          tickfont: { size: 11 },
          gridcolor: '#f3f4f6',
          title: {
            text: 'Sản lượng (GWh)',
            font: { size: 12 }
          }
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        hoverlabel: {
          bgcolor: '#000000',
          font: { 
            size: 12,
            color: '#ffffff'
          },
          bordercolor: '#000000'
        }
      }}
      config={{ 
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'hoverCompareCartesian', 'hoverClosestCartesian'],
        modeBarButtonsToAdd: [{ 
          name: 'Tải xuống',
          icon: { 
            'width': 500,
            'height': 500,
            'path': 'M450 0H50C22.4 0 0 22.4 0 50v400c0 27.6 22.4 50 50 50h400c27.6 0 50-22.4 50-50V50c0-27.6-22.4-50-50-50zM238.4 409.6c0 11.2-9.6 20.8-20.8 20.8s-20.8-9.6-20.8-20.8V256l-68.8 68.8c-4 4-9.6 6.4-14.4 6.4s-10.4-2.4-14.4-6.4c-8.8-8.8-8.8-22.4 0-31.2l96-96c8.8-8.8 22.4-8.8 31.2 0l96 96c8.8 8.8 8.8 22.4 0 31.2-8.8 8.8-22.4 8.8-31.2 0l-68.8-68.8v153.6z',
            'transform': 'matrix(1 0 0 -1 0 500)'
          },
          click: function(gd) { 
            Plotly.downloadImage(gd, {format: 'png', width: 800, height: 600, filename: 'bieu-do-san-luong-dien'});
          }
        }]
      }}
      style={{ width: '100%', height: '100%' }}
    />
  ) : (
    <Plot
      data={[{
        x: chartData.monthlySum.map(item => item.month),
        y: chartData.monthlySum.map(item => item.sum / 1000000),
        type: 'bar',
        marker: { 
          color: chartData.monthlySum.map(item => 
            item.sum > 1000000 ? '#ef4444' : '#f97316'
          ),
          line: { width: 1, color: 'rgba(0,0,0,0.1)' }
        },
        hovertemplate: '<b>Tháng %{x}</b><br>TB: %{y:,.3f} GWh<extra></extra>',
        text: chartData.monthlySum.map(item => (item.sum/1000000).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' GWh'),
        textposition: 'auto'
      }]}
      layout={{
        margin: { t: 20, b: 80, l: 60, r: 40 },
        xaxis: { 
          tickangle: 0,
          tickfont: { size: 11 },
          automargin: true,
          gridcolor: '#f3f4f6',
          title: {
            text: 'Tháng',
            font: { size: 12 }
          }
        },
        yaxis: { 
          tickfont: { size: 11 },
          gridcolor: '#f3f4f6',
          title: {
            text: 'Sản lượng trung bình (GWh)',
            font: { size: 12 }
          },
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        hoverlabel: {
          bgcolor: '#000000',
          font: { 
            size: 12,
            color: '#ffffff'
          },
          bordercolor: '#000000'
        },
        uniformtext: {
          minsize: 10,
          mode: 'hide'
        }
      }}
      config={{ 
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'hoverCompareCartesian', 'hoverClosestCartesian'],
        modeBarButtonsToAdd: [{ 
          name: 'Tải xuống',
          icon: { 
            'width': 500,
            'height': 500,
            'path': 'M450 0H50C22.4 0 0 22.4 0 50v400c0 27.6 22.4 50 50 50h400c27.6 0 50-22.4 50-50V50c0-27.6-22.4-50-50-50zM238.4 409.6c0 11.2-9.6 20.8-20.8 20.8s-20.8-9.6-20.8-20.8V256l-68.8 68.8c-4 4-9.6 6.4-14.4 6.4s-10.4-2.4-14.4-6.4c-8.8-8.8-8.8-22.4 0-31.2l96-96c8.8-8.8 22.4-8.8 31.2 0l96 96c8.8 8.8 8.8 22.4 0 31.2-8.8 8.8-22.4 8.8-31.2 0l-68.8-68.8v153.6z',
            'transform': 'matrix(1 0 0 -1 0 500)'
          },
          click: function(gd) { 
            Plotly.downloadImage(gd, {format: 'png', width: 800, height: 600, filename: 'bieu-do-san-luong-dien'});
          }
        }]
      }}
      style={{ width: '100%', height: '100%' }}
    />
  )}
</div>
        </div>
  
        {/* Stats panel with improved visual hierarchy */}
        <div className="space-y-6">

          {/* Additional summary card */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Tổng sản lượng
            </h3>
            <div className="text-3xl font-bold mb-2">
              {chartData.dailyData.reduce((sum, day) => sum + day.production, 0).toLocaleString()} kWh
            </div>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Tương đương {calculateEquivalent()} hộ gia đình</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-5 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Tổng quan hệ thống
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Số ngày có dữ liệu
                </span>
                <span className="font-medium text-gray-900 text-lg">
                  {chartData.dailyData.length}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Tháng gần nhất
                </span>
                <span className="font-medium text-gray-900 text-lg">
                  {chartData.monthlySum[chartData.monthlySum.length - 1]?.month || 'N/A'}
                </span>
              </div>
            </div>
          </div>
  
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-5 flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Thống kê tiêu thụ
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Sản lượng cao nhất
                </span>
                <div className="flex items-center">
                  <span className="font-medium text-green-600 text-lg mr-2">
                    {Math.max(...chartData.dailyData.map(d => d.production)).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">kWh</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Sản lượng thấp nhất
                </span>
                <div className="flex items-center">
                  <span className="font-medium text-red-600 text-lg mr-2">
                    {Math.min(...chartData.dailyData.map(d => d.production)).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">kWh</span>
                </div>
              </div>
            </div>
          </div>
  
          
        </div>
      </div>
    </div>
  );
  
  // Helper function to calculate equivalent households
  const calculateEquivalent = () => {
    const totalConsumption = chartData.dailyData.reduce((sum, day) => sum + day.production, 0);
    // sum household consumption of 300 kWh/month
    return Math.round(totalConsumption / (300 * (chartData.monthlySum.length || 1)));
  };

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!chartData.dailyData.length) return renderNoData();

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default ResultChart;