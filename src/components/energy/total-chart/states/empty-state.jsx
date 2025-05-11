const EmptyState = ({ mobile = false }) => (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 ${
      mobile ? 'h-[250px]' : 'h-[500px]'
    } flex flex-col items-center justify-center`}>
      <div className="text-gray-400 dark:text-gray-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className={`${mobile ? 'h-10 w-10' : 'h-12 w-12'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className={`text-gray-500 dark:text-gray-300 ${
        mobile ? 'text-sm' : 'font-medium'
      }`}>Không có dữ liệu để hiển thị</p>
      <p className={`text-gray-400 dark:text-gray-500 ${
        mobile ? 'text-xs mt-1' : 'text-sm mt-1'
      }`}>Vui lòng chọn khoảng thời gian khác</p>
    </div>
  )
  
  export default EmptyState