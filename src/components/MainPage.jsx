import React, { useState } from 'react';
import { 
  FiHome, FiZap, FiUsers, FiMap, FiBarChart2, 
  FiWifi, FiSun, FiDroplet, FiShield, FiSmartphone,
  FiFacebook, FiTwitter, FiLinkedin, FiYoutube,
  FiChevronDown
} from 'react-icons/fi';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

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
      <div className="relative overflow-hidden dark:bg-gray-900">
        {/* Navigation */}


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
                <motion.a 
  href="#video-section"
  className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl font-medium text-lg border border-white/20 hover:bg-white/20 transition-all inline-block"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={(e) => {
    e.preventDefault();
    document.getElementById('video-section').scrollIntoView({
      behavior: 'smooth'
    });
  }}
>
  Xem video giới thiệu
</motion.a>
              </div>
            </motion.div>
          </Parallax>

          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FiChevronDown className="w-8 h-8 text-white" />
          </motion.div>
        </section>

        {/* Overview Section */}
        <section id="video-section" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 dark:text-white">Giải pháp đô thị thông minh toàn diện</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                  <iframe 
                    width="100%" 
                    height="320" 
                    src="https://www.youtube.com/embed/71ocMfYgV1Y?autoplay=1&mute=1&loop=1&playlist=71ocMfYgV1Y" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    title="Smart City Introduction"
                  ></iframe>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">Thành phố tương lai</h3>
                    <p>Kết nối mọi mặt của đời sống đô thị</p>
                  </div>
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
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Tầm nhìn của chúng tôi</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
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
                        <span className="text-lg dark:text-gray-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 dark:text-white">Tính năng nổi bật</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Các giải pháp công nghệ tiên tiến được tích hợp trong hệ sinh thái SmartUrban
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
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
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
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
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 dark:text-white">Đánh giá từ đối tác</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Những gì các đối tác và cư dân nói về SmartUrban
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "Hệ thống năng lượng mặt trời của SmartUrban giúp khu đô thị chúng tôi giảm 75% khí thải độc hại, đồng thời tiết kiệm chi phí điện năng.",
                  name: "Ông Nguyễn Thành Long",
                  title: "Giám đốc Năng lượng Xanh",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  quote: "Nhà thông minh tích hợp vân tay đã ngăn chặn 100% vụ đột nhập trong 6 tháng qua. An toàn tuyệt đối cho gia đình tôi.",
                  name: "Bà Huỳnh Thị Ngọc Thảo",
                  title: "Cư dân cao cấp",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  quote: "Hệ thống tưới tự động thông minh không chỉ tiết kiệm 50% nước mà còn tự động điều chỉnh theo thời tiết, khu vườn luôn xanh tươi mà không cần can thiệp.",
                  name: "Anh Lê Hàn Lập",
                  title: "Chuyên gia Cảnh quan",
                  avatar: "https://randomuser.me/api/portraits/men/75.jpg"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-2xl text-gray-400 mb-6">"</div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-bold dark:text-white">{testimonial.name}</div>
                      <div className="text-gray-600 dark:text-gray-400">{testimonial.title}</div>
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
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white text-lg font-bold mb-4">SmartUrban</h3>
                <p className="mb-4 dark:text-gray-300">
                  Giải pháp toàn diện cho đô thị thông minh tương lai
                </p>
                <div className="flex space-x-4">
                  <motion.a 

                    className="text-gray-400 hover:text-white dark:hover:text-blue-400"
                    whileHover={{ y: -3 }}
                    aria-label="Facebook"
                  >
                    <FiFacebook className="w-6 h-6" />
                  </motion.a>
                  <motion.a 

                    className="text-gray-400 hover:text-white dark:hover:text-blue-400"
                    whileHover={{ y: -3 }}
                    aria-label="Twitter"
                  >
                    <FiTwitter className="w-6 h-6" />
                  </motion.a>
                  <motion.a 

                    className="text-gray-400 hover:text-white dark:hover:text-blue-400"
                    whileHover={{ y: -3 }}
                    aria-label="LinkedIn"
                  >
                    <FiLinkedin className="w-6 h-6" />
                  </motion.a>
                  <motion.a 

                    className="text-gray-400 hover:text-white dark:hover:text-red-400"
                    whileHover={{ y: -3 }}
                    aria-label="YouTube"
                  >
                    <FiYoutube className="w-6 h-6" />
                  </motion.a>
                </div>
              </div>
              
              <div>
                <h3 className="text-white text-lg font-bold mb-4 dark:text-gray-100">Giải pháp</h3>
                <ul className="space-y-2">
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="/home" className="hover:text-white dark:hover:text-gray-200">Không gian sống</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="/garden" className="hover:text-white dark:hover:text-gray-200">Tiểu cảnh sinh thái</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="/energy" className="hover:text-white dark:hover:text-gray-200">Năng lượng</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="/waste" className="hover:text-white dark:hover:text-gray-200">Môi trường</a>
                  </motion.li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white text-lg font-bold mb-4 dark:text-gray-100">Công ty</h3>
                <ul className="space-y-2">
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="/energy/about" className="hover:text-white dark:hover:text-gray-200">Về chúng tôi</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="/energy/privacy" className="hover:text-white dark:hover:text-gray-200">Bản quyền</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="/energy/contact" className="hover:text-white dark:hover:text-gray-200">Liên hệ</a>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <a href="/energy/support" className="hover:text-white dark:hover:text-gray-200">Hỗ trợ</a>
                  </motion.li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white text-lg font-bold mb-4 dark:text-gray-100">Liên hệ</h3>
                <address className="not-italic space-y-2 dark:text-gray-300">
                  <p>227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh</p>
                  <p>Email: nl700218@gmail.com</p>
                  <p>Điện thoại: (032) 803 3***</p>
                </address>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center dark:text-gray-400">
              <p>© {new Date().getFullYear()} SmartUrban. Bảo lưu mọi quyền.</p>
            </div>
          </div>
        </footer>
      </div>
    </ParallaxProvider>
  );
};

export default MainPage;