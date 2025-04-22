import { useMemo } from 'react';

// Hàm parse giá trị số từ các định dạng Firebase
const parseFirebaseNumber = (value, defaultValue = 0) => {
  if (typeof value === 'number') return value;
  if (value === null || value === undefined) return defaultValue;
  
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
    if (value === null || value === undefined) return 0;
    
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
    if (!itemInfo || typeof itemInfo !== 'object') {
      console.error(`Invalid itemInfo for type ${type}`, itemInfo);
      return 0;
    }
    // console.log('Full itemInfo:', itemInfo); // Thêm dòng này để debug

    const quantity = Math.max(parseFirebaseNumber(itemInfo.quantity), 1);
    // console.log(parseFirebaseNumber(itemInfo.quantity));
    const efficiency = parseFirebaseNumber(itemInfo.efficiency) / 100;
    // console.log(parseFirebaseNumber(itemInfo.efficiency));

    switch (type) {
      case 'Solar': {
        // console.log(parseFirebaseNumber(itemInfo.quantity))
        if (efficiency <= 0) {
          console.warn(`Invalid solar efficiency:`, itemInfo.efficiency);
          return 0;
        }
        return power * efficiency * 5 * quantity; // 5 effective sun hours/day
      }

      case 'Wind': {
        if (efficiency <= 0) {
          console.warn(`Invalid wind efficiency:`, itemInfo.efficiency);
          return 0;
        }
        return power * efficiency * 12 * quantity; // 12 effective wind hours/day
      }

      case 'Hydro': {
        const flowRate = parseFirebaseNumber(itemInfo.flow_rate);
        const headHeight = parseFirebaseNumber(itemInfo.head_height);
        
        // Validation
        const errors = [];
        if (efficiency <= 0) errors.push('efficiency');
        if (flowRate <= 0) errors.push('flow_rate');
        if (headHeight <= 0) errors.push('head_height');
        
        if (errors.length > 0) {
          console.warn(`Invalid hydro parameters (${errors.join(', ')}):`, itemInfo);
          
          // Fallback: use rated power if available
          if (itemInfo.power !== null && itemInfo.power !== undefined) {
            console.warn('Using rated power as fallback');
            return parsePower(itemInfo.power, 'Hydro') * 24 * quantity;
          }
          return 0;
        }

        // Calculate hydro power (kW)
        const powerKW = efficiency * 1000 * 9.81 * flowRate * headHeight / 1000;
        
        // Daily production (kWh)
        return powerKW * 24 * quantity;
      }

      default:
        console.warn(`Unknown energy type "${type}" in calculateEnergy`);
        return 0;
    }
  };

  // Tính toán cho từng loại năng lượng
  Object.keys(energyTypes || {}).forEach((type) => {
    if (type === "all") return;

    const items = (data || []).filter((d) => d?.type === type);
    if (!items.length) {
      result[type] = { production: 0, percentage: '0.0' };
      return;
    }

    const production = items.reduce((sum, item) => {
      const itemPower = parsePower(item.info?.power, type);
      return sum + calculateEnergy(itemPower, type, item.info || {});
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
      return {
        all: { production: 0, percentage: '0.0' },
        ...Object.fromEntries(
          Object.keys(energyTypes || {}).map(type => [type, { production: 0, percentage: '0.0' }])
        )
      };
    }

    if (!energyTypes || typeof energyTypes !== 'object' || Object.keys(energyTypes).length === 0) {
      console.error('Invalid energyTypes: expected non-empty object', energyTypes);
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