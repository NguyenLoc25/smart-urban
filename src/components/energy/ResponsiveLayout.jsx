'use client'

import { useMediaQuery } from "@/hooks/useMediaQuery";
import Sidebar from "@/components/energy/sidebar/sidebar";

export default function ResponsiveLayout({ children }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Desktop Sidebar and content */}
        <div className="flex flex-1">
          <main className={`flex-1 p-4 md:p-6 container mx-auto transition-all duration-300`}>
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-center py-4 md:py-6 shadow-inner">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3 md:gap-6 mb-3 md:mb-4 text-xs md:text-sm">
              <a href="/energy/about" className="hover:underline px-2 py-1 md:py-0">About Us</a>
              <a href="/energy/privacy" className="hover:underline px-2 py-1 md:py-0">Privacy Policy</a>
              <a href="/energy/contact" className="hover:underline px-2 py-1 md:py-0">Contact</a>
              <a href="/energy/support" className="hover:underline px-2 py-1 md:py-0">Support</a>
            </div>
            <p className="text-xs md:text-xs">&copy; {new Date().getFullYear()} Smart Urban - Energy. All Rights Reserved.</p>
          </div>
        </footer>
      </div>

      {/* Sidebar component (now with floating toggle) */}
      <Sidebar />
    </div>
  );
}