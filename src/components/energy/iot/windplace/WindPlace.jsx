import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const WindPlace = () => {
  const [turbines, setTurbines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const windPlaceRef = ref(db, 'energy/signal-status/windplace');

    const unsubscribe = onValue(windPlaceRef, (snapshot) => {
      const data = snapshot.val() || {};
      const turbineArray = [];

      // Duyệt qua các hàng (row1, row2, row3)
      Object.entries(data).forEach(([rowKey, rowData]) => {
        // Duyệt qua các cột (col1, col2) trong mỗi hàng
        Object.entries(rowData).forEach(([colKey, turbineData]) => {
          if (turbineData) {
            turbineArray.push({
              id: `${rowKey}-${colKey}`,
              status: turbineData.status || 'stopped',
              position: turbineData.position || { row: 0, col: 0 },
              lastUpdate: turbineData.lastUpdate || 0,
              // Thêm các trường dữ liệu khác nếu cần
            });
          }
        });
      });

      setTurbines(turbineArray);
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

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Wind Farm Dashboard</h1>
            <p className="text-gray-600 mt-2">Grid layout monitoring</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Hiển thị dạng lưới */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3].map(row => (
            <div key={`row-${row}`} className="space-y-4">
              <h3 className="text-lg font-semibold">Row {row}</h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map(col => {
                  const turbine = turbines.find(t => 
                    t.position.row === row && t.position.col === col
                  );
                  
                  return (
                    <div
                      key={`row-${row}-col-${col}`}
                      className={`bg-white p-4 rounded-lg shadow ${
                        turbine ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Position: {row}-{col}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          turbine 
                            ? turbine.status === 'running' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {turbine ? turbine.status : 'EMPTY'}
                        </span>
                      </div>
                      
                      {turbine && (
                        <>
                          <div className="flex items-center justify-center my-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              turbine.status === 'running' 
                                ? 'bg-blue-50 animate-pulse' 
                                : 'bg-gray-50'
                            }`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className={`w-8 h-8 ${
                                  turbine.status === 'running' 
                                    ? 'text-blue-600 animate-spin-slow' 
                                    : 'text-gray-400'
                                }`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Last Update:</span>
                              <span>{new Date(turbine.lastUpdate * 1000).toLocaleString()}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Thống kê tổng quan */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Farm Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-800">Total Turbines</h3>
                <span className="text-2xl font-bold text-blue-600">
                  {turbines.length}
                </span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-green-800">Active Turbines</h3>
                <span className="text-2xl font-bold text-green-600">
                  {turbines.filter(t => t.status === 'running').length}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800">Available Positions</h3>
                <span className="text-2xl font-bold text-gray-600">
                  {6 - turbines.length} {/* 3 rows x 2 cols = 6 positions */}
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