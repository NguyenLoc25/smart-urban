import { useMemo } from "react";

export default function useEnergyTypes() {
  return useMemo(() => ({
    all: "Tất cả",
    Solar: "Năng lượng mặt trời",
    Wind: "Năng lượng gió",
    Hydro: "Năng lượng thủy điện"
  }), []);
}