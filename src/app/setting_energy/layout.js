// app/energy/layout.js
import Sidebar from "@/components/energy/sidebar/sidebar";
import ResponsiveLayout from "@/components/energy/ResponsiveLayout";

export default function EnergyLayout({ children }) {
  return (
    <ResponsiveLayout>
      {children}
    </ResponsiveLayout>
  );
}