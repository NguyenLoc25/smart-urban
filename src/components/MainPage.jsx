import React, { useState } from 'react';
import { 
  FiHome, FiZap, FiUsers, FiMap, FiBarChart2, 
  FiWifi, FiSun, FiDroplet, FiShield, FiSmartphone 
} from 'react-icons/fi';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import { Parallax, ParallaxProvider  } from 'react-scroll-parallax';

const MainPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  // Feature data
  const features = [
    {
      icon: <FiZap className="text-3xl" />,
      title: "Năng lượng thông minh",
      desc: "Hệ thống quản lý năng lượng tái tạo và phân phối thông minh",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      icon: <FiWifi className="text-3xl" />,
      title: "Kết nối IoT",
      desc: "Mạng lưới thiết bị kết nối toàn thành phố",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <FiSun className="text-3xl" />,
      title: "Chiếu sáng thông minh",
      desc: "Đèn đường tự động điều chỉnh theo môi trường",
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: <FiDroplet className="text-3xl" />,
      title: "Quản lý nước",
      desc: "Hệ thống giám sát và phân phối nước tối ưu",
      color: "from-cyan-400 to-cyan-600"
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "An ninh đô thị",
      desc: "Giám sát an ninh bằng AI và camera thông minh",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <FiSmartphone className="text-3xl" />,
      title: "Ứng dụng di động",
      desc: "Kết nối cư dân với dịch vụ đô thị",
      color: "from-green-400 to-green-600"
    }
  ];

  // Stats data
  const stats = [
    { value: "98%", label: "Hài lòng của cư dân" },
    { value: "45%", label: "Tiết kiệm năng lượng" },
    { value: "10k+", label: "Thiết bị IoT" },
    { value: "24/7", label: "Giám sát an ninh" }
  ];

  return (
      <ParallaxProvider>
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </div>

        <Parallax speed={-10}>
          <motion.div 
            className="relative z-10 text-center px-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                Smart Urban
              </span>
              <br />
              Tương lai của đô thị thông minh
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-300">
              Giải pháp toàn diện cho thành phố thông minh, kết nối và bền vững
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Khám phá ngay
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl font-medium text-lg border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xem video giới thiệu
              </motion.button>
            </div>
          </motion.div>
        </Parallax>

        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                SmartUrban
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['Tổng quan', 'Tính năng', 'Lợi ích', 'Thống kê', 'Liên hệ'].map((item, index) => (
                <motion.button
                  key={index}
                  className={`relative py-2 font-medium ${activeSection === item.toLowerCase() ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveSection(item.toLowerCase())}
                >
                  {item}
                  {activeSection === item.toLowerCase() && (
                    <motion.span 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
                      layoutId="underline"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className="md:hidden bg-white shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-4">
                {['Tổng quan', 'Tính năng', 'Lợi ích', 'Thống kê', 'Liên hệ'].map((item, index) => (
                  <motion.button
                    key={index}
                    className={`block w-full text-left py-2 font-medium ${activeSection === item.toLowerCase() ? 'text-blue-600' : 'text-gray-600'}`}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setActiveSection(item.toLowerCase());
                      setMenuOpen(false);
                    }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Overview Section */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl font-bold mb-6">Giải pháp đô thị thông minh toàn diện</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        SmartUrban tích hợp công nghệ tiên tiến để xây dựng thành phố thông minh, bền vững và đáng sống
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          {/* Thay đổi ở đây: Thêm autoplay và loop */}
<iframe 
  width="100%" 
  height="360" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ" 
  frameborder="0" 
  allowfullscreen
></iframe>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-2xl font-bold">Thành phố tương lai</h3>
            <p>Kết nối mọi mặt của đời sống đô thị</p>
          </div>
          {/* Thêm nút điều khiển âm thanh */}
          <button 
            onClick={() => {
              const iframe = document.querySelector('iframe');
              const newSrc = iframe.src.includes('mute=1') 
                ? iframe.src.replace('mute=1', 'mute=0') 
                : iframe.src.replace('mute=0', 'mute=1');
              iframe.src = newSrc;
            }}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            aria-label="Toggle sound"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343" />
            </svg>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-gray-900">Tầm nhìn của chúng tôi</h3>
          <p className="text-lg text-gray-600">
            SmartUrban không chỉ là công nghệ - đó là cách chúng tôi tái tạo đô thị thành không gian sống thông minh, 
            nơi con người và công nghệ cùng phát triển hài hòa.
          </p>
          
          <div className="space-y-4">
            {[
              "Hạ tầng thông minh kết nối IoT",
              "Năng lượng sạch và bền vững",
              "Giao thông thông minh và an toàn",
              "Dịch vụ công trực tuyến 24/7",
              "Môi trường sống xanh và lành mạnh"
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="flex items-start"
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 mt-1 mr-3 text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Tính năng nổi bật</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các giải pháp công nghệ tiên tiến được tích hợp trong hệ sinh thái SmartUrban
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                <div className="p-8">
                  <div className={`w-16 h-16 mb-6 rounded-lg bg-gradient-to-br ${feature.color} text-white flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-5xl font-bold mb-3">{stat.value}</div>
                <div className="text-xl">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Đánh giá từ đối tác</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những gì các đối tác và cư dân nói về SmartUrban
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "SmartUrban đã cách mạng hóa cách chúng tôi quản lý đô thị. Hiệu quả năng lượng tăng 40% chỉ sau 6 tháng.",
                name: "Ông Nguyễn Văn A",
                title: "Giám đốc Sở Xây dựng",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "Hệ thống giám sát thông minh giúp giảm 30% tai nạn giao thông trong khu vực chúng tôi.",
                name: "Bà Trần Thị B",
                title: "Chủ tịch Phường",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "Là cư dân, tôi cảm thấy an toàn và tiện nghi hơn bao giờ hết nhờ các giải pháp của SmartUrban.",
                name: "Anh Lê Văn C",
                title: "Cư dân khu đô thị",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-2xl text-gray-400 mb-6">"</div>
                <p className="text-lg text-gray-700 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Sẵn sàng chuyển đổi đô thị của bạn?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Liên hệ với chúng tôi ngay hôm nay để nhận tư vấn và báo cáo chi tiết về giải pháp SmartUrban
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Liên hệ tư vấn
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl font-medium text-lg border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tải báo cáo (PDF)
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">SmartUrban</h3>
              <p className="mb-4">Giải pháp toàn diện cho đô thị thông minh tương lai</p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'linkedin', 'youtube'].map((social, index) => (
                  <motion.a 
                    key={index} 
                    href="#" 
                    className="text-gray-400 hover:text-white"
                    whileHover={{ y: -3 }}
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-gray-700 rounded-full" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Giải pháp</h3>
              <ul className="space-y-2">
                {['Năng lượng', 'Giao thông', 'An ninh', 'Môi trường', 'Dịch vụ công'].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a href="#" className="hover:text-white">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Công ty</h3>
              <ul className="space-y-2">
                {['Về chúng tôi', 'Đối tác', 'Tuyển dụng', 'Tin tức', 'Liên hệ'].map((item, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a href="#" className="hover:text-white">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Liên hệ</h3>
              <address className="not-italic space-y-2">
                <p>123 Đường Smart, Quận Urban, TP.HCM</p>
                <p>Email: info@smarturban.vn</p>
                <p>Điện thoại: (028) 1234 5678</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>© {new Date().getFullYear()} SmartUrban. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </div>
    </ParallaxProvider>
  );
};

export default MainPage;