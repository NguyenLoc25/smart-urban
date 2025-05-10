'use client'

import { Home, Settings, Wifi, Scan, Menu, X } from "lucide-react";
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 h-screen fixed top-16 left-0 
          bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 
          border-r shadow-sm px-4 py-6
          text-gray-800 dark:text-white"
        >
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md 
                  hover:bg-blue-200/60 dark:hover:bg-gray-700 
                  text-sm font-medium transition 
                  text-gray-800 dark:text-gray-100 
                  hover:text-blue-800 dark:hover:text-blue-400"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={toggleDrawer}
          className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-blue-500 text-white shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Drawer Menu */}
      {isMobile && (
        <>
          <div
            className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300
              ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={toggleDrawer}
          />
          
          <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen
              bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 
              shadow-lg transform transition-transform duration-300
              ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={toggleDrawer}
                className="p-1 rounded-md hover:bg-blue-200/60 dark:hover:bg-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="space-y-2 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleDrawer}
                  className="flex items-center gap-3 px-3 py-2 rounded-md 
                    hover:bg-blue-200/60 dark:hover:bg-gray-700 
                    text-sm font-medium transition 
                    text-gray-800 dark:text-gray-100 
                    hover:text-blue-800 dark:hover:text-blue-400"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}