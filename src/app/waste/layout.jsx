'use client'

import Sidebar from "@/components/waste/layout/Sidebar";

export default function WasteLayout({ children }) {
  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 flex">
      {/* Sidebar chiếm 64px bên trái */}
      <div className="w-48 h-full">
        <Sidebar />
      </div>

      {/* Main chiếm phần còn lại và scroll được */}
      <main className="flex-1 h-full overflow-y-auto p-6 bg-white dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}
