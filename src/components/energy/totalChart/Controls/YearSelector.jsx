const YearSelector = ({ selectedYear, setSelectedYear, allYears }) => (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner min-w-[150px]">
      <label htmlFor="year-select" className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
        Năm:
      </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-0 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 flex-1"
      >
        {allYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default YearSelector;