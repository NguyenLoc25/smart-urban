"use client";

import { useState, useEffect } from 'react';
import { calculateMonthlySum } from './utils/dataUtils';
import useResponsive from './hooks/useResponsive';

const ChartContainer = ({ cityName, children }) => {
  const [chartData, setChartData] = useState({
    dailyData: [],
    monthlySum: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useResponsive();

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

        const processedData = processFirebaseData(result.data);
        setChartData({
          dailyData: processedData,
          monthlySum: calculateMonthlySum(processedData)
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

  const processFirebaseData = (firebaseData) => {
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

    return entries.filter(entry => 
      !isNaN(entry.date.getTime()) && 
      typeof entry.production === 'number' &&
      entry.production > 0
    ).sort((a, b) => a.date - b.date);
  };

  return children({ 
    loading, 
    error, 
    chartData, 
    isMobile,
    cityName 
  });
};

export default ChartContainer;