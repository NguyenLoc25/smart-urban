// app/page.jsx hoặc app/energy/page.jsx
import CityConsumption from "@/components/energy/setting/CityConsumption";

export default function Page() {
  return (
    <div className="p-6">
      <CityConsumption />
    </div>
  );
}
