import React, { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const WindPlace = () => {
  const [turbines, setTurbines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    // Set initial height
    setWindowHeight(window.innerHeight);
    
    // Update height on resize
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
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
          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-1 sm:mb-2 transition-all duration-300 ${
            turbine.status === 'running'
              ? 'bg-green-100 dark:bg-green-800 shadow-lg shadow-green-200 dark:shadow-green-900/50'
              : 'bg-red-100 dark:bg-red-800 shadow-lg shadow-red-200 dark:shadow-red-900/50'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 ${
              turbine.status === 'running'
                ? 'text-green-600 dark:text-green-300'
                : 'text-red-600 dark:text-red-300'
            }`}
          >
            <path stroke="currentColor" strokeWidth="1.5" d="M12 18V10" />
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
          className={`text-[10px] sm:text-xs font-semibold ${
            turbine.status === 'running'
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-700 dark:text-red-300'
          }`}
        >
          {turbine.powerOutput.toFixed(1)} kW
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
          Eff: {turbine.efficiency.toFixed(1)}%
        </p>
        <div className="absolute hidden group-hover:block bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg p-2 sm:p-3 shadow-xl -top-16 sm:-top-20 z-10">
          <p className="font-semibold">Turbine {turbine.id}</p>
          <p>Status: {turbine.status.charAt(0).toUpperCase() + turbine.status.slice(1)}</p>
          <p>Power: {turbine.powerOutput.toFixed(1)} kW</p>
          <p>Efficiency: {turbine.efficiency.toFixed(1)}%</p>
        </div>
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-green-500"></div>
          <svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path stroke="currentColor" strokeWidth="1.5" d="M12 18V10" />
            <g className="animate-spin-slow">
              <path fill="currentColor" d="M12 6c-1 0-2 .5-2.7 1.3L7 9.6c-.4.4-.4 1 0 1.4l2.3 2.3c.8.8 2.1.8 2.9 0l2.3-2.3c.4-.4.4-1 0-1.4L12.7 7.3C12.5 6.5 12 6 12 6z" opacity="0.8" />
            </g>
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium">Loading wind farm data...</p>
      </div>
    );
  }

  if (!turbines.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium">No turbine data available.</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Please check the data source or try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      {/* Wind Farm Visualization */}
      <section className="bg-transparent rounded-xl p-2 sm:p-4 md:p-6">
        {/* 3D Terrain Visualization - Responsive with dynamic height */}
        <div className="relative w-full" style={{ height: `${windowHeight * 0.8}px` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full rounded-xl shadow-2xl overflow-hidden"
              style={{
                background: `
                  linear-gradient(to bottom, 
                    hsl(200, 70%, 50%) 0%,
                    hsl(200, 70%, 70%) 30%,
                    hsl(142, 60%, 75%) 50%,
                    hsl(142, 60%, 55%) 70%,
                    hsl(142, 60%, 45%) 100%
                )`,
                boxShadow: `
                  5px 5px 15px rgba(0, 0, 0, 0.2),
                  -5px -5px 15px rgba(255, 255, 255, 0.1)
                `,
                position: 'relative'
              }}
            >
              {/* Simplified Terrain for Mobile */}
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 w-full h-2/3"
                  style={{
                    background: 'linear-gradient(to top, hsl(142, 60%, 40%), hsl(142, 60%, 50%))',
                    clipPath: 'polygon(0 100%, 20% 60%, 40% 80%, 60% 50%, 80% 70%, 100% 60%, 100% 100%)',
                    filter: 'drop-shadow(0px 5px 3px rgba(0,0,0,0.2))'
                  }}
                ></div>
                
                <div 
                  className="absolute bottom-0 left-0 w-2/3 h-1/2"
                  style={{
                    background: 'linear-gradient(to top, hsl(142, 60%, 35%), hsl(142, 60%, 45%))',
                    clipPath: 'polygon(0 100%, 30% 70%, 50% 80%, 70% 60%, 100% 80%, 100% 100%)',
                    zIndex: 1
                  }}
                ></div>
                
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(90deg, 
                        rgba(255,255,255,0.1) 0%, 
                        rgba(255,255,255,0.2) 20%, 
                        rgba(255,255,255,0.1) 30%, 
                        transparent 50%
                      )`,
                    animation: 'windFlow 5s linear infinite',
                    zIndex: 2
                  }}
                ></div>
              </div>
              
              {/* Sky Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-300 opacity-70"
                  style={{
                    filter: 'blur(6px) sm:blur(8px)',
                    boxShadow: '0 0 10px sm:0 0 20px rgba(255, 255, 0, 0.5)',
                    zIndex: 1
                  }}
                ></div>
                
                <div 
                  className="absolute top-4 left-0 w-16 h-8 sm:w-24 sm:h-12 bg-white rounded-full opacity-20"
                  style={{
                    filter: 'blur(4px) sm:blur(6px)',
                    animation: 'cloudMove 20s linear infinite'
                  }}
                ></div>
              </div>
              
              {/* Integrated Legends - Positioned inside the background */}
              <div className="absolute bottom-4 left-4 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-md">
                <div className="flex flex-col space-y-1 sm:space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">Running</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">Stopped</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">Offline</span>
                  </div>
                </div>
              </div>
              
              {/* Wind Direction Indicator */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 sm:p-2 shadow-md">
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200 animate-pulse"
                  viewBox="0 0 24 24"
                  fill="none"
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
                <span className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm ml-1">NW 15km/h</span>
              </div>
              
              {/* Last Updated Time */}
              {lastUpdated && (
                <div className="absolute bottom-4 right-4 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md">
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                    Updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              )}
              
              {/* Turbine Grid - Maintains 2x3 layout */}
              <div className="absolute w-full h-full grid grid-cols-2 grid-rows-3 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 z-10">
                {turbines.map((turbine, index) => (
                  <div key={index} className="flex items-center justify-center relative">
                    {renderTurbine(turbine, index)}
                    <div 
                      className="absolute bottom-0 w-10 h-3 sm:w-12 sm:h-4 md:w-16 md:h-4 rounded-full bg-black opacity-10 blur-sm"
                      style={{
                        transform: 'translateY(8px) sm:translateY(10px) scale(0.8)',
                        filter: 'blur(3px) sm:blur(4px)'
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              
              <style jsx>{`
                @keyframes cloudMove {
                  0% { transform: translateX(-30px); }
                  100% { transform: translateX(calc(100% + 30px)); }
                }
                @keyframes windFlow {
                  0% { background-position: 0 0; }
                  100% { background-position: 200% 0; }
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WindPlace;