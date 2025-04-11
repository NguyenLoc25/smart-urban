export default function GlowyFooter() {
    return (
      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700 py-12 mt-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                YourBrand
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Making tech less boring since 2020
              </p>
            </div>
            
            <div className="flex space-x-6">
              {['twitter', 'instagram', 'tiktok', 'discord'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} All vibes reserved. Made with ☕ and 🎵
          </div>
        </div>
      </footer>
    );
  }