'use client'

import { Home, Truck, Settings, History, ActivitySquare } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/waste/dashboard", label: "Dashboard", icon: <Home size={18} /> },
  { href: "/waste/vehicles", label: "Xe gom rác", icon: <Truck size={18} /> },
  { href: "/waste/conveyors", label: "Băng chuyền", icon: <ActivitySquare size={18} /> },
  { href: "/waste/history", label: "Lịch sử", icon: <History size={18} /> },
  { href: "/waste/settings", label: "Cài đặt", icon: <Settings size={18} /> },
];


export default function Sidebar() {
  return (
    <aside className="w-64 h-screen fixed top-16 left-0 
      bg-gradient-to-b from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900 
      border-r shadow-sm px-4 py-6
      text-gray-800 dark:text-white"
    >
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md 
              hover:bg-green-200/60 dark:hover:bg-gray-700 
              text-sm font-medium transition 
              text-gray-800 dark:text-gray-100 
              hover:text-green-800 dark:hover:text-green-400"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
