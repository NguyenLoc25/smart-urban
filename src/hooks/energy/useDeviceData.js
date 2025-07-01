import { useState, useCallback } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

function createDeviceObject(id, type, device) {
  const baseInfo = {
    id,
    type,
    energy_type: type,
    model: device.question_header || 'default',
    quantity: device.quantity || 0,
    info: {
      power: device.power || (type === 'Solar' ? '0 kW' : '0 MW'),
      efficiency: device.efficiency || (type === 'Hydro' ? '80' : '0'),
      quantity: device.quantity,
      model: device.question_header || 'default',
    }
  };

  if (type === 'Hydro') {
    baseInfo.info.flow_rate = device.flowRate || '0';
  }

  return baseInfo;
}

export default function useDeviceData() {
  const [energyDevices, setEnergyDevices] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  
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
              devices.push(createDeviceObject(id, 'Solar', device));
            });
          }
          
          if (data.hydro) {
            Object.entries(data.hydro).forEach(([id, device]) => {
              if (device.status !== "Active") return;
              devices.push(createDeviceObject(id, 'Hydro', device));
            });
          }
          
          if (data.wind) {
            Object.entries(data.wind).forEach(([id, device]) => {
              if (device.status !== "Active") return;
              devices.push(createDeviceObject(id, 'Wind', device));
            });
          }
          
          setEnergyDevices(devices);
        }
      });
    } catch (err) {
      console.error("Error loading device data:", err);
    }
  }, []);

  const fetchEnergyData = useCallback(() => {
    const database = getDatabase();
    const physicInfoRef = ref(database, 'energy/physic-info');
    
    const unsubscribe = onValue(physicInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEnergyData(Object.values(data));
      }
    });

    return unsubscribe;
  }, []);

  return { energyDevices, energyData, loadDeviceData, fetchEnergyData };
}