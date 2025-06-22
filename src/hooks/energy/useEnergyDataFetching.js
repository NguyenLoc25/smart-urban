import { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";

export default function useEnergyDataFetching() {
  const [renewableEnergy, setRenewableEnergy] = useState(0);
  const [consumption, setConsumption] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    
    const fetchData = () => {
      const productionRef = ref(db, 'energy/totalProduction');
      const productionUnsub = onValue(productionRef, (snapshot) => {
        try {
          const data = snapshot.val();
          const productionKey = Object.keys(data)[0];
          const productionData = data[productionKey]?.production;
          
          if (productionData) {
            const { Hydro, Solar, Wind } = productionData;
            const totalRenewable = (Hydro?.value || 0) + (Solar?.value || 0) + (Wind?.value || 0);
            setRenewableEnergy(totalRenewable);
          } else {
            setError('Dữ liệu sản xuất không có cấu trúc như mong đợi');
          }
        } catch (err) {
          setError('Lỗi khi đọc dữ liệu sản xuất năng lượng');
        }
      }, (error) => {
        setError('Lỗi kết nối đến dữ liệu sản xuất năng lượng');
      });
    
      const cityRef = ref(db, 'energy/city');
      const cityUnsub = onValue(cityRef, (snapshot) => {
        try {
          const data = snapshot.val();
          if (data && typeof data === 'object') {
            const cityArray = Object.values(data);
            if (cityArray.length > 0) {
              const latest = cityArray.sort((a, b) => {
                const dateA = new Date(a.year, a.month - 1, a.day);
                const dateB = new Date(b.year, b.month - 1, b.day);
                return dateB - dateA;
              })[0];
              setConsumption(latest.production);
              setLoading(false);
            }
          }
        } catch (err) {
          setError('Lỗi khi đọc dữ liệu tiêu thụ năng lượng');
        }
      });
    
      return () => {
        productionUnsub();
        cityUnsub();
      };
    };

    const unsubscribe = fetchData();
    return unsubscribe;
  }, []);

  useEffect(() => {
    const saveProductionData = async () => {
      try {
        const db = getDatabase();
        const now = new Date();
        
        const productionData = {
          totalProduction: {
            timestamp: now.toISOString(),
            production: {
              Hydro: { value: renewableEnergy * 0.4 },
              Solar: { value: renewableEnergy * 0.3 },
              Wind: { value: renewableEnergy * 0.3 }
            }
          }
        };

        const productionRef = ref(db, 'energy/totalProduction');
        await set(productionRef, productionData);
      } catch (err) {
        setError('Lỗi khi lưu dữ liệu sản xuất');
      }
    };

    if (renewableEnergy > 0) {
      saveProductionData();
    }
  }, [renewableEnergy]);

  return { renewableEnergy, consumption, loading, error };
}