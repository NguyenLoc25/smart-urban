'use client';
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import SyncStatus from "../../hooks/energy/SyncStatus";
import LoadingState from "./LoadingState";
import MobileView from "./MobileView";
import DesktopView from "./DesktopView";
import { calculateEnergyProduction } from "@/components/energy/ProductCalculator";
import useEnergyTypes from "./hooks/useEnergyTypes";

// Import hooks
import useDeviceData from "@/hooks/energy/useDeviceData";
import useSyncOperations from "@/hooks/energy/useSyncOperations";
import useEnergyData from "@/hooks/energy/useEnergyData";
import useResponsiveLayout from "@/hooks/energy/useResponsiveLayout";
import useEnergyDataFetching from "@/hooks/energy/useEnergyDataFetching";
import { postProductionData } from "@/hooks/energy/apiFunctions";

export default function EnergyPage() {  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSyncTime: null,
    syncInProgressBy: null
  });
  
  // Initialize hooks in proper sequence
  const isMobile = useResponsiveLayout();
  const { postAllData, checkSyncStatus } = useSyncOperations(); // Now comes before useEnergyData
  const { energyDevices, energyData, loadDeviceData, fetchEnergyData } = useDeviceData();
  const { data, dataProcessingStage, dataVersion, setDataVersion, fetchData } = useEnergyData();
  const { renewableEnergy, consumption } = useEnergyDataFetching();
  const energyTypes = useEnergyTypes();
  const auth = getAuth();

  const energyProduction = useMemo(() => 
    calculateEnergyProduction(energyDevices, energyTypes),
    [energyDevices, energyTypes]
  );

  // Sync version changes from Firebase
  useEffect(() => {
    const database = getDatabase();
    const versionRef = ref(database, 'energy/dataVersion');
    
    const unsubscribe = onValue(versionRef, (snapshot) => {
      const version = snapshot.val();
      if (version && version > dataVersion) {
        setDataVersion(version);
        fetchData(checkSyncStatus);
      }
    });

    return () => unsubscribe();
  }, [dataVersion, fetchData, checkSyncStatus]);

  // Listen for sync status changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'energy_sync_status') {
        setSyncStatus(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle data processing stages
  useEffect(() => {
    if (dataProcessingStage === 'initial' && energyDevices.length > 0) {
      setLoading(true);
      postAllData(energyProduction)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (dataProcessingStage === 'fetching') {
      setLoading(true);
      fetchData(checkSyncStatus)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [dataProcessingStage, energyDevices, postAllData, fetchData, energyProduction, checkSyncStatus]);

  // Save production data callback
const saveProductionData = useCallback(async () => {
  try {
    const productionData = {
      entity: "Vietnam",
      metadata: {
        production: Object.entries(energyProduction)
          .filter(([type]) => type !== 'all')
          .reduce((acc, [type, values]) => ({
            ...acc,
            [type]: {
              value: values.production,
              percentage: values.percentage,
              devices: energyDevices
                .filter(device => device.type === type)
                .map(({ id, model, quantity }) => ({ id, model, quantity }))
            }
          }), {})
      }
    };

    const response = await postProductionData(productionData);
    console.log('Post production data completed:', response); // Add this line
    return response;
  } catch (error) {
    console.error("Error saving production data:", error);
    throw error;
  }
}, [energyProduction, energyDevices]);

  // Initialize auth and data loading
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const unsubscribeDevice = loadDeviceData();
        const unsubscribeEnergy = fetchEnergyData();
        
        return () => {
          unsubscribeDevice();
          unsubscribeEnergy();
        };
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, [loadDeviceData, fetchEnergyData]);

  // Save data on initial load
// Handle data processing stages
useEffect(() => {
  const processData = async () => {
    if (dataProcessingStage === 'initial' && energyDevices.length > 0) {
      setLoading(true);
      try {
        // First fetch data
        await fetchData(checkSyncStatus);
        // Then post all data
        const postResult = await postAllData(energyProduction);
        console.log('Post all data completed:', postResult);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else if (dataProcessingStage === 'fetching') {
      setLoading(true);
      try {
        await fetchData(checkSyncStatus);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  processData();
}, [dataProcessingStage, energyDevices, postAllData, fetchData, energyProduction, checkSyncStatus]);

  // Save data before unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (energyDevices.length > 0) {
        await saveProductionData();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [energyDevices, saveProductionData]);

  if (loading) {
    return <LoadingState dataProcessingStage={dataProcessingStage} energyDevices={energyDevices} />;
  }

  if (error) return <div className="text-red-500 p-4">❌ Lỗi: {error}</div>;

  return (
    <>
      {isMobile ? 
        <MobileView energyData={energyData} data={data} /> : 
        <DesktopView 
          energyData={energyData} 
          data={data} 
          renewableEnergy={renewableEnergy} 
          consumption={consumption} 
          error={error} 
          loading={loading}
          energyProduction={energyProduction} 
        />
      }
      <SyncStatus 
        syncStatus={syncStatus} 
        lastSyncTime={syncStatus.lastSyncTime} 
      />
    </>
  );
}