'use client'

import { usePathname } from 'next/navigation';
import { Home, Settings, ToggleLeft } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/waste/dashboard", label: "Tổng quan", icon: <Home size={18} /> },
  { href: "/waste/classification", label: "Phân loại rác", icon: <Settings size={18} /> },
  { href: "/waste/control", label: "Điều khiển", icon: <ToggleLeft size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Global CSS cho animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-leaf {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
            25% { transform: translateY(-8px) rotate(90deg); opacity: 1; }
            50% { transform: translateY(-4px) rotate(180deg); opacity: 0.8; }
            75% { transform: translateY(-12px) rotate(270deg); opacity: 1; }
          }
          
          @keyframes sparkle {
            0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1) rotate(180deg); opacity: 1; }
          }
          
          @keyframes wave-1 {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes wave-2 {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .animate-float-leaf {
            animation: float-leaf 2s ease-in-out infinite;
          }
          
          .animate-sparkle {
            animation: sparkle 1.5s ease-in-out infinite;
          }
          
          .animate-wave-1 {
            animation: wave-1 1.5s ease-in-out infinite;
          }
          
          .animate-wave-2 {
            animation: wave-2 1.8s ease-in-out infinite 0.3s;
          }
        `
      }} />
      
      <aside className="w-48 h-[calc(100vh-4rem)]
        bg-gradient-to-b from-green-50 via-green-100 to-emerald-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900
        border-r border-green-200/50 dark:border-gray-700 shadow-lg py-6 flex flex-col justify-start
        text-gray-800 dark:text-white backdrop-blur-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 px-3 gap-2 border-b border-green-200/60 dark:border-gray-700 pb-4">
          <Link href="/waste" title="Quản lý rác thông minh" className="group">
            <div className="relative overflow-hidden rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-2 shadow-lg
              transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
              <img
                src="/waste/eco-home.png"
                alt="Logo Quản lý rác thông minh"
                className="w-12 h-12 object-contain relative z-10 filter drop-shadow-sm"
              />
            </div>
          </Link>
          <span className="text-sm font-bold text-green-700 dark:text-green-300 tracking-wide">
            Quản lý rác thông minh
          </span>
        </div>

        {/* Navigation items */}
        <nav className="space-y-3 px-3">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-medium
                  transition-all duration-300 ease-out transform overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-105' 
                    : 'text-gray-700 dark:text-gray-200 hover:text-green-800 dark:hover:text-green-300'
                  }
                  hover:scale-105 hover:translate-x-1 hover:shadow-lg`}
              >
                {/* Floating leaves animation */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-green-400 rounded-full animate-float-leaf"
                      style={{
                        left: `${10 + i * 15}%`,
                        top: `${20 + (i % 2) * 60}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${2 + i * 0.2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Sparkle effects */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={`sparkle-${i}`}
                      className="absolute w-0.5 h-0.5 bg-emerald-300 rounded-full animate-sparkle"
                      style={{
                        left: `${15 + i * 20}%`,
                        top: `${30 + (i % 2) * 40}%`,
                        animationDelay: `${i * 0.4}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>

                {/* Green energy waves */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/20 to-transparent animate-wave-1"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent animate-wave-2"></div>
                </div>

                {/* Icon with 3D effect */}
                <div className={`relative transition-all duration-300 transform z-10
                  ${isActive ? 'text-white' : 'text-green-600 dark:text-green-400'}
                  group-hover:scale-110 group-hover:rotate-12`}>
                  {item.icon}
                </div>
                
                {/* Label with sliding effect */}
                <span className="relative overflow-hidden z-10">
                  <span className={`block transition-all duration-300 transform
                    ${isActive ? 'translate-y-0' : 'group-hover:translate-y-0'}
                    group-hover:font-semibold`}>
                    {item.label}
                  </span>
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-sm
                    animate-pulse z-10"></div>
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/0 to-emerald-500/0
                  group-hover:from-green-400/20 group-hover:to-emerald-500/20
                  transition-all duration-300 opacity-0 group-hover:opacity-100
                  blur-sm -z-10"></div>
              </Link>
            );
          })}
        </nav>

        {/* Decorative elements */}
        <div className="mt-auto px-3 mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent dark:via-gray-600"></div>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-green-600 dark:text-green-400 opacity-60">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span>Thân thiện môi trường</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}