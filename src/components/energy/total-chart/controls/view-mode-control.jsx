const ViewModeControl = ({ viewMode, onChange }) => {
    const modes = [
      { value: 'yearly', label: 'Năm' },
      { value: 'monthly', label: 'Tháng' },
      { value: 'hourly', label: 'Giờ' }
    ]
  
    return (
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner flex-1">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            className={`flex-1 px-4 py-2 text-sm rounded-md transition-all duration-200 ${
              viewMode === mode.value
                ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm dark:bg-indigo-900 dark:text-indigo-100'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    )
  }
  
  export default ViewModeControl