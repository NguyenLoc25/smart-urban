import { countModels } from "@/components/energy/tableDevide/utils/parsers";

export default function ModalState({ energyTypes, selectedEnergyType, closeModal }) {
    // Safely get the energy type data
    const energyType = energyTypes[selectedEnergyType] || {};
    
    // Get models with fallback to empty array
    const models = energyType.models || [];
    
    // Count model occurrences
    const modelCounts = countModels(models);
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Mẫu thiết bị {energyType.name || 'Unknown'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
  
            <div className="space-y-4">
              {Object.keys(modelCounts).length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(modelCounts).map(([model, count], index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {model}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {count} thiết bị
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Không có thông tin mẫu thiết bị
                </p>
              )}
            </div>
  
            <div className="mt-6">
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }