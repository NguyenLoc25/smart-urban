import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import TotalChart from "@/components/energy/TotalChart"; 
import QuantityTable from "@/components/energy/QuantityTable";
import ResultChart from "@/components/energy/ResultChart"; 
import { useEnergyProduction } from "@/components/energy/EnergyProductionCalculator";

export default function EnergyPage() {
  const [cityConsumptionData, setCityConsumptionData] = useState([
    { time: "00:00", deficit: 100 },
    { time: "06:00", deficit: 150 },
    { time: "12:00", deficit: 200 },
    { time: "18:00", deficit: 250 },
    { time: "24:00", deficit: 180 },
  ]);

  
  const [energyDevices, setEnergyDevices] = useState([]);
  const [data, setData] = useState({ yearly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantityData, setQuantityData] = useState({
    total: 0,
    used: 0,
    available: 0,
    solar: 0,
    hydro: 0,
    wind: 0
  });

  const colors = {
    deficit: "#FF5733",
  };

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
          fetch("/api/energy_use_data/year/solar"),
          fetch("/api/energy_use_data/year/wind"),
          fetch("/api/energy_use_data/year/hydro"),
          fetch("/api/energy_use_data/month/solar"),
          fetch("/api/energy_use_data/month/wind"),
          fetch("/api/energy_use_data/month/hydro"),
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

  const loadData = () => {
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
                info: {
                  power: device.power || '0 kW',
                  efficiency: device.efficiency || '0'
                }
              });
            });
          }
          
          if (data.hydro) {
            Object.entries(data.hydro).forEach(([id, device]) => {
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
          
          if (data.wind) {
            Object.entries(data.wind).forEach(([id, device]) => {
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

          const solarCount = data.solar ? Object.keys(data.solar).length : 0;
          const hydroCount = data.hydro ? Object.keys(data.hydro).length : 0;
          const windCount = data.wind ? Object.keys(data.wind).length : 0;
          const total = solarCount + hydroCount + windCount;
          
          setQuantityData({
            total,
            used: total,
            available: total * 2,
            solar: solarCount,
            hydro: hydroCount,
            wind: windCount
          });

          setLoading(false);
        } else {
          setError("No data available");
          setLoading(false);
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

  return (
    <div className="p-6 space-y-8">
      {/* Quantity Table Section */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Thống kê vị trí</h2>
        <QuantityTable data={quantityData} />
      </div>
  
      {/* Energy Production Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Sản lượng điện theo năm</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <TotalChart energyData={data} />
          </div>
        </div>
  
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tiêu thụ điện theo thành phố</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <ResultChart data={cityConsumptionData} colors={colors} />
          </div>
        </div>
      </div>
  
      {/* Energy Sources Grid */}
      <div className="space-y-2">
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
  
      {/* Consumption Table */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chênh lệch công suất theo giờ</h2>
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg overflow-hidden border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="p-3 font-medium text-gray-700 dark:text-gray-300">Thời gian</th>
                <th className="p-3 font-medium text-gray-700 dark:text-gray-300">Chênh lệch (MW)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {cityConsumptionData.map((row, index) => (
                <tr 
                  key={index} 
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td className="p-3 text-gray-600 dark:text-gray-300">{row.time}</td>
                  <td className={`p-3 font-medium ${
                    row.deficit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {row.deficit >= 0 ? '+' : ''}{row.deficit} MW
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}