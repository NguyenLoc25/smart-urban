export default function PrivacyLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-green-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Subtle grid background */}
      <div className="fixed inset-0 -z-10 opacity-20 dark:opacity-10 [background:radial-gradient(circle_at_center,rgba(0,0,0,0)_0,rgba(200,200,200,0.1)_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Animated gradient blobs */}
      <div className="fixed -z-10 inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full mix-blend-overlay dark:mix-blend-soft-light"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `conic-gradient(from ${Math.random() * 360}deg at 50% 50%, 
                rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 200)}, 255, 0.3), 
                rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 200)}, 255, 0.1))`,
              filter: 'blur(60px)',
              animation: `float ${Math.random() * 15 + 15}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Privacy Policy
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 mb-6">
            Your Data, <span className="italic font-serif">Our Promise</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transparent, ethical data practices you can actually understand. No fine print.
          </p>
        </header>


        {/* Key points summary */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-6 rounded-2xl border border-blue-500/10 dark:border-cyan-500/10 hover:border-blue-500/20 transition-colors duration-300">
            <h3 className="font-semibold text-lg flex items-center gap-3 mb-4 text-blue-600 dark:text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              Our Commitment
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-cyan-400 mt-0.5">✓</span>
                <span>Minimal data collection - only what's essential</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-cyan-400 mt-0.5">✓</span>
                <span>No third-party data sharing or selling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-cyan-400 mt-0.5">✓</span>
                <span>You control your personal information</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-teal-500/5 to-green-500/5 p-6 rounded-2xl border border-teal-500/10 dark:border-green-500/10 hover:border-teal-500/20 transition-colors duration-300">
            <h3 className="font-semibold text-lg flex items-center gap-3 mb-4 text-teal-600 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Your Rights
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 dark:text-green-400 mt-0.5">✓</span>
                <span>Access and download your data anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 dark:text-green-400 mt-0.5">✓</span>
                <span>Request deletion of your information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 dark:text-green-400 mt-0.5">✓</span>
                <span>Opt-out of non-essential tracking</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/30">
          <div className="flex flex-wrap justify-center gap-6 items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              GDPR Compliant
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              CCPA Ready
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              No Tracking Cookies
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}