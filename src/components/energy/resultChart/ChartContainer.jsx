"use client";

import { useState, useEffect, useCallback } from 'react';
import { calculateMonthlySum } from './utils/dataUtils';
import useResponsive from './hooks/useResponsive';

const ChartContainer = ({ children }) => {
  const [chartData, setChartData] = useState({
    dailyData: [],
    monthlySum: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useResponsive();

  // Memoized data processing function
  const processFirebaseData = useCallback((firebaseData) => {
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
  }, []);

  // Optimized Firebase data sender
  const sendMonthlySumToFirebase = useCallback(async (monthlySumData) => {
    try {
      console.log('Attempting to save monthly data:', monthlySumData);
      
      await Promise.all(
        monthlySumData.map(monthData => {
          const payload = {
            year: monthData.year,
            month: monthData.month,
            totalProduction: monthData.sum
          };
  
          return fetch('/api/energy/totalConsumption', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(result => {
            if (!result.success) {
              console.error(`Failed to save ${monthData.month}/${monthData.year}:`, result);
            }
            return result;
          });
        })
      );
      
      console.log('Save completed');
    } catch (error) {
      console.error('Error sending to Firebase:', error);
    }
  }, []);

  // Main data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/energy/city');
        
        if (!response.ok) {
          throw new Error(`Data load failed: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success || !result.data) {
          throw new Error('Invalid API data');
        }

        const processedData = processFirebaseData(result.data);
        const monthlySum = calculateMonthlySum(processedData);
        
        setChartData({
          dailyData: processedData,
          monthlySum
        });

      } catch (err) {
        console.error('Processing error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [processFirebaseData]);

  // Single source for sending data to Firebase
  useEffect(() => {
    if (chartData.monthlySum.length > 0) {
      sendMonthlySumToFirebase(chartData.monthlySum);
    }
  }, [chartData.monthlySum, sendMonthlySumToFirebase]);

  return children({ 
    loading, 
    error, 
    chartData, 
    isMobile
  });
};

export default ChartContainer;