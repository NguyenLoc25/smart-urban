// D:\GitHub\smart-urban\src\app\energy\month\page.js
"use client"; // This is a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EnergyMonthPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Code: 'VNM', // Default value for Vietnam
    Entity: 'Vietnam', // Default value for Vietnam
    Year: '',
    Month: '',
    solar: '',
    wind: '',
    hydro: ''
  });
  const [energyType, setEnergyType] = useState('solar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // Prepare the data for the specific energy type
      const payload = {
        Code: formData.Code,
        Entity: formData.Entity,
        Year: formData.Year,
        Month: formData.Month,
        [ENERGY_FIELDS[energyType]]: formData[energyType]
      };

      const response = await fetch(`/api/energy/fetchData/month/${energyType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ text: `${energyType} data added successfully! ID: ${result.id}`, type: 'success' });
        // Reset form but keep the default values for Vietnam
        setFormData(prev => ({
          ...prev,
          [energyType]: '',
          Year: '',
          Month: ''
        }));
      } else {
        throw new Error(result.error || 'Failed to submit data');
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define energy fields mapping (same as in your API)
  const ENERGY_FIELDS = {
    solar: "Electricity from solar - TWh",
    wind: "Electricity from wind - TWh",
    hydro: "Electricity from hydro - TWh",
  };

  return (
    <div className="max-w-2xl mx-auto p-6 dark:bg-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Add Monthly Energy Data</h1>
      
      <div className="flex gap-2 mb-6">
        {['solar', 'wind', 'hydro'].map(type => (
          <button
            key={type}
            className={`px-4 py-2 rounded-md transition-colors ${
              energyType === type 
                ? 'bg-blue-600 text-white dark:bg-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            }`}
            onClick={() => setEnergyType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="Code" className="block font-medium">Country Code:</label>
          <input
            type="text"
            id="Code"
            name="Code"
            value={formData.Code}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="Entity" className="block font-medium">Entity (Country/Region):</label>
          <input
            type="text"
            id="Entity"
            name="Entity"
            value={formData.Entity}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="Year" className="block font-medium">Year:</label>
          <input
            type="number"
            id="Year"
            name="Year"
            value={formData.Year}
            onChange={handleChange}
            required
            min="1900"
            max="2100"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="Month" className="block font-medium">Month (1-12):</label>
          <input
            type="number"
            id="Month"
            name="Month"
            value={formData.Month}
            onChange={handleChange}
            required
            min="1"
            max="12"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor={energyType} className="block font-medium">
            {ENERGY_FIELDS[energyType]}:
          </label>
          <input
            type="number"
            id={energyType}
            name={energyType}
            value={formData[energyType]}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Data'}
        </button>
      </form>

      {message.text && (
        <div className={`mt-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}