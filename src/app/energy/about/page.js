// app/about/layout.js
export default function AboutLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Glowy blob background - smaller on mobile */}
      <div className="fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-48 h-48 md:w-72 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-0 w-48 h-48 md:w-72 md:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-48 h-48 md:w-72 md:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Header with mobile adjustments */}
        <header className="mb-8 md:mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600 mb-4 md:mb-6 animate-fade-in">
            About Us
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light animate-fade-in animation-delay-300 px-2">
            We're building the future with memes, code, and good vibes only ✨
          </p>
        </header>

        {/* Content section - stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-20">
          {children}
        </div>

        {/* Team showcase - 2 columns on mobile */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Meet the Squad</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-600">
                <div className="aspect-square w-full bg-gray-200 dark:bg-gray-600 rounded-lg md:rounded-xl mb-2 md:mb-3"></div>
                <h3 className="font-bold text-sm md:text-base">Member {i+1}</h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Job Title</p>
              </div>
            ))}
          </div>
        </section>

{/* Stats counter - responsive grid with better mobile layout */}
<div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl p-6 mb-12 md:mb-20 overflow-hidden">
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
    {[
      { value: "10K+", label: "Clicks per day", colors: "from-blue-500 to-cyan-400" },
      { value: "4", label: "Team Members", colors: "from-purple-500 to-pink-500" },
      { value: "2025", label: "Founded", colors: "from-amber-500 to-orange-500" },
      { value: "∞", label: "Good Vibes", colors: "from-green-500 to-emerald-400" }
    ].map((stat, index) => (
      <div 
        key={index}
        className="flex flex-col items-center p-3 md:p-4 transition-all hover:scale-[1.03]"
      >
        <div className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.colors} mb-1 md:mb-2`}>
          {stat.value}
        </div>
        <div className="text-xs md:text-sm text-center text-gray-500 dark:text-gray-400 font-medium">
          {stat.label}
        </div>
      </div>
    ))}
  </div>
</div>
      </main>

    </div>
  );
}