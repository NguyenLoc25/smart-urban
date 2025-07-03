// src/app/garden/control/layout.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, Leaf, Tractor } from 'lucide-react';

const navItems = [
  { href: '/garden/control/animal', label: 'Animal', icon: <PawPrint className="w-4 h-4" /> },
  { href: '/garden/control/vegetable', label: 'Vegetable', icon: <Leaf className="w-4 h-4" /> },
  { href: '/garden/control/cablecar', label: 'Cable Car', icon: <Tractor className="w-4 h-4" /> },
];

export default function ControlLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-md flex items-center justify-between">
        <h1 className="text-lg font-semibold">🌿 Control Dashboard</h1>
        <p className="text-sm text-white/80">Quản lý các hệ thống trong vườn</p>
      </header>

      {/* Nav Tabs */}
      <nav className="flex justify-center gap-4 bg-green-50 border-b px-4 py-2">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              pathname === href
                ? 'bg-green-200 text-green-900'
                : 'text-gray-600 hover:bg-green-100'
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>

      {/* Nội dung từng page con */}
      <main className="flex-grow overflow-y-auto bg-gray-50 p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-400 text-center text-xs py-2 border-t">
        Realtime System © RevoBricks 2025
      </footer>
    </div>
  );
}
