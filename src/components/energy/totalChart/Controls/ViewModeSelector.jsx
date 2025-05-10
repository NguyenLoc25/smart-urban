// TotalChart/components/Controls/ViewModeSelector.jsx
import React from 'react';
import { VIEW_MODES } from '../types';

const ViewModeSelector = ({ viewMode, setViewMode }) => (
  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner flex-1">
    {Object.values(VIEW_MODES).map((mode) => (
      <button
        key={mode}
        onClick={() => setViewMode(mode)}
        className={`flex-1 px-4 py-2 text-sm rounded-md transition-all duration-200 ${
          viewMode === mode
            ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm dark:bg-indigo-900 dark:text-indigo-100'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {mode === VIEW_MODES.YEARLY ? "Năm" : mode === VIEW_MODES.MONTHLY ? "Tháng" : "Giờ"}
      </button>
    ))}
  </div>
);

export default ViewModeSelector;