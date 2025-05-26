'use client';
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, remove, set, get } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import SyncStatus from "./SyncStatus";
import LoadingState from "./LoadingState";
import MobileView from "./MobileView";
import DesktopView from "./DesktopView";
import { calculateEnergyProduction } from "@/components/energy/ProductCalculator";
import { useSyncStatus } from "./hooks/useSyncStatus";
import useEnergyTypes from "./hooks/useEnergyTypes";

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

  const postedEntriesRef = useRef(new Set());
  const hasPostedRef = useRef(false);
  const auth = getAuth();
  const energyTypes = useEnergyTypes();
  const { checkSyncStatus, lockSync, unlockSync } = useSyncStatus(auth);

  const energyProduction = useMemo(() => 
    calculateEnergyProduction(energyDevices, energyTypes),
    [energyDevices, energyTypes]
  );

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

      await Promise.all(postRequests.map(res => res.json()));
      
      const versionRef = ref(database, 'energy/dataVersion');
      const currentVersion = (await get(versionRef)).val() || 0;
      await set(versionRef, currentVersion + 1);
      
      setDataProcessingStage('fetching');
      hasPostedRef.current = true;
    } catch (error) {
      // setError('Lỗi khi gửi dữ liệu lên server');
      // setDataProcessingStage('error');
      // setLoading(false);
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
    if (dataProcessingStage === 'initial' && energyDevices.length > 0) {
      postAllData();
    } else if (dataProcessingStage === 'fetching') {
      fetchData();
    }
  }, [dataProcessingStage, energyDevices, postAllData, fetchData]);

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