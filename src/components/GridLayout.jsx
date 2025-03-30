import React from "react";

const locations = [
  { id: "hydropower", name: "Thủy điện", count: 1, color: "bg-green-500", position: "top" },
  { id: "wind", name: "Quạt gió", count: 14, used: 6, color: "bg-blue-500", inactiveColor: "bg-gray-300", position: "right" },
  { id: "solar", name: "Pin mặt trời", count: 6, used: 3, color: "bg-orange-500", inactiveColor: "bg-gray-300", position: "left" },
  { id: "city", name: "Thành phố", count: 1, color: "bg-gray-400", position: "bottom" },
];

const GridLayout = () => {
  const wind = locations.find((loc) => loc.id === "wind");
  const solar = locations.find((loc) => loc.id === "solar");

  return (
    <div className="w-[400px] h-[250px] border grid grid-cols-3 grid-rows-2 gap-1">
      {/* Thủy điện - hàng trên */}
      <div className="col-span-2 row-span-1 flex items-center justify-center text-white font-bold text-lg bg-green-500">
        {locations.find((loc) => loc.id === "hydropower").name} ({locations.find((loc) => loc.id === "hydropower").count})
      </div>

      {/* Quạt gió - bên phải */}
      <div className="row-span-2 flex flex-wrap p-1 bg-blue-500">
        {Array.from({ length: wind.count }).map((_, index) => (
          <div
            key={index}
            className={`w-6 h-6 m-1 flex items-center justify-center text-white font-bold text-xs ${
              index < wind.used ? wind.color : wind.inactiveColor
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Pin mặt trời - bên trái dưới */}
      <div className="flex flex-wrap p-1 bg-orange-500">
        {Array.from({ length: solar.count }).map((_, index) => (
          <div
            key={index}
            className={`w-6 h-6 m-1 flex items-center justify-center text-white font-bold text-xs ${
              index < solar.used ? solar.color : solar.inactiveColor
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Thành phố - chính giữa dưới */}
      <div className="flex items-center justify-center text-white font-bold text-lg bg-gray-400">
        {locations.find((loc) => loc.id === "city").name} ({locations.find((loc) => loc.id === "city").count})
      </div>
    </div>
  );
};

export default GridLayout;
