// app/about/layout.js
export default function AboutLayout({ children }) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Glowy blob background */}
        <div className="fixed -z-10 inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div>
        </div>
  
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Animated header */}
          <header className="mb-16 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600 mb-6 animate-fade-in">
              About Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light animate-fade-in animation-delay-300">
              We're building the future with memes, code, and good vibes only ✨
            </p>
          </header>
  
          {/* Content section with grid layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {children}
          </div>
  
          {/* Team showcase */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Meet the Squad</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-600">
                  <div className="aspect-square w-full bg-gray-200 dark:bg-gray-600 rounded-xl mb-3"></div>
                  <h3 className="font-bold">Member {i+1}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Job Title</p>
                </div>
              ))}
            </div>
          </section>
  
          {/* Stats counter */}
          <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl p-8 mb-20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-gray-200 dark:divide-gray-600">
            <div className="p-4">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">10K+</div>
              <div className="text-gray-500 dark:text-gray-400">Happy Users</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">42</div>
              <div className="text-gray-500 dark:text-gray-400">Team Members</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">2019</div>
              <div className="text-gray-500 dark:text-gray-400">Founded</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-400">∞</div>
              <div className="text-gray-500 dark:text-gray-400">Good Vibes</div>
            </div>
          </div>
        </main>
  
        {/* Glowy footer */}
        <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700 py-12">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="flex justify-center space-x-6 mb-6">
              {['twitter', 'instagram', 'tiktok', 'discord'].map((social) => (
                <a key={social} href="#" className="text-2xl text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Cool Company. Made with ❤️ and too much coffee.
            </p>
          </div>
        </footer>
      </div>
    );
  }