import React, { useEffect, useState, useCallback } from 'react';
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

      // Ensure exactly 6 turbines (2x3 grid), filling empty spots with null
      const gridTurbines = [];
      for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 2; col++) {
          const turbine = turbineArray.find(t => t.position.row === row && t.position.col === col);
          gridTurbines.push(turbine || null);
        }
      }

      setTurbines(gridTurbines);
      setLastUpdated(latestUpdate);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderTurbine = useCallback((turbine, index) => {
    if (!turbine) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 text-xs">Offline</span>
          </div>
        </div>
      );
    }

    return (
      <div
        className="relative flex flex-col items-center group"
        role="button"
        tabIndex={0}
        aria-label={`Turbine ${turbine.id}, Status: ${turbine.status}, Power: ${turbine.powerOutput.toFixed(1)} kW, Efficiency: ${turbine.efficiency.toFixed(1)}%`}
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            turbine.status === 'running'
              ? 'bg-green-100 dark:bg-green-800 shadow-lg shadow-green-200 dark:shadow-green-900/50'
              : 'bg-red-100 dark:bg-red-800 shadow-lg shadow-red-200 dark:shadow-red-900/50'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`w-10 h-10 ${
              turbine.status === 'running'
                ? 'text-green-600 dark:text-green-300'
                : 'text-red-600 dark:text-red-300'
            }`}
          >
            {/* Tower */}
            <path stroke="currentColor" strokeWidth="1.5" d="M12 18V10" />
            {/* Blades */}
            <g className={turbine.status === 'running' ? 'animate-spin-slow origin-center' : ''}>
              <path
                fill="currentColor"
                d="M12 6c-1.2 0-2.4.6-3.2 1.6L6 10.4c-.5.5-.5 1.3 0 1.8l2.8 2.8c1 .9 2.6.9 3.5 0l2.8-2.8c.5-.5.5-1.3 0-1.8L12.8 7.6C12.4 6.6 12 6 12 6z"
                opacity="0.9"
              />
              <path
                fill="currentColor"
                d="M12 6c1.2 0 2.4.6 3.2 1.6L18 10.4c.5.5.5 1.3 0 1.8l-2.8 2.8c-1 .9-2.6.9-3.5 0L9 12.2c-.5-.5-.5-1.3 0-1.8l2.8-2.8C11.6 6.6 12 6 12 6z"
                opacity="0.7"
              />
              <path
                fill="currentColor"
                d="M12 10c0-1.2.6-2.4 1.6-3.2l2.8-2.8c.5-.5 1.3-.5 1.8 0l2.8 2.8c.9 1 .9 2.6 0 3.5l-2.8 2.8c-.5.5-1.3.5-1.8 0l-2.8-2.8C12.6 12.4 12 11.2 12 10z"
                opacity="0.5"
              />
            </g>
            {/* Rotor Hub */}
            <circle
              cx="12"
              cy="10"
              r="2"
              fill="currentColor"
              className={turbine.status === 'running' ? 'animate-pulse' : ''}
            />
          </svg>
        </div>
        <p
          className={`text-xs font-semibold ${
            turbine.status === 'running'
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-700 dark:text-red-300'
          }`}
        >
          {turbine.powerOutput.toFixed(1)} kW
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Eff: {turbine.efficiency.toFixed(1)}%
        </p>
        {/* Tooltip */}
        <div className="absolute hidden group-hover:block bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl -top-20 z-10">
          <p className="font-semibold">Turbine {turbine.id}</p>
          <p>Status: {turbine.status.charAt(0).toUpperCase() + turbine.status.slice(1)}</p>
          <p>Power: {turbine.powerOutput.toFixed(1)} kW</p>
          <p>Efficiency: {turbine.efficiency.toFixed(1)}%</p>
          <p>Last Update: {new Date(turbine.lastUpdate * 1000).toLocaleTimeString()}</p>
        </div>
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
          <svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path stroke="currentColor" strokeWidth="1.5" d="M12 18V10" />
            <g className="animate-spin-slow">
              <path fill="currentColor" d="M12 6c-1 0-2 .5-2.7 1.3L7 9.6c-.4.4-.4 1 0 1.4l2.3 2.3c.8.8 2.1.8 2.9 0l2.3-2.3c.4-.4.4-1 0-1.4L12.7 7.3C12.5 6.5 12 6 12 6z" opacity="0.8" />
            </g>
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading wind farm data...</p>
      </div>
    );
  }

  if (!turbines.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">No turbine data available.</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Please check the data source or try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Wind Farm Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">Monitoring 6 turbines in real-time</p>
            </div>
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date(lastUpdated * 1000).toLocaleString()}
              </p>
            )}
          </div>
        </header>

        {/* Wind Farm Visualization */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">Wind Farm Layout</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Running</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Stopped</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Offline</span>
              </div>
            </div>
          </div>

          {/* 3D Terrain Visualization */}
          <div className="relative h-[350px] md:h-[450px] lg:h-[500px] w-full">
  <div className="absolute inset-0 flex items-center justify-center">
    <div
      className="w-full md:w-3/4 h-3/4 rounded-xl shadow-2xl overflow-hidden"
      style={{
        background: `
          linear-gradient(to bottom, 
            hsl(200, 70%, 50%) 0%, /* Sky blue at the top */
            hsl(200, 70%, 70%) 30%, /* Lighter sky */
            hsl(142, 60%, 75%) 50%, /* Horizon with green */
            hsl(142, 60%, 55%) 70%, /* Green terrain */
            hsl(142, 60%, 45%) 100% /* Darker green at the bottom */
          )`,
        boxShadow: `
          10px 10px 30px rgba(0, 0, 0, 0.2),
          -10px -10px 30px rgba(255, 255, 255, 0.1)
        `,
        position: 'relative'
      }}
    >
      {/* Terrain Base */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main Hill */}
        <div 
          className="absolute bottom-0 left-0 w-full h-2/3"
          style={{
            background: 'linear-gradient(to top, hsl(142, 60%, 40%), hsl(142, 60%, 50%))',
            clipPath: 'polygon(0 100%, 20% 60%, 40% 80%, 60% 50%, 80% 70%, 100% 60%, 100% 100%)',
            filter: 'drop-shadow(0px 10px 5px rgba(0,0,0,0.2))'
          }}
        ></div>
        
        {/* Secondary Hill */}
        <div 
          className="absolute bottom-0 left-0 w-2/3 h-1/2"
          style={{
            background: 'linear-gradient(to top, hsl(142, 60%, 35%), hsl(142, 60%, 45%))',
            clipPath: 'polygon(0 100%, 30% 70%, 50% 80%, 70% 60%, 100% 80%, 100% 100%)',
            zIndex: 1
          }}
        ></div>
        
        {/* Wind Path Animation */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(90deg, 
                rgba(255,255,255,0.1) 0%, 
                rgba(255,255,255,0.3) 20%, 
                rgba(255,255,255,0.1) 30%, 
                transparent 50%
              )`,
            animation: 'windFlow 5s linear infinite',
            zIndex: 2
          }}
        ></div>
        
        {/* Road Path */}
        <div 
          className="absolute bottom-0 left-1/4 w-1/2 h-1/4"
          style={{
            background: 'linear-gradient(to right, hsl(45, 80%, 75%), hsl(45, 80%, 65%))',
            clipPath: 'polygon(10% 100%, 30% 50%, 70% 50%, 90% 100%)',
            filter: 'blur(1px)',
            zIndex: 3
          }}
        ></div>
      </div>
      
      {/* Sky and Cloud Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun/Moon */}
        <div 
          className="absolute top-10 left-10 w-16 h-16 rounded-full bg-yellow-300 opacity-70"
          style={{
            filter: 'blur(8px)',
            boxShadow: '0 0 20px rgba(255, 255, 0, 0.5)',
            zIndex: 1
          }}
        ></div>
        
        {/* Clouds */}
        <div 
          className="absolute top-8 left-0 w-24 h-12 bg-white rounded-full opacity-25"
          style={{
            filter: 'blur(6px)',
            animation: 'cloudMove 25s linear infinite'
          }}
        ></div>
        <div 
          className="absolute top-20 right-0 w-32 h-14 bg-white rounded-full opacity-20"
          style={{
            filter: 'blur(7px)',
            animation: 'cloudMove 35s linear infinite reverse'
          }}
        ></div>
        <div 
          className="absolute top-32 left-1/3 w-28 h-10 bg-white rounded-full opacity-20"
          style={{
            filter: 'blur(6px)',
            animation: 'cloudMove 30s linear infinite'
          }}
        ></div>
      </div>
      
      {/* Wind Direction Indicator */}
      <div className="absolute top-4 right-4 z-20 flex items-center">
        <svg 
          className="w-8 h-8 text-white opacity-80 animate-pulse"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2V6M12 18V22M12 14V10M5 12H9M19 12H15" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <path 
            d="M12 12L15 9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
        <span className="text-white text-sm ml-1">NW 15km/h</span>
      </div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-0 z-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border border-white"></div>
        ))}
      </div>

      {/* Turbine Grid */}
      <div className="absolute w-full h-full grid grid-cols-2 grid-rows-3 gap-4 p-4 md:p-6 z-10">
        {turbines.map((turbine, index) => (
          <div key={index} className="flex items-center justify-center relative">
            {renderTurbine(turbine, index)}
            {/* Shadow Effect */}
            <div 
              className="absolute bottom-0 w-16 h-4 rounded-full bg-black opacity-10 blur-sm"
              style={{
                transform: 'translateY(10px) scale(0.8)',
                filter: 'blur(4px)'
              }}
            ></div>
          </div>
        ))}
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes cloudMove {
          0% { transform: translateX(-50px); }
          100% { transform: translateX(calc(100% + 50px)); }
        }
        @keyframes windFlow {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes windFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  </div>
</div>
        </section>
      </div>
    </div>
  );
};

export default WindPlace;