import GlowyFooter from "../GlowyFooter";

export default function ContactLayout({ children }) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-purple-50/60 via-pink-50/60 to-amber-50/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
  
        <main className="container mx-auto px-4 py-16 max-w-6xl">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
              Contact Us
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-amber-500 to-orange-500 mb-6">
              Let's <span className="italic font-serif">connect</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Whether you have questions or just want to say hello, we'd love to hear from you.
            </p>
          </header>
  
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact methods */}
            <div className="space-y-6">
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
              />
            </div>
            
            {/* Form container */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 border border-gray-200/70 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send us a message</h2>
                  <p className="text-gray-500 dark:text-gray-400">We typically respond within 24 hours</p>
                </div>
                {children}
              </div>
            </div>
          </div>
        </main>
  
        <GlowyFooter />
      </div>
    );
}

const ContactCard = ({ icon, title, description, action, color, textColor }) => (
  <div className={`bg-gradient-to-br ${color} p-5 rounded-2xl hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-white/20`}>
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