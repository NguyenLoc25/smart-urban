const LoadingState = ({ small = false }) => {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-200 dark:border-gray-700 ${
        small ? 'p-4 h-[200px]' : 'p-8 h-[500px]'
      } flex items-center justify-center`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className={`${
            small ? 'w-8 h-8' : 'w-12 h-12'
          } bg-gray-200 dark:bg-gray-700 rounded-full mb-4`}></div>
          <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
            small ? 'w-32 mb-2' : 'w-48 mb-3'
          }`}></div>
          <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
            small ? 'w-24' : 'w-32'
          }`}></div>
        </div>
      </div>
    )
  }
  
  export default LoadingState