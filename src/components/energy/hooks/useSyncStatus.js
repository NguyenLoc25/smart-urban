import { useCallback } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";

export function useSyncStatus(auth) {
  const checkSyncStatus = useCallback(async () => {
    const database = getDatabase();
    const syncRef = ref(database, 'energy/syncStatus');
    
    return new Promise((resolve) => {
      onValue(syncRef, (snapshot) => {
        const status = snapshot.val();
        resolve(status || { isSyncing: false, syncInProgressBy: null });
      }, { onlyOnce: true });
    });
  }, []);

  const lockSync = useCallback(async (userId) => {
    const database = getDatabase();
    const syncRef = ref(database, 'energy/syncStatus');
    
    try {
      const newStatus = {
        isSyncing: true,
        syncInProgressBy: userId,
        timestamp: Date.now()
      };
      
      await set(syncRef, newStatus);
      localStorage.setItem('energy_sync_status', JSON.stringify(newStatus));
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const unlockSync = useCallback(async () => {
    const database = getDatabase();
    const syncRef = ref(database, 'energy/syncStatus');
    
    try {
      const newStatus = {
        isSyncing: false,
        syncInProgressBy: null,
        timestamp: Date.now()
      };
      
      await set(syncRef, newStatus);
      localStorage.setItem('energy_sync_status', JSON.stringify(newStatus));
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  return { checkSyncStatus, lockSync, unlockSync };
}