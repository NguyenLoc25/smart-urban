'use client'

import { usePathname } from 'next/navigation';
import { Home, Settings } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/waste/dashboard", label: "Dashboard", icon: <Home size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 h-[calc(100vh-4rem)]
      bg-gradient-to-b from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900
      border-r shadow-sm py-6 flex flex-col justify-between
      text-gray-800 dark:text-white"
    >
      {/* Logo */}
      <div>
        <div className="flex flex-col items-center mb-6 px-3 gap-1 border-b border-green-200 dark:border-gray-700 pb-3">
          <Link href="/waste" title="Smart Waste">
            <img
              src="/waste/eco-home.png"
              alt="Smart Waste Logo"
              className="w-16 h-16 object-contain hover:scale-105 transition-transform"
            />
          </Link>
          <span className="text-sm font-semibold text-green-700 dark:text-green-300 tracking-wide">
            Smart Waste
          </span>
        </div>

        {/* Navigation items */}
        <nav className="space-y-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-2 px-2 rounded-md text-sm font-medium transition
                  ${isActive ? 'bg-green-200 text-green-800 dark:bg-gray-700 dark:text-white' : 'text-gray-800 dark:text-gray-100 hover:bg-green-200/60 dark:hover:bg-gray-700 hover:text-green-800 dark:hover:text-green-400'}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Cài đặt ở dưới cùng */}
      <div className="px-3 mt-4">
        <Link
          href="/waste/settings"
          className={`flex items-center gap-3 py-2 px-2 rounded-md text-sm font-medium transition
            ${pathname === "/waste/settings" ? 'bg-green-200 text-green-800 dark:bg-gray-700 dark:text-white' : 'text-gray-800 dark:text-gray-100 hover:bg-green-200/60 dark:hover:bg-gray-700 hover:text-green-800 dark:hover:text-green-400'}`}
        >
          <Settings size={18} />
          Cài đặt
        </Link>
      </div>
    </aside>
  );
}
