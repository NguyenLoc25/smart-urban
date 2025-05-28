'use client'

import { Home, Settings, Wifi, Scan, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/energy", label: "Trang chính", icon: <Home size={20} /> },
  { href: "/energy/iot", label: "IoT", icon: <Wifi size={20} /> },
  { href: "/energy/ar", label: "AR", icon: <Scan size={20} /> },
  { href: "/setting_energy", label: "Cài đặt", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-40 p-2 rounded-full bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300
          ${isMobile ? 'bottom-1/2 left-4 translate-y-1/2' : 'top-1/2 left-4 -translate-y-1/2'}
          hover:bg-gray-700 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
      >
        {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Sidebar Content */}
      <aside
        className={`fixed z-30 ${isMobile ? 'h-[calc(100vh-4rem)] bottom-0' : 'h-screen top-0'} left-0 mt-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 
          shadow-lg transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
      >
        <nav className="space-y-2 p-4 h-full flex flex-col">
          <div className="flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md 
                  hover:bg-gray-200/60 dark:hover:bg-gray-700/80
                  text-sm font-medium transition 
                  text-gray-800 dark:text-gray-200 
                  hover:text-gray-900 dark:hover:text-gray-100
                  whitespace-nowrap overflow-hidden"
              >
                {item.icon}
                <span className={`${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 dark:bg-black/70"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}