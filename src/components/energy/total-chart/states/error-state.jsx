const ErrorState = ({ message = 'Đã xảy ra lỗi', mobile = false }) => (
    <div className={`bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center border border-red-200 dark:border-red-800 ${
      mobile ? 'h-[300px]' : 'h-[500px]'
    } flex flex-col items-center justify-center`}>
      <div className="text-red-500 dark:text-red-300 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className={`${mobile ? 'h-10 w-10' : 'h-12 w-12'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className={`text-red-600 dark:text-red-300 font-medium ${
        mobile ? 'text-base' : 'text-lg'
      }`}>Lỗi tải dữ liệu</h3>
      <p className={`text-red-500 dark:text-red-400 ${
        mobile ? 'text-sm mt-1' : 'text-base mt-2'
      }`}>{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className={`mt-4 px-4 py-2 rounded-md bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-700 transition-colors ${
          mobile ? 'text-sm' : 'text-base'
        }`}
      >
        Thử lại
      </button>
    </div>
  )
  
  export default ErrorState