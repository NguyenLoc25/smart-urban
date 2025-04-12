import React, { useReducer, useCallback, useMemo } from "react";
import { Button } from "../../ui/button";
import { Plus, Trash, Save } from "lucide-react";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { v4 as uuidv4 } from "uuid";
import { ErrorBoundary } from "react-error-boundary";

// Constants
const ENERGY_TYPES = ["Solar", "Wind", "Hydro"];

const DEVICE_OPTIONS = {
  Solar: [
    { name: "Canadian Solar HiKu6", power: "450", weight: "24.9", efficiency: "20.6", size: "1903 × 1134 × 30", origin: "Canada - Manufactured in China", status: "Active" },
    { name: "JA Solar JAM72S30", power: "525", weight: "28.6", efficiency: "20.5", size: "2278 × 1134 × 35", origin: "China", status: "Active" },
    { name: "Jinko Solar Tiger Neo N-type", power: "555", weight: "32.0", efficiency: "21.6", size: "2278 × 1134 × 30", origin: "China", status: "Active" },
    { name: "LONGi Solar Hi-MO5", power: "530", weight: "32.3", efficiency: "20.9", size: "2278 × 1134 × 30", origin: "China", status: "Active" },
    { name: "Trina Solar Vertex S+", power: "425", weight: "21.0", efficiency: "21.7", size: "1762 × 1134 × 30", origin: "China", status: "Active" },
    { name: "AE Solar Mono Half-Cut", power: "530", weight: "28.6", efficiency: "20.5", size: "2278 × 1134 × 35", origin: "Germany", status: "Active" },
    { name: "Q Cells Q.PEAK DUO", power: "420", weight: "25.0", efficiency: "20.1", size: "2080 × 1030 × 35", origin: "Korea - Germany", status: "Active" },
    { name: "SunPower Maxeon 6 AC", power: "420", weight: "21.8", efficiency: "22.2", size: "1872 × 1032 × 40", origin: "USA - Philippines", status: "Active" }
  ],
  Wind: [
    { name: "Siemens Gamesa SG 5.8-155", power: "5.8 ", weight: "500,000+", efficiency: "96", size: "Blade diameter: 155", origin: "Spain", status: "Active" },
    { name: "GE Haliade-X", power: "12 ", weight: "1000000+", efficiency: "94", size: "Blade diameter: 220", origin: "USA", status: "Active" },
    { name: "Nordex N60/130", power: "1.4 ", weight: "100000+", efficiency: "93", size: "Blade diameter: 130", origin: "Germany", status: "Active" },
    { name: "Senvion 3.4M140", power: "3.4 ", weight: "350000", efficiency: "95", size: "Blade diameter: 140", origin: "Germany", status: "Active" },
    { name: "Goldwind GW 3.0", power: "3.0 ", weight: "250000", efficiency: "94", size: "Blade diameter: 116", origin: "China", status: "Active" },
    { name: "Suzlon S66", power: "1.25 ", weight: "75,000", efficiency: "92", size: "Blade diameter: 66", origin: "India", status: "Active" },
    { name: "Vestas V90-3.0 MW", power: "3.0 ", weight: "300,000", efficiency: "96", size: "Blade diameter: 90", origin: "Denmark", status: "Active" }
  ],
  Hydro: [
    { name: "Pumped Storage Hydro", power: "1200", turbine_type: "Francis Turbine", efficiency: "85", head_height: "500", flow_rate: "1500", origin: "Switzerland", status: "Active" },
    { name: "Run-of-river Hydro", power: "300", turbine_type: "Kaplan Turbine", efficiency: "90", head_height: "50", flow_rate: "800", origin: "Vietnam", status: "Active" }
  ]
};

const ENERGY_FIELDS = {
  Solar: ["power", "weight", "efficiency", "size", "origin", "status"],
  Wind: ["power", "weight", "efficiency", "size", "origin", "status"],
  Hydro: ["power", "turbine_type", "efficiency", "head_height", "flow_rate", "origin", "status"]
};

const FIELD_LABELS = {
  power: { Solar: "Power (W)", Wind: "Power (MW)", Hydro: "Power (MW)" },
  weight: { Solar: "Weight (Kg)", Wind: "Weight (Kg)", Hydro: "Weight (Kg)" },
  efficiency: { Solar: "Efficiency (%)", Wind: "Efficiency (%)", Hydro: "Efficiency (%)" },
  size: { Solar: "Size (mm)", Wind: "Size (m)", Hydro: "Size (m)" },
  origin: "Origin",
  status: "Status",
  turbine_type: "Turbine Type",
  head_height: "Head Height (m)",
  flow_rate: "Flow Rate (m³/s)"
};

// Helper functions
const getInitialDevice = (type = "Solar") => {
  const firstDevice = DEVICE_OPTIONS[type][0];
  const device = {
    id: uuidv4(),
    energy_type: type,
    question_header: firstDevice.name,
  };

  ENERGY_FIELDS[type].forEach(field => {
    device[field] = firstDevice[field] || "";
  });

  return device;
};

const getFieldLabel = (field, energyType) => {
  const label = FIELD_LABELS[field];
  return typeof label === 'object' ? label[energyType] : label || field;
};

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
    <p>Something went wrong:</p>
    <pre className="my-2">{error.message}</pre>
    <Button onClick={resetErrorBoundary} variant="outline" size="sm">
      Try again
    </Button>
  </div>
);

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, getInitialDevice()];
    case "REMOVE":
      return state.filter(q => q.id !== action.id);
    case "UPDATE":
      return state.map(q => q.id === action.id ? { ...q, [action.field]: action.value } : q);
    case "CHANGE_TYPE": {
      return state.map(q => q.id === action.id ? getInitialDevice(action.value) : q);
    }
    case "CHANGE_DEVICE": {
      const selectedDevice = DEVICE_OPTIONS[action.deviceType].find(d => d.name === action.value);
      if (!selectedDevice) return state;
      
      return state.map(q => {
        if (q.id !== action.id) return q;
        
        const updatedDevice = {
          ...q,
          question_header: selectedDevice.name,
        };
        
        ENERGY_FIELDS[q.energy_type].forEach(field => {
          if (selectedDevice[field] !== undefined) {
            updatedDevice[field] = selectedDevice[field];
          }
        });
        
        return updatedDevice;
      });
    }
    default:
      return state;
  }
}

// Device Card Component
const DeviceCard = React.memo(({ device, dispatch }) => {
  const fields = useMemo(() => ENERGY_FIELDS[device.energy_type], [device.energy_type]);
  
  const handleTypeChange = useCallback((value) => {
    dispatch({ type: "CHANGE_TYPE", id: device.id, value });
  }, [device.id, dispatch]);

  const handleDeviceChange = useCallback((value) => {
    dispatch({ type: "CHANGE_DEVICE", id: device.id, deviceType: device.energy_type, value });
  }, [device.id, device.energy_type, dispatch]);

  const handleFieldChange = useCallback((field, value) => {
    dispatch({ type: "UPDATE", id: device.id, field, value });
  }, [device.id, dispatch]);

  const devices = useMemo(() => DEVICE_OPTIONS[device.energy_type], [device.energy_type]);

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {device.energy_type} Device
        </h3>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => dispatch({ type: "REMOVE", id: device.id })}
          className="hover:scale-105 transition-transform"
        >
          <Trash className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Energy Type
          </label>
          <Select 
            value={device.energy_type} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {ENERGY_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {devices.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {device.energy_type} Device Model
            </label>
            <Select 
              value={device.question_header} 
              onValueChange={handleDeviceChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${device.energy_type.toLowerCase()} device`} />
              </SelectTrigger>
              <SelectContent>
                {devices.map(device => (
                  <SelectItem key={device.name} value={device.name}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(field => {
          const label = getFieldLabel(field, device.energy_type);
          const defaultValue = DEVICE_OPTIONS[device.energy_type][0][field];

          return (
            <div key={field} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <Input 
                value={device[field] || ""} 
                onChange={(e) => handleFieldChange(field, e.target.value)}
                placeholder={`Enter ${label}`}
              />
              {device[field] === defaultValue && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Default value from device
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

DeviceCard.displayName = "DeviceCard";

// Main Component
export default function CollectionEditor() {
  const [questions, dispatch] = useReducer(reducer, [getInitialDevice()]);

  const handleSave = useCallback(async () => {
    if (questions.length === 0) return;
    
    try {
      const formattedQuestion = {
        id: questions[0].id,
        energy_type: questions[0].energy_type,
        question_header: questions[0].question_header,
        ...Object.fromEntries(
          Object.entries(questions[0])
            .filter(([key, value]) => 
              !['id', 'energy_type', 'question_header'].includes(key) && 
              value && 
              value !== ""
            )
        )
      };

      const response = await fetch(`/api/energy/settings/${formattedQuestion.energy_type.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedQuestion)
      });

      if (!response.ok) throw new Error(await response.text());
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert(`Error: ${error.message}`);
    }
  }, [questions]);

  const canSave = useMemo(() => questions.length > 0, [questions]);

  const handleAddDevice = useCallback(() => {
    dispatch({ type: "ADD" });
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => dispatch({ type: "ADD" })}
    >
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light mb-2">
            Energy Device Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add and configure your energy monitoring devices
          </p>
        </div>

        <div className="space-y-6">
          {questions.map(q => (
            <DeviceCard 
              key={q.id} 
              device={q} 
              dispatch={dispatch}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            variant="outline"
            onClick={handleAddDevice}
            className="bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Device
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={!canSave}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
}