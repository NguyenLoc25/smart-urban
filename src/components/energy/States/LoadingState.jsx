const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-600">Đang tải dữ liệu...</p>
    </div>
  );
  
  export default LoadingState;