'use client';
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, remove, set, get } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/firebaseConfig";
import SyncStatus from "./SyncStatus";
import LoadingState from "./LoadingState";
import MobileView from "./MobileView";
import DesktopView from "./DesktopView";
import { calculateEnergyProduction } from "@/components/energy/ProductCalculator";
import { useSyncStatus } from "./hooks/useSyncStatus";
import useEnergyTypes from "./hooks/useEnergyTypes";

// Constants
const EFFECTIVE_HOURS_CONFIG = {
  Solar: {
    effectiveHours: [9, 10, 11, 12, 13],
    energyField: "Electricity from solar - TWh"
  },
  Wind: {
    effectiveHours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    energyField: "Electricity from wind - TWh"
  },
  Hydro: {
    effectiveHours: Array.from({ length: 24 }, (_, i) => i + 1),
    energyField: "Electricity from hydro - TWh"
  }
};

// Custom hooks
function useDeviceData() {
  const [energyDevices, setEnergyDevices] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  
  const loadDeviceData = useCallback(() => {
    try {
      const database = getDatabase();
      const physicInfoRef = ref(database, 'energy/physic-info');

      return onValue(physicInfoRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const devices = [];
          
          if (data.solar) {
            Object.entries(data.solar).forEach(([id, device]) => {
              if (device.status !== "Active") return;
              devices.push(createDeviceObject(id, 'Solar', device));
            });
          }
          
          if (data.hydro) {
            Object.entries(data.hydro).forEach(([id, device]) => {
              if (device.status !== "Active") return;
              devices.push(createDeviceObject(id, 'Hydro', device));
            });
          }
          
          if (data.wind) {
            Object.entries(data.wind).forEach(([id, device]) => {
              if (device.status !== "Active") return;
              devices.push(createDeviceObject(id, 'Wind', device));
            });
          }
          
          setEnergyDevices(devices);
        }
      });
    } catch (err) {
      console.error("Error loading device data:", err);
    }
  }, []);

  const fetchEnergyData = useCallback(() => {
    const database = getDatabase();
    const physicInfoRef = ref(database, 'energy/physic-info');
    
    const unsubscribe = onValue(physicInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEnergyData(Object.values(data));
      }
    });

    return unsubscribe;
  }, []);

  return { energyDevices, energyData, loadDeviceData, fetchEnergyData };
}

function createDeviceObject(id, type, device) {
  const baseInfo = {
    id,
    type,
    energy_type: type,
    model: device.question_header || 'default',
    quantity: device.quantity || 0,
    info: {
      power: device.power || (type === 'Solar' ? '0 kW' : '0 MW'),
      efficiency: device.efficiency || (type === 'Hydro' ? '80' : '0'),
      quantity: device.quantity,
      model: device.question_header || 'default',
    }
  };

  if (type === 'Hydro') {
    baseInfo.info.flow_rate = device.flowRate || '0';
  }

  return baseInfo;
}

function useEnergyData() {
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
        } else {
          throw new Error("Dữ liệu đang được cập nhật, vui lòng thử lại sau");
        }
      }
  
      // Tạo mảng các API endpoints cần fetch
      const endpoints = [
        "/api/energy/useData/year/solar",
        "/api/energy/useData/year/wind",
        "/api/energy/useData/year/hydro",
        "/api/energy/useData/month/solar",
        "/api/energy/useData/month/wind",
        "/api/energy/useData/month/hydro",
        "/api/energy/useData/hour/solar",
        "/api/energy/useData/hour/wind",
        "/api/energy/useData/hour/hydro",
      ];
  
      // Fetch tất cả endpoints
      const responses = await Promise.all(endpoints.map(url => fetch(url)));
  
      // Kiểm tra status của từng response trước khi parse JSON
      for (const res of responses) {
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        if (!res.headers.get('content-type')?.includes('application/json')) {
          throw new Error('API did not return JSON');
        }
      }
  
      // Parse JSON từ tất cả responses
      const [
        solarYear, windYear, hydroYear,
        solarMonth, windMonth, hydroMonth,
        solarHour, windHour, hydroHour
      ] = await Promise.all(responses.map(res => res.json()));
  
      const formattedData = formatData(
        normalizeData,
        solarYear, windYear, hydroYear,
        solarMonth, windMonth, hydroMonth,
        solarHour, windHour, hydroHour
      );
  
      setData(formattedData);
      setDataProcessingStage('complete');
      return formattedData;
    } catch (err) {
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchData(checkSyncStatus, retryCount + 1);
      }
      setDataProcessingStage('error');
      throw err;
    }
  }, [normalizeData]);

  function formatData(
    normalizeData,
    solarYear, windYear, hydroYear,
    solarMonth, windMonth, hydroMonth,
    solarHour, windHour, hydroHour
  ) {
    const solarYearData = normalizeData(solarYear, "year");
    const windYearData = normalizeData(windYear, "year");
    const hydroYearData = normalizeData(hydroYear, "year");

    const solarMonthData = normalizeData(solarMonth, "month");
    const windMonthData = normalizeData(windMonth, "month");
    const hydroMonthData = normalizeData(hydroMonth, "month");

    const allYears = [...new Set([
      ...solarMonthData.filter(d => d.year).map(d => d.year),
      ...windMonthData.filter(d => d.year).map(d => d.year),
      ...hydroMonthData.filter(d => d.year).map(d => d.year)
    ])].sort();

    const solarHourData = normalizeData(solarHour, "hour");
    const windHourData = normalizeData(windHour, "hour");
    const hydroHourData = normalizeData(hydroHour, "hour");

    const uniqueYears = [...new Set([...solarYearData, ...windYearData, ...hydroYearData].map(d => d.year))].sort((a, b) => a - b);
    const uniqueHours = Array.from({ length: 24 }, (_, i) => i);

    const formattedYearlyData = uniqueYears.map(year => ({
      year,
      solar: solarYearData.find(d => d.year === year)?.energy ?? 0,
      wind: windYearData.find(d => d.year === year)?.energy ?? 0,
      hydro: hydroYearData.find(d => d.year === year)?.energy ?? 0,
    }));

    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

    const formattedMonthlyData = allYears.flatMap(year => 
      allMonths.map(month => ({
        year,
        month,
        solar: solarMonthData.find(d => d.month === month && d.year === year)?.energy ?? 0,
        wind: windMonthData.find(d => d.month === month && d.year === year)?.energy ?? 0,
        hydro: hydroMonthData.find(d => d.month === month && d.year === year)?.energy ?? 0,
      }))
    );

    const formattedHourlyData = uniqueHours.map(hour => ({
      hour,
      solar: solarHourData.find(d => d.hour === hour)?.energy ?? 0,
      wind: windHourData.find(d => d.hour === hour)?.energy ?? 0,
      hydro: hydroHourData.find(d => d.hour === hour)?.energy ?? 0,
    }));

    return {
      yearly: formattedYearlyData,
      monthly: formattedMonthlyData,
      hourly: formattedHourlyData
    };
  }

  return { data, dataProcessingStage, dataVersion, setDataVersion, fetchData, setDataProcessingStage };
}

function useSyncOperations() {
  const auth = getAuth();
  const { checkSyncStatus, lockSync, unlockSync } = useSyncStatus(auth);
  const postedEntriesRef = useRef(new Set());
  const hasPostedRef = useRef(false);

  const postAllData = useCallback(async (energyProduction) => {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("Người dùng chưa đăng nhập");
    }
  
    const currentSyncStatus = await checkSyncStatus();
    
    if (currentSyncStatus.isSyncing) {
      if (currentSyncStatus.syncInProgressBy === user.uid) {
        return;
      } else {
        throw new Error("Đồng bộ đang được thực hiện bởi người dùng khác");
      }
    }
  
    const lockAcquired = await lockSync(user.uid);
    if (!lockAcquired) {
      throw new Error("Không thể khóa đồng bộ, có thể đang được thực hiện bởi người khác");
    }
  
    try {
      const database = getDatabase();
      const renewableHourRef = ref(db, "energy/renewable/hour");
      await remove(renewableHourRef);
  
      postedEntriesRef.current = new Set();
  
      const postRequests = Object.entries(energyProduction).flatMap(([type, values]) => {
        if (type === "all" || !values.dbEntries || values.dbEntries.length === 0) {
          return [];
        }
  
        return values.dbEntries
          .filter(entry => {
            const key = `${type}-${entry.Entity}-${entry.Hour}-${entry.Month}-${entry.Year}`;
            return !postedEntriesRef.current.has(key);
          })
          .map(entry => {
            const key = `${type}-${entry.Entity}-${entry.Hour}-${entry.Month}-${entry.Year}`;
            const requestData = {
              id: key,
              Electricity: entry[EFFECTIVE_HOURS_CONFIG[type].energyField],
              Entity: entry.Entity,
              Hour: entry.Hour,
              Month: entry.Month,
              Year: entry.Year,
              code: entry.code || "VNM"
            };
  
            postedEntriesRef.current.add(key);
  
            return fetch(`/api/energy/fetchData/hour/${type.toLowerCase()}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify([requestData])
            });
          });
      });
  
      // First wait for all requests to complete
      const responses = await Promise.all(postRequests);
      
      // Then parse all responses as JSON
      const results = await Promise.all(responses.map(res => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      }));
      
      const versionRef = ref(database, 'energy/dataVersion');
      const currentVersion = (await get(versionRef)).val() || 0;
      await set(versionRef, currentVersion + 1);
      
      hasPostedRef.current = true;
      return results;
    } finally {
      await unlockSync();
    }
  }, [checkSyncStatus, lockSync, unlockSync, auth]);

  return { postAllData, checkSyncStatus  };
}

function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const resizeHandler = () => checkMobile();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return isMobile;
}

function useEnergyDataFetching() {
  const [renewableEnergy, setRenewableEnergy] = useState(0);
  const [consumption, setConsumption] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Fixed: Removed TypeScript annotation 

  // First useEffect for fetching data
  useEffect(() => {
    const db = getDatabase();
    
    const fetchData = () => {
      // Fetch renewable energy production data
      const productionRef = ref(db, 'energy/totalProduction');
      const productionUnsub = onValue(productionRef, (snapshot) => {
        try {
          const data = snapshot.val();
          console.log('Raw production data:', data);
          
          // Extract the first key (UUID) since data is nested under a random UUID
          const productionKey = Object.keys(data)[0];
          const productionData = data[productionKey]?.production;
          
          if (productionData) {
            const { Hydro, Solar, Wind } = productionData;
            const hydroValue = Hydro?.value || 0;
            const solarValue = Solar?.value || 0;
            const windValue = Wind?.value || 0;
            const totalRenewable = hydroValue + solarValue + windValue;
            
            console.log('Energy Production:', {
              Hydro: hydroValue,
              Solar: solarValue,
              Wind: windValue,
              Total: totalRenewable,
            });
            
            setRenewableEnergy(totalRenewable);
          } else {
            console.warn('Production data not found in expected structure');
            setError('Dữ liệu sản xuất không có cấu trúc như mong đợi');
          }
        } catch (err) {
          setError('Lỗi khi đọc dữ liệu sản xuất năng lượng');
          console.error('Production data processing error:', err);
        }
      }, (error) => {
        setError('Lỗi kết nối đến dữ liệu sản xuất năng lượng');
        console.error('Production connection error:', error);
      });
    
      const cityRef = ref(db, 'energy/city');
const cityUnsub = onValue(cityRef, (snapshot) => {
  try {
    const data = snapshot.val();
    console.log('Raw consumption data:', data);

    if (data && typeof data === 'object') {
      // Lấy mảng các object thành phố từ object
      const cityArray = Object.values(data);

      if (cityArray.length > 0) {
        // Giả sử chọn bản ghi mới nhất theo ngày tháng năm
        const latest = cityArray.sort((a, b) => {
          const dateA = new Date(a.year, a.month - 1, a.day);
          const dateB = new Date(b.year, b.month - 1, b.day);
          return dateB - dateA;
        })[0];

        const consumptionValue = latest.production;
        console.log('Latest consumption data:', latest);
        setConsumption(consumptionValue);
        setLoading(false);
      } else {
        setError('Không có dữ liệu tiêu thụ năng lượng');
      }
    } else {
      setError('Dữ liệu tiêu thụ năng lượng không hợp lệ');
    }
  } catch (err) {
    setError('Lỗi khi đọc dữ liệu tiêu thụ năng lượng');
    console.error('Consumption data error:', err);
  }
}, (error) => {
  setError('Lỗi kết nối đến dữ liệu tiêu thụ năng lượng');
  console.error('Consumption connection error:', error);
});

    
      return () => {
        productionUnsub();
        cityUnsub();
      };
    };

    const unsubscribe = fetchData();
    return unsubscribe;
  }, []);

  // Second useEffect for saving production data when renewableEnergy changes
  useEffect(() => {
    const saveProductionData = async () => {
      try {
        const db = getDatabase();
        const now = new Date();
        
        // Prepare production data
        const productionData = {
          totalProduction: {
            timestamp: now.toISOString(),
            production: {
              Hydro: { value: renewableEnergy * 0.4 }, // Example distribution
              Solar: { value: renewableEnergy * 0.3 },
              Wind: { value: renewableEnergy * 0.3 }
            }
          }
        };

        // Save to database
        const productionRef = ref(db, 'energy/totalproduction');
        await set(productionRef, productionData);
        
        console.log('Production data saved successfully');
      } catch (err) {
        console.error('Failed to save production data:', err);
        setError('Lỗi khi lưu dữ liệu sản xuất');
      }
    };

    if (renewableEnergy > 0) {
      saveProductionData();
    }
  }, [renewableEnergy]);

  return { renewableEnergy, consumption, loading, error };
}

export default function EnergyPage() {  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSyncTime: null,
    syncInProgressBy: null
  });
  const { renewableEnergy, consumption } = useEnergyDataFetching();

  const isMobile = useResponsiveLayout();
  const { energyDevices, energyData, loadDeviceData, fetchEnergyData } = useDeviceData();
  const { data, dataProcessingStage, dataVersion, setDataVersion, fetchData, setDataProcessingStage } = useEnergyData();
  const { postAllData, checkSyncStatus } = useSyncOperations();
  const energyTypes = useEnergyTypes();
  const auth = getAuth();

  const energyProduction = useMemo(() => 
    calculateEnergyProduction(energyDevices, energyTypes),
    [energyDevices, energyTypes]
  );


  useEffect(() => {
    const database = getDatabase();
    const versionRef = ref(database, 'energy/dataVersion');
    
    const unsubscribe = onValue(versionRef, (snapshot) => {
      const version = snapshot.val();
      if (version && version > dataVersion) {
        setDataVersion(version);
        fetchData(checkSyncStatus); // Pass checkSyncStatus here
      }
    });

    return () => unsubscribe();
  }, [dataVersion, fetchData, checkSyncStatus]);


  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'energy_sync_status') {
        setSyncStatus(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);



  useEffect(() => {
    if (dataProcessingStage === 'initial' && energyDevices.length > 0) {
      setLoading(true);
      postAllData(energyProduction)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (dataProcessingStage === 'fetching') {
      setLoading(true);
      fetchData(checkSyncStatus) // Pass checkSyncStatus here
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [dataProcessingStage, energyDevices, postAllData, fetchData, energyProduction, checkSyncStatus]);

  const saveProductionData = useCallback(async () => {
    try {
      const now = new Date();
      
      // Chuẩn bị dữ liệu sản xuất theo cấu trúc mới
      const productionData = {
        entity: "Vietnam",
        metadata: {
          production: Object.entries(energyProduction)
            .filter(([type]) => type !== 'all')
            .reduce((acc, [type, values]) => ({
              ...acc,
              [type]: {
                value: values.production,
                percentage: values.percentage,
                devices: energyDevices
                  .filter(device => device.type === type)
                  .map(({ id, model, quantity }) => ({ id, model, quantity }))
              }
            }), {})
        }
      };
  
      // Gửi request đến API
      const response = await fetch('/api/energy/totalProduction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productionData)
      });
      
      // Xử lý response
      const result = await response.json();
      console.log('API Response:', result);
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save production data');
      }
  
      return result;
    } catch (error) {
      console.error("Error saving production data:", error);
      return { 
        success: false, 
        message: error.message,
        error: error.toString() 
      };
    }
  }, [energyProduction, energyDevices]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const unsubscribeDevice = loadDeviceData();
        const unsubscribeEnergy = fetchEnergyData();
        
        return () => {
          unsubscribeDevice();
          unsubscribeEnergy();
        };
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, [loadDeviceData, fetchEnergyData]);

  useEffect(() => {
    const saveDataOnLoad = async () => {
      if (energyDevices.length > 0 && dataProcessingStage === 'complete') {
        try {
          await saveProductionData();
        } catch (error) {
          console.error("Failed to save production data on load:", error);
        }
      }
    };

    saveDataOnLoad();
  }, [energyDevices, dataProcessingStage, saveProductionData]);

  

  // Add this useEffect to save data when production changes
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (energyDevices.length > 0) {
        try {
          await saveProductionData();
        } catch (error) {
          console.error("Failed to save production data before unload:", error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [energyDevices, saveProductionData]);



  if (loading) {
    return <LoadingState dataProcessingStage={dataProcessingStage} energyDevices={energyDevices} />;
  }

  if (error) return <div className="text-red-500 p-4">❌ Lỗi: {error}</div>;

  return (
    <>
      {isMobile ? 
        <MobileView energyData={energyData} data={data} /> : 
        <DesktopView energyData={energyData} data={data} renewableEnergy={renewableEnergy} consumption={consumption} error={error} loading={loading}  energyProduction={energyProduction} />
      }
      <SyncStatus 
        syncStatus={syncStatus} 
        lastSyncTime={syncStatus.lastSyncTime} 
      />
    </>
  );
}