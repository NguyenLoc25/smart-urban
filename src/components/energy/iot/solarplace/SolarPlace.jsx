import React, { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const SolarPlace = () => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const solarPlaceRef = ref(db, 'energy/signal-status/solarplace');

    const unsubscribe = onValue(solarPlaceRef, (snapshot) => {
      const data = snapshot.val() || {};
      const panelArray = [];
      let latestUpdate = 0;

      Object.entries(data).forEach(([colKey, colData]) => {
        Object.entries(colData).forEach(([panelKey, panelData]) => {
          if (panelData) {
            panelArray.push({
              id: `${colKey}-${panelKey}`,
              status: panelData.status || 'inactive',
              position: {
                col: parseInt(colKey.replace('col', '')),
                panel: parseInt(panelKey.replace('panel', '')),
              },
              lastUpdate: panelData.lastUpdate || 0,
              powerOutput: panelData.powerOutput || 0,
              efficiency: panelData.efficiency || 0,
              sunlight: panelData.sunlight || 0,
              temperature: panelData.temperature || 25,
            });
            if (panelData.lastUpdate > latestUpdate) {
              latestUpdate = panelData.lastUpdate;
            }
          }
        });
      });

      const gridPanels = [];
      for (let col = 1; col <= 2; col++) {
        for (let panel = 1; panel <= 6; panel++) {
          const existingPanel = panelArray.find(
            (p) => p.position.col === col && p.position.panel === panel
          );
          gridPanels.push(
            existingPanel || {
              id: `col${col}-panel${panel}`,
              status: 'inactive',
              position: { col, panel },
              lastUpdate: 0,
              powerOutput: 0,
              efficiency: 0,
              sunlight: 0,
              temperature: 25,
            }
          );
        }
      }

      setPanels(gridPanels);
      setLastUpdated(latestUpdate);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderPanel = useCallback((panel) => {
    const brightness = Math.min(100, panel.sunlight * 10);
    const temperatureColor =
      panel.temperature > 45
        ? 'text-red-600 dark:text-red-400'
        : panel.temperature > 35
          ? 'text-orange-600 dark:text-orange-400'
          : 'text-yellow-600 dark:text-yellow-400';

    const isOffline = panel.status === 'inactive' && panel.lastUpdate === 0;

    return (
      <div className="relative flex flex-col items-center group">

        {/* Panel Display */}
        <div
          className={`w-16 h-16 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 relative ${
            isOffline
              ? 'bg-gray-300 dark:bg-gray-600 shadow-md'
              : panel.status === 'active'
                ? 'bg-yellow-100 dark:bg-yellow-800 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/50'
                : 'bg-gray-200 dark:bg-gray-700 shadow-md'
          }`}
          style={{
            filter: panel.status === 'active' ? `brightness(${brightness}%)` : 'brightness(70%)',
          }}
        >
          {isOffline ? (
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Empty
            </span>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className={`w-12 h-12 ${
                  panel.status === 'active'
                    ? 'text-yellow-500 dark:text-yellow-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <path
                  fill={panel.status === 'active' ? '#FFC107' : 'currentColor'}
                  d="M12 2L15 8H21L16 13L18 19L12 15L6 19L8 13L3 8H9L12 2Z"
                />
              </svg>
              {/* Glowing Effect for Active Panels */}
              {panel.status === 'active' && (
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    boxShadow: '0 0 15px 5px rgba(255, 193, 7, 0.6), 0 0 30px 10px rgba(255, 193, 7, 0.4)',
                    animation: 'glow 2s ease-in-out infinite alternate',
                  }}
                ></div>
              )}
            </>
          )}
        </div>

        {!isOffline && (
          <>
            <p
              className={`text-xs font-semibold ${
                panel.status === 'active'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {panel.powerOutput.toFixed(1)} kW
            </p>
            <p className={`text-xs ${temperatureColor}`}>
              {panel.temperature.toFixed(1)}°C
            </p>
          </>
        )}
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-yellow-500"></div>
          <svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-yellow-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill="#FFC107"
              d="M12 2L15 8H21L16 13L18 19L12 15L6 19L8 13L3 8H9L12 2Z"
            />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium">
          Loading solar farm data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <section className="bg-transparent rounded-xl p-2 sm:p-4 md:p-6">
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
                position: 'relative',
              }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 w-full h-2/3"
                  style={{
                    background: 'linear-gradient(to top, hsl(142, 60%, 40%), hsl(142, 60%, 50%))',
                    clipPath: 'polygon(0 100%, 20% 60%, 40% 80%, 60% 50%, 80% 70%, 100% 60%, 100% 100%)',
                    filter: 'drop-shadow(0px 5px 3px rgba(0,0,0,0.2))',
                  }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-2/3 h-1/2"
                  style={{
                    background: 'linear-gradient(to top, hsl(142, 60%, 35%), hsl(142, 60%, 45%))',
                    clipPath: 'polygon(0 100%, 30% 70%, 50% 80%, 70% 60%, 100% 80%, 100% 100%)',
                    zIndex: 1,
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
                    zIndex: 2,
                  }}
                ></div>
              </div>
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-300 opacity-70"
                  style={{
                    filter: 'blur(6px) sm:blur(8px)',
                    boxShadow: '0 0 10px sm:0 0 20px rgba(255, 255, 0, 0.5)',
                    zIndex: 1,
                  }}
                ></div>
                <div
                  className="absolute top-4 left-0 w-16 h-8 sm:w-24 sm:h-12 bg-white rounded-full opacity-20"
                  style={{
                    filter: 'blur(4px) sm:blur(6px)',
                    animation: 'cloudMove 20s linear infinite',
                  }}
                ></div>
              </div>
              <div className="absolute bottom-4 left-4 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-md">
                <div className="flex flex-col space-y-1 sm:space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">Active</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">Inactive</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">Offline</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 sm:p-2 shadow-md">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 dark:text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fill="#FFC107"
                    d="M12 2L15 8H21L16 13L18 19L12 15L6 19L8 13L3 8H9L12 2Z"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm ml-1">High Sun</span>
              </div>
              {lastUpdated && (
                <div className="absolute bottom-4 right-4 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md">
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                    Updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              )}
              <div className="absolute w-full h-full flex flex-col justify-center z-10 px-4 sm:px-8">
                <div className="grid grid-cols-2 gap-4 sm:gap-8">
                  {[1, 2].map((col) => (
                    <div key={`col-${col}`} className="relative">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
                        {panels
                          .filter((panel) => panel.position.col === col)
                          .sort((a, b) => a.position.panel - b.position.panel)
                          .map((panel) => (
                            <div key={`panel-${col}-${panel.position.panel}`} className="relative">
                              {renderPanel(panel)}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <style jsx>{`
                @keyframes cloudMove {
                  0% {
                    transform: translateX(-30px);
                  }
                  100% {
                    transform: translateX(calc(100% + 30px));
                  }
                }
                @keyframes windFlow {
                  0% {
                    background-position: 0 0;
                  }
                  100% {
                    background-position: 200% 0;
                  }
                }
                @keyframes glow {
                  0% {
                    box-shadow: 0 0 15px 5px rgba(255, 193, 7, 0.6), 0 0 30px 10px rgba(255, 193, 7, 0.4);
                  }
                  100% {
                    box-shadow: 0 0 20px 8px rgba(255, 193, 7, 0.8), 0 0 40px 15px rgba(255, 193, 7, 0.5);
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolarPlace;