"use client";
import { useState } from 'react';

export default function ContactLayout({ children }) {
  const [showToast, setShowToast] = useState(false);

  const showUnderDevelopment = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50/60 via-pink-50/60 to-amber-50/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-start max-w-xs">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Thông báo</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tính năng đang được phát triển, vui lòng quay lại sau!</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-auto -mx-1.5 -my-1.5 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating gradient blobs */}
      <div className="fixed -z-10 inset-0 overflow-hidden opacity-70 dark:opacity-30">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-pink-300/30 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full filter blur-[80px]"
          style={{
            animation: "pulse 12s ease-in-out infinite alternate"
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-300/30 to-amber-300/30 dark:from-pink-600/10 dark:to-amber-600/10 rounded-full filter blur-[80px]"
          style={{
            animation: "pulse 8s ease-in-out infinite alternate-reverse"
          }}
        ></div>
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_0,rgba(200,200,200,0.05)_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl h-full flex flex-col justify-center">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <path d="M22 6l-10 7L2 6"/>
            </svg>
            Contact Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-amber-500 to-orange-500 mb-4">
            Let's <span className="italic font-serif">connect</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Whether you have questions or just want to say hello, we'd love to hear from you.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <ContactCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>
              </svg>
            }
            title="Join Our Community" 
            description="Real-time discussions with our team and users"
            action="Connect on Discord"
            color="from-indigo-500/10 to-indigo-600/10 dark:from-indigo-900/20 dark:to-indigo-900/30"
            textColor="text-indigo-600 dark:text-indigo-400"
            onClick={showUnderDevelopment}
          />
          
          <ContactCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            }
            title="Twitter DMs" 
            description="Quick questions or public shoutouts"
            action="Message @ourhandle"
            color="from-blue-500/10 to-cyan-500/10 dark:from-blue-900/20 dark:to-cyan-900/30"
            textColor="text-blue-600 dark:text-blue-400"
            onClick={showUnderDevelopment}
          />
          
          <ContactCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            }
            title="Email Us" 
            description="For detailed inquiries and partnerships"
            action="hello@company.com"
            color="from-amber-500/10 to-orange-500/10 dark:from-amber-900/20 dark:to-orange-900/30"
            textColor="text-amber-600 dark:text-amber-400"
            onClick={showUnderDevelopment}
          />
        </div>
      </main>
    </div>
  );
}

const ContactCard = ({ icon, title, description, action, color, textColor, onClick }) => (
  <div 
    className={`bg-gradient-to-br ${color} p-5 rounded-2xl hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-white/20`}
    onClick={onClick}
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${textColor}/20 group-hover:${textColor}/30 transition-colors`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-semibold ${textColor}`}>{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
        <div className={`inline-flex items-center gap-2 text-sm font-medium ${textColor} group-hover:underline`}>
          {action} 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
);