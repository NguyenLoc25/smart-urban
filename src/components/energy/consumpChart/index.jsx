"use client";

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { calculateMonthlySum, calculateEquivalent } from './helpers';
import LoadingState from '@/components/energy/States/LoadingState';
import ErrorState from '@/components/energy/States/ErrorState';
import NoDataState from '@/components/energy/States/NoDataState';
import MobileView from './Views/MobileView';
import DesktopView from './Views/DesktopView';

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

        const processedData = processEnergyData(result.data);
        setChartData(processedData);

      } catch (err) {
        console.error('Lỗi khi xử lý dữ liệu:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processEnergyData = (firebaseData) => {
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

    return {
      dailyData: validEntries,
      monthlySum: calculateMonthlySum(validEntries)
    };
  };

  const equivalentHouseholds = useMemo(() => {
    return calculateEquivalent(chartData.dailyData, chartData.monthlySum.length);
  }, [chartData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!chartData.dailyData.length) return <NoDataState />;

  return isMobile ? (
    <MobileView 
      cityName={cityName}
      chartData={chartData}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      equivalentHouseholds={equivalentHouseholds}
      Plot={Plot}
    />
  ) : (
    <DesktopView 
      cityName={cityName}
      chartData={chartData}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      equivalentHouseholds={equivalentHouseholds}
      Plot={Plot}
    />
  );
};

export default ResultChart;