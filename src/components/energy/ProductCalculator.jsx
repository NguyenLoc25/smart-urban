import { useMemo } from 'react';

// Hàm parse giá trị số từ các định dạng Firebase
const parseFirebaseNumber = (value, defaultValue = 0) => {
  if (typeof value === 'number') return value;
  if (!value) return defaultValue;
  
  try {
    // Xử lý các trường hợp: "85%", "1,500", "1,200 MW"
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

// Hàm chính tính toán
export const calculateEnergyProduction = (data, energyTypes) => {
  const result = {};
  let totalProduction = 0;

  const parsePower = (value, type) => {
    const numValue = parseFirebaseNumber(value);
    
    switch (type) {
      case 'Solar':
        return numValue / 1000; // Chuyển từ W sang kW
      case 'Wind':
      case 'Hydro':
        return numValue * 1000; // Chuyển từ MW sang kW
      default:
        console.warn(`Unknown energy type "${type}" in parsePower`);
        return numValue;
    }
  };

  const calculateEnergy = (power, type, itemInfo) => {
    if (!itemInfo) {
      console.error(`Missing itemInfo for type ${type}`);
      return 0;
    }

    switch (type) {
      case 'Solar': {
        const efficiency = parseFirebaseNumber(itemInfo.efficiency) / 100;
        if (efficiency <= 0) {
          console.warn(`Invalid solar efficiency:`, itemInfo.efficiency);
          return 0;
        }
        return power * efficiency * 5; // 5 giờ nắng hiệu quả/ngày
      }

      case 'Wind': {
        const efficiency = parseFirebaseNumber(itemInfo.efficiency) / 100;
        if (efficiency <= 0) {
          console.warn(`Invalid wind efficiency:`, itemInfo.efficiency);
          return 0;
        }
        return power * efficiency * 12; // 12 giờ gió hiệu quả/ngày
      }

      case 'Hydro': {
        const efficiency = parseFirebaseNumber(itemInfo.efficiency) / 100;
        const flowRate = parseFirebaseNumber(itemInfo.flow_rate);
        const headHeight = parseFirebaseNumber(itemInfo.head_height);
        
        // Validation dữ liệu
        const errors = [];
        if (efficiency <= 0) errors.push('efficiency');
        if (flowRate <= 0) errors.push('flow_rate');
        if (headHeight <= 0) errors.push('head_height');
        
        if (errors.length > 0) {
          console.warn(`Invalid hydro parameters (${errors.join(', ')}):`, itemInfo);
          
          // Fallback: sử dụng công suất danh định nếu có
          if (itemInfo.power) {
            console.warn('Using rated power as fallback');
            return parsePower(itemInfo.power, 'Hydro') * 24;
          }
          return 0;
        }

        // Tính toán công suất thủy điện (kW)
        const powerKW = efficiency * 1000 * 9.81 * flowRate * headHeight / 1000;
        
        // Sản lượng hàng ngày (kWh)
        return powerKW * 24;
      }

      default:
        console.warn(`Unknown energy type "${type}" in calculateEnergy`);
        return 0;
    }
  };

  // Tính toán cho từng loại năng lượng
  Object.keys(energyTypes).forEach((type) => {
    if (type === "all") return;

    const items = data.filter((d) => d.type === type);
    if (!items.length) {
      console.warn(`No items found for energy type: ${type}`);
      result[type] = { production: 0, percentage: '0.0' };
      return;
    }

    const production = items.reduce((sum, item) => {
      const itemPower = parsePower(item.info?.power, type);
      return sum + calculateEnergy(itemPower, type, item.info);
    }, 0);

    result[type] = { production };
    totalProduction += production;
  });

  // Tính toán tổng sản lượng
  result.all = { 
    production: parseFloat(totalProduction.toFixed(2)),
    percentage: '100.0' 
  };

  // Tính phần trăm đóng góp
  Object.keys(result).forEach((type) => {
    if (type === "all") return;
    
    result[type].percentage = totalProduction > 0
      ? ((result[type].production / totalProduction) * 100).toFixed(1)
      : '0.0';
    result[type].production = parseFloat(result[type].production.toFixed(2));
  });

  return result;
};

// Custom hook
export const useEnergyProduction = (data, energyTypes) => {
  return useMemo(() => {
    // Validate input
    if (!Array.isArray(data) || data.length === 0) {
      // console.error('Invalid data: expected non-empty array', data);
      return {
        all: { production: 0, percentage: '0.0' },
        ...Object.fromEntries(
          Object.keys(energyTypes || {}).map(type => [type, { production: 0, percentage: '0.0' }])
        )
      };
    }

    if (!energyTypes || typeof energyTypes !== 'object') {
      console.error('Invalid energyTypes: expected object', energyTypes);
      return {
        all: { production: 0, percentage: '0.0' },
        Solar: { production: 0, percentage: '0.0' },
        Wind: { production: 0, percentage: '0.0' },
        Hydro: { production: 0, percentage: '0.0' }
      };
    }

    return calculateEnergyProduction(data, energyTypes);
  }, [data, energyTypes]);
};