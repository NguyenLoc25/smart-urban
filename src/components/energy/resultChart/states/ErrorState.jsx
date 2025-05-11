const ErrorState = ({ error }) => (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl shadow-sm border border-red-100">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-red-500 mt-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-red-800">Đã xảy ra lỗi</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
            <p className="mt-2">Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default ErrorState;