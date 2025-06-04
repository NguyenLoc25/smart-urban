import React, { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const SolarPlace = () => {
  const [panels, setPanels] = useState([]);
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

      // Organize into 2 columns (left and right), each with 6 positions
      // Each column has 3 sub-columns with 2 positions each
      const organizedPanels = { left: [], right: [] };
      
      // Left column (positions 1-6)
      for (let i = 1; i <= 6; i++) {
        const panel = panelArray.find(p => p.position.row === i && p.position.col === 1);
        organizedPanels.left.push(panel || null);
      }
      
      // Right column (positions 7-12)
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
    if (!panel) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 text-xs">Offline</span>
          </div>
        </div>
      );
    }

    const intensity = panel.status === 'active' ? 
      Math.min(100, Math.max(20, panel.efficiency / 2)) : 20;
    const tempColor = panel.temperature > 60 ? 'orange' : 'yellow';

    return (
      <div
        className="relative flex flex-col items-center group"
        role="button"
        tabIndex={0}
        aria-label={`Solar Panel ${panel.id}, Status: ${panel.status}, Power: ${panel.powerOutput.toFixed(1)} kW, Efficiency: ${panel.efficiency.toFixed(1)}%`}
      >
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-1 sm:mb-2 transition-all duration-300 ${
            panel.status === 'active'
              ? 'bg-yellow-100 dark:bg-yellow-800 shadow-lg shadow-yellow-200 dark:shadow-yellow-900/50'
              : 'bg-gray-100 dark:bg-gray-800 shadow-lg shadow-gray-200 dark:shadow-gray-900/50'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 ${
              panel.status === 'active'
                ? `text-yellow-${intensity} dark:text-yellow-300`
                : 'text-gray-400 dark:text-gray-500'
            }`}
            style={{
              opacity: panel.status === 'active' ? intensity/100 : 0.5
            }}
          >
            <rect x="2" y="2" width="20" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1" />
            <line x1="2" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1" />
            <line x1="8" y1="2" x2="8" y2="22" stroke="currentColor" strokeWidth="1" />
            <line x1="14" y1="2" x2="14" y2="22" stroke="currentColor" strokeWidth="1" />
            {panel.status === 'active' && (
              <circle cx="12" cy="12" r="3" fill="currentColor" className="animate-pulse" />
            )}
          </svg>
        </div>
        <p
          className={`text-[10px] sm:text-xs font-semibold ${
            panel.status === 'active'
              ? 'text-yellow-700 dark:text-yellow-300'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {panel.powerOutput.toFixed(1)} kW
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
          Eff: {panel.efficiency.toFixed(1)}%
        </p>
        <p className={`text-[10px] sm:text-xs ${panel.temperature > 60 ? 'text-orange-500' : 'text-blue-500'}`}>
          {panel.temperature}°C
        </p>
        <div className="absolute hidden group-hover:block bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg p-2 sm:p-3 shadow-xl -top-20 sm:-top-24 z-10">
          <p className="font-semibold">Panel {panel.id}</p>
          <p>Status: {panel.status.charAt(0).toUpperCase() + panel.status.slice(1)}</p>
          <p>Power: {panel.powerOutput.toFixed(1)} kW</p>
          <p>Efficiency: {panel.efficiency.toFixed(1)}%</p>
          <p>Temp: {panel.temperature}°C</p>
        </div>
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
            <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="4" x2="10" y2="20" stroke="currentColor" strokeWidth="1" />
            <line x1="16" y1="4" x2="16" y2="20" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium">Loading solar farm data...</p>
      </div>
    );
  }

  if (!panels.left?.length && !panels.right?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium">No solar panel data available.</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Please check the data source or try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      {/* Solar Farm Visualization */}
      <section className="bg-transparent rounded-xl p-2 sm:p-4 md:p-6">
        {/* 3D Terrain Visualization - Responsive with dynamic height */}
        <div className="relative w-full" style={{ height: `${windowHeight * 0.8}px` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full rounded-xl shadow-2xl overflow-hidden"
              style={{
                background: `
                  linear-gradient(to bottom, 
                    hsl(200, 70%, 90%) 0%,
                    hsl(200, 70%, 85%) 30%,
                    hsl(40, 80%, 85%) 50%,
                    hsl(40, 80%, 75%) 70%,
                    hsl(40, 80%, 65%) 100%
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
                {/* Solar farm ground */}
                <div 
                  className="absolute bottom-0 left-0 w-full h-2/3"
                  style={{
                    background: 'linear-gradient(to top, hsl(40, 60%, 50%), hsl(40, 60%, 60%))',
                    clipPath: 'polygon(0 100%, 20% 80%, 40% 90%, 60% 70%, 80% 85%, 100% 75%, 100% 100%)',
                    filter: 'drop-shadow(0px 5px 3px rgba(0,0,0,0.2))'
                  }}
                ></div>
                
                {/* Sun */}
                <div 
                  className="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-300"
                  style={{
                    filter: 'blur(4px)',
                    boxShadow: '0 0 20px 10px rgba(255, 200, 0, 0.5)',
                    zIndex: 1
                  }}
                ></div>
                
                {/* Sun rays */}
                <div 
                  className="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                    animation: 'pulseSun 3s infinite alternate',
                    zIndex: 2
                  }}
                ></div>
                
                {/* Light rays */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255,255,255,0.1) 0%, 
                        rgba(255,255,255,0.3) 20%, 
                        rgba(255,255,255,0.1) 30%, 
                        transparent 50%
                      )`,
                    animation: 'sunLight 5s linear infinite',
                    zIndex: 2
                  }}
                ></div>
              </div>
              
              {/* Integrated Legends - Positioned inside the background */}
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
              
              {/* Sun Intensity Indicator */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 sm:p-2 shadow-md">
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 dark:text-yellow-300 animate-pulse"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="2" />
                  <line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" strokeWidth="2" />
                  <line x1="4" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="2" />
                  <line x1="18" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
                  <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" stroke="currentColor" strokeWidth="2" />
                  <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" stroke="currentColor" strokeWidth="2" />
                  <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="2" />
                  <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm ml-1">High (85%)</span>
              </div>
              
              {/* Last Updated Time */}
              {lastUpdated && (
                <div className="absolute bottom-4 right-4 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md">
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                    Updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              )}
              
              {/* Panel Grid - 2 main columns, each with 3 sub-columns of 2 panels */}
              <div className="absolute w-full h-full flex z-10 p-4 sm:p-6">
                {/* Left Column */}
                <div className="w-1/2 h-full flex">
                  {/* Sub-column 1 */}
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.left.slice(0, 2).map((panel, index) => (
                      <div key={`left-${index}`} className="flex items-center justify-center relative">
                        {renderPanel(panel, index)}
                      </div>
                    ))}
                  </div>
                  {/* Sub-column 2 */}
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.left.slice(2, 4).map((panel, index) => (
                      <div key={`left-${index+2}`} className="flex items-center justify-center relative">
                        {renderPanel(panel, index+2)}
                      </div>
                    ))}
                  </div>
                  {/* Sub-column 3 */}
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.left.slice(4, 6).map((panel, index) => (
                      <div key={`left-${index+4}`} className="flex items-center justify-center relative">
                        {renderPanel(panel, index+4)}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="w-1/2 h-full flex">
                  {/* Sub-column 1 */}
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.right.slice(0, 2).map((panel, index) => (
                      <div key={`right-${index}`} className="flex items-center justify-center relative">
                        {renderPanel(panel, index)}
                      </div>
                    ))}
                  </div>
                  {/* Sub-column 2 */}
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.right.slice(2, 4).map((panel, index) => (
                      <div key={`right-${index+2}`} className="flex items-center justify-center relative">
                        {renderPanel(panel, index+2)}
                      </div>
                    ))}
                  </div>
                  {/* Sub-column 3 */}
                  <div className="w-1/3 h-full flex flex-col items-center justify-evenly">
                    {panels.right.slice(4, 6).map((panel, index) => (
                      <div key={`right-${index+4}`} className="flex items-center justify-center relative">
                        {renderPanel(panel, index+4)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <style jsx>{`
                @keyframes pulseSun {
                  0% { transform: scale(1); opacity: 0.8; }
                  100% { transform: scale(1.1); opacity: 1; }
                }
                @keyframes sunLight {
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

export default SolarPlace;