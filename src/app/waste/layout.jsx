import React from "react";
import Sidebar from "@/components/waste/layout/Sidebar";

export default function WasteLayout({ children }) {
  return (
    <div className="flex pt-16">
      <Sidebar />
      <main className="ml-64 p-6 w-full">{children}</main>
    </div>
  );
}
