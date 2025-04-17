// app/energy/layout.js
export default function EnergyLayout({ children }) {
    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Main content */}
            <main className="w-full flex-1 p-4 md:p-6 container mx-auto">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-center py-4 md:py-6 mt-6 shadow-inner">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Information links - stacked on mobile, inline on desktop */}
                    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3 md:gap-6 mb-3 md:mb-4 text-xs md:text-sm">
                        <a href="/energy/about" className="hover:underline px-2 py-1 md:py-0">About Us</a>
                        <a href="/energy/privacy" className="hover:underline px-2 py-1 md:py-0">Privacy Policy</a>
                        <a href="/energy/contact" className="hover:underline px-2 py-1 md:py-0">Contact</a>
                        <a href="/energy/support" className="hover:underline px-2 py-1 md:py-0">Support</a>
                    </div>

                    {/* Social icons */}
                    <div className="flex justify-center gap-3 md:gap-4 text-lg md:text-xl mb-3 md:mb-4">
                        <a href="#" aria-label="Facebook" className="hover:text-blue-600 p-1 md:p-0">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="#" aria-label="Twitter" className="hover:text-blue-400 p-1 md:p-0">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-pink-500 p-1 md:p-0">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" aria-label="YouTube" className="hover:text-red-500 p-1 md:p-0">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-xs md:text-xs">&copy; {new Date().getFullYear()} Smart Urban - Energy. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}   