'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon, SlidersIcon, BarChartIcon, BellIcon
} from 'lucide-react';
import '../globals.css';
import Notice from './notice';

const NavItem = ({ label, icon: Icon, path, currentPath, onClick }) => (
  <div
    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
      currentPath === `/garden/${path}`
        ? 'bg-green-300 dark:bg-green-700'
        : 'hover:bg-green-200 dark:hover:bg-green-800'
    }`}
    onClick={() => onClick(path)}
  >
    <Icon className="text-green-800 dark:text-green-200" />
    <span className="text-green-900 dark:text-green-100 font-medium">{label}</span>
  </div>
);

export default function GardenLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (path) => {
    router.push(`/garden/${path}`);
  };

  return (
<div className="flex h-screen overflow-hidden bg-green-50 dark:bg-gray-900 text-green-900 dark:text-green-100 transition-colors">
      {/* Sidebar cố định bên trái */}
      <div className="w-60 bg-green-100 dark:bg-gray-800 p-4 flex flex-col gap-4 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-green-800 dark:text-green-200">Smart Garden</h2>
        <NavItem label="Trang chủ" icon={HomeIcon} path="home" currentPath={pathname} onClick={navigate} />
        <NavItem label="Điều khiển" icon={SlidersIcon} path="control" currentPath={pathname} onClick={navigate} />
        <NavItem label="Biểu đồ" icon={BarChartIcon} path="chart" currentPath={pathname} onClick={navigate} />
        <NavItem label="Thông báo" icon={BellIcon} path="notice" currentPath={pathname} onClick={navigate} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>

      <Notice />
    </div>
  );
}
