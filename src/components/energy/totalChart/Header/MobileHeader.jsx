// TotalChart/components/Header/MobileHeader.jsx
import React from 'react';
import { VIEW_MODES } from '../types';

const MobileHeader = ({ viewMode }) => (
  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md overflow-hidden mb-4">
    <div className="p-4 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Sản lượng điện</h1>
          <p className="text-sm opacity-90 mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dữ liệu theo {viewMode === VIEW_MODES.YEARLY ? "năm" : viewMode === VIEW_MODES.MONTHLY ? "tháng" : "giờ"}
          </p>
        </div>
        <div className="bg-white/20 rounded p-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

export default MobileHeader;