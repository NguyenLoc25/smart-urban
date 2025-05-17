import React from "react";

const getStatusColor = (status) => {
  return status === "Active" ? "#4caf50" : "#9e9e9e";
};

const EnergyTypeCard = ({ type, stat, config, onClick }) => {
  const { icon, bgClass, label } = config;
  const { power = 0, percentage = 0, status } = stat;
  
  let displayPower, powerUnit;
  
  if (type === 'solar') {
    displayPower = power.toFixed(2);
    powerUnit = 'MW';
  } else {
    displayPower = power.toFixed(2);
    powerUnit = 'MW';
  }

  return (
    <div 
      className={`${bgClass} rounded-xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md text-white`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium opacity-90">{label}</p>
          <div className="space-y-1">
            <p className="text-xs opacity-80">tổng công suất</p>
            <p className="text-2xl font-bold">
              {displayPower} <span className="text-sm font-normal">{powerUnit}</span>
            </p>
          </div>
        </div>
        
        <div className="relative">
          <span className="text-3xl opacity-90">{icon}</span>
          {status && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: getStatusColor(status) }}
              aria-label={`Trạng thái: ${status}`}
            />
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs opacity-80"> </span>
          <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-lg">
            {percentage}%
          </span>
        </div>
        <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnergyTypeCard;