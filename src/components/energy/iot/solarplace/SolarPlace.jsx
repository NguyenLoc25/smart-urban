import React, { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const SolarPlace = () => {
  const [panels, setPanels] = useState([]);
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
    const solarPlaceRef = ref(db, 'energy/signal-status/solarplace');

    const unsubscribe = onValue(solarPlaceRef, (snapshot) => {
      const data = snapshot.val() || {};
      const panelArray = [];
      let latestUpdate = 0;

      Object.entries(data).forEach(([colKey, colData]) => {
        Object.entries(colData).forEach(([rowKey, panelData]) => {
          if (panelData) {
            panelArray.push({
              id: `${colKey}-${rowKey}`,
              status: panelData.status || 'inactive',
              position: panelData.position || { col: parseInt(colKey), row: parseInt(rowKey) },
              lastUpdate: panelData.lastUpdate || 0,
              powerOutput: panelData.powerOutput || 0,
              efficiency: panelData.efficiency || 0,
              temperature: panelData.temperature || 0
            });
            if (panelData.lastUpdate > latestUpdate) {
              latestUpdate = panelData.lastUpdate;
            }
          }
        });
      });

      const organizedPanels = { left: [], right: [] };
      
      for (let i = 1; i <= 6; i++) {
        const panel = panelArray.find(p => p.position.row === i && p.position.col === 1);
        organizedPanels.left.push(panel || null);
      }
      
      for (let i = 1; i <= 6; i++) {
        const panel = panelArray.find(p => p.position.row === i && p.position.col === 2);
        organizedPanels.right.push(panel || null);
      }

      setPanels(organizedPanels);
      setLastUpdated(latestUpdate);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderPanel = useCallback((panel, index) => {
    const panelSize = isMobile ? 12 : 16;
    const iconSize = isMobile ? 10 : 12;

    if (!panel) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className={`w-${panelSize} h-${panelSize} rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={`w-${iconSize} h-${iconSize} text-gray-400 dark:text-gray-500`}>
              <path d="M12 3V1M12 23V21M21 12H23M1 12H3M18.364 18.364L19.778 19.778M4.222 4.222L5.636 5.636M18.364 5.636L19.778 4.222M4.222 19.778L5.636 18.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      );
    }

    const intensity = panel.status === 'active' ? 
      Math.min(100, Math.max(40, panel.efficiency / 2)) : 20;
    const glowEffect = panel.status === 'active' ? 
      `drop-shadow(0 0 ${isMobile ? '4px' : '6px'} rgba(255, ${200 + intensity}, 0, ${intensity/100}))` : 'none';

    return (
      <div className="relative flex flex-col items-center">
        <div className={`w-${panelSize} h-${panelSize} rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
          panel.status === 'active' 
            ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900' 
            : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`w-${iconSize} h-${iconSize} ${panel.status === 'active' ? 'text-yellow-500 dark:text-yellow-300' : 'text-gray-400 dark:text-gray-500'}`}
            style={{
              filter: glowEffect,
              opacity: panel.status === 'active' ? intensity/100 : 0.6
            }}
          >
            {panel.status === 'active' ? (
              <>
                <path d="M12 2V4M12 20V22M22 12H20M4 12H2M18.364 18.364L16.95 16.95M7.05 7.05L5.636 5.636M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="4" fill="currentColor" className="animate-pulse" />
              </>
            ) : (
              <>
                <path d="M12 2V4M12 20V22M22 12H20M4 12H2M18.364 18.364L16.95 16.95M7.05 7.05L5.636 5.636M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </div>
        <div className="text-center">
          <p className={`text-xs font-medium ${panel.status === 'active' ? 'text-yellow-600 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-300'}`}>
            {panel.powerOutput.toFixed(1)} kW
          </p>
        </div>
      </div>
    );
  }, [isMobile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
          <svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M12 2V4M12 20V22M22 12H20M4 12H2M18.364 18.364L16.95 16.95M7.05 7.05L5.636 5.636M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading solar farm data...</p>
      </div>
    );
  }

  if (!panels.left?.length && !panels.right?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">No solar panel data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mt-8 mx-auto px-2 sm:px-4">
      <section className="bg-transparent rounded-xl p-2 sm:p-4">
        <div className="relative w-full" style={{ height: isMobile ? '70vh' : `${windowSize.height * 0.8}px` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full rounded-xl shadow-lg overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, 
                    hsl(210, 80%, 95%) 0%,
                    hsl(210, 80%, 85%) 30%,
                    hsl(40, 90%, 80%) 60%,
                    hsl(40, 90%, 70%) 100%
                )`,
                boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.3)',
                position: 'relative',
              }}
            >
              {/* Clouds */}
              <div className="absolute top-0 left-0 w-full h-1/3 z-5">
                <div
                  className="absolute w-32 h-16 bg-white/70 rounded-full animate-cloud"
                  style={{
                    top: '20%',
                    left: '10%',
                    filter: 'blur(8px)',
                    animationDuration: '40s',
                  }}
                ></div>
                <div
                  className="absolute w-40 h-20 bg-white/60 rounded-full animate-cloud"
                  style={{
                    top: '30%',
                    left: '30%',
                    filter: 'blur(10px)',
                    animationDuration: '50s',
                    animationDelay: '-10s',
                  }}
                ></div>
                <div
                  className="absolute w-28 h-14 bg-white/80 rounded-full animate-cloud"
                  style={{
                    top: '15%',
                    left: '60%',
                    filter: 'blur(6px)',
                    animationDuration: '45s',
                    animationDelay: '-5s',
                  }}
                ></div>
              </div>
  
              {/* Mountain Background */}
              {!isMobile && (
                <div className="absolute bottom-0 left-0 w-full h-1/2 z-0">
                  <div
                    className="absolute bottom-0 left-0 w-full h-full"
                    style={{
                      background: 'linear-gradient(to top, hsl(140, 60%, 30%), hsl(140, 60%, 20%))',
                      clipPath: 'polygon(0% 100%, 0% 60%, 20% 50%, 40% 70%, 60% 40%, 80% 60%, 100% 30%, 100% 100%)',
                    }}
                  ></div>
                </div>
              )}
  
              {/* Sun with Rays - Fixed Positioning */}
<div className={`absolute ${isMobile ? 'top-[15%] right-[15%]' : 'top-[20%] right-[20%]'} z-0`}>
  <div className="relative" style={{ width: isMobile ? '5rem' : '8rem', height: isMobile ? '5rem' : '8rem' }}>
    {/* Sun Core */}
    <div
      className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500"
      style={{
        filter: 'blur(8px)',
        boxShadow: isMobile 
          ? '0 0 30px 15px rgba(255, 200, 0, 0.4)' 
          : '0 0 50px 25px rgba(255, 200, 0, 0.5)',
      }}
    ></div>
    
    {/* Sun Rays - only on desktop */}
    {!isMobile && (
      <div
        className="absolute top-0 left-0 w-full h-full animate-spin-slow"
        style={{
          backgroundImage: `
            repeating-conic-gradient(
              from 0deg,
              rgba(255,255,255,0) 0deg 10deg,
              rgba(255,255,255,0.3) 10deg 20deg
            )`,
          borderRadius: '50%',
          transformOrigin: 'center center',
        }}
      ></div>
    )}
  </div>
</div>
  
              {/* Solar Farm Ground */}
              <div
                className="absolute bottom-0 left-0 w-full h-1/3 z-10"
                style={{
                  background: 'linear-gradient(to top, hsl(35, 60%, 38%), hsl(35, 60%, 48%))',
                  clipPath: isMobile
                    ? 'polygon(0% 100%, 0% 70%, 30% 75%, 60% 65%, 100% 80%, 100% 100%)'
                    : 'polygon(0% 100%, 0% 65%, 15% 60%, 30% 70%, 45% 55%, 60% 75%, 80% 60%, 100% 75%, 100% 100%)',
                  boxShadow: 'inset 0 -12px 20px rgba(0,0,0,0.25)',
                }}
              ></div>
  
              {/* Legends */}
              <div className={`absolute ${isMobile ? 'bottom-2 left-2 p-2' : 'bottom-4 left-4 p-3'} z-20 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md`}>
                <div className={`flex ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
                  <div className="flex items-center">
                    <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-yellow-500 mr-1 sm:mr-2`}></div>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Active</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-gray-400 mr-1 sm:mr-2`}></div>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Inactive</span>
                  </div>
                </div>
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
  
              {/* Panel Grid */}
              <div className={`absolute w-full h-full flex z-10 ${isMobile ? 'p-2' : 'p-6'}`}>
                {/* Left Column */}
                <div className="w-1/2 h-full flex">
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.left.slice(0, 2).map((panel, index) => (
                      <div key={`left-${index}`} className="flex items-center justify-center">
                        {renderPanel(panel, index)}
                      </div>
                    ))}
                  </div>
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.left.slice(2, 4).map((panel, index) => (
                      <div key={`left-${index + 2}`} className="flex items-center justify-center">
                        {renderPanel(panel, index + 2)}
                      </div>
                    ))}
                  </div>
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.left.slice(4, 6).map((panel, index) => (
                      <div key={`left-${index + 4}`} className="flex items-center justify-center">
                        {renderPanel(panel, index + 4)}
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Right Column */}
                <div className="w-1/2 h-full flex">
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.right.slice(0, 2).map((panel, index) => (
                      <div key={`right-${index}`} className="flex items-center justify-center">
                        {renderPanel(panel, index)}
                      </div>
                    ))}
                  </div>
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.right.slice(2, 4).map((panel, index) => (
                      <div key={`right-${index + 2}`} className="flex items-center justify-center">
                        {renderPanel(panel, index + 2)}
                      </div>
                    ))}
                  </div>
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.right.slice(4, 6).map((panel, index) => (
                      <div key={`right-${index + 4}`} className="flex items-center justify-center">
                        {renderPanel(panel, index + 4)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
  
              <style jsx>{`
                @keyframes spin-slow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                  animation: spin-slow 20s linear infinite;
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

export default SolarPlace;