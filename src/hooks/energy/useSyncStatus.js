import { useState, useEffect, useCallback } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";

export default function useSyncStatus(auth) {
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSyncTime: null,
    syncInProgressBy: null
  });

  // Listen for sync status changes
  useEffect(() => {
    const db = getDatabase();
    const syncStatusRef = ref(db, 'energy/syncStatus');
    
    const unsubscribe = onValue(syncStatusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSyncStatus({
          isSyncing: data.isSyncing,
          lastSyncTime: data.lastSyncTime,
          syncInProgressBy: data.syncInProgressBy
        });
        
        // Also store in localStorage for cross-tab communication
        localStorage.setItem('energy_sync_status', JSON.stringify(data));
      }
    });

    return () => unsubscribe();
  }, []);

  // Check current sync status
  const checkSyncStatus = useCallback(async () => {
    return new Promise((resolve) => {
      const db = getDatabase();
      const syncStatusRef = ref(db, 'energy/syncStatus');
      
      onValue(syncStatusRef, (snapshot) => {
        const data = snapshot.val();
        resolve(data || {
          isSyncing: false,
          lastSyncTime: null,
          syncInProgressBy: null
        });
      }, { onlyOnce: true });
    });
  }, []);

  // Lock the sync process
  const lockSync = useCallback(async (userId) => {
    const currentStatus = await checkSyncStatus();
    if (currentStatus.isSyncing) {
      return false;
    }

    try {
      const db = getDatabase();
      const syncStatusRef = ref(db, 'energy/syncStatus');
      await set(syncStatusRef, {
        isSyncing: true,
        lastSyncTime: currentStatus.lastSyncTime,
        syncInProgressBy: userId,
        lockedAt: Date.now()
      });
      return true;
    } catch (error) {
      console.error("Failed to lock sync:", error);
      return false;
    }
  }, [checkSyncStatus]);

  // Unlock the sync process
  const unlockSync = useCallback(async () => {
    try {
      const db = getDatabase();
      const syncStatusRef = ref(db, 'energy/syncStatus');
      await set(syncStatusRef, {
        isSyncing: false,
        lastSyncTime: new Date().toISOString(),
        syncInProgressBy: null
      });
      return true;
    } catch (error) {
      console.error("Failed to unlock sync:", error);
      return false;
    }
  }, []);

  return {
    syncStatus,
    checkSyncStatus,
    lockSync,
    unlockSync
  };
}