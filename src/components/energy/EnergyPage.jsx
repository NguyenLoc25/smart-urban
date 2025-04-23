import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import TotalChart from "@/components/energy/chart/TotalChart"; 
import QuantityTable from "@/components/energy/chart/QuantityTable";
import ResultChart from "@/components/energy/chart/ResultChart"; 
import { calculateEnergyProduction } from "@/components/energy/ProductCalculator";

export default function EnergyPage() {  
  const [energyDevices, setEnergyDevices] = useState([]);
  const [data, setData] = useState({ yearly: [], monthly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [energyData, setEnergyData] = useState([]);
  const [dataProcessingStage, setDataProcessingStage] = useState('initial'); // 'initial', 'posting', 'fetching', 'complete'

  // Memoize config to avoid recreating object on every render
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

  // Use ref to track posted entries
  const postedEntriesRef = useRef(new Set());
  const hasPostedRef = useRef(false);

  // Memoize energyTypes
  const energyTypes = useMemo(() => ({
    all: "Tất cả",
    Solar: "Năng lượng mặt trời",
    Wind: "Năng lượng gió",
    Hydro: "Năng lượng thủy điện"
  }), []);

  // Memoize energy production calculation
  const energyProduction = useMemo(() => 
    calculateEnergyProduction(energyDevices, energyTypes),
    [energyDevices, energyTypes]
  );

  // Fetch energy data from Firebase
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

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const resizeHandler = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // Post data to server
  const postAllData = useCallback(async () => {
    try {
      if (!energyProduction || Object.keys(energyProduction).length === 0 || hasPostedRef.current) {
        console.warn("⏳ Dữ liệu energyProduction chưa sẵn sàng hoặc đã được post. Bỏ qua.");
        return;
      }

      setDataProcessingStage('posting');
      setLoading(true);

      // 1. DELETE ALL OLD DATA
      const renewableHourRef = ref(db, "energy/renewable/hour");
      await remove(renewableHourRef);
      postedEntriesRef.current = new Set();
      console.log("✅ Đã xóa toàn bộ dữ liệu cũ");

      // 2. POST NEW DATA
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
      console.log('All data posted successfully');
      hasPostedRef.current = true;
      setDataProcessingStage('fetching');
    } catch (error) {
      console.error('Error posting data:', error);
      setError('Lỗi khi gửi dữ liệu lên server');
      setDataProcessingStage('error');
      setLoading(false);
    }
  }, [energyProduction, EFFECTIVE_HOURS_CONFIG]);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
  
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
          energy: parseInt(d.energy, 10) || 0
        })).filter(d => d.energy > 0);
  
      const solarYearData = normalizeData(solarYear, "year");
      const windYearData = normalizeData(windYear, "year");
      const hydroYearData = normalizeData(hydroYear, "year");
  
      const solarMonthData = normalizeData(solarMonth, "month");
      const windMonthData = normalizeData(windMonth, "month");
      const hydroMonthData = normalizeData(hydroMonth, "month");
  
      const solarHourData = normalizeData(solarHour, "hour");
      const windHourData = normalizeData(windHour, "hour");
      const hydroHourData = normalizeData(hydroHour, "hour");
  
      const uniqueYears = [...new Set([...solarYearData, ...windYearData, ...hydroYearData].map(d => d.year))].sort((a, b) => a - b);
      const uniqueMonths = Array.from({ length: 12 }, (_, i) => i + 1);
      const uniqueHours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
  
      const formattedYearlyData = uniqueYears.map(year => ({
        year,
        solar: solarYearData.find(d => d.year === year)?.energy ?? 0,
        wind: windYearData.find(d => d.year === year)?.energy ?? 0,
        hydro: hydroYearData.find(d => d.year === year)?.energy ?? 0,
      }));
  
      const formattedMonthlyData = uniqueMonths.map(month => ({
        month,
        solar: solarMonthData.find(d => d.month === month)?.energy ?? 0,
        wind: windMonthData.find(d => d.month === month)?.energy ?? 0,
        hydro: hydroMonthData.find(d => d.month === month)?.energy ?? 0,
      }));
  
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
    } catch (err) {
      console.error("❌ Lỗi:", err);
      setError(err.message);
      setDataProcessingStage('error');
    } finally {
      setLoading(false);
    }
  }, []);
  

  // Main effect to coordinate data operations
  useEffect(() => {
    if (dataProcessingStage === 'initial' && energyDevices.length > 0) {
      postAllData();
    } else if (dataProcessingStage === 'fetching') {
      fetchData();
    }
  }, [dataProcessingStage, energyDevices, postAllData, fetchData]);

  // Load device data
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

  // Check auth and load data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadData();
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [loadData]);

  if (loading) {
    let loadingMessage = "⏳ Đang tải dữ liệu...";
    if (dataProcessingStage === 'posting') loadingMessage = "🔄 Đang gửi dữ liệu lên server...";
    if (dataProcessingStage === 'fetching') loadingMessage = "📥 Đang tải dữ liệu mới...";
    
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-blue-500 text-lg">{loadingMessage}</div>
        <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '50%' }}></div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 p-4">❌ Lỗi: {error}</div>;

  // Render functions
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

  return isMobile ? renderMobileView() : renderDesktopView();
}