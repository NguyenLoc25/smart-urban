import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const WindPlace = () => {
  const [turbines, setTurbines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const windPlaceRef = ref(db, 'energy/signal-status/windplace');

    const unsubscribe = onValue(windPlaceRef, (snapshot) => {
      const data = snapshot.val() || {};
      const turbineArray = [];
      let latestUpdate = 0;

      Object.entries(data).forEach(([rowKey, rowData]) => {
        Object.entries(rowData).forEach(([colKey, turbineData]) => {
          if (turbineData) {
            turbineArray.push({
              id: `${rowKey}-${colKey}`,
              status: turbineData.status || 'stopped',
              position: turbineData.position || { row: parseInt(rowKey), col: parseInt(colKey) },
              lastUpdate: turbineData.lastUpdate || 0,
              powerOutput: turbineData.powerOutput || 0,
              efficiency: turbineData.efficiency || 0,
            });
            if (turbineData.lastUpdate > latestUpdate) {
              latestUpdate = turbineData.lastUpdate;
            }
          }
        });
      });

      setTurbines(turbineArray);
      setLastUpdated(latestUpdate);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading turbine data...</p>
      </div>
    );
  }

  // Determine grid size based on turbine positions
  const maxRow = Math.max(...turbines.map(t => t.position.row), 0) || 3;
  const maxCol = Math.max(...turbines.map(t => t.position.col), 0) || 3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">Wind Farm Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time monitoring of turbine performance
              </p>
            </div>
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date(lastUpdated * 1000).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Active Turbines</h3>
              <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold mt-3 text-gray-800 dark:text-white">
              {turbines.filter(t => t.status === 'running').length}
              <span className="text-base text-gray-500 dark:text-gray-400">/{turbines.length}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Output</h3>
              <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/30">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold mt-3 text-gray-800 dark:text-white">
              {turbines.reduce((sum, turbine) => sum + (turbine.powerOutput || 0), 0).toFixed(2)} kW
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Avg Efficiency</h3>
              <div className="p-2 rounded-full bg-purple-50 dark:bg-purple-900/30">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold mt-3 text-gray-800 dark:text-white">
              {turbines.length > 0 
                ? (turbines.reduce((sum, turbine) => sum + (turbine.efficiency || 0), 0) / turbines.length).toFixed(1) 
                : '0'}%
            </p>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Wind Farm Layout</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Running</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Stopped</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-1"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Offline</span>
                </div>
              </div>
            </div>
            
            {/* Map Grid */}
            <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="relative" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio */}
                <div className="absolute inset-0 grid gap-2" 
                  style={{ 
                    gridTemplateRows: `repeat(${maxRow}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${maxCol}, minmax(0, 1fr))`
                  }}>
                  {Array.from({ length: maxRow }).map((_, rowIndex) => (
                    Array.from({ length: maxCol }).map((_, colIndex) => {
                      const row = rowIndex + 1;
                      const col = colIndex + 1;
                      const turbine = turbines.find(t => t.position.row === row && t.position.col === col);
                      
                      return (
                        <div 
                          key={`${row}-${col}`}
                          className={`relative flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                            turbine 
                              ? turbine.status === 'running' 
                                ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' 
                                : 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20'
                              : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50'
                          }`}
                        >
                          <div className="absolute top-1 left-1 text-xs text-gray-500 dark:text-gray-400">
                            {row}-{col}
                          </div>
                          
                          {turbine ? (
                            <>
                              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-1 ${
                                turbine.status === 'running' 
                                  ? 'bg-blue-100 dark:bg-blue-800' 
                                  : 'bg-amber-100 dark:bg-amber-800'
                              }`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  className={`w-5 h-5 md:w-6 md:h-6 ${
                                    turbine.status === 'running'
                                      ? 'text-blue-600 dark:text-blue-300 animate-spin-slow'
                                      : 'text-amber-600 dark:text-amber-300'
                                  }`}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z"
                                  />
                                </svg>
                              </div>
                              
                              <div className="text-center px-1">
                                <p className="text-xs font-semibold ${
                                  turbine.status === 'running' 
                                    ? 'text-blue-700 dark:text-blue-300' 
                                    : 'text-amber-700 dark:text-amber-300'
                                }">
                                  {turbine.powerOutput.toFixed(1)} kW
                                </p>
                                <p className="text-[0.65rem] text-gray-500 dark:text-gray-400">
                                  {turbine.efficiency.toFixed(1)}%
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-400 dark:text-gray-500 text-sm italic">
                              Empty
                            </div>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Turbine List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Turbine Details</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="col-span-2 md:col-span-1 text-xs font-medium text-gray-500 dark:text-gray-400">ID</div>
              <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400">Status</div>
              <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:block">Location</div>
              <div className="col-span-3 text-xs font-medium text-gray-500 dark:text-gray-400">Power Output</div>
              <div className="col-span-3 text-xs font-medium text-gray-500 dark:text-gray-400">Efficiency</div>
              <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400 hidden md:block">Last Update</div>
            </div>
            
            {turbines.length > 0 ? (
              turbines.map((turbine) => (
                <div key={turbine.id} className="grid grid-cols-12 p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <div className="col-span-2 md:col-span-1 font-medium text-sm text-gray-800 dark:text-gray-200">{turbine.id}</div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      turbine.status === 'running'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                    }`}>
                      {turbine.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300 hidden sm:block">{turbine.position.row}-{turbine.position.col}</div>
                  <div className="col-span-3 text-sm font-medium ${
                    turbine.status === 'running' 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-amber-600 dark:text-amber-400'
                  }">
                    {turbine.powerOutput.toFixed(2)} kW
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            turbine.efficiency > 75 
                              ? 'bg-green-500' 
                              : turbine.efficiency > 50 
                                ? 'bg-blue-500' 
                                : turbine.efficiency > 25 
                                  ? 'bg-amber-500' 
                                  : 'bg-red-500'
                          }`}
                          style={{ width: `${turbine.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{turbine.efficiency.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                    {new Date(turbine.lastUpdate * 1000).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No turbine data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindPlace;