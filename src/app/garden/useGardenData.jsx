'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from "firebase/database";
import { db } from '@/lib/firebaseConfig';

export default function useGardenData() {
  const [data, setData] = useState({
    fishWaterLevel: null,
    chickenHumidity: null,
    chickenTemperature: null,
    mushroomHumidity: null,
    mushroomTemperature: null,
    soilHumidity: null,
    hydroWaterTemp: null,
    lastWateredTime: null,
    lastFedTime: null,
    autoMode: null,
    pumpStatus: null,
    targetSoilPercent: null,
  });

  useEffect(() => {
    const listeners = [];

    const subscribe = (path, key) => {
      const firebaseRef = ref(db, path);
      const unsubscribe = onValue(firebaseRef, (snapshot) => {
        setData((prev) => ({ ...prev, [key]: snapshot.val() }));
      });
      listeners.push(unsubscribe);
    };

    subscribe('garden/fish/waterlevel', 'fishWaterLevel');
    subscribe('garden/chicken/heating/humidity', 'chickenHumidity');
    subscribe('garden/chicken/heating/temperature', 'chickenTemperature');
    subscribe('garden/mushroom/mode/humidity', 'mushroomHumidity');
    subscribe('garden/mushroom/mode/temperature', 'mushroomTemperature');
    subscribe('garden/soil_watering/mode/soil_percent', 'soilHumidity');
    subscribe('garden/hydroponic/mode/water_temp', 'hydroWaterTemp');
    subscribe('garden/soil_watering/last_watered_time', 'lastWateredTime');
    subscribe('garden/chicken/feeding/last_fed_time', 'lastFedTime');
    subscribe('garden/soil_watering/mode/auto_mode', 'autoMode');
    subscribe('garden/soil_watering/mode/pump_status', 'pumpStatus');
    subscribe('garden/soil_watering/mode/target_soil_percent', 'targetSoilPercent');

    return () => {
      listeners.forEach((unsub) => unsub());
    };
  }, []);

  return data;
}
