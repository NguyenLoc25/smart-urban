import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, set, get, remove } from 'firebase/database';
import LoadingState from './LoadingState';
import MobileView from './MobileView';
import DesktopView from './DesktopView';
import SyncStatus from './SyncStatus';
import useEnergyTypes from "./hooks/useEnergyTypes";
import { useSyncStatus } from "./hooks/useSyncStatus";

// Utility function to parse numbers from Firebase
const parseFirebaseNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

// Configuration for effective hours and energy fields
const EFFECTIVE_HOURS_CONFIG = {
  Solar: {
    effectiveHours: [9, 10, 11, 12, 13], // 9am-1pm (5 effective hours)
    energyField: "Electricity from solar - TWh",
    convertToKW: (value) => value, // Solar power is in kW
    defaultHours: 5
  },
  Wind: {
    effectiveHours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], // 6am-5pm (12 hours)
    energyField: "Electricity from wind - TWh",
    convertToKW: (value) => value * 1000, // Convert MW to kW
    defaultHours: 12
  },
  Hydro: {
    effectiveHours: Array.from({ length: 24 }, (_, i) => i), // All 24 hours
    energyField: "Electricity from hydro - TWh",
    convertToKW: (value) => value * 1000, // Convert MW to kW
    defaultHours: 24
  }
};

// Main calculation function
const calculateEnergyProduction = (data, energyTypes, config = EFFECTIVE_HOURS_CONFIG) => {
  const result = {};
  let totalProduction = 0;

  const parsePower = (value, type) => {
    if (value === null || value === undefined) return 0;
    const numValue = parseFirebaseNumber(value);

    const typeConfig = config[type];
    if (!typeConfig || typeof typeConfig.convertToKW !== 'function') return numValue;
    return typeConfig.convertToKW(numValue);
  };

  const calculateDailyEnergy = (power, type, itemInfo) => {
    if (!itemInfo || typeof itemInfo !== 'object') return 0;

    const quantity = Math.max(parseFirebaseNumber(itemInfo.quantity), 1);
    const efficiency = parseFirebaseNumber(itemInfo.efficiency) / 100;

    const typeConfig = config[type];
    const hours = typeConfig?.defaultHours || 0;

    switch (type) {
      case 'Solar':
      case 'Wind': {
        if (efficiency <= 0) return 0;
        return power * efficiency * hours * quantity;
      }

      case 'Hydro': {
        const flowRate = parseFirebaseNumber(itemInfo.flow_rate);
        const headHeight = parseFirebaseNumber(itemInfo.head_height);
        
        if (efficiency <= 0 || flowRate <= 0 || headHeight <= 0) {
          if (itemInfo.power !== null && itemInfo.power !== undefined) {
            return parsePower(itemInfo.power, 'Hydro') * hours * quantity;
          }
          return 0;
        }

        const powerKW = efficiency * 1000 * 9.81 * flowRate * headHeight / 1000;
        return powerKW * hours * quantity;
      }

      default:
        return 0;
    }
  };

  const createHourlyData = (dailyProduction, type, entity, date) => {
    const typeConfig = config[type];
    const effectiveHours = typeConfig?.effectiveHours || [];
    const field = typeConfig?.energyField || 'Energy';

    const hourlyValue = dailyProduction / effectiveHours.length;
    return effectiveHours.map(hour => ({
      code: "VNM",
      [field]: hourlyValue,
      Entity: entity,
      Hour: hour,
      Month: date.getMonth() + 1,
      Year: date.getFullYear(),
      timestamp: new Date().toISOString()
    }));
  };

  Object.keys(energyTypes || {}).forEach((type) => {
    if (type === "all") return;

    const items = (data || []).filter((d) => d?.type === type);
    if (!items.length) {
      result[type] = {
        production: 0,
        percentage: '0.0',
        hourlyProduction: Array(24).fill(0),
        dbEntries: []
      };
      return;
    }

    const dailyProduction = items.reduce((sum, item) => {
      const itemPower = parsePower(item.info?.power, type);
      return sum + calculateDailyEnergy(itemPower, type, item.info || {});
    }, 0);

    const entity = items[0].info?.entity || "Vietnam";
    const date = new Date();
    const dbEntries = createHourlyData(dailyProduction, type, entity, date);

    const effectiveHours = config[type]?.effectiveHours || [];
    const hourlyProduction = Array.from({ length: 24 }, (_, hour) =>
      effectiveHours.includes(hour)
        ? dailyProduction / effectiveHours.length
        : 0
    );

    result[type] = {
      production: parseFloat(dailyProduction.toFixed(2)),
      percentage: '0.0',
      hourlyProduction: hourlyProduction.map(v => parseFloat(v.toFixed(2))),
      dbEntries
    };

    totalProduction += dailyProduction;
  });

  // Aggregate all types
  result.all = {
    production: parseFloat(totalProduction.toFixed(2)),
    percentage: '100.0',
    hourlyProduction: Array(24).fill(0),
    dbEntries: []
  };

  Object.keys(result).forEach(type => {
    if (type !== "all" && result[type].hourlyProduction) {
      result[type].hourlyProduction.forEach((value, hour) => {
        result.all.hourlyProduction[hour] += value;
      });
    }
  });

  result.all.hourlyProduction = result.all.hourlyProduction.map(v => parseFloat(v.toFixed(2)));

  Object.keys(result).forEach((type) => {
    if (type === "all") return;
    result[type].percentage = totalProduction > 0
      ? ((result[type].production / totalProduction) * 100).toFixed(1)
      : '0.0';
  });

  return result;
};

// Custom hook
const useEnergyProduction = (data, energyTypes, config = EFFECTIVE_HOURS_CONFIG) => {
  return useMemo(() => {
    const emptyResult = {
      production: 0,
      percentage: '0.0',
      hourlyProduction: Array(24).fill(0),
      dbEntries: []
    };

    if (!Array.isArray(data) || data.length === 0) {
      return {
        all: { ...emptyResult },
        ...Object.fromEntries(
          Object.keys(energyTypes || {}).map(type => [type, { ...emptyResult }])
        )
      };
    }

    if (!energyTypes || typeof energyTypes !== 'object') {
      return {
        all: { ...emptyResult },
        Solar: { ...emptyResult },
        Wind: { ...emptyResult },
        Hydro: { ...emptyResult }
      };
    }

    return calculateEnergyProduction(data, energyTypes, config);
  }, [data, energyTypes, config]);
};

export default function EnergyPage() {  
  const [energyDevices, setEnergyDevices] = useState([]);
  const [data, setData] = useState({ yearly: [], monthly: [], hourly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [energyData, setEnergyData] = useState([]);
  const [dataProcessingStage, setDataProcessingStage] = useState('initial');
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSyncTime: null,
    syncInProgressBy: null
  });
  const [dataVersion, setDataVersion] = useState(0);
  // Thêm state để theo dõi thay đổi
const [changesDetected, setChangesDetected] = useState(false);
const previousDevicesRef = useRef([]);

  const postedEntriesRef = useRef(new Set());
  const hasPostedRef = useRef(false);
  const auth = getAuth();
  const energyTypes = useEnergyTypes();
  const { checkSyncStatus, lockSync, unlockSync } = useSyncStatus(auth);

  const energyProduction = useMemo(() => 
    calculateEnergyProduction(energyDevices, energyTypes, EFFECTIVE_HOURS_CONFIG),
    [energyDevices, energyTypes]
  );

  const detectChanges = useCallback((currentDevices) => {
    const prevDevices = previousDevicesRef.current;
    
    // So sánh theo id và các trường quan trọng
    if (prevDevices.length !== currentDevices.length) {
      return true;
    }
  
    const currentMap = new Map(currentDevices.map(d => [d.id, d]));
    
    for (const prevDevice of prevDevices) {
      const currentDevice = currentMap.get(prevDevice.id);
      if (!currentDevice) return true;
      
      // So sánh các trường quan trọng
      if (prevDevice.type !== currentDevice.type) return true;
      if (prevDevice.quantity !== currentDevice.quantity) return true;
      if (JSON.stringify(prevDevice.info) !== JSON.stringify(currentDevice.info)) return true;
    }
    
    return false;
  }, []);

  const normalizeData = useCallback((data, key) => {
    return data.map((d) => ({
      [key]: d[key],
      energy: parseInt(d.energy, 10) || 0,
      ...(d.year && { year: parseInt(d.year, 10) })
    })).filter(d => d.energy > 0);
  }, []);

  const fetchEnergyData = useCallback(() => {
    const database = getDatabase();
    const physicInfoRef = ref(database, 'energy/physic-info');
    
    const unsubscribe = onValue(physicInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.values(data);
        setEnergyData(dataArray);
      }
    });

    return unsubscribe;
  }, []);

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
              
              devices.push({
                id,
                type: 'Solar',
                energy_type: 'Solar',
                model: device.question_header || 'default',
                quantity: device.quantity || 0,
                info: {
                  power: device.power || '0 kW',
                  efficiency: device.efficiency || '0',
                  quantity: device.quantity,
                  model: device.question_header || 'default',
                }
              });
            });
          }
          
          if (data.hydro) {
            Object.entries(data.hydro).forEach(([id, device]) => {
              if (device.status !== "Active") return;
              
              devices.push({
                id,
                type: 'Hydro',
                energy_type: 'Hydro',
                model: device.question_header || 'default',
                quantity: device.quantity || 0,
                info: {
                  power: device.power || '0 MW',
                  efficiency: device.efficiency || '80',
                  flow_rate: device.flowRate || '0',
                  quantity: device.quantity,
                  model: device.question_header || 'default',
                }
              });
            });
          }
          
          if (data.wind) {
            Object.entries(data.wind).forEach(([id, device]) => {
              if (device.status !== "Active") return;
              
              devices.push({
                id,
                type: 'Wind',
                energy_type: 'Wind',
                model: device.question_header || 'default',
                quantity: device.quantity || 0,
                info: {
                  power: device.power || '0 MW',
                  efficiency: device.efficiency || '0',
                  quantity: device.quantity,
                  model: device.question_header || 'default',
                }
              });
            });
          }
          
          setEnergyDevices(devices);
          setDataProcessingStage('initial');
        } else {
          setError("No data available");
          setLoading(false);
        }
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const currentSyncStatus = await checkSyncStatus();
      
      if (currentSyncStatus.isSyncing) {
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return fetchData(retryCount + 1);
        } else {
          throw new Error("Dữ liệu đang được cập nhật, vui lòng thử lại sau");
        }
      }

      const [
        solarYearRes, windYearRes, hydroYearRes,
        solarMonthRes, windMonthRes, hydroMonthRes,
        solarHourRes, windHourRes, hydroHourRes
      ] = await Promise.all([
        fetch("/api/energy/useData/year/solar"),
        fetch("/api/energy/useData/year/wind"),
        fetch("/api/energy/useData/year/hydro"),
        fetch("/api/energy/useData/month/solar"),
        fetch("/api/energy/useData/month/wind"),
        fetch("/api/energy/useData/month/hydro"),
        fetch("/api/energy/useData/hour/solar"),
        fetch("/api/energy/useData/hour/wind"),
        fetch("/api/energy/useData/hour/hydro"),
      ]);

      const allRes = [
        solarYearRes, windYearRes, hydroYearRes,
        solarMonthRes, windMonthRes, hydroMonthRes,
        solarHourRes, windHourRes, hydroHourRes
      ];
      const failedRes = allRes.filter(res => !res.ok);

      if (failedRes.length > 0) {
        console.error("Failed to fetch data:", failedRes);
      }

      const [
        solarYear, windYear, hydroYear,
        solarMonth, windMonth, hydroMonth,
        solarHour, windHour, hydroHour
      ] = await Promise.all([
        solarYearRes.json(), windYearRes.json(), hydroYearRes.json(),
        solarMonthRes.json(), windMonthRes.json(), hydroMonthRes.json(),
        solarHourRes.json(), windHourRes.json(), hydroHourRes.json(),
      ]);

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

      setData({
        yearly: formattedYearlyData,
        monthly: formattedMonthlyData,
        hourly: formattedHourlyData
      });

      setDataProcessingStage('complete');
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: Date.now()
      }));
    } catch (err) {
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchData(retryCount + 1);
      }
      setError(err.message);
      setDataProcessingStage('error');
    } finally {
      setLoading(false);
    }
  }, [checkSyncStatus, normalizeData]);

  const postAllData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("Người dùng chưa đăng nhập");
      return;
    }
  
    const currentSyncStatus = await checkSyncStatus();
    if (currentSyncStatus.isSyncing) {
      if (currentSyncStatus.syncInProgressBy === user.uid) {
        return;
      } else {
        setError("Đồng bộ đang được thực hiện bởi người dùng khác");
        return;
      }
    }
  
    const lockAcquired = await lockSync(user.uid);
    if (!lockAcquired) {
      setError("Không thể khóa đồng bộ, có thể đang được thực hiện bởi người khác");
      return;
    }
  
    try {
      setDataProcessingStage('posting');
      setLoading(true);
      setSyncStatus(prev => ({ ...prev, isSyncing: true }));
  
      const database = getDatabase();
      
      // 1. Lấy dữ liệu hiện tại từ Firebase
      const renewableHourRef = ref(database, "energy/renewable/hour");
      const snapshot = await get(renewableHourRef);
      const existingData = snapshot.val() || {};
      
      // 2. Tạo map dữ liệu hiện tại để so sánh
      const existingDataMap = new Map();
      Object.entries(existingData).forEach(([key, value]) => {
        existingDataMap.set(key, value);
      });
  
      // 3. Chuẩn bị dữ liệu mới và xác định thay đổi
      const updates = {};
      let hasChanges = false;
  
      Object.entries(energyProduction).forEach(([type, values]) => {
        if (type === "all" || !values.dbEntries || values.dbEntries.length === 0) {
          return;
        }
  
        values.dbEntries.forEach(entry => {
          const key = `${type}-${entry.Entity}-${entry.Hour}-${entry.Month}-${entry.Year}`;
          const currentValue = existingDataMap.get(key);
          const newValue = {
            id: key,
            Electricity: entry[EFFECTIVE_HOURS_CONFIG[type].energyField],
            Entity: entry.Entity,
            Hour: entry.Hour,
            Month: entry.Month,
            Year: entry.Year,
            code: entry.code || "VNM",
            timestamp: new Date().toISOString()
          };
  
          // Chỉ cập nhật nếu có thay đổi hoặc mới
          if (!currentValue || 
              currentValue.Electricity !== newValue.Electricity ||
              currentValue.Entity !== newValue.Entity) {
            updates[key] = newValue;
            hasChanges = true;
          }
        });
      });
  
      // 4. Chỉ thực hiện cập nhật nếu có thay đổi
      if (hasChanges) {
        // Cập nhật nhiều bản ghi cùng lúc
        await set(renewableHourRef, { ...existingData, ...updates });
        
        // Tăng version nếu có thay đổi
        const versionRef = ref(database, 'energy/dataVersion');
        const currentVersion = (await get(versionRef)).val() || 0;
        await set(versionRef, currentVersion + 1);
      }
  
      setDataProcessingStage('fetching');
      hasPostedRef.current = true;
    } catch (error) {
      console.log("Error posting data:", error);
    } finally {
      await unlockSync();
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: Date.now()
      }));
    }
  }, [energyProduction, checkSyncStatus, lockSync, unlockSync, auth]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const resizeHandler = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  useEffect(() => {
    const database = getDatabase();
    const versionRef = ref(database, 'energy/dataVersion');
    
    const unsubscribe = onValue(versionRef, (snapshot) => {
      const version = snapshot.val();
      if (version && version > dataVersion) {
        setDataVersion(version);
        fetchData();
      }
    });

    return () => unsubscribe();
  }, [dataVersion, fetchData]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'energy_sync_status') {
        const newStatus = JSON.parse(e.newValue);
        setSyncStatus(newStatus);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (energyDevices.length > 0) {
      const hasChanges = detectChanges(energyDevices);
      if (hasChanges) {
        previousDevicesRef.current = energyDevices;
        setChangesDetected(true);
      }
    }
  }, [energyDevices, detectChanges]);
  
  useEffect(() => {
    if (changesDetected && dataProcessingStage === 'initial') {
      postAllData();
      setChangesDetected(false);
    } else if (dataProcessingStage === 'fetching') {
      fetchData();
    }
  }, [changesDetected, dataProcessingStage, postAllData, fetchData]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
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
  }, [loadDeviceData, fetchEnergyData, auth]);

  if (loading) {
    return <LoadingState dataProcessingStage={dataProcessingStage} energyDevices={energyDevices} />;
  }

  if (error) return <div className="text-red-500 p-4">❌ Lỗi: {error}</div>;

  return (
    <>
      {isMobile ? 
        <MobileView energyData={energyData} data={data} /> : 
        <DesktopView energyData={energyData} data={data} energyProduction={energyProduction} />
      }
      <SyncStatus 
        syncStatus={syncStatus} 
        lastSyncTime={syncStatus.lastSyncTime} 
      />
    </>
  );
}