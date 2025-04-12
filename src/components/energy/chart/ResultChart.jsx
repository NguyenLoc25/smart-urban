"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const ResultChart = ({ cityName = "Hồ Chí Minh" }) => {
  const [chartData, setChartData] = useState({
    dailyData: [],
    monthlyAverages: []
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
          monthlyAverages: calculateMonthlyAverages(validEntries)
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

  const calculateMonthlyAverages = (entries) => {
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
      average: Math.round(group.sum / group.count)
    }));
  };

  const renderMobileView = () => (
    <div className="px-4 py-6">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl p-4 text-white mb-6">
        <h1 className="text-xl font-bold">Tiêu thụ điện - TP. {cityName}</h1>
        <p className="text-sm opacity-90 mt-1">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'daily' 
              ? 'bg-blue-100 text-blue-600 shadow-inner' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Theo ngày
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'monthly' 
              ? 'bg-blue-100 text-blue-600 shadow-inner' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Theo tháng
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap ${
            activeTab === 'stats' 
              ? 'bg-blue-100 text-blue-600 shadow-inner' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Thống kê
        </button>
      </div>

      {activeTab === 'daily' && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h3 className="font-medium mb-3">Tiêu thụ theo ngày</h3>
          <div style={{ height: '300px' }}>
            <Plot
              data={[{
                x: chartData.dailyData.map(entry => 
                  `${entry.day}/${entry.month}`
                ),
                y: chartData.dailyData.map(entry => entry.production),
                type: 'scatter',
                mode: 'lines+markers',
                line: { color: '#3b82f6', width: 2 },
                marker: { size: 6, color: '#3b82f6' },
                hovertemplate: '%{x}<br>%{y:,.0f} kWh<extra></extra>'
              }]}
              layout={{
                margin: { t: 0, b: 40, l: 40, r: 20 },
                xaxis: { 
                  tickangle: -45,
                  tickfont: { size: 10 }
                },
                yaxis: { 
                  tickformat: ',.0f',
                  tickfont: { size: 10 }
                }
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h3 className="font-medium mb-3">Trung bình tháng</h3>
          <div style={{ height: '300px' }}>
            <Plot
              data={[{
                x: chartData.monthlyAverages.map(item => item.month),
                y: chartData.monthlyAverages.map(item => item.average),
                type: 'bar',
                marker: { color: '#10b981' },
                hovertemplate: '%{x}<br>TB: %{y:,.0f} kWh<extra></extra>'
              }]}
              layout={{
                margin: { t: 0, b: 80, l: 40, r: 20 },
                xaxis: { 
                  tickangle: -45,
                  tickfont: { size: 10 }
                },
                yaxis: { 
                  tickformat: ',.0f',
                  tickfont: { size: 10 }
                }
              }}
              config={{ responsive: true, displayModeBar: false }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-medium mb-3">Tổng quan</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Số ngày dữ liệu</span>
                <span className="font-medium">{chartData.dailyData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tháng gần nhất</span>
                <span className="font-medium">
                  {chartData.monthlyAverages[chartData.monthlyAverages.length - 1]?.month || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-medium mb-3">Thống kê</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cao nhất</span>
                <span className="font-medium text-green-600">
                  {Math.max(...chartData.dailyData.map(d => d.production)).toLocaleString()} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thấp nhất</span>
                <span className="font-medium text-red-600">
                  {Math.min(...chartData.dailyData.map(d => d.production)).toLocaleString()} kWh
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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

  const renderDailyChart = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Biểu đồ sản lượng theo ngày</h3>
        <div className="text-sm text-gray-500">
          Tổng {chartData.dailyData.length} ngày có dữ liệu
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Plot
          data={[{
            x: chartData.dailyData.map(entry => 
              `${entry.day.toString().padStart(2, '0')}/${entry.month.toString().padStart(2, '0')}`
            ),
            y: chartData.dailyData.map(entry => entry.production),
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#3b82f6', width: 2, shape: 'spline' },
            marker: { size: 8, color: '#3b82f6' },
            hovertemplate: '<b>%{x}</b><br>Sản lượng: %{y:,.0f} kWh<extra></extra>',
            fill: 'tozeroy',
            fillcolor: 'rgba(59, 130, 246, 0.1)',
            name: 'Sản lượng điện'
          }]}
          layout={{
            margin: { t: 30, b: 60, l: 60, r: 30 }, // Tăng margin để tránh bị cắt
            xaxis: { 
              title: 'Ngày/Tháng', // Thêm tiêu đề trục x
              gridcolor: '#f3f4f6',
              linecolor: '#e5e7eb',
              tickangle: -45,
              titlefont: { size: 12 }
            },
            yaxis: { 
              title: 'Sản lượng (kWh)', // Thêm tiêu đề trục y
              gridcolor: '#f3f4f6',
              linecolor: '#e5e7eb',
              tickformat: ',.0f',
              titlefont: { size: 12 },
              automargin: true // Tự động điều chỉnh margin
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            hoverlabel: {
              bgcolor: '#1e3a8a',
              font: { color: 'white' }
            },
            legend: {
              orientation: 'h',
              y: -0.2, // Đặt chú thích bên dưới biểu đồ
              x: 0.5,
              xanchor: 'center'
            },
            showlegend: true // Hiển thị chú thích
          }}
          config={{ 
            responsive: true, 
            displayModeBar: false,
            scrollZoom: true
          }}
          style={{ width: '100%', height: '400px' }} // Tăng chiều cao
        />
      </div>
    </div>
  );
  
  const renderMonthlyChart = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Biểu đồ sản lượng trung bình theo tháng</h3>
        <div className="text-sm text-gray-500">
          {chartData.monthlyAverages.length} tháng có dữ liệu
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Plot
          data={[{
            x: chartData.monthlyAverages.map(item => `Tháng ${item.month}`),
            y: chartData.monthlyAverages.map(item => item.average),
            type: 'bar',
            marker: { 
              color: '#10b981',
              line: { width: 1, color: '#047857' }
            },
            hovertemplate: '<b>%{x}</b><br>Trung bình: %{y:,.0f} kWh<extra></extra>',
            name: 'Sản lượng TB' // Thêm chú thích
          }]}
          layout={{
            margin: { t: 30, b: 60, l: 60, r: 30 }, // Tăng margin
            xaxis: { 
              title: 'Tháng', // Thêm tiêu đề trục x
              gridcolor: '#f3f4f6',
              linecolor: '#e5e7eb',
              titlefont: { size: 12 }
            },
            yaxis: { 
              title: 'Sản lượng trung bình (kWh)', // Thêm tiêu đề trục y
              gridcolor: '#f3f4f6',
              linecolor: '#e5e7eb',
              tickformat: ',.0f',
              titlefont: { size: 12 },
              automargin: true
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            hoverlabel: {
              bgcolor: '#065f46',
              font: { color: 'white' }
            },
            legend: {
              orientation: 'h',
              y: -0.2,
              x: 0.5,
              xanchor: 'center'
            },
            showlegend: true,
            barmode: 'group'
          }}
          config={{ 
            responsive: true, 
            displayModeBar: false,
            scrollZoom: true
          }}
          style={{ width: '100%', height: '480px' }} // Tăng chiều cao
        />
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">
            Phân tích tiêu thụ điện
          </h1>
          <p className="mt-2 opacity-90">
            Thành phố {cityName} • Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
  <div className="flex space-x-4 border-b border-gray-100 pb-4 mb-6">
    <button
      onClick={() => setActiveTab('daily')}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === 'daily' 
          ? 'bg-blue-50 text-blue-600 shadow-inner' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      Theo ngày
    </button>
    <button
      onClick={() => setActiveTab('monthly')}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === 'monthly' 
          ? 'bg-blue-50 text-blue-600 shadow-inner' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      Theo tháng
    </button>
  </div>
  
  {/* Thêm wrapper div với padding và margin phù hợp */}
  <div className="relative" style={{ 
    width: '100%',
    height: '480px', // Tăng chiều cao
    paddingLeft: '50px', // Thêm padding trái cho trục y
    paddingRight: '20px' // Thêm padding phải
  }}>
    {activeTab === 'daily' ? renderDailyChart() : renderMonthlyChart()}
  </div>
</div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Tổng quan</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Số ngày có dữ liệu</span>
                <span className="font-medium">{chartData.dailyData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tháng gần nhất</span>
                <span className="font-medium">
                  {chartData.monthlyAverages[chartData.monthlyAverages.length - 1]?.month || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Thống kê</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Sản lượng cao nhất</span>
                <span className="font-medium text-green-600">
                  {Math.max(...chartData.dailyData.map(d => d.production)).toLocaleString()} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sản lượng thấp nhất</span>
                <span className="font-medium text-red-600">
                  {Math.min(...chartData.dailyData.map(d => d.production)).toLocaleString()} kWh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!chartData.dailyData.length) return renderNoData();

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default ResultChart;