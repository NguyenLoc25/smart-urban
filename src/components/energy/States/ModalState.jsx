// src/components/energy/states/ModalState.jsx
'use client';

import React from "react";

export default function ModalState({ energyTypes, selectedEnergyType, closeModal }) {
  if (!selectedEnergyType) return null;

  const energyType = energyTypes[selectedEnergyType.toLowerCase()];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {selectedEnergyType} Devices
          </h3>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Models in use:</h4>
            <ul className="list-disc pl-5 mt-2">
              {energyType.models?.map((model, index) => (
                <li key={index}>{model}</li>
              ))}
            </ul>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}