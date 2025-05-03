"use client";
import { useState } from 'react';

function DevelopmentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Feature in Development</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This feature is currently under development. We're working hard to bring it to you soon!
        </p>
        <button 
          onClick={onClose}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

const LiveChatWidget = ({ onClick }) => (
  <div 
    className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all group"
    onClick={onClick}
  >
    <div className="flex items-start gap-4">
      <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div>
        <h3 className="font-bold">Live Chat Support</h3>
        <p className="text-sm opacity-90 mt-1">Connect instantly with our team</p>
        <div className="flex items-center gap-2 mt-3 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          Available now
        </div>
      </div>
    </div>
  </div>
);

const TopicIcon = ({ topic }) => {
  const icons = {
    'Account Issues': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    'Billing': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>
      </svg>
    ),
    'Features': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3c1.2 0 3 .5 3 2.5 0 2-.5 3-1 3.5 1 1 1.5 2 1.5 3.5S18 17 18 19c0 1.5-1.8 2.5-3 2.5"/>
        <path d="M9 3c-1.2 0-3 .5-3 2.5S6 8 7 8.5C6 9.5 5.5 10.5 5.5 12s.5 2.5 1.5 3.5S6 17 6 19c0 1.5 1.8 2.5 3 2.5"/>
      </svg>
    ),
    'Report Bug': (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="14" x="8" y="6" rx="4"/>
        <path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="M10 4 8 2"/>
      </svg>
    )
  };
  return icons[topic] || (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
    </svg>
  );
};

function getTopicDescription(topic) {
  const descriptions = {
    'Account Issues': "Login, security, and access problems",
    'Billing': "Payments, invoices, and subscriptions",
    'Features': "How to use product features",
    'Report Bug': "Technical issues and errors"
  };
  return descriptions[topic] || "Get help with this topic";
}

export default function SupportLayout({ children }) {
  const [showModal, setShowModal] = useState(false);

  const handleItemClick = () => {
    setShowModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50/60 via-emerald-50/60 to-lime-50/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Modal */}
      <DevelopmentModal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      {/* Abstract organic background */}
      <div className="fixed -z-10 inset-0 overflow-hidden opacity-70 dark:opacity-30">
        <div 
          className="absolute top-20 right-20 w-64 h-64 bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full filter blur-[80px]"
          style={{
            animation: "pulse 8s ease-in-out infinite alternate"
          }}
        ></div>
        <div 
          className="absolute bottom-32 left-32 w-56 h-56 bg-lime-300/30 dark:bg-lime-500/10 rounded-tl-full rounded-br-full filter blur-[80px]"
          style={{
            animation: "pulse 12s ease-in-out infinite alternate-reverse"
          }}
        ></div>
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_0,rgba(200,200,200,0.05)_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
            </svg>
            Support Center
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 mb-6">
            How can we <span className="italic font-serif">help?</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Fast, friendly support from real humans. Average response time: 12 minutes.
          </p>
        </header>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {['Account Issues', 'Billing', 'Features', 'Report Bug'].map((topic) => (
            <div 
              key={topic} 
              onClick={handleItemClick}
              className="group bg-white/80 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700/90 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/50 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-500 group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/30 transition-colors">
                <TopicIcon topic={topic} />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">{topic}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getTopicDescription(topic)}</p>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Knowledge base */}
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/70 dark:border-gray-700/50">
              <h3 className="font-semibold flex items-center gap-3 mb-4 text-gray-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
                Knowledge Base
              </h3>
              <ul className="space-y-3">
                {['Getting Started Guide', 'Troubleshooting', 'API Documentation', 'Video Tutorials'].map((item) => (
                  <li 
                    key={item} 
                    onClick={handleItemClick}
                    className="flex items-start gap-2 text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quick fixes */}
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/70 dark:border-gray-700/50">
              <h3 className="font-semibold flex items-center gap-3 mb-4 text-gray-900 dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
                Quick Fixes
              </h3>
              <ul className="space-y-3">
                {['Password Reset', 'Clear Cache', 'Update App', 'Check Status'].map((item) => (
                  <li 
                    key={item} 
                    onClick={handleItemClick}
                    className="flex items-start gap-2 text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Live chat widget */}
            <LiveChatWidget onClick={handleItemClick} />
          </div>
          
          {/* Content area */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/70 dark:border-gray-700/50 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}