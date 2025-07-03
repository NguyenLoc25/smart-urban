import { useState, useCallback } from "react";
import { 
  fetchYearlyData, 
  fetchMonthlyData, 
  fetchHourlyData 
} from "./apiFunctions";

export default function useEnergyData() {
  const [data, setData] = useState({ yearly: [], monthly: [], hourly: [] });
  const [dataProcessingStage, setDataProcessingStage] = useState('initial');
  const [dataVersion, setDataVersion] = useState(0);

  const normalizeData = useCallback((data, key) => {
    return data.map((d) => ({
      [key]: d[key],
      energy: parseInt(d.energy, 10) || 0,
      ...(d.year && { year: parseInt(d.year, 10) })
    })).filter(d => d.energy > 0);
  }, []);

  const fetchData = useCallback(async (checkSyncStatus, retryCount = 0) => {
    try {
      setDataProcessingStage('fetching');
      
      const currentSyncStatus = await checkSyncStatus();
      
      if (currentSyncStatus.isSyncing) {
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return fetchData(checkSyncStatus, retryCount + 1);
        }
        setDataProcessingStage('error');
        return Promise.reject(new Error("Dữ liệu đang được cập nhật, vui lòng thử lại sau"));
      }
  
      const types = ['solar', 'wind', 'hydro'];
      
      const [solarYear, windYear, hydroYear] = await Promise.all(
        types.map(type => fetchYearlyData(type).catch(() => []))
      );
      
      const [solarMonth, windMonth, hydroMonth] = await Promise.all(
        types.map(type => fetchMonthlyData(type).catch(() => []))
      );
      
      const [solarHour, windHour, hydroHour] = await Promise.all(
        types.map(type => fetchHourlyData(type).catch(() => []))
      );

      const yearly = processYearlyData(
        normalizeData(solarYear, "year"),
        normalizeData(windYear, "year"),
        normalizeData(hydroYear, "year")
      );
      
      const monthly = processMonthlyData(
        normalizeData(solarMonth, "month"),
        normalizeData(windMonth, "month"),
        normalizeData(hydroMonth, "month")
      );
      
      const hourly = processHourlyData(
        normalizeData(solarHour, "hour"),
        normalizeData(windHour, "hour"),
        normalizeData(hydroHour, "hour")
      );

      const result = { yearly, monthly, hourly };
      setData(result);
      setDataProcessingStage('complete');
      return result;
    } catch (err) {
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchData(checkSyncStatus, retryCount + 1);
      }
      setDataProcessingStage('error');
      return Promise.reject(err);
    }
  }, [normalizeData]);

  function processYearlyData(solar, wind, hydro) {
    const years = [...new Set([...solar, ...wind, ...hydro].map(d => d.year))].sort((a, b) => a - b);
    return years.map(year => ({
      year,
      solar: solar.find(d => d.year === year)?.energy || 0,
      wind: wind.find(d => d.year === year)?.energy || 0,
      hydro: hydro.find(d => d.year === year)?.energy || 0,
    }));
  }

  function processMonthlyData(solar, wind, hydro) {
    const years = [...new Set([...solar, ...wind, ...hydro].map(d => d.year))].sort((a, b) => a - b);
    return years.flatMap(year => 
      Array.from({ length: 12 }, (_, i) => i + 1).map(month => ({
        year,
        month,
        solar: solar.find(d => d.month === month && d.year === year)?.energy || 0,
        wind: wind.find(d => d.month === month && d.year === year)?.energy || 0,
        hydro: hydro.find(d => d.month === month && d.year === year)?.energy || 0,
      }))
    );
  }

  function processHourlyData(solar, wind, hydro) {
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      solar: solar.find(d => d.hour === hour)?.energy || 0,
      wind: wind.find(d => d.hour === hour)?.energy || 0,
      hydro: hydro.find(d => d.hour === hour)?.energy || 0,
    }));
  }

  return { 
    data, 
    dataProcessingStage, 
    dataVersion, 
    setDataVersion, 
    fetchData, 
    setDataProcessingStage 
  };
}