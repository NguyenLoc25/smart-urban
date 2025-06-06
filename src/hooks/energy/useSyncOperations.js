import { useRef, useCallback } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import useSyncStatus from "./useSyncStatus";
import { postHourlyData } from "./apiFunctions";

const EFFECTIVE_HOURS_CONFIG = {
  Solar: {
    energyField: "Electricity from solar - TWh"
  },
  Wind: {
    energyField: "Electricity from wind - TWh"
  },
  Hydro: {
    energyField: "Electricity from hydro - TWh"
  }
};

export default function useSyncOperations() {
  const auth = getAuth();
  const { checkSyncStatus, lockSync, unlockSync } = useSyncStatus(auth);
  const postedEntriesRef = useRef(new Set());
  const hasPostedRef = useRef(false);

  const postAllData = useCallback(async (energyProduction) => {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("Người dùng chưa đăng nhập");
    }
  
    const currentSyncStatus = await checkSyncStatus();
    
    if (currentSyncStatus.isSyncing) {
      if (currentSyncStatus.syncInProgressBy === user.uid) {
        return;
      } else {
        throw new Error("Đồng bộ đang được thực hiện bởi người dùng khác");
      }
    }
  
    const lockAcquired = await lockSync(user.uid);
    if (!lockAcquired) {
      throw new Error("Không thể khóa đồng bộ, có thể đang được thực hiện bởi người khác");
    }
  
    try {
      const database = getDatabase();
      const renewableHourRef = ref(db, "energy/renewable/hour");
      
      // Instead of removing the entire database, we'll update only what's needed
      postedEntriesRef.current = new Set();

      const postRequests = Object.entries(energyProduction).flatMap(([type, values]) => {
        if (type === "all" || !values.dbEntries || values.dbEntries.length === 0) {
          return [];
        }

        return values.dbEntries
          .filter(entry => {
            const key = `${type}-${entry.Entity}-${entry.Hour}-${entry.Month}-${entry.Year}`;
            return !postedEntriesRef.current.has(key);
          })
          .map(entry => {
            const key = `${type}-${entry.Entity}-${entry.Hour}-${entry.Month}-${entry.Year}`;
            const requestData = {
              id: key,
              Electricity: entry[EFFECTIVE_HOURS_CONFIG[type].energyField],
              Entity: entry.Entity,
              Hour: entry.Hour,
              Month: entry.Month,
              Year: entry.Year,
              code: entry.code || "VNM"
            };

            postedEntriesRef.current.add(key);
            return postHourlyData(type, [requestData]);
          });
      });

      const responses = await Promise.all(postRequests);
      const results = await Promise.all(responses);
      
      // Update version only if there were changes
      if (results.length > 0) {
        const versionRef = ref(database, 'energy/dataVersion');
        const currentVersion = (await get(versionRef)).val() || 0;
        await set(versionRef, currentVersion + 1);
      }
      
      hasPostedRef.current = true;
      return results;
    } finally {
      await unlockSync();
    }
  }, [checkSyncStatus, lockSync, unlockSync, auth]);

  return { postAllData, checkSyncStatus };
}