import { useMemo } from 'react';

// Hàm parse giá trị số từ các định dạng Firebase
const parseFirebaseNumber = (value, defaultValue = 0) => {
  if (typeof value === 'number') return value;
  if (value === null || value === undefined) return defaultValue;
  
  try {
    const cleaned = String(value)
      .replace(/%/g, '')
      .replace(/,/g, '')
      .replace(/[^\d.-]/g, '');
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? defaultValue : parsed;
  } catch (error) {
    console.error('Error parsing value:', value, error);
    return defaultValue;
  }
};

// Cấu hình giờ hiệu quả cho từng loại năng lượng
const EFFECTIVE_HOURS_CONFIG = {
  Solar: {
    effectiveHours: [9, 10, 11, 12, 13], // 9h-14h (5 giờ hiệu quả)
    energyField: "Electricity from solar - TWh"
  },
  Wind: {
    effectiveHours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], // 6h-18h (12 giờ)
    energyField: "Electricity from wind - TWh"
  },
  Hydro: {
    effectiveHours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], // Tất cả 24 giờ
    energyField: "Electricity from hydro - TWh"
  }
};

// Hàm chính tính toán
export const calculateEnergyProduction = (data, energyTypes) => {
  const result = {};
  let totalProduction = 0;

  const parsePower = (value, type) => {
    if (value === null || value === undefined) return 0;
    
    const numValue = parseFirebaseNumber(value);
    
    switch (type) {
      case 'Solar':
        return numValue / 1000; // W → kW
      case 'Wind':
      case 'Hydro':
        return numValue * 1000; // MW → kW
      default:
        return numValue;
    }
  };

  const calculateDailyEnergy = (power, type, itemInfo) => {
    if (!itemInfo || typeof itemInfo !== 'object') return 0;

    const quantity = Math.max(parseFirebaseNumber(itemInfo.quantity), 1);
    const efficiency = parseFirebaseNumber(itemInfo.efficiency) / 100;

    switch (type) {
      case 'Solar': {
        if (efficiency <= 0) return 0;
        return power * efficiency * 5 * quantity; // 5 effective hours
      }

      case 'Wind': {
        if (efficiency <= 0) return 0;
        return power * efficiency * 12 * quantity; // 12 effective hours
      }

      case 'Hydro': {
        const flowRate = parseFirebaseNumber(itemInfo.flow_rate);
        const headHeight = parseFirebaseNumber(itemInfo.head_height);
        
        if (efficiency <= 0 || flowRate <= 0 || headHeight <= 0) {
          // Fallback to rated power if available
          if (itemInfo.power !== null && itemInfo.power !== undefined) {
            return parsePower(itemInfo.power, 'Hydro') * 24 * quantity;
          }
          return 0;
        }

        const powerKW = efficiency * 1000 * 9.81 * flowRate * headHeight / 1000;
        return powerKW * 24 * quantity;
      }

      default:
        return 0;
    }
  };

  // Tính toán sản lượng theo giờ và tạo dữ liệu để lưu vào database
  const createHourlyData = (dailyProduction, type, entity, date) => {
    const config = EFFECTIVE_HOURS_CONFIG[type];
    const effectiveHoursCount = config.effectiveHours.length;
    const hourlyValue = dailyProduction / effectiveHoursCount;
    
    // Tạo mảng dữ liệu cho từng giờ hiệu quả
    return config.effectiveHours.map(hour => ({
      code: "VNM", // Mã quốc gia, có thể điều chỉnh
      [config.energyField]: hourlyValue,
      Entity: entity,
      Hour: hour,
      Month: date.getMonth() + 1,
      Year: date.getFullYear(),
      timestamp: new Date().toISOString()
    }));
  };

  // Tính toán cho từng loại năng lượng
  Object.keys(energyTypes || {}).forEach((type) => {
    if (type === "all") return;

    const items = (data || []).filter((d) => d?.type === type);
    if (!items.length) {
      result[type] = { 
        production: 0, 
        percentage: '0.0',
        hourlyProduction: Array(24).fill(0),
        dbEntries: [] // Thêm mảng để lưu dữ liệu cho database
      };
      return;
    }

    // Tính tổng sản lượng 1 ngày
    const dailyProduction = items.reduce((sum, item) => {
      const itemPower = parsePower(item.info?.power, type);
      return sum + calculateDailyEnergy(itemPower, type, item.info || {});
    }, 0);

    // Tạo dữ liệu để lưu vào database
    const entity = items[0].info?.entity || "Vietnam";
    const date = new Date();
    const dbEntries = createHourlyData(dailyProduction, type, entity, date);
    
    // Phân bổ vào các giờ hiệu quả (cho UI)
    const hourlyProduction = Array.from({length: 24}, (_, hour) => 
      EFFECTIVE_HOURS_CONFIG[type].effectiveHours.includes(hour) 
        ? dailyProduction / EFFECTIVE_HOURS_CONFIG[type].effectiveHours.length 
        : 0
    );
    
    result[type] = { 
      production: parseFloat(dailyProduction.toFixed(2)),
      percentage: '0.0',
      hourlyProduction: hourlyProduction.map(val => parseFloat(val.toFixed(2))),
      dbEntries: dbEntries // Dữ liệu để lưu vào database
    };
    
    totalProduction += dailyProduction;
  });

  // Tính toán tổng sản lượng
  result.all = { 
    production: parseFloat(totalProduction.toFixed(2)),
    percentage: '100.0',
    hourlyProduction: Array(24).fill(0),
    dbEntries: [] // Tổng không cần lưu theo giờ
  };

  // Tính tổng sản lượng từng giờ
  Object.keys(result).forEach(type => {
    if (type !== "all" && result[type].hourlyProduction) {
      result[type].hourlyProduction.forEach((value, hour) => {
        result.all.hourlyProduction[hour] += value;
      });
    }
  });

  // Làm tròn giá trị từng giờ của tổng
  result.all.hourlyProduction = result.all.hourlyProduction.map(val => parseFloat(val.toFixed(2)));

  // Tính phần trăm đóng góp
  Object.keys(result).forEach((type) => {
    if (type === "all") return;
    result[type].percentage = totalProduction > 0
      ? ((result[type].production / totalProduction) * 100).toFixed(1)
      : '0.0';
  });

  return result;
};

// Custom hook
export const useEnergyProduction = (data, energyTypes) => {
  return useMemo(() => {
    const emptyResult = {
      production: 0,
      percentage: '0.0',
      hourlyProduction: Array(24).fill(0),
      dbEntries: []
    };

    if (!Array.isArray(data) || data.length === 0) {
      return {
        all: {...emptyResult},
        ...Object.fromEntries(
          Object.keys(energyTypes || {}).map(type => [type, {...emptyResult}])
        )
      };
    }

    if (!energyTypes || typeof energyTypes !== 'object') {
      return {
        all: {...emptyResult},
        Solar: {...emptyResult},
        Wind: {...emptyResult},
        Hydro: {...emptyResult}
      };
    }

    return calculateEnergyProduction(data, energyTypes);
  }, [data, energyTypes]);
};