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
export const calculateEnergyProduction = (data, energyTypes, config = {}) => {
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

  // Tổng hợp
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
export const useEnergyProduction = (data, energyTypes, config) => {
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
