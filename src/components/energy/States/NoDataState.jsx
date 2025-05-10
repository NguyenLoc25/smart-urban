const NoDataState = () => (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl shadow-sm border border-blue-100">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-blue-500 mt-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-blue-800">Không có dữ liệu</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Không tìm thấy dữ liệu tiêu thụ điện để hiển thị.</p>
            <p className="mt-2">Vui lòng kiểm tra lại sau hoặc thêm dữ liệu mới.</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default NoDataState;