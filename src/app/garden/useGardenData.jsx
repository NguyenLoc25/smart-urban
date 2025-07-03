//src/app/garden/useGardenData.jsx
'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from "firebase/database";
import { db} from '@/lib/firebaseConfig';

export default function useGardenData() {
  const [data, setData] = useState({
    fishWaterLevel: null,
    chickenHumidity: null,
    chickenTemperature: null,
    mushroomHumidity: null,
    mushroomTemperature: null,
    soilHumidity: null,
    hydroWaterTemp: null,
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
    subscribe('garden/hydroponic/mode/water_temp','hydroWaterTemp' )


    return () => {
      listeners.forEach((unsub) => unsub());
    };
  }, []);

  return data;
}
