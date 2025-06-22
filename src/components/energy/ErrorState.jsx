export default function ErrorState({ error }) {
    return (
      <div className="p-4 max-w-md mx-auto bg-red-50 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-red-500 text-2xl">⚠️</div>
          <h2 className="text-lg font-medium text-red-800">{error.message}</h2>
        </div>
        
        {error.details && (
          <div className="mb-4 text-sm text-red-700">
            <p>Chi tiết lỗi:</p>
            <p className="italic">{error.details}</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={error.action}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }