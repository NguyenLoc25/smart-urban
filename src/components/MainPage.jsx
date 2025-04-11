import React, { useState } from 'react';
import { FiHome, FiZap, FiTrash2, FiChevronDown, FiChevronUp, FiExternalLink, FiCheckCircle } from 'react-icons/fi';

const FeatureCard = ({ icon, title, description, progress, color, children }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`w-full bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-t-4 border-${color}-500 relative overflow-hidden`}>
      <div className=" flex items-start justify-between">
        <div className="flex items-start">
          <div className={`bg-${color}-100 p-3 rounded-lg mr-4 text-${color}-600`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className={`text-${color}-600 hover:bg-${color}-50 p-2 rounded-full transition-colors`}
          aria-label={expanded ? "Thu gọn" : "Mở rộng"}
        >
          {expanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      </div>
      
      {progress && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Tiến độ phát triển</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-${color}-500 h-2 rounded-full`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'mt-4 opacity-100 max-h-screen' : 'opacity-0 max-h-0'}`}>
        {children}
      </div>
      
      {/* Decorative element */}
      <div className={`absolute bottom-0 right-0 w-16 h-16 bg-${color}-50 rounded-tl-full opacity-30`}></div>
    </div>
  );
};

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('energy');
  
  const energyData = [
    { year: 2023, solar: 1200, wind: 800, hydro: 400 },
    { year: 2022, solar: 900, wind: 700, hydro: 350 },
    { year: 2021, solar: 600, wind: 500, hydro: 300 },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Animated Header */}
        <header className="w-full mb-12 text-center animate-fadeIn">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center">
              <span className="mr-2">🏙️</span> Smart-Urban
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Giải pháp đô thị thông minh toàn diện, kết nối mọi khía cạnh của cuộc sống đô thị 
            vào một nền tảng duy nhất với công nghệ tiên tiến và giao diện trực quan.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto mb-8 scrollbar-hide">
          <div className="flex space-x-2">
            {[
              { id: 'home', icon: <FiHome />, label: 'Tổng quan' },
              { id: 'energy', icon: <FiZap />, label: 'Năng lượng' },
              { id: 'garden', icon: <FiZap />, label: 'Cảnh quan' },
              { id: 'waste', icon: <FiTrash2 />, label: 'Chất thải' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Home Dashboard */}
          <FeatureCard 
            icon={<FiHome size={24} />}
            title="Tổng quan Đô thị"
            description="Bảng điều khiển trung tâm quản lý toàn bộ hệ thống"
            progress={30}
            color="blue"
          >
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Thống kê nhanh</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">1,240</div>
                    <div className="text-xs text-gray-500">Cư dân</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">42</div>
                    <div className="text-xs text-gray-500">Tòa nhà</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">98%</div>
                    <div className="text-xs text-gray-500">Hài lòng</div>
                  </div>
                </div>
              </div>
              <button className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors">
                <FiExternalLink className="mr-2" /> Xem chi tiết báo cáo
              </button>
            </div>
          </FeatureCard>

          {/* Garden Management */}
          <FeatureCard 
            icon={<FiZap size={24} />}
            title="Quản lý Cảnh quan"
            description="Hệ thống theo dõi và chăm sóc không gian xanh"
            progress={15}
            color="green"
          >
            <div className="space-y-3">
              <div className="flex items-center text-green-700">
                <FiCheckCircle className="mr-2" />
                <span>Giám sát tự động cây xanh</span>
              </div>
              <div className="flex items-center text-green-700">
                <FiCheckCircle className="mr-2" />
                <span>Lịch tưới tiêu thông minh</span>
              </div>
              <div className="flex items-center text-gray-400">
                <FiCheckCircle className="mr-2" />
                <span>Phân tích chất lượng đất (coming soon)</span>
              </div>
            </div>
          </FeatureCard>
        </div>

        {/* Energy Section - Full width */}
        <FeatureCard 
          icon={<FiZap size={24} />}
          title="Quản lý Năng lượng Thông minh"
          description="Tối ưu hóa hệ thống năng lượng xanh cho đô thị bền vững"
          progress={75}
          color="yellow"
          className="mb-8"
        >
          <div className="space-y-6">
            {/* Energy Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="text-yellow-800 font-medium mb-1">Tổng thiết bị</div>
                <div className="text-3xl font-bold text-yellow-600">156</div>
                <div className="text-xs text-yellow-700 mt-1">+12% so với năm ngoái</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-blue-800 font-medium mb-1">Sản lượng hôm nay</div>
                <div className="text-3xl font-bold text-blue-600">24.5 MWh</div>
                <div className="text-xs text-blue-700 mt-1">Đủ cho 850 hộ gia đình</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="text-green-800 font-medium mb-1">Giảm phát thải</div>
                <div className="text-3xl font-bold text-green-600">42 tấn</div>
                <div className="text-xs text-green-700 mt-1">CO2 tiết kiệm hàng tháng</div>
              </div>
            </div>

            {/* Interactive Chart Placeholder */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Biểu đồ sản lượng năng lượng</h3>
                <select className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Theo năm</option>
                  <option>Theo tháng</option>
                  <option>Theo ngày</option>
                </select>
              </div>
              <div className="h-64 bg-white rounded-md flex items-center justify-center text-gray-400">
                [Biểu đồ tương tác sẽ hiển thị tại đây]
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                {['Solar', 'Wind', 'Hydro'].map((type, index) => (
                  <div key={type} className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${[
                        'bg-yellow-400',
                        'bg-blue-400',
                        'bg-green-400'
                      ][index]}`}
                    ></div>
                    <span className="text-sm text-gray-600">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Installation Suggestions */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
              <h3 className="font-medium text-gray-800 mb-3">Đề xuất lắp đặt mới</h3>
              <div className="space-y-3">
                {[
                  { location: 'Khu A - Tòa nhà B', type: 'Solar Panel', potential: 'High' },
                  { location: 'Công viên Trung tâm', type: 'Wind Turbine', potential: 'Medium' },
                  { location: 'Hồ nước phía Bắc', type: 'Hydro Generator', potential: 'Low' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${
                      item.potential === 'High' ? 'bg-green-500' : 
                      item.potential === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{item.location}</div>
                      <div className="text-sm text-gray-600">{item.type} - Tiềm năng: {item.potential}</div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FeatureCard>

        {/* Waste Management */}
        <FeatureCard 
          icon={<FiTrash2 size={24} />}
          title="Quản lý Chất thải Thông minh"
          description="Hệ thống thu gom và xử lý rác thải tối ưu"
          progress={5}
          color="red"
        >
          <div className="text-center py-6">
            <div className="inline-block bg-red-100 p-4 rounded-full mb-4">
              <FiTrash2 size={32} className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Tính năng đang phát triển</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Chúng tôi đang xây dựng hệ thống quản lý chất thải thông minh với các cảm biến IoT 
              để tối ưu hóa lộ trình thu gom rác và phân loại tự động.
            </p>
            <button className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors">
              Nhận thông báo khi ra mắt
            </button>
          </div>
        </FeatureCard>

        {/* Feedback Section */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-medium text-center mb-4">Đóng góp ý kiến của bạn</h3>
          <div className="max-w-md mx-auto">
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Chúng tôi muốn nghe ý kiến của bạn để cải thiện Smart-Urban..."
            ></textarea>
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-2">
                {['😊', '😍', '😐', '😕', '😞'].map(emoji => (
                  <button key={emoji} className="text-2xl hover:scale-125 transition-transform">
                    {emoji}
                  </button>
                ))}
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-blue-600 transition-colors">Giới thiệu</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Tính năng</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Báo giá</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Liên hệ</a>
          </div>
          <p>© 2023 Smart-Urban. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default MainPage;