import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const WindPlace = () => {
  const [windPlaceData, setWindPlaceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const windPlaceRef = ref(db, 'energy/signal-status/windplace');

    const unsubscribe = onValue(windPlaceRef, (snapshot) => {
      const data = snapshot.val() || {};
      setWindPlaceData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Extract all turbines from the nested structure
  const getAllTurbines = () => {
    const turbines = [];
    
    Object.entries(windPlaceData).forEach(([rowKey, rowData]) => {
      if (rowKey.startsWith('row')) {
        Object.entries(rowData).forEach(([colKey, colData]) => {
          if (colKey.startsWith('col') && colData.status) {
            turbines.push({
              ...colData,
              position: {
                ...colData.position,
                row: parseInt(rowKey.replace('row', '')),
                col: parseInt(colKey.replace('col', ''))
              }
            });
          }
        });
      }
    });
    
    return turbines;
  };

  const turbines = getAllTurbines();

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Wind Farm Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring and control</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {turbines.map((turbine, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border-l-4 ${
                turbine.status === 'running' ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="text-blue-600">Row {turbine.position.row}, Col {turbine.position.col}</span>
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      turbine.status === 'running'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {turbine.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col items-center my-6">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <>
                      <div className="absolute inset-0 bg-blue-50 rounded-full"></div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={`w-20 h-20 text-blue-600 ${
                          turbine.status === 'running' ? 'animate-spin-slow' : 'opacity-70'
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      {turbine.status === 'running' && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {turbine.speed || 0} RPM
                        </div>
                      )}
                    </>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span className="text-gray-600">Position</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      Row {turbine.position.row}, Col {turbine.position.col}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-600">Last Update</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {new Date(turbine.lastUpdate * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      turbine.status === 'running'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {turbine.status === 'running' ? 'Stop Turbine' : 'Start Turbine'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Farm Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-800">Active Turbines</h3>
                <span className="text-2xl font-bold text-blue-600">
                  {turbines.filter(t => t.status === 'running').length}
                </span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-green-800">Total Turbines</h3>
                <span className="text-2xl font-bold text-green-600">
                  {turbines.length}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800">Last Update</h3>
                <span className="text-2xl font-bold text-gray-600">
                  {turbines.length > 0 
                    ? new Date(Math.max(...turbines.map(t => t.lastUpdate)) * 1000).toLocaleTimeString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindPlace;