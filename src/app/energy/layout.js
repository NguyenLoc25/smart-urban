// app/energy/layout.js
export default function EnergyLayout({ children }) {
    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Nội dung chính */}
            <main className="w-full flex-1 p-6 container mx-auto">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-center py-6 mt-6 shadow-inner">
                <div className="max-w-4xl mx-auto">
                    {/* Dòng thông tin */}
                    <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
                        <a href="/energy/about" className="hover:underline">About Us</a>
                        <a href="/energy/privacy" className="hover:underline">Privacy Policy</a>
                        <a href="/energy/contact" className="hover:underline">Contact</a>
                        <a href="/energy/support" className="hover:underline">Support</a>
                    </div>

                    {/* Biểu tượng mạng xã hội */}
                    <div className="flex justify-center gap-4 text-xl mb-4">
                        <a href="#" className="hover:text-blue-600">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="#" className="hover:text-blue-400">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="hover:text-pink-500">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="hover:text-red-500">
                            <i className="fab fa-youtube"></i>
                        </a>
                    </div>

                    {/* Bản quyền */}
                    <p className="text-xs">&copy; {new Date().getFullYear()} Smart Urban - Energy. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}