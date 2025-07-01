import React, { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const WindPlace = () => {
  const [turbines, setTurbines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      checkIfMobile();
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
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
    const isActive = turbine?.status === 'running';
    
    if (!turbine) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
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
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            isActive
              ? 'bg-green-100 dark:bg-green-900 shadow-lg shadow-green-200 dark:shadow-green-900/50'
              : 'bg-gray-100 dark:bg-gray-800 shadow-lg shadow-gray-200 dark:shadow-gray-900/50'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`w-10 h-10 sm:w-12 sm:h-12 ${
              isActive
                ? 'text-green-600 dark:text-green-300'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <path stroke="currentColor" strokeWidth="1.5" d="M12 18V10" />
            <g className={isActive ? 'animate-spin-slow origin-center' : ''}>
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
              className={isActive ? 'animate-pulse' : ''}
            />
          </svg>
        </div>
        <p
          className={`text-xs sm:text-sm font-medium ${
            isActive
              ? 'text-green-700 dark:text-green-300'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {turbine.powerOutput.toFixed(1)} kW
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Eff: {turbine.efficiency.toFixed(1)}%
        </p>
        <div className="absolute hidden group-hover:block bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg p-2 sm:p-3 shadow-xl -top-20 z-10">
          <p className="font-semibold">Turbine {turbine.id}</p>
          <p>Status: {isActive ? 'Running' : 'Inactive'}</p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <section className="bg-transparent rounded-2xl overflow-hidden">
        <div className="relative w-full" style={{ height: isMobile ? '70vh' : `${windowSize.height * 0.8}px` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full rounded-2xl shadow-xl overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, 
                    hsl(200, 80%, 65%) 0%,
                    hsl(200, 80%, 75%) 30%,
                    hsl(200, 60%, 85%) 60%,
                    hsl(200, 50%, 95%) 100%
                )`,
                boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.3)',
                position: 'relative',
              }}
            >
              {/* Animated Wind Flow */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(90deg, 
                        rgba(255,255,255,0) 0%, 
                        rgba(255,255,255,0.2) 50%, 
                        rgba(255,255,255,0) 100%
                      )`,
                    animation: 'windFlow 8s linear infinite',
                    zIndex: 1
                  }}
                ></div>
              </div>
  
              {/* Clouds */}
              <div className="absolute top-0 left-0 w-full h-1/3 z-5">
                <div
                  className="absolute w-32 h-16 bg-white/70 rounded-full animate-cloud"
                  style={{
                    top: '20%',
                    left: '10%',
                    filter: 'blur(8px)',
                    animationDuration: '60s',
                  }}
                ></div>
                <div
                  className="absolute w-40 h-20 bg-white/60 rounded-full animate-cloud"
                  style={{
                    top: '30%',
                    left: '30%',
                    filter: 'blur(10px)',
                    animationDuration: '80s',
                    animationDelay: '-15s',
                  }}
                ></div>
                <div
                  className="absolute w-28 h-14 bg-white/80 rounded-full animate-cloud"
                  style={{
                    top: '15%',
                    left: '60%',
                    filter: 'blur(6px)',
                    animationDuration: '70s',
                    animationDelay: '-10s',
                  }}
                ></div>
              </div>
  
              {/* Terrain with rounder peaks */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 z-10"
                style={{
                  background: 'linear-gradient(to top, hsl(140, 60%, 30%), hsl(140, 60%, 40%))',
                  clipPath: isMobile
                    ? 'polygon(0% 100%, 0% 60%, 10% 55%, 20% 60%, 30% 50%, 40% 60%, 50% 55%, 60% 65%, 70% 50%, 80% 60%, 90% 55%, 100% 60%, 100% 100%)'
                    : 'polygon(0% 100%, 0% 50%, 10% 55%, 20% 45%, 30% 55%, 40% 40%, 50% 55%, 60% 45%, 70% 60%, 80% 40%, 90% 55%, 100% 50%, 100% 100%)',
                  boxShadow: 'inset 0 -12px 20px rgba(0,0,0,0.25)',
                }}
              ></div>
  
              {/* Simplified Legend - Only green and gray */}
              <div className={`absolute ${isMobile ? 'bottom-2 left-2 p-2' : 'bottom-4 left-4 p-3'} z-20 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md`}>
                <div className={`flex ${isMobile ? 'space-x-3' : 'space-x-4'}`}>
                  <div className="flex items-center">
                    <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-green-500 mr-2`}></div>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Active</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-gray-500 mr-2`}></div>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Inactive</span>
                  </div>
                </div>
              </div>
  
              {/* Wind Direction Indicator */}
              <div className={`absolute ${isMobile ? 'top-2 right-2 p-2' : 'top-4 right-4 p-3'} z-20 flex items-center bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md`}>
                <svg 
                  className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-gray-700 dark:text-gray-200 animate-pulse`}
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
                <span className={`text-gray-700 dark:text-gray-200 ${isMobile ? 'text-xs ml-1' : 'text-sm ml-2'}`}>
                  {isMobile ? 'NW 15km/h' : 'Wind: NW 15km/h'}
                </span>
              </div>
  
              {/* Last Updated */}
              {lastUpdated && (
                <div className={`absolute ${isMobile ? 'bottom-2 right-2 px-2 py-1' : 'bottom-4 right-4 px-3 py-2'} z-20 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md`}>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {isMobile
                      ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : `Updated: ${new Date(lastUpdated).toLocaleTimeString()}`}
                  </span>
                </div>
              )}
  
              {/* Turbine Grid */}
              <div className={`absolute w-full h-full grid ${isMobile ? 'grid-cols-2 grid-rows-3 gap-4 p-4' : 'grid-cols-2 grid-rows-3 gap-8 p-8'} z-10`}>
                {turbines.map((turbine, index) => (
                  <div key={index} className="flex items-center justify-center relative">
                    {renderTurbine(turbine, index)}
                    {/* Turbine shadow */}
                    <div 
                      className={`absolute bottom-0 rounded-full bg-black opacity-10 blur-sm ${isMobile ? 'w-10 h-2' : 'w-14 h-3'}`}
                      style={{
                        transform: isMobile ? 'translateY(5px) scale(0.8)' : 'translateY(8px) scale(0.9)',
                        filter: 'blur(3px)'
                      }}
                    ></div>
                  </div>
                ))}
              </div>
  
              <style jsx>{`
                @keyframes windFlow {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes cloud {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(200vw); }
                }
                .animate-cloud {
                  animation: cloud linear infinite;
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