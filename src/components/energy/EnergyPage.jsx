
'use client';
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, remove, set, get } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
// import TotalChart from "@/components/energy/chart/TotalChart"; 
import TotalChart from "@/components/energy/total-chart"; 
import QuantityTable from "@/components/energy/chart/QuantityTable";
// import QuantityTable from "@/components/energy/tableDevide/index";
import ResultChart from "@/components/energy/chart/ResultChart"; 
// import ResultChart from "@/components/energy/consumpChart/index"; 
import { calculateEnergyProduction } from "@/components/energy/ProductCalculator";

function SyncStatus({ syncStatus, lastSyncTime }) {
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center space-x-2">
        {syncStatus.isSyncing ? (
          <>
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            <span className="text-sm">Đang đồng bộ dữ liệu...</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Dữ liệu đã đồng bộ</span>
          </>
        )}
      </div>
      {lastSyncTime && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Cập nhật lúc: {new Date(lastSyncTime).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

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

  const EFFECTIVE_HOURS_CONFIG = useMemo(() => ({
    Solar: {
      effectiveHours: [9, 10, 11, 12, 13],
      energyField: "Electricity from solar - TWh"
    },
    Wind: {
      effectiveHours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      energyField: "Electricity from wind - TWh"
    },
    Hydro: {
      effectiveHours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      energyField: "Electricity from hydro - TWh"
    }
  }), []);

  const postedEntriesRef = useRef(new Set());
  const hasPostedRef = useRef(false);
  const auth = getAuth();

  const energyTypes = useMemo(() => ({
    all: "Tất cả",
    Solar: "Năng lượng mặt trời",
    Wind: "Năng lượng gió",
    Hydro: "Năng lượng thủy điện"
  }), []);

  const energyProduction = useMemo(() => 
    calculateEnergyProduction(energyDevices, energyTypes),
    [energyDevices, energyTypes]
  );

  const checkSyncStatus = useCallback(async () => {
    const database = getDatabase();
    const syncRef = ref(database, 'energy/syncStatus');
    
    return new Promise((resolve) => {
      onValue(syncRef, (snapshot) => {
        const status = snapshot.val();
        resolve(status || { isSyncing: false, syncInProgressBy: null });
      }, { onlyOnce: true });
    });
  }, []);

  const lockSync = useCallback(async (userId) => {
    const database = getDatabase();
    const syncRef = ref(database, 'energy/syncStatus');
    
    try {
      const newStatus = {
        isSyncing: true,
        syncInProgressBy: userId,
        timestamp: Date.now()
      };
      
      await set(syncRef, newStatus);
      localStorage.setItem('energy_sync_status', JSON.stringify(newStatus));
      return true;
    } catch (error) {
      console.error('Không thể khóa đồng bộ:', error);
      return false;
    }
  }, []);

  const unlockSync = useCallback(async () => {
    const database = getDatabase();
    const syncRef = ref(database, 'energy/syncStatus');
    
    try {
      const newStatus = {
        isSyncing: false,
        syncInProgressBy: null,
        timestamp: Date.now()
      };
      
      await set(syncRef, newStatus);
      localStorage.setItem('energy_sync_status', JSON.stringify(newStatus));
      return true;
    } catch (error) {
      console.error('Không thể mở khóa đồng bộ:', error);
      return false;
    }
  }, []);

  const postAllData = useCallback(async () => {
    const user = auth.currentUser;
    
    if (!user) {
      console.warn("Người dùng chưa đăng nhập");
      return;
    }

    const currentSyncStatus = await checkSyncStatus();
    
    if (currentSyncStatus.isSyncing) {
      if (currentSyncStatus.syncInProgressBy === user.uid) {
        console.log("Bạn đang thực hiện đồng bộ từ một tab khác");
      } else {
        console.log("Đồng bộ đang được thực hiện bởi người dùng khác");
      }
      return;
    }

    const lockAcquired = await lockSync(user.uid);
    if (!lockAcquired) {
      console.warn("Không thể khóa đồng bộ, có thể đang được thực hiện bởi người khác");
      return;
    }

    try {
      setDataProcessingStage('posting');
      setLoading(true);

      const database = getDatabase();
      const transactionRef = ref(database, 'energy/transactions/' + Date.now());
      
      await set(transactionRef, {
        type: 'data_cleanup',
        initiatedBy: user.uid,
        status: 'started',
        timestamp: Date.now()
      });

      const renewableHourRef = ref(db, "energy/renewable/hour");
      await remove(renewableHourRef);
      
      await set(transactionRef, {
        status: 'data_deleted',
        timestamp: Date.now()
      });

      postedEntriesRef.current = new Set();
      console.log("✅ Đã xóa toàn bộ dữ liệu cũ");

      await set(transactionRef, {
        status: 'posting_data',
        entriesCount: Object.keys(energyProduction).length,
        timestamp: Date.now()
      });

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

      const responses = await Promise.all(postRequests);
      await Promise.all(responses.map(res => res.json()));
      
      const versionRef = ref(database, 'energy/dataVersion');
      const currentVersion = (await get(versionRef)).val() || 0;
      await set(versionRef, currentVersion + 1);
      
      console.log('All data posted successfully');
      hasPostedRef.current = true;
      setDataProcessingStage('fetching');
    } catch (error) {
      console.error('Error posting data:', error);
      setError('Lỗi khi gửi dữ liệu lên server');
      setDataProcessingStage('error');
      setLoading(false);
      
      const database = getDatabase();
      const errorRef = ref(database, 'energy/transactions/' + Date.now());
      await set(errorRef, {
        error: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    } finally {
      await unlockSync();
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: Date.now()
      }));
    }
  }, [energyProduction, EFFECTIVE_HOURS_CONFIG, checkSyncStatus, lockSync, unlockSync, auth]);

  const fetchData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const syncStatus = await checkSyncStatus();
      if (syncStatus.isSyncing) {
        if (retryCount < 3) {
          console.log(`Dữ liệu đang được đồng bộ, thử lại sau 2s... (${retryCount + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return fetchData(retryCount + 1);
        } else {
          throw new Error("Dữ liệu đang được cập nhật bởi người dùng khác, vui lòng thử lại sau");
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
        failedRes.forEach((res) => {
          console.error(`❌ Lỗi từ API: ${res.url} - Mã trạng thái: ${res.status}`);
        });
        throw new Error("Lỗi khi tải dữ liệu từ server");
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

      const normalizeData = (data, key) =>
        data.map((d) => ({
          [key]: d[key],
          energy: parseInt(d.energy, 10) || 0,
          ...(d.year && { year: parseInt(d.year, 10) })
        })).filter(d => d.energy > 0);

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
      const uniqueMonths = Array.from({ length: 12 }, (_, i) => i + 1);
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
      if (retryCount < 3 && err.message.includes("tải dữ liệu")) {
        console.log(`Thử lại fetchData... (${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchData(retryCount + 1);
      }
      
      console.error("❌ Lỗi:", err);
      setError(err.message);
      setDataProcessingStage('error');
    } finally {
      setLoading(false);
    }
  }, [checkSyncStatus]);

  const loadData = useCallback(() => {
    try {
      const database = getDatabase();
      const physicInfoRef = ref(database, 'energy/physic-info');

      const unsubscribe = onValue(physicInfoRef, (snapshot) => {
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

      return () => unsubscribe();
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const database = getDatabase();
    const physicInfoRef = ref(database, 'energy/physic-info');
    
    const unsubscribe = onValue(physicInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.values(data);
        setEnergyData(dataArray);
      }
    });

    return () => unsubscribe();
  }, []);

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
        console.log(`Phát hiện phiên bản dữ liệu mới: ${version}`);
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
        
        if (newStatus.isSyncing && newStatus.syncInProgressBy !== auth.currentUser?.uid) {
          console.log('Phát hiện đồng bộ từ tab khác');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [auth]);

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
        loadData();
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [loadData, auth]);

  if (loading) {
    const loadingMessages = {
      initial: "⏳ Đang chuẩn bị dữ liệu...",
      posting: "🔄 Đang gửi dữ liệu lên server...",
      fetching: "📥 Đang tải dữ liệu mới từ server...",
      complete: "✅ Hoàn tất! Đang hiển thị kết quả..."
    };
  
    const loadingProgress = {
      initial: 20,
      posting: 50,
      fetching: 80,
      complete: 100
    };
  
    const currentMessage = loadingMessages[dataProcessingStage] || "Đang tải...";
    const currentProgress = loadingProgress[dataProcessingStage] || 30;
  
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                style={{ animationDuration: '1.5s' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">
                  {dataProcessingStage === 'posting' && '📤'}
                  {dataProcessingStage === 'fetching' && '📥'}
                  {dataProcessingStage === 'initial' && '⏳'}
                  {dataProcessingStage === 'complete' && '✅'}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 text-center">
              {currentMessage}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
              {dataProcessingStage === 'posting' && 'Vui lòng chờ trong giây lát...'}
              {dataProcessingStage === 'fetching' && 'Dữ liệu đang được xử lý...'}
              {dataProcessingStage === 'initial' && 'Đang khởi tạo hệ thống...'}
              {dataProcessingStage === 'complete' && 'Đang hoàn tất quá trình...'}
            </p>
          </div>
  
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Tiến trình</span>
              <span>{currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          </div>
  
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500 dark:text-gray-400">
              <p>Trạng thái hiện tại: <span className="font-mono">{dataProcessingStage}</span></p>
              <p className="mt-1">Số lượng thiết bị: <span className="font-mono">{energyDevices.length}</span></p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 p-4">❌ Lỗi: {error}</div>;

  const renderMobileView = () => (
    <div className="p-4 space-y-6">
      <div className="overflow-x-auto">
        <QuantityTable data={energyData} />
      </div>
      <TotalChart energyData={data} />
      <ResultChart />
    </div>
  );
  
  const renderDesktopView = () => (
    <div className="p-6 space-y-6">
      <QuantityTable data={energyData} />
      <TotalChart energyData={data} />
      <ResultChart />
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Sản lượng điện từ các nguồn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(energyProduction).map(([type, values]) => (
          <div 
            key={type} 
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-700 dark:text-gray-300">{energyTypes[type] || type}</h3>
            <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">{values.production} kWh</p>
            <div className="flex items-center mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full" 
                  style={{ width: `${values.percentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{values.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}
      <SyncStatus 
        syncStatus={syncStatus} 
        lastSyncTime={syncStatus.lastSyncTime} 
      />
    </>
  );
}
