import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import TotalChart from "@/components/energy/chart/TotalChart"; 
import QuantityTable from "@/components/energy/chart/QuantityTable";
import ResultChart from "@/components/energy/chart/ResultChart"; 
import { useEnergyProduction } from "@/components/energy/ProductCalculator";

export default function EnergyPage() {  
  const [energyDevices, setEnergyDevices] = useState([]);
  const [data, setData] = useState({ yearly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Kiểm tra kích thước màn hình
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const energyTypes = {
    all: "Tất cả",
    Solar: "Năng lượng mặt trời",
    Wind: "Năng lượng gió",
    Hydro: "Năng lượng thủy điện"
  };

  const energyProduction = useEnergyProduction(energyDevices, energyTypes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [solarYearRes, windYearRes, hydroYearRes, solarMonthRes, windMonthRes, hydroMonthRes] = await Promise.all([
          fetch("/api/energy/useData/year/solar"),
          fetch("/api/energy/useData/year/wind"),
          fetch("/api/energy/useData/year/hydro"),
          fetch("/api/energy/useData/month/solar"),
          fetch("/api/energy/useData/month/wind"),
          fetch("/api/energy/useData/month/hydro"),
        ]);
  
        // Kiểm tra nếu có bất kỳ API nào trả về mã lỗi
        const allRes = [solarYearRes, windYearRes, hydroYearRes, solarMonthRes, windMonthRes, hydroMonthRes];
        const failedRes = allRes.filter(res => !res.ok); // Tìm tất cả các API không thành công
  
        if (failedRes.length > 0) {
          // In ra lỗi chi tiết từ API không thành công
          failedRes.forEach((res) => {
            console.error(`❌ Lỗi từ API: ${res.url} - Mã trạng thái: ${res.status}`);
          });
          throw new Error("Lỗi khi tải dữ liệu từ server");
        }
  
        const [solarYear, windYear, hydroYear, solarMonth, windMonth, hydroMonth] = await Promise.all([
          solarYearRes.json(),
          windYearRes.json(),
          hydroYearRes.json(),
          solarMonthRes.json(),
          windMonthRes.json(),
          hydroMonthRes.json(),
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
  
        const uniqueYears = [...new Set([...solarYearData, ...windYearData, ...hydroYearData].map(d => d.year))].sort((a, b) => a - b);
        const uniqueMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  
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
  
        setData({ yearly: formattedYearlyData, monthly: formattedMonthlyData });
      } catch (err) {
        console.error("❌ Lỗi:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

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
  }, []);

  const [quantityData, setEnergyData] = useState({
    hydroCount: 0,
    windCount: 0,
    solarCount: 0,
    hydroUsed: 0,
    windUsed: 0,
    solarUsed: 0,
    updatedAt: null,
    question_header: {
      hydro_models: [],
      wind_models: [],
      solar_models: []
    }
});

const loadData = () => {
    try {
      const database = getDatabase();
      const physicInfoRef = ref(database, 'energy/physic-info');

      const unsubscribe = onValue(physicInfoRef, (snapshot) => {
        // dùng cho số lượng thiết bị
        const data = snapshot.val();
        if (data) {
          // Khởi tạo đối tượng để lưu các model và số lượng
          const models = {
            hydro: {},
            wind: {},
            solar: {}
          };

          // Hàm xử lý chung cho từng loại năng lượng
          const processEnergyType = (type) => {
            if (!data[type]) return { count: 0, used: 0 };
            
            const devices = Object.values(data[type]);
            devices.forEach(d => {
              if (d.question_header) {
                // Đếm số lượng từng model
                models[type][d.question_header] = (models[type][d.question_header] || 0) + 1;
              }
            });
            
            return {
              count: devices.length,
              used: devices.filter(d => d.status === 'Active').length
            };
          };

          // Xử lý từng loại năng lượng
          const hydro = processEnergyType('hydro');
          const wind = processEnergyType('wind');
          const solar = processEnergyType('solar');

          setEnergyData({
            hydroCount: hydro.count,
            windCount: wind.count,
            solarCount: solar.count,
            hydroUsed: hydro.used,
            windUsed: wind.used,
            solarUsed: solar.used,
            updatedAt: new Date().toISOString(),
            question_header: {
              // Chuyển object thành mảng các model (lặp lại theo số lượng)
              hydro_models: Object.entries(models.hydro).flatMap(([model, count]) => 
                Array(count).fill(model)
              ),
              wind_models: Object.entries(models.wind).flatMap(([model, count]) => 
                Array(count).fill(model)
              ),
              solar_models: Object.entries(models.solar).flatMap(([model, count]) => 
                Array(count).fill(model)
              )
            }
          });
          
          setLoading(false);
        } else {
          setError("No data available");
          setLoading(false);
        }
        // dùng cho Sản lượng điện từ các nguồn
        const datas = snapshot.val();
        if (datas) {
          const devices = [];
          
          if (datas.solar) {
            Object.entries(datas.solar).forEach(([id, device]) => {
              devices.push({
                id,
                type: 'Solar',
                info: {
                  power: device.power || '0 kW',
                  efficiency: device.efficiency || '0'
                }
              });
            });
          }
          
          if (datas.hydro) {
            Object.entries(datas.hydro).forEach(([id, device]) => {
              devices.push({
                id,
                type: 'Hydro',
                info: {
                  power: device.power || '0 MW',
                  efficiency: device.efficiency || '80',
                  flow_rate: device.flowRate || '0'
                }
              });
            });
          }
          
          if (datas.wind) {
            Object.entries(datas.wind).forEach(([id, device]) => {
              devices.push({
                id,
                type: 'Wind',
                info: {
                  power: device.power || '0 MW',
                  efficiency: device.efficiency || '0'
                }
              });
            });
          }
          
          setEnergyDevices(devices);
        }
      }, (error) => {
        console.error("Error listening to data:", error);
        setError(error.message);
        setLoading(false);
      });

      

      return () => unsubscribe();
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message);
      setLoading(false);
    }
};

  if (loading) return <div className="text-blue-500">⏳ Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500">❌ Lỗi: {error}</div>;

  const renderMobileView = () => (
    <div >
      {/* Quantity Table - Full width on mobile */}
      <div className="overflow-x-auto">
        <QuantityTable data={quantityData} />
      </div>
  
      {/* Total Chart - Full width */}
      <TotalChart energyData={data} />
  
      {/* Result Chart - Full width */}
      <ResultChart />
  
      {/* Energy Sources - Grid 2 columns for small mobile */}
      {/* <h2 className="text-lg font-semibold text-gray-800 dark:text-white px-2">Sản lượng điện từ các nguồn</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(energyProduction).map(([type, values]) => (
          <div 
            key={type} 
            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {energyTypes[type] || type}
            </h3>
            <p className="text-lg font-bold mt-1 text-gray-800 dark:text-white">
              {values.production} kWh
            </p>
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full" 
                  style={{ width: `${values.percentage}%` }}
                ></div>
              </div>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                {values.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
  
  const renderDesktopView = () => (
    <div className="p-6 space-y-6">
      {/* Quantity Table */}
      <QuantityTable data={quantityData} />
    
      {/* Total Chart */}
      <TotalChart energyData={data} />
    
      {/* Result Chart */}
      <ResultChart />
    
      {/* Energy Sources Grid */}
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